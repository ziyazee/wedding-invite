import { useLayoutEffect, useRef, useState } from 'react'
import './Landing.css'

type Template = { id: number | string; name: string; mood: string; image: string; path?: string }

const templates: Template[] = [
  { id: 5, name: 'Secret Garden', mood: 'Garden · Ivory · Romantic', image: '/design5/assets/opened.jpg' },
  { id: 6, name: 'Majestic', mood: 'Pearl · Chandeliers · Garden', image: '/design6/assets/hero-poster-DkA1j00-.jpg', path: '/design6' },
  { id: 3, name: 'Embroidered Garden', mood: 'Wisteria · Swans · Romance', image: '/design3/assets/embroidered-swans-hero-v2.png' },
  { id: 7, name: 'Bloom', mood: 'Garden · Ivory · Romantic', image: '/design7/assets/hero-bg-RvVOmFvi.png' },
  { id: 14, name: 'Radha · A Timeless Union', mood: 'Traditional · Hindu · Floral', image: '/design14/assets/704nAPXndZuu4f9Y58HGiZKFCM.jpeg' },
  { id: 13, name: 'The Artful Love Story', mood: 'Ornate · Indian · Romantic', image: '/design13/assets/zBRd2fZShor1nxxKvdVKhKU.png' },
  { id: 15, name: 'Ivory Arch', mood: 'Ivory · Champagne · Elegant', image: '/design15/preview.jpg' },
  { id: 17, name: 'Gulabi Mandap', mood: 'Rose · Champagne · Romance', image: '/design17/preview.jpg' },
  { id: 18, name: 'Mandap at Dusk', mood: 'Sunset · Rose · Regal', image: '/design18/preview.jpg' },
  { id: 'mohadrahma', name: 'Mohad & Rahma', mood: 'Royal Grace · Nikah · Celebration', image: '/images/royal-grace/opening-poster.jpg', path: '/mohadrahma' },
]

export default function Landing() {
  const [selected, setSelected] = useState<number | string>(5)
  const phoneScreen = useRef<HTMLDivElement>(null)
  const [screenScale, setScreenScale] = useState(0.42)
  const [previewKey, setPreviewKey] = useState(0)
  const [previewLoaded, setPreviewLoaded] = useState(false)
  const currentTemplate = templates.find(template => template.id === selected) ?? templates[0]

  useLayoutEffect(() => {
    const screen = phoneScreen.current
    if (!screen) return
    const resize = () => {
      const scale = Math.min(screen.clientWidth / 402, screen.clientHeight / 874)
      setScreenScale(previous => Math.abs(previous - scale) < 0.001 ? previous : scale)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(screen)
    return () => observer.disconnect()
  }, [])

  function chooseTemplate(id: number | string) {
    if (id === selected) return
    setSelected(id)
    setPreviewLoaded(false)
    setPreviewKey(key => key + 1)
  }

  return (
    <div className="showcase-page">
      <div className="showcase-atmosphere" aria-hidden="true">
        <span className="showcase-glow showcase-glow-left" />
        <span className="showcase-glow showcase-glow-right" />
        <span className="showcase-star showcase-star-one">✦</span>
        <span className="showcase-star showcase-star-two">✧</span>
        <span className="showcase-star showcase-star-three">✧</span>
      </div>

      <main className="showcase-content">
        <section className="showcase-preview" aria-label="Interactive invitation preview">
          <div className="phone-stage">
            <div className="phone-halo" aria-hidden="true" />
            <div className="phone-shadow" aria-hidden="true" />
            <div className="iphone-frame" aria-label="iPhone 17 Pro preview">
              <div className="iphone-screen" ref={phoneScreen}>
                <iframe
                  key={`${selected}-${previewKey}`}
                  src={currentTemplate.path ?? `/design${selected}`}
                  title={`${currentTemplate.name}: interactive wedding invitation`}
                  allow="autoplay; fullscreen"
                  style={{ transform: `scale(${screenScale})`, opacity: previewLoaded ? 1 : 0 }}
                  onLoad={() => setPreviewLoaded(true)}
                  allowFullScreen
                />
                <div className="dynamic-island" aria-hidden="true"><span /></div>
                <div className="screen-glass" aria-hidden="true" />
              </div>
            </div>
            <div className="phone-caption"><span /> iPhone 17 Pro <span /></div>
          </div>

        </section>

        <div className="showcase-copy">
        <section className="template-section" aria-labelledby="template-title">
          <div className="template-heading">
            <div>
              <p className="showcase-eyebrow">THE COLLECTION</p>
              <h2 id="template-title">Choose your <em>beginning</em></h2>
            </div>
            <span className="template-count">10 <i>designs</i></span>
          </div>
          <div className="template-list" role="group" aria-label="Choose an invitation template">
            {templates.map(template => {
              const active = selected === template.id
              return (
                <button
                  type="button"
                  key={template.id}
                  className={`template-card${active ? ' is-selected' : ''}`}
                  aria-pressed={active}
                  onClick={() => chooseTemplate(template.id)}
                >
                  <span className="template-image-wrap">
                    <img src={template.image} alt="" />
                    <span className="template-image-shade" />
                    <span className="template-number">{typeof template.id === 'number' ? `DESIGN ${template.id}` : 'FEATURED'}</span>
                    <span className="template-check" aria-hidden="true">{active ? '✓' : '↗'}</span>
                  </span>
                  <span className="template-copy">
                    <span className="template-name">{template.name}</span>
                    <span className="template-mood">{template.mood}</span>
                  </span>
                  <span className="template-active-label">SELECTED</span>
                </button>
              )
            })}
          </div>
        </section>
          <footer className="showcase-footer"><span>SHAADI INVITES</span><i /> A celebration begins with an invitation</footer>
        </div>
      </main>
    </div>
  )
}
