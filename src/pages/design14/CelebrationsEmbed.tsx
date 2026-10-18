import { useLayoutEffect, useRef } from 'react'
import { Celebrations } from './Design14Scenes'
import styles from './Design14.css?inline'

// Share the original carousel inside legacy invitation documents, keeping its
// stylesheet isolated from their artwork and typography.
export default function CelebrationsEmbed() {
  const host = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    document.documentElement.classList.add('d14-document')
    const element = host.current
    const frame = window.frameElement as HTMLIFrameElement | null
    if (!element) return

    const resize = () => {
      if (frame) frame.style.height = `${Math.ceil(element.getBoundingClientRect().height)}px`
    }
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    resize()
    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('d14-document')
    }
  }, [])

  return (
    <>
      <style>{styles}</style>
      <style>{`
        html.d14-document, html.d14-document body, html.d14-document #root {
          margin: 0;
          padding: 0;
          width: 100%;
          max-width: none;
          height: auto;
          min-height: 0;
          overflow: hidden;
          background: #f5e2bc;
        }
      `}</style>
      <div ref={host} className="d14-JfqWY">
        <Celebrations opened />
      </div>
    </>
  )
}
