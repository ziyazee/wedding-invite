import { useRef } from 'react'
import { useDepthLayers } from './useDepthLayers'
import skySrc from './assets/sky.webp'
import haveliSrc from './assets/haveli.webp'
import fieldMidSrc from './assets/field-mid.webp'
import fieldFrontSrc from './assets/field-front.webp'
import garlandsSrc from './assets/garlands.webp'
import './lab.css'

// Fixed positions: no Math.random so renders are stable and testable.
const PETALS = [
  { x: 8, d: 0, t: 13, s: 0.9 },
  { x: 22, d: 4, t: 17, s: 0.7 },
  { x: 37, d: 9, t: 15, s: 1 },
  { x: 51, d: 2, t: 19, s: 0.8 },
  { x: 64, d: 7, t: 14, s: 0.65 },
  { x: 78, d: 11, t: 18, s: 0.95 },
  { x: 91, d: 5, t: 16, s: 0.75 },
]

export default function ParallaxLab() {
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  useDepthLayers(track, stage)

  return (
    <main className="pl-root">
      <div className="pl-track" ref={track}>
        <div className="pl-stage" ref={stage}>
          <div className="pl-layer pl-sky">
            <img src={skySrc} alt="" decoding="async" />
          </div>
          <div className="pl-layer pl-clouds" aria-hidden="true">
            <span className="pl-cloud pl-cloud--a" />
            <span className="pl-cloud pl-cloud--b" />
            <span className="pl-cloud pl-cloud--c" />
          </div>

          <div className="pl-layer pl-haveli">
            <img src={haveliSrc} alt="" decoding="async" />
          </div>

          <div className="pl-layer pl-ground" />
          <div className="pl-layer pl-field-mid">
            <img src={fieldMidSrc} alt="" decoding="async" />
          </div>
          <div className="pl-layer pl-field-front">
            <img src={fieldFrontSrc} alt="" decoding="async" />
          </div>

          <div className="pl-layer pl-petals" aria-hidden="true">
            {PETALS.map((petal, index) => (
              <span
                key={index}
                className="pl-petal"
                style={{ left: `${petal.x}%`, animationDelay: `-${petal.d}s`, animationDuration: `${petal.t}s`, scale: petal.s }}
              />
            ))}
          </div>

          <div className="pl-layer pl-garlands">
            <img src={garlandsSrc} alt="" decoding="async" />
          </div>

          <div className="pl-copy pl-copy--intro">
            <p className="pl-eyebrow">Together with their families</p>
            <h1 className="pl-names">
              Harpreet <i>&amp;</i> Simran
            </h1>
          </div>

          <div className="pl-copy pl-copy--gate">
            <p className="pl-eyebrow">Step through the gate</p>
            <p className="pl-line">celebrate with us</p>
          </div>

          <div className="pl-hint" aria-hidden="true">
            <span>Scroll</span>
            <i />
          </div>
        </div>
      </div>

      <section className="pl-after">
        <p className="pl-eyebrow">The celebration</p>
        <h2>Harpreet &amp; Simran</h2>
        <p>14 February 2027 · Ludhiana, Punjab</p>
      </section>
    </main>
  )
}
