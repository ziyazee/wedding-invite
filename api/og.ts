import type { IncomingMessage, ServerResponse } from 'node:http'
import handler from '../server/ogImage.js'

// Use the Node runtime so local company logos can be bundled with the function.
export default async function og(request: IncomingMessage, response: ServerResponse) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.statusCode = 405
    response.setHeader('Allow', 'GET, HEAD')
    response.end()
    return
  }
  const url = new URL(request.url || '/api/og', `https://${request.headers.host || 'www.shaadiinvites.in'}`)
  const image = await handler(new Request(url))
  const bytes = Buffer.from(await image.arrayBuffer())
  response.statusCode = image.status
  image.headers.forEach((value, name) => response.setHeader(name, value))
  response.setHeader('Content-Length', bytes.byteLength)
  response.end(request.method === 'HEAD' ? undefined : bytes)
}
