import { useEffect, useRef, useState } from 'react'
import { googlePlaces, type SelectedPlace } from '../lib/googlePlaces'

export default function EventLocationMap({ place }: { place: SelectedPlace }) {
  const root = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [image, setImage] = useState('')
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!root.current || !('IntersectionObserver' in window)) { setVisible(true); return }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect() }
    }, { rootMargin: '200px' })
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const controller = new AbortController()
    setImage('')
    setError('')
    void googlePlaces({ action: 'preview', latitude: String(place.latitude), longitude: String(place.longitude) }, controller.signal)
      .then(result => {
        if (controller.signal.aborted) return
        if (!result.image?.startsWith('data:image/png;base64,')) throw new Error('Map preview is unavailable.')
        setImage(result.image)
      })
      .catch(() => { if (!controller.signal.aborted) setError('Map preview is unavailable. Open Google Maps to verify the location.') })
    return () => controller.abort()
  }, [visible, place.latitude, place.longitude, attempt])

  return <div ref={root} className="event-location-map">
    <a href={place.map} target="_blank" rel="noreferrer" className="event-location-map-image" aria-label={`View ${place.label} in Google Maps`}>
      {image ? <img src={image} width={600} height={420} alt={`Map pin for ${place.label}`} onError={() => { setImage(''); setError('Map preview is unavailable. Open Google Maps to verify the location.') }}/>
        : <span>{error || (visible ? 'Loading map preview…' : 'View location on Google Maps')}</span>}
    </a>
    <div className="event-location-map-footer"><span className="event-location-attribution" translate="no">Google Maps</span><a href={place.map} target="_blank" rel="noreferrer">View larger map ↗</a></div>
    {error && <button type="button" className="text-action" onClick={() => setAttempt(value => value + 1)}>Retry map preview</button>}
  </div>
}
