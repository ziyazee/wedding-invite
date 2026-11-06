import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { observeInvitationAudio } from '../invitations/observeInvitationAudio'
import { catalogMusicPath } from '../invitations/musicCatalog'
import './MusicPlaybackControls.css'

type Props = {
  value: string
  start?: number
  end?: number
  previewFrame: RefObject<HTMLIFrameElement | null>
  onRangeChange: (start: number, end?: number) => void
  onPlay: () => void
}

const timestamp = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`

export default function MusicPlaybackControls({ value, start = 0, end, previewFrame, onRangeChange, onPlay }: Props) {
  const player = useRef<HTMLAudioElement | null>(null)
  const startedPlayers = useRef(new WeakSet<HTMLAudioElement>())
  const pendingSeek = useRef<number | null>(null)
  const seekInput = useRef<HTMLInputElement>(null)
  const seekMarker = useRef<HTMLSpanElement>(null)
  const paintPlayhead = useRef<(seconds: number) => void>(() => {})
  const [detectedSource, setDetectedSource] = useState('')
  const [duration, setDuration] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [loadError, setLoadError] = useState(false)
  const selectedSource = catalogMusicPath(value)
  const source = selectedSource || detectedSource

  useEffect(() => {
    const frame = previewFrame.current
    if (!frame) return
    let stop = () => {}
    setDetectedSource('')
    setPlaying(false)
    setPosition(0)
    pendingSeek.current = null
    const connect = () => {
      stop()
      if (!frame.contentDocument) return
      stop = observeInvitationAudio(frame.contentDocument, audio => {
        let animation = 0
        let seekAnimation = 0
        const followPlayback = () => {
          if (player.current !== audio || audio.paused) return
          // Move only the pin each frame, without rerendering the controls.
          paintPlayhead.current(audio.currentTime)
          animation = requestAnimationFrame(followPlayback)
        }
        const update = () => {
          const src = audio.src || audio.querySelector('source')?.src || ''
          if (!src || (selectedSource && src !== new URL(selectedSource, window.location.origin).href)) return
          player.current = audio
          setDetectedSource(src)
          setPlaying(!audio.paused && !audio.ended)
          setPosition(audio.currentTime)
          cancelAnimationFrame(animation)
          if (!audio.paused) {
            startedPlayers.current.add(audio)
            if (pendingSeek.current !== null) {
              const target = pendingSeek.current
              pendingSeek.current = null
              // Apply after the design's opening handlers set their start time.
              seekAnimation = requestAnimationFrame(() => {
                if (player.current === audio) { audio.currentTime = target; setPosition(target) }
              })
            }
            animation = requestAnimationFrame(followPlayback)
          }
        }
        const events = ['loadedmetadata', 'durationchange', 'play', 'pause', 'ended', 'timeupdate', 'seeked', 'emptied']
        events.forEach(event => audio.addEventListener(event, update))
        update()
        return () => {
          cancelAnimationFrame(animation)
          cancelAnimationFrame(seekAnimation)
          events.forEach(event => audio.removeEventListener(event, update))
          if (player.current === audio) { player.current = null; setPlaying(false) }
        }
      })
    }
    frame.addEventListener('load', connect)
    connect()
    return () => { frame.removeEventListener('load', connect); stop(); player.current = null }
  }, [previewFrame, selectedSource])

  useEffect(() => { setDuration(0); setLoadError(false) }, [source])
  const max = Math.ceil(duration)
  const from = duration && start >= duration ? 0 : start
  const to = end !== undefined && end > from && end < duration ? end : max
  const ready = duration > 0
  const seekEnd = ready ? Math.max(from, Math.min(to, duration) - .05) : from
  useLayoutEffect(() => {
    paintPlayhead.current = seconds => {
      const time = ready ? Math.min(Math.max(seconds, from), seekEnd) : 0
      if (seekMarker.current) seekMarker.current.style.left = `${ready ? time / max * 100 : 0}%`
      if (seekInput.current) {
        seekInput.current.value = String(time)
        const label = timestamp(time)
        if (seekInput.current.getAttribute('aria-valuetext') !== label) {
          seekInput.current.setAttribute('aria-valuetext', label)
          seekInput.current.title = `Playback position · ${label}`
        }
      }
    }
    paintPlayhead.current(player.current?.currentTime ?? position)
  }, [ready, from, seekEnd, max, position])

  function seek(next: number) {
    if (!ready) return
    const target = Math.min(Math.max(next, from), seekEnd)
    paintPlayhead.current(target)
    setPosition(target)
    const audio = player.current
    if (audio && startedPlayers.current.has(audio)) audio.currentTime = target
    else {
      pendingSeek.current = target
      onPlay()
    }
  }

  function togglePlayback() {
    const audio = player.current
    if (audio && !audio.paused) audio.pause()
    else if (audio && startedPlayers.current.has(audio)) void audio.play().catch(() => {})
    else onPlay()
  }

  return <div className="music-playback">
    {/* Metadata only: playback stays inside the phone, avoiding two songs. */}
    {source && <audio key={source} src={source} preload="metadata" hidden onLoadedMetadata={event => {
      const length = event.currentTarget.duration
      if (Number.isFinite(length) && length > 0) { setDuration(length); setLoadError(false) }
    }} onError={() => setLoadError(true)}/>}
    <div className="music-playback-toolbar">
      <button className="music-playback-toggle" type="button" onClick={togglePlayback}>
        <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>{playing ? 'Pause' : 'Play selection'}
      </button>
      <span className="music-playback-position" aria-label="Playback position">{timestamp(position)} / {ready ? timestamp(duration) : '—'}</span>
      <button className="music-playback-reset" type="button" disabled={!start && end === undefined} onClick={() => onRangeChange(0, undefined)}>Full song</button>
    </div>
    <div className="music-playback-range" role="group" aria-label="Music playback range">
      <div className="music-playback-range-labels">
        <span>Start <output>{timestamp(from)}</output></span>
        <span>End <output>{ready ? timestamp(Math.min(to, duration)) : '—'}</output></span>
      </div>
      <div className={`music-playback-timeline${ready ? '' : ' is-disabled'}`}>
        <div className="music-playback-track" aria-hidden="true"><span style={{ left: `${ready ? from / max * 100 : 0}%`, right: `${ready ? (1 - to / max) * 100 : 0}%` }}/></div>
        <input type="range" min={0} max={max || 1} step={1} value={ready ? from : 0} disabled={!ready} aria-label="Music start time" aria-valuemax={Math.max(0, to - 1)} aria-valuetext={timestamp(from)} onChange={event => onRangeChange(Math.min(Number(event.target.value), Math.max(0, to - 1)), end)}/>
        <input type="range" min={0} max={max || 1} step={1} value={ready ? to : 1} disabled={!ready} aria-label="Music end time" aria-valuemin={from + 1} aria-valuetext={end === undefined ? 'End of song' : timestamp(to)} onChange={event => { const next = Math.max(from + 1, Number(event.target.value)); onRangeChange(from, next >= max ? undefined : next) }}/>
        <div className="music-playback-marker-track" aria-hidden="true"><span ref={seekMarker}/></div>
        <input ref={seekInput} className="music-playback-seek" type="range" min={0} max={max || 1} step="any" defaultValue={0} disabled={!ready} aria-label="Playback position" aria-valuemin={from} aria-valuemax={seekEnd} onChange={event => seek(Number(event.target.value))}/>
      </div>
    </div>
    <p className="music-playback-note" role="status">{loadError ? 'Song length is unavailable. Try playing the song.' : !source ? 'Play the invitation to load its default song.' : !ready ? 'Loading song length…' : 'Gold handles set the start and end. Drag the green pin to move through the selected part.'}</p>
  </div>
}
