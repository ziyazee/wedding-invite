/* Golden — floating music toggle. Rendered by the renderer when a music source exists. */

import type { MusicApi } from './contract'

export default function MusicButton({ music }: { music: MusicApi }) {
  if (!music.available) return null
  return (
    <button
      type="button"
      className={`tm-music${music.playing ? ' is-playing' : ''}`}
      aria-label={music.playing ? 'Pause music' : 'Play music'}
      aria-pressed={music.playing}
      onClick={music.toggle}
    >
      <span className="tm-music__bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  )
}
