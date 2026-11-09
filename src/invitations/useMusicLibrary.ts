import { useCallback, useEffect, useState } from 'react'
import { musicCatalog } from './musicCatalog'
import { loadMusicLibrary, musicLibraryUpdated, type MusicTrack } from './musicLibrary'

export function useMusicLibrary(companyId?: number, includeAll = false) {
  const [tracks, setTracks] = useState<readonly MusicTrack[]>(musicCatalog)
  const [loading, setLoading] = useState(true)
  const [available, setAvailable] = useState(false)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const refresh = useCallback(() => setRevision(value => value + 1), [])
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    void loadMusicLibrary(companyId, includeAll).then(items => {
      if (cancelled) return
      setTracks(items); setAvailable(true); setError('')
    }).catch(cause => {
      if (cancelled) return
      // Keep the last good catalogue, or built-in songs before setup.
      setError(cause && typeof cause.message === 'string' ? cause.message : 'Unable to load the music library.')
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [revision, companyId, includeAll])
  useEffect(() => {
    window.addEventListener('focus', refresh)
    window.addEventListener(musicLibraryUpdated, refresh)
    return () => { window.removeEventListener('focus', refresh); window.removeEventListener(musicLibraryUpdated, refresh) }
  }, [refresh])
  return { tracks, loading, available, error, refresh }
}
