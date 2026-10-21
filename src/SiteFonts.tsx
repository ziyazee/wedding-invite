import { lazy, useLayoutEffect } from 'react'
import type { ComponentType } from 'react'

const fontURL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Playfair+Display:wght@400;500;600;700&family=Lora:wght@400;500;600&family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Great+Vibes&family=Quicksand:wght@300;400;500;600;700&display=swap'
let users = 0
let stylesheet: HTMLLinkElement | null = null

// Site pages and unmigrated designs keep their established font set. Native
// Royal Grace loads its own two families from Design2.css instead.
export default function SiteFonts() {
  useLayoutEffect(() => {
    users += 1
    if (!stylesheet) {
      stylesheet = document.createElement('link')
      stylesheet.rel = 'stylesheet'
      stylesheet.href = fontURL
      stylesheet.dataset.siteFonts = ''
      document.head.append(stylesheet)
    }
    return () => {
      users -= 1
      if (users === 0) { stylesheet?.remove(); stylesheet = null }
    }
  }, [])
  return null
}

export function lazySitePage(load: () => Promise<{ default: ComponentType }>) {
  return lazy(async () => {
    const { default: Page } = await load()
    return { default: function SitePage() { return <><SiteFonts/><Page/></> } }
  })
}
