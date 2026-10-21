import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useInvitationDetails } from '../invitations/context'
import { OpeningScene, WelcomeScene, CoupleScene, ClosingScene, InvitationContact, SvgDefinitions, Celebrations as ReferenceCelebrations } from './design14/Design14Scenes'
import { ReferenceOpeningScene, ReferenceWelcomeScene } from './design14/ReferenceScenes'
import { useDesign14Motion } from './design14/useDesign14Motion'
import styles from './design14/Design14.css?inline'
import { useDesign14TextMotion } from './design14/useDesign14TextMotion'
import type { Celebration } from '../invitations/model'
import { TimelessNotes, TimelessCelebrations as Celebrations } from './design14/TimelessRules'
import rulesCSS from './design14/TimelessRules.css?inline'

const referenceEvents: [Celebration, Celebration, Celebration, Celebration] = [
  { title: 'Engagement Ceremony', date: '2026-12-11', time: '18:00', venue: 'Kshana by the Sea', address: 'Kaup', map: '' },
  { title: 'Sangeeth Celebration', date: '2027-01-31', time: '18:00', venue: 'Shamili Beach Resort', address: 'Padukere', map: '' },
  { title: 'Marriage Ceremony', date: '2027-02-03', time: '09:00', venue: 'Amrith Garden', address: 'Udupi', map: '' },
  { title: 'Reception Celebration', date: '2027-02-04', time: '18:00', venue: 'Ocean Pearl Times Square', address: 'Udupi', map: '' },
]

export default function Design14() {
  const details = useInvitationDetails()
  const query = new URLSearchParams(window.location.search)
  const personalizedQuery = query.has('groom') && query.has('bride')
  const groom = details?.groom || (personalizedQuery && query.get('groom')) || 'Arjun'
  const bride = details?.bride || (personalizedQuery && query.get('bride')) || 'Bhavana'
  const events = details ? details.events : referenceEvents
  const showIllustrations = details?.showCoupleIllustrations !== false
  const musicSource = details?.music || (personalizedQuery && query.get('music')) || '/design14/assets/rinnehtiauuttzor38lg.mp3'
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
    return () => {
      mounted.current = false
      starting.current = false
      music?.pause()
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
          <img className="d14-entry-frame" src="/design14/assets/open-invitation-frame.svg" width="480" height="180" alt="" aria-hidden="true" />
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
            <InvitationContact />
          </div>
        </div>
        <div id="overlay" />
      </div>
      <SvgDefinitions />
    </div>
  )
}
