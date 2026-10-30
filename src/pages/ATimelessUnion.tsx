import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useInvitationDetails } from '../invitations/context'
import { OpeningScene, WelcomeScene, CoupleScene, ClosingScene, SvgDefinitions, Celebrations as ReferenceCelebrations } from './a-timeless-union/Design14Scenes'
import { ReferenceOpeningScene, ReferenceWelcomeScene } from './a-timeless-union/ReferenceScenes'
import { useDesign14Motion } from './a-timeless-union/useDesign14Motion'
import styles from './a-timeless-union/Design14.css?inline'
import { useDesign14TextMotion } from './a-timeless-union/useDesign14TextMotion'
import { referenceEvents } from './a-timeless-union/referenceEvents'
import { TimelessNotes, TimelessCelebrations as Celebrations } from './a-timeless-union/TimelessRules'
import rulesCSS from './a-timeless-union/TimelessRules.css?inline'

export default function Design14() {
  const details = useInvitationDetails()
  const query = new URLSearchParams(window.location.search)
  const personalizedQuery = query.has('groom') && query.has('bride')
  const groom = details?.groom || (personalizedQuery && query.get('groom')) || 'Arjun'
  const bride = details?.bride || (personalizedQuery && query.get('bride')) || 'Bhavana'
  const events = details ? details.events : referenceEvents
  const showIllustrations = details?.showCoupleIllustrations !== false
  const musicSource = details?.music || (personalizedQuery && query.get('music')) || '/templates/a-timeless-union/assets/rinnehtiauuttzor38lg.mp3'
  const host = useRef<HTMLDivElement>(null)
  const main = useRef<HTMLDivElement>(null)
  const audio = useRef<HTMLAudioElement>(null)
  const mounted = useRef(false)
  const starting = useRef(false)
  const [opened, setOpened] = useState(false)
  const [entryVisible, setEntryVisible] = useState(true)
  const [pending, setPending] = useState(false)
  const [playbackFailed, setPlaybackFailed] = useState(false)
  useDesign14TextMotion(host, opened, `${events.length}:${showIllustrations}`)
  useDesign14Motion(host, opened, String(showIllustrations))

  useLayoutEffect(() => {
    mounted.current = true
    const html = document.documentElement
    const previousTitle = document.title
    const music = audio.current
    const previousClasses = ['d14-document', 'd14-awaiting-play', 'd14-started'].filter(name => html.classList.contains(name))
    html.classList.add('d14-document', 'd14-awaiting-play')
    html.classList.remove('d14-started')
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    const preloadPaths = [
      '/templates/a-timeless-union/assets/1Zg49ggjH1NeMsuurkKzD6m20vo.webp',
      '/templates/a-timeless-union/assets/ELOlTg3x5fKABGtAydCmkvEWw.webp',
      '/templates/a-timeless-union/assets/nMi6QUEDQLWoopKcsbxHe7tv3w.webp',
      '/templates/a-timeless-union/assets/0IJJIgu6Wx8qN5wGM26QzcUWTNg.webp',
      '/templates/a-timeless-union/assets/zGWp5UP4NXxBVD059Ha4jDG8lIE.webp',
    ]
    const preloadLinks = preloadPaths.map(href => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = href
      document.head.appendChild(link)
      return link
    })

    return () => {
      mounted.current = false
      starting.current = false
      music?.pause()
      preloadLinks.forEach(link => link.remove())
      html.classList.remove('d14-document', 'd14-awaiting-play', 'd14-started')
      previousClasses.forEach(name => html.classList.add(name))
      document.title = previousTitle
    }
  }, [])

  useEffect(() => {
    document.title = `${groom} & ${bride} — Wedding Invitation`
  }, [groom, bride])

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('d14-awaiting-play', !opened)
    document.documentElement.classList.toggle('d14-started', opened)
    if (opened) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      main.current?.focus({ preventScroll: true })
    }
  }, [opened])

  useEffect(() => {
    if (!opened) return
    const timer = window.setTimeout(() => setEntryVisible(false), 600)
    return () => window.clearTimeout(timer)
  }, [opened])

  async function openInvitation() {
    if (starting.current || opened || !audio.current) return
    const music = audio.current
    starting.current = true
    setPending(true)
    try {
      // Keep playback inside the tap gesture for mobile browsers.
      music.muted = false
      await music.play()
      if (mounted.current) setOpened(true)
      else music.pause()
    } catch {
      if (mounted.current) {
        starting.current = false
        setPending(false)
        setPlaybackFailed(true)
      }
    }
  }

  return (
    <div ref={host} className="d14-react-host">
      <style>{styles}</style>
      {details && <style>{rulesCSS}</style>}
      <audio ref={audio} id="d14-background-music" src={musicSource} preload="auto" loop />
      {entryVisible && <div className={`d14-entry${opened ? ' is-opening' : ''}`} onTransitionEnd={event => {
        if (opened && event.target === event.currentTarget && event.propertyName === 'opacity') setEntryVisible(false)
      }}>
        <button className="d14-entry-play" type="button" disabled={pending} onClick={openInvitation}
          aria-label={playbackFailed ? 'Retry music and open invitation' : 'Open invitation and play music'}>
          <img className="d14-entry-frame" src="/templates/a-timeless-union/assets/open-invitation-frame.svg" width="480" height="180" alt="" aria-hidden="true" />
          <span className="d14-entry-label">OPEN INVITATION</span>
          <span className="d14-entry-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg></span>
        </button>
      </div>}
      <div ref={main} id="main" inert={!opened} tabIndex={-1}>
        <div data-d14-root="" className="d14-JfqWY d14-72rtr7" style={{ minHeight: '100vh', width: 'auto' }}>
          <div className="d14-i1vx06">
            {details ? <OpeningScene groom={groom} bride={bride} date={details.date} opened={opened} /> : <ReferenceOpeningScene groom={groom} bride={bride} />}
            {details ? <WelcomeScene groom={groom} bride={bride} groomFamily={details.groomFamily} brideFamily={details.brideFamily} message={details.message} /> : <ReferenceWelcomeScene groom={groom} bride={bride} />}
            {showIllustrations && <CoupleScene />}
            {details ? <Celebrations opened={opened} events={events} offset={details.offset} couple={`${groom} & ${bride}`} showIllustrations={showIllustrations} /> : <ReferenceCelebrations opened={opened} events={referenceEvents} />}
            {details && <TimelessNotes dressCode={details.dressCode} note={details.giftNote} />}
            <ClosingScene showIllustrations={showIllustrations} />
          </div>
        </div>
        <div id="overlay" />
      </div>
      <SvgDefinitions />
    </div>
  )
}
