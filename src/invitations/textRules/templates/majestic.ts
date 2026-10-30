import { registerTemplateRules } from '../engine'
import type { TemplateTextRules } from '../engine'

const rules: TemplateTextRules = {
  'opening.groom':      { maxChars: 12, minScale: 0.55, maxLines: 2 },
  'opening.bride':      { maxChars: 12, minScale: 0.55, maxLines: 2 },
  'opening.groomFamily': { maxChars: 20, minScale: 0.6, maxLines: 2 },
  'opening.brideFamily': { maxChars: 20, minScale: 0.6, maxLines: 2 },
  'welcome.message':    { maxChars: 120, minScale: 0.7, maxLines: 4 },
}

registerTemplateRules('t2', rules)
