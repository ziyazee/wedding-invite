import type { TextLayout } from '../../invitations/textLayout'

const layout: TextLayout = {
  version: 1,
  elements: {
    // Opening composition follows the supplied visual reference in normal flow.
    't2.opening.separator': { fontSize: 33, x: 0, y: 0 },
    't2.opening.caption':   { x: 0, y: 0 },
    't2.opening.groom':     { fontSize: 37, x: 0, y: 0 },
    't2.opening.bride':     { fontSize: 37, x: 0, y: 0 },
    't2.opening.date':      { fontSize: 24, x: 0, y: 0 },
    't2.closing.separator': { fontSize: 54, x: 0, y: 0.04962675920267453 },
    't2.closing.groom':     { fontSize: 61 },
    't2.closing.bride':     { fontSize: 64 },
  },
}

export default layout
