import { useEffect, useId, useRef, useState } from 'react'
import { googlePlaces as places, safeMapLink, savedPlaceId, type PlaceSuggestion as Suggestion, type SelectedPlace } from '../lib/googlePlaces'
import EventLocationMap from './EventLocationMap'

type Props = { title: string; venue: string; address: string; value: string; disabled: boolean; onChange: (map: string) => void; onPendingChange: (pending: boolean) => void }

export default function EventLocationPicker({ title, venue, address, value, disabled, onChange, onPendingChange }: Props) {
  const id = useId()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [active, setActive] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [message, setMessage] = useState('')
  const [matched, setMatched] = useState<SelectedPlace | null>(null)
  const [previewMessage, setPreviewMessage] = useState('')
  const session = useRef('')
  const request = useRef(0)
  const lookup = useRef(0)
  const lookupController = useRef<AbortController | null>(null)
  const manual = useRef(false)
  const attempted = useRef('')
  const latest = useRef({ value, onChange })
  latest.current = { value, onChange }
  const input = [venue.trim(), address.trim()].filter(Boolean).join(', ').slice(0, 500)
  const currentMatch = matched?.map === value ? matched : null
  const mapLink = safeMapLink(value)

  useEffect(() => () => { request.current += 1; lookup.current += 1; lookupController.current?.abort() }, [])
  useEffect(() => { manual.current = false; attempted.current = '' }, [input])
  useEffect(() => {
    if (!resolving) return
    onPendingChange(true)
    return () => onPendingChange(false)
  }, [resolving, onPendingChange])
  useEffect(() => {
    const current = ++request.current
    setSuggestions([])
    setActive(-1)
    setLoading(false)
    if (!open || disabled || query.trim().length < 3) return
    setLoading(true)
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      session.current ||= crypto.randomUUID()
      try {
        const result = await places({ action: 'autocomplete', input: query.trim(), sessionToken: session.current }, controller.signal)
        if (request.current !== current) return
        setSuggestions(result.suggestions || [])
        setMessage(result.suggestions?.length ? '' : 'No locations found. Try adding a city, or paste a Maps link.')
      } catch (error) {
        if (request.current === current) setMessage(error instanceof Error ? error.message : 'Location search failed.')
      } finally {
        if (request.current === current) setLoading(false)
      }
    }, 350)
    return () => { window.clearTimeout(timer); controller.abort(); if (request.current === current) request.current += 1 }
  }, [query, open, disabled])

  function cancelLookup() {
    lookup.current += 1
    lookupController.current?.abort()
    setResolving(false)
  }

  function resolveLocation(body: Record<string, string>, automatic: boolean) {
    lookupController.current?.abort()
    const controller = new AbortController()
    lookupController.current = controller
    const current = ++lookup.current
    const previousValue = latest.current.value
    setResolving(true)
    setMessage(automatic ? 'Finding a location from your venue and address…' : 'Adding location…')
    void places(body, controller.signal).then(result => {
      if (lookup.current !== current || controller.signal.aborted || latest.current.value !== previousValue) return
      if (!result.map || !result.place) throw new Error('Could not find a location. Search again or paste a Maps link.')
      setMatched(result.place)
      latest.current.onChange(result.map)
      setMessage('')
    }).catch(error => {
      if (lookup.current === current && !controller.signal.aborted) setMessage(error instanceof Error ? error.message : 'Could not find this location.')
    }).finally(() => {
      if (lookup.current === current) setResolving(false)
    })
    return () => {
      controller.abort()
      if (lookup.current === current) { lookup.current += 1; setResolving(false) }
    }
  }

  useEffect(() => {
    if (disabled || value.trim() || input.length < 3 || manual.current || attempted.current === input) return
    let cancel: (() => void) | undefined
    const timer = window.setTimeout(() => {
      if (manual.current || latest.current.value.trim()) return
      attempted.current = input
      cancel = resolveLocation({ action: 'find', input }, true)
    }, 450)
    return () => { window.clearTimeout(timer); cancel?.() }
  }, [input, value, disabled])

  // Re-open the exact saved place, without changing an existing Maps link.
  useEffect(() => {
    setPreviewMessage('')
    if (!value.trim() || currentMatch) return
    const placeId = savedPlaceId(value)
    if (!placeId) {
      setPreviewMessage('Open this saved link to verify it, or select a search result to show a map here.')
      return
    }
    const controller = new AbortController()
    setPreviewMessage('Loading saved location…')
    void places({ action: 'details', placeId, input }, controller.signal).then(result => {
      if (controller.signal.aborted) return
      if (!result.place) throw new Error('Location preview unavailable.')
      setMatched({ ...result.place, map: value })
      setPreviewMessage('')
    }).catch(() => {
      if (!controller.signal.aborted) setPreviewMessage('Could not preview this saved location. Open Google Maps to verify it.')
    })
    return () => controller.abort()
  }, [value, input, currentMatch])

  function select(place: Suggestion) {
    if (disabled || resolving) return
    manual.current = true
    request.current += 1
    const token = session.current
    session.current = '' // A Place Details request ends this search session.
    setLoading(false)
    setSuggestions([])
    setActive(-1)
    setQuery('')
    setOpen(false)
    resolveLocation({ action: 'details', placeId: place.placeId, sessionToken: token, input: input || query.trim() || 'Location' }, false)
  }

  function editMap(map: string) {
    manual.current = true
    cancelLookup()
    request.current += 1
    setLoading(false)
    setOpen(false)
    setQuery('')
    setMessage('')
    setMatched(null)
    session.current = ''
    onChange(map)
  }

  return <div className="order-personal-event-map">
    <div className="event-location-fields">
    <div className="event-location-heading">
    <strong>{title}</strong>
    <small>{[venue, address].filter(Boolean).join(', ')}</small>
    </div>
    <div className="event-location-search">
      <label htmlFor={`${id}-search`}>Search Google Maps</label>
      <input id={`${id}-search`} type="text" role="combobox" autoComplete="off" maxLength={200}
        value={query} disabled={disabled} placeholder={venue ? `Search for ${venue}` : 'Search venue or address, including city'}
        aria-label={`Search Google Maps for ${title}`} aria-autocomplete="list" aria-expanded={open && suggestions.length > 0}
        aria-controls={`${id}-results`} aria-activedescendant={active >= 0 ? `${id}-option-${active}` : undefined}
        aria-describedby={`${id}-status`}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onChange={event => { manual.current = true; cancelLookup(); request.current += 1; setQuery(event.target.value); setOpen(true); setMessage(''); setSuggestions([]); setActive(-1) }}
        onKeyDown={event => {
          if (event.key === 'Escape') { event.preventDefault(); setOpen(false); setActive(-1) }
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            if (!suggestions.length) { setOpen(true); return }
            setActive(index => event.key === 'ArrowDown' ? (index + 1) % suggestions.length : (index <= 0 ? suggestions.length : index) - 1)
          }
          if (event.key === 'Enter') {
            event.preventDefault() // Searching must never submit/create the order.
            if (open && active >= 0 && suggestions[active]) void select(suggestions[active])
          }
        }}/>
      {open && suggestions.length > 0 && <div className="event-location-results">
        <ul id={`${id}-results`} role="listbox" aria-label={`Locations for ${title}`}>
          {suggestions.map((place, index) => <li key={place.placeId} id={`${id}-option-${index}`} role="option" aria-selected={index === active}
            onPointerDown={event => event.preventDefault()} onMouseEnter={() => setActive(index)} onClick={() => void select(place)}>
            <strong>{place.label}</strong><span>{place.address}</span>
          </li>)}
        </ul>
        <div className="event-location-attribution" translate="no">Google Maps</div>
      </div>}
    </div>
    <p id={`${id}-status`} className="form-note event-location-status" role="status">{loading ? 'Searching…' : message}</p>
    <div className="event-location-link">
    <label htmlFor={`${id}-map`}>Google Maps link</label>
    <input id={`${id}-map`} type="url" inputMode="url" value={value} maxLength={2000} disabled={disabled}
      placeholder="Or paste https://maps.app.goo.gl/…" aria-label={`Google Maps link for ${title}`} onChange={event => editMap(event.target.value)}/>
    </div>
    </div>
    <div className="event-location-preview">
    {currentMatch && mapLink ? <EventLocationMap key={value} place={{ ...currentMatch, map: mapLink }}/>
      : value.trim() ? <div className="event-location-map-fallback"><p className="form-note" role="status">{previewMessage}</p>{mapLink && <a href={mapLink} target="_blank" rel="noreferrer">View saved location in Google Maps ↗</a>}</div>
      : <div className="event-location-map-placeholder">{resolving ? 'Finding your location…' : 'Your location preview will appear here.'}</div>}
    </div>
  </div>
}
