/* Golden — section registry. Sections register once; the renderer looks them up by id. */

import type { SectionPlugin } from './contract'

const sections = new Map<string, SectionPlugin>()

export function registerSection(plugin: SectionPlugin): void {
  sections.set(plugin.id, plugin)
}

export function registerSections(plugins: SectionPlugin[]): void {
  for (const p of plugins) registerSection(p)
}

export function getSection(id: string): SectionPlugin | undefined {
  return sections.get(id)
}

export function listSections(): string[] {
  return [...sections.keys()]
}
