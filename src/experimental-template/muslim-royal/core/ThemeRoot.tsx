/* Golden — page root: applies theme variables, loads fonts, scopes the page.
   Everything it touches outside its own element is undone on unmount. */

import { useEffect } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { themeVars } from './theme'
import type { Theme } from './theme'

const FONT_LINK_ID = 'mr-fonts'

export default function ThemeRoot({ theme, children }: { theme: Theme; children: ReactNode }) {
  useEffect(() => {
    let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null
    const created = !link
    if (!link) {
      link = document.createElement('link')
      link.id = FONT_LINK_ID
      link.rel = 'stylesheet'
      link.href = theme.fonts.href
      document.head.appendChild(link)
    }
    const html = document.documentElement
    const prevBg = html.style.backgroundColor
    html.style.backgroundColor = theme.tokens.bg
    return () => {
      html.style.backgroundColor = prevBg
      if (created) link?.remove()
    }
  }, [theme])

  return (
    <div className={`${theme.prefix}-page`} style={themeVars(theme) as CSSProperties}>
      {children}
    </div>
  )
}
