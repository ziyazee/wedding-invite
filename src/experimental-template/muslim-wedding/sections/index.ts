/* Golden — built-in sections. Adding a section = create its folder, add one line here,
   then add one line to config/layout.ts. */

import { registerSections } from '../core'
import opening from './opening'
import couple from './couple'
import countdown from './countdown'
import celebrations from './celebrations'
import rsvp from './rsvp'
import closing from './closing'

registerSections([opening, couple, countdown, celebrations, rsvp, closing])
