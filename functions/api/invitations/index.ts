import { nameSlug, reservedSlugs, validateDetails } from '../../../src/invitations/model'
interface Database { prepare(sql: string): { bind(...values: unknown[]): { run(): Promise<unknown> } } }
export async function onRequestPost({ request, env }: { request: Request; env: { INVITATIONS_DB?: Database } }) {
  if (!env.INVITATIONS_DB) return Response.json({ error: 'Invitation storage is not configured. Bind INVITATIONS_DB before creating invitations.' }, { status: 503 })
  if (request.headers.get('Origin') !== new URL(request.url).origin) return Response.json({ error: 'Invalid origin.' }, { status: 403 })
  try {
    const body = await request.text()
    if (body.length > 40000) return Response.json({ error: 'Invitation is too large.' }, { status: 413 })
    const details = validateDetails(JSON.parse(body)); const base = nameSlug(details.groom, details.bride)
    for (let attempt = 0; attempt < 10; attempt++) {
      const slug = attempt || reservedSlugs.has(base) ? `${base}-${crypto.randomUUID().slice(0,8)}` : base
      const record = { slug, details, createdAt: new Date().toISOString() }
      try {
        await env.INVITATIONS_DB.prepare('INSERT INTO invitations (slug, payload) VALUES (?, ?)').bind(slug, JSON.stringify(record)).run()
        return Response.json(record, { status: 201 })
      } catch (error) { if (!String(error).includes('UNIQUE')) throw error }
    }
    throw new Error('Could not reserve a URL. Please try again.')
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : 'Could not create invitation.' }, { status: 400 }) }
}
