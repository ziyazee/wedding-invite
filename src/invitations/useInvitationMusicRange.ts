import { useEffect } from 'react'
import { observeInvitationAudio } from './observeInvitationAudio'

export function useInvitationMusicRange(start?: number, end?: number, template?: number) {
  useEffect(() => {
    // Older orders with no range retain their original playback behaviour.
    if (start === undefined && end === undefined) return
    return observeInvitationAudio(document, audio => {
      let timer: number | undefined
      let needsStart = true
      const constrain = () => {
        window.clearTimeout(timer)
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return
        const from = start !== undefined && start >= 0 && start < audio.duration ? start : 0
        const to = end !== undefined && end > from ? Math.min(end, audio.duration) : audio.duration
        if (needsStart && !audio.paused) {
          needsStart = false
          // Do not interrupt a track already starting at the requested point.
          // Tolerance also avoids repeated seeks with rounded media timestamps.
          if (Math.abs(audio.currentTime - from) > .05) audio.currentTime = from
        }
        else if (audio.currentTime < from - .05) audio.currentTime = from
        else if (audio.currentTime >= to) {
          if (audio.loop) audio.currentTime = from
          else { audio.pause(); audio.currentTime = from }
        }
        // timeupdate is coarse; schedule the boundary while the track plays.
        if (!audio.paused && audio.playbackRate > 0) timer = window.setTimeout(constrain, Math.max(20, (to - audio.currentTime) / audio.playbackRate * 1000))
      }
      const events = ['loadedmetadata', 'durationchange', 'play', 'pause', 'timeupdate', 'seeked', 'ratechange']
      const reset = () => { needsStart = true }
      audio.addEventListener('emptied', reset)
      events.forEach(event => audio.addEventListener(event, constrain))
      constrain()
      return () => { window.clearTimeout(timer); audio.removeEventListener('emptied', reset); events.forEach(event => audio.removeEventListener(event, constrain)) }
    })
  }, [start, end, template])
}
