const COLORS = ['#E2B959', '#CC9A32', '#F3D488', '#232F52', '#F6EFDD']
const COUNT = 26

export function fireConfetti(container: HTMLElement | null) {
  if (!container) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  for (let i = 0; i < COUNT; i++) {
    const piece = document.createElement('span')
    piece.className = 'confetti-piece'
    const angle = (Math.random() - 0.5) * Math.PI * 0.9 - Math.PI / 2
    const dist = 60 + Math.random() * 90
    const dx = Math.cos(angle) * dist
    const dy = Math.sin(angle) * dist + 40
    piece.style.setProperty('--dx', `${dx}px`)
    piece.style.setProperty('--dy', `${dy}px`)
    piece.style.setProperty('--rot', `${(Math.random() - 0.5) * 480}deg`)
    piece.style.background = COLORS[i % COLORS.length]
    piece.style.animationDelay = `${Math.random() * 0.15}s`
    piece.style.left = `${45 + Math.random() * 10}%`
    container.appendChild(piece)
    piece.addEventListener('animationend', () => piece.remove())
  }
}
