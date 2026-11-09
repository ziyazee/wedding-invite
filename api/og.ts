// Keep the Vercel endpoint as .ts; the JSX image layout lives outside /api.
import handler from '../server/ogImage'

export const config = { runtime: 'edge' }

export default handler
