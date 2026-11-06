import type { TextLayout } from '../../invitations/textLayout'

const layout: TextLayout = {
  version: 1,
  elements: {
    // Saved opening positions from public/edits/2.json.
    't2.opening.separator': { fontSize: 30, x: 0.000009717039800995197, y: -0.027302020575467986 },
    't2.opening.caption':   { x: 0, y: -0.016752719545464485 },
    't2.opening.groom':     { fontSize: 37, x: 0.000009717039800995197, y: -0.023764416085330652 },
    't2.opening.bride':     { fontSize: 37, x: 0.000009717039800995197, y: -0.038609968523114935 },
    't2.opening.date':      { fontSize: 20, x: 0, y: -0.07115844982833275 },
    't2.welcome.separator': { x: 0.000009717039800994764, y: 0.010962311250380115 },
    't2.closing.separator': { fontSize: 55, x: 0.00000971703980099433, y: 0.026348700483871224 },
    't2.closing.groom':     { fontSize: 61 },
    't2.closing.bride':     { fontSize: 64 },
  },
}

export default layout
