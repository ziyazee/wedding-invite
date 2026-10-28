import { useLayoutEffect } from 'react'

const active = new Map<string, { link: HTMLLinkElement; users: number }>()

export default function useGoogleFonts(url: string) {
  useLayoutEffect(() => {
    let entry = active.get(url)
    if (!entry) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = url
      document.head.append(link)
      entry = { link, users: 0 }
      active.set(url, entry)
    }
    entry.users += 1
    return () => {
      entry!.users -= 1
      if (entry!.users === 0) { entry!.link.remove(); active.delete(url) }
    }
  }, [url])
}
