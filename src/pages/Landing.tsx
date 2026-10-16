import { useLayoutEffect, useRef, useState } from 'react'
import './Landing.css'

type Template = { id: number | string; name: string; mood: string; image: string; path?: string }

const templates: Template[] = [
  { id: 17, name: 'Gulabi Mandap', mood: 'Rose · Champagne · Romance', image: '/design17/preview.jpg' },
  { id: 'mohadrahma', name: 'Mohad & Rahma', mood: 'Royal Grace · Nikah · Celebration', image: '/images/royal-grace/opening-poster.jpg', path: '/mohadrahma' },
  { id: 6, name: 'Majestic', mood: 'Pearl · Chandeliers · Garden', image: '/design6/assets/hero-poster-DkA1j00-.jpg', path: '/design6' },
  { id: 14, name: 'Arjun & Bhavana · A Timeless Union', mood: 'Traditional · Hindu · Floral', image: '/design14/assets/704nAPXndZuu4f9Y58HGiZKFCM.jpeg', path: '/arjunbhavana' },
  { id: 18, name: 'Mandap at Dusk', mood: 'Sunset · Rose · Regal', image: '/design18/preview.jpg' },
  { id: 15, name: 'Ivory Arch', mood: 'Ivory · Champagne · Elegant', image: '/design15/preview.jpg' },
  { id: 5, name: 'Secret Garden', mood: 'Garden · Ivory · Romantic', image: '/design5/assets/opened.jpg' },
  { id: 3, name: 'Embroidered Garden', mood: 'Wisteria · Swans · Romance', image: '/design3/assets/embroidered-swans-hero-v2.png' },
  { id: 7, name: 'Bloom', mood: 'Garden · Ivory · Romantic', image: '/design7/assets/hero-bg-RvVOmFvi.png' },
  { id: 13, name: 'The Artful Love Story', mood: 'Ornate · Indian · Romantic', image: '/design13/assets/zBRd2fZShor1nxxKvdVKhKU.png' },
]

const categories = ['All Templates', 'Hindu', 'Muslim', 'Christian', 'Traditional', 'Modern', 'Floral', 'Royal', 'Minimal']
const categoryIcons = ['grid', 'lotus', 'moon', 'cross', 'ornament', 'leaf', 'flower', 'crown', 'mountain']
const tags: Record<string, string[]> = {
  5: ['Floral', 'Modern'], 6: ['Royal', 'Traditional'], 3: ['Floral', 'Traditional'],
  7: ['Floral', 'Modern'], 14: ['Hindu', 'Traditional', 'Floral'], 13: ['Hindu', 'Traditional', 'Royal'],
  15: ['Minimal', 'Modern'], 17: ['Hindu', 'Floral'], 18: ['Hindu', 'Royal'], mohadrahma: ['Muslim', 'Royal'],
}
const contact = 'https://wa.me/917975948093?text=Hey%20I%20need%20an%20invitation%21'
function LineIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    grid: 'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z',
    lotus: 'M12 21C5 17 6 9 12 3c6 6 7 14 0 18ZM12 21C4 21 1 15 2 10c6 0 9 5 10 11Zm0 0c8 0 11-6 10-11-6 0-9 5-10 11Z',
    moon: 'M20 16A9 9 0 0 1 9 3a9 9 0 1 0 11 13Z',
    cross: 'M10 3h4v6h5v4h-5v9h-4v-9H5V9h5Z',
    ornament: 'M12 2 16 6 12 10 8 6ZM12 14l4 4-4 4-4-4ZM2 12l4-4 4 4-4 4ZM14 12l4-4 4 4-4 4Z',
    leaf: 'M4 22 19 3M9 16C2 13 2 8 4 4c6 3 7 6 5 12ZM12 12c-1-7 3-10 9-10 0 6-3 10-9 10ZM7 19c4-6 8-5 12-4-2 5-7 7-12 4Z',
    flower: 'M12 8C5-3 1 9 8 12c-11 5 1 13 4 4 5 10 13-1 4-4 10-5-1-13-4-4ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
    crown: 'm3 7 5 5 4-9 4 9 5-5-3 12H6ZM6 22h12',
    mountain: 'M2 21 10 4l4 8 3-6 6 15ZM7 10l3 3 3-3',
    diamond: 'M3 4h18l3 6-12 14L0 10ZM0 10h24M8 4l-3 6 7 14 7-14-3-6M8 4h8',
    phone: 'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1ZM11 19h2',
    heart: 'M12 21 3 12C-3 4 7-1 12 6 17-1 27 4 21 12Z',
    edit: 'm4 16-1 5 5-1L21 7l-5-5ZM14 4l5 5M12 22h10',
    photo: 'M3 3h18v18H3ZM3 17l6-6 5 5 3-3 4 4M16 7h.01',
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.flower}/></svg>
}
function SearchIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg> }
function Lotus() { return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M24 42C9 33 12 17 24 5c12 12 15 28 0 37ZM24 42C8 42 3 31 3 20c12 0 20 8 21 22Zm0 0c16 0 21-11 21-22-12 0-20 8-21 22Z"/><path d="M24 42C11 39 8 25 12 13m12 29c13-3 16-17 12-29"/></svg> }
export default function Landing() {
  const [selected, setSelected] = useState<number | string>(17)
  const [category, setCategory] = useState('All Templates')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [sort, setSort] = useState('featured')
  const [favorites, setFavorites] = useState<(number | string)[]>([])
  const [info, setInfo] = useState<string | null>(null)
  const phoneScreen = useRef<HTMLDivElement>(null)
  const [screenScale, setScreenScale] = useState(0.42)
  const [previewLoaded, setPreviewLoaded] = useState(false)
  const currentTemplate = templates.find(template => template.id === selected) ?? templates[0]
  const path = currentTemplate.path ?? `/design${selected}`
  const filtered = templates.filter(t => (category === 'All Templates' || tags[t.id]?.includes(category)) && `${t.name} ${t.mood}`.toLowerCase().includes(query.toLowerCase()) && (sort !== 'favorites' || favorites.includes(t.id)))
  if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name))
  useLayoutEffect(() => {
    const screen = phoneScreen.current
    if (!screen) return
    const resize = () => setScreenScale(Math.min(screen.clientWidth / 402, screen.clientHeight / 874))
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(screen)
    return () => observer.disconnect()
  }, [])
  function chooseTemplate(id: number | string) {
    if (id !== selected) { setSelected(id); setPreviewLoaded(false) }
    if (window.matchMedia('(max-width: 760px)').matches) document.getElementById('live-preview')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  function next(direction: number) {
    const index = templates.findIndex(t => t.id === selected)
    chooseTemplate(templates[(index + direction + templates.length) % templates.length].id)
  }
  return <div className="showcase-page">
    <header className="studio-header">
      <a className="studio-brand" href="/" aria-label="Shaadi Invites home"><Lotus/><span>SHAADI INVITES<small>— THE WEDDING STUDIO —</small></span></a>
      <nav aria-label="Main navigation"><a className="active" href="#templates">Templates</a>{['How It Works', 'Pricing', 'About'].map(label => <button key={label} onClick={() => setInfo(label)}>{label}</button>)}<a href={contact} target="_blank" rel="noreferrer">Contact</a></nav>
      <div className="studio-header-actions"><button className="search-toggle" aria-label="Search templates" aria-expanded={searchOpen} onClick={() => { setSearchOpen(!searchOpen); document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' }) }}><SearchIcon/></button><a className="gold-button" href="/dashboard">Create Invite <span>⟶</span></a></div>
    </header>
    <main className="showcase-content">
      <div className="showcase-catalog">
        <section className="studio-hero">
          <img className="hero-art" src="/landing/palace-wedding-hero.jpg" alt="" fetchPriority="high"/>
          <div className="hero-copy"><p className="studio-eyebrow">THE ART OF A BEAUTIFUL BEGINNING</p><h1>Digital Invitations<br/>for Unforgettable<br/>Moments</h1><p className="hero-description">Beautifully crafted wedding invitations for every story,<br className="desktop-break"/> every tradition, every celebration.</p><a className="gold-button" href="#templates">Explore Templates <span>⟶</span></a>
          <div className="hero-benefits"><span><LineIcon name="diamond"/>Elegant Designs</span><span><LineIcon name="phone"/>Works on All Devices</span><span><LineIcon name="heart"/>Made for Every Tradition</span></div></div>
          <p className="hero-note">Invitations<br/>that feel like<br/>your story</p>
        </section>
        <section className="template-section" id="templates" aria-labelledby="template-title">
          <div className="template-filters" role="group" aria-label="Template categories">{categories.map((label, i) => <button key={label} className={category === label ? 'active' : ''} aria-pressed={category === label} onClick={() => setCategory(label)}><span aria-hidden="true"><LineIcon name={categoryIcons[i]}/></span>{label}</button>)}</div>
          {searchOpen && <label className="template-search"><SearchIcon/><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Find your invitation…" aria-label="Search templates"/><button onClick={() => { setQuery(''); setSearchOpen(false) }} aria-label="Close search">×</button></label>}
          <div className="template-heading"><h2 id="template-title">Explore Our Templates</h2><div><span>{filtered.length} Beautiful Designs</span><select aria-label="Sort templates" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="name">Name: A–Z</option><option value="favorites">Your Favourites</option></select></div></div>
          <div className="template-list">{filtered.map(template => <article className={`template-card${selected === template.id ? ' is-selected' : ''}`} key={template.id}>
            <div className="template-image-wrap"><button className="template-select" aria-label={`Preview ${template.name}`} aria-pressed={selected === template.id} onClick={() => chooseTemplate(template.id)}><img src={template.image} alt={`${template.name} invitation artwork`} loading="lazy"/><span className="card-play" aria-hidden="true"><svg viewBox="0 0 20 20" fill="currentColor"><path d="m7 4 9 6-9 6Z"/></svg></span></button><button className={`card-favorite${favorites.includes(template.id) ? ' saved' : ''}`} aria-label={`Favourite ${template.name}`} aria-pressed={favorites.includes(template.id)} onClick={() => setFavorites(prev => prev.includes(template.id) ? prev.filter(id => id !== template.id) : [...prev, template.id])}><LineIcon name="heart"/></button></div>
            <button className="template-name" onClick={() => chooseTemplate(template.id)}>{template.name}</button><p className="template-mood">{template.mood}</p>
          </article>)}</div>
          {filtered.length === 0 && <div className="template-empty"><h3>A beautiful beginning is on its way.</h3><p>No templates match this selection yet.</p><button onClick={() => { setCategory('All Templates'); setQuery(''); setSort('featured') }}>Explore all templates →</button></div>}
          <footer className="showcase-footer">SHAADI INVITES <span>·</span> A celebration begins with an invitation</footer>
        </section>
      </div>
      <aside id="live-preview" className="showcase-preview" aria-label="Live invitation preview">
        <div className="phone-stage"><div className="iphone-frame"><div className="iphone-screen" ref={phoneScreen}>
          {!previewLoaded && <img className="phone-placeholder" src={currentTemplate.image} alt="Loading invitation preview"/>}
          <iframe key={selected} src={path} title={`${currentTemplate.name}: interactive wedding invitation`} allow="autoplay; fullscreen" style={{ transform: `scale(${screenScale})`, opacity: previewLoaded ? 1 : 0 }} onLoad={() => setPreviewLoaded(true)} allowFullScreen/>
          <div className="dynamic-island" aria-hidden="true"/>
        </div></div></div>
        <div className="preview-details"><div className="preview-title"><h2>{currentTemplate.name}</h2><button aria-label="Previous template" onClick={() => next(-1)}>‹</button><button aria-label="Next template" onClick={() => next(1)}>›</button></div>
          <a className="gold-button" href={`https://wa.me/917975948093?text=${encodeURIComponent(`Hey I need an invitation! I like ${currentTemplate.name}.`)}`} target="_blank" rel="noreferrer">Use This Template <span>⟶</span></a>
          <a className="preview-full" href={path} target="_blank" rel="noreferrer">▷ &nbsp; Preview Full Invitation</a>
          {['Customise Content', 'Choose Colours', 'Add Photos & Videos'].map((label, i) => <a className="preview-option" key={label} href={`https://wa.me/917975948093?text=${encodeURIComponent(`Hey I need an invitation! Can you help me ${label.toLowerCase()} for ${currentTemplate.name}?`)}`} target="_blank" rel="noreferrer"><span><LineIcon name={['edit','flower','photo'][i]}/></span>{label}<b>›</b></a>)}
        </div>
      </aside>
    </main>
    {info && <div className="studio-modal-backdrop" onClick={() => setInfo(null)}><section className="studio-modal" role="dialog" aria-modal="true" aria-label={info} onClick={e => e.stopPropagation()} onKeyDown={e => { if(e.key === 'Escape') setInfo(null) }}><button autoFocus className="modal-close" onClick={() => setInfo(null)} aria-label="Close">×</button><p className="studio-eyebrow">SHAADI INVITES</p><h2>{info}</h2>{info === 'How It Works' ? <ol><li>Explore the collection and play a live invitation.</li><li>Choose your design and share your celebration details.</li><li>Receive your personal invitation link to share with loved ones.</li></ol> : <p>{info === 'Pricing' ? 'Every celebration is personal. Contact us with your favourite template and customisation needs for a quote.' : 'Thoughtfully crafted digital wedding invitations, bringing your story and traditions to life through beautiful artwork, music, and motion.'}</p>}<a className="gold-button" href={contact} target="_blank" rel="noreferrer">Let’s create your invitation ⟶</a></section></div>}
  </div>
}
