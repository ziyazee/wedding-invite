import { validateDetails } from '../../../src/invitations/model'
interface Database { prepare(sql: string): { bind(...values: unknown[]): { run(): Promise<unknown> } } }
export async function onRequestPost({ request, env }: { request: Request; env: { INVITATIONS_DB?: Database } }) {
 const headers = { 'Cache-Control': 'no-store' }
 if (request.headers.get('Origin') !== new URL(request.url).origin) return Response.json({ error: 'Invalid origin.' }, { status: 403, headers })
 if (!env.INVITATIONS_DB) return Response.json({ error: 'Applications are temporarily unavailable. Please try again later.' }, { status: 503, headers })
 let details
 try {
  const body = await request.text()
  if (body.length > 40000) return Response.json({ error: 'Application is too large.' }, { status: 413, headers })
  details = validateDetails(JSON.parse(body))
  if (details.template !== 2) throw new Error('Please select the Royal Grace application form.')
 } catch (error) { return Response.json({ error: error instanceof Error ? error.message : 'Invalid application.' }, { status: 400, headers }) }
 const id = crypto.randomUUID(); const createdAt = new Date().toISOString()
 try {
  await env.INVITATIONS_DB.prepare('INSERT INTO applications (id, created_at, status, groom, bride, wedding_date, payload) VALUES (?, ?, ?, ?, ?, ?, ?)')
   .bind(id, createdAt, 'new', details.groom, details.bride, details.date, JSON.stringify(details)).run()
  return Response.json({ id, createdAt, status: 'new' }, { status: 201, headers })
 } catch { return Response.json({ error: 'Unable to save your application. Please try again.' }, { status: 503, headers }) }
}
export function onRequestGet() { return Response.json({ error: 'Method not allowed.' }, { status: 405, headers: { Allow: 'POST', 'Cache-Control': 'no-store' } }) }
