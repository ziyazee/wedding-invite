interface Database { prepare(sql: string): { bind(...values: unknown[]): { first<T>(): Promise<T | null> } } }
export async function onRequestGet({ params, env }: { params: { slug: string }; env: { INVITATIONS_DB?: Database } }) {
  if (!env.INVITATIONS_DB) return Response.json({ error: 'Invitation storage is not configured.' }, { status: 503 })
  const row = await env.INVITATIONS_DB.prepare('SELECT payload FROM invitations WHERE slug = ?').bind(params.slug).first<{ payload: string }>()
  return row ? new Response(row.payload, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }) : Response.json({ error: 'Invitation not found.' }, { status: 404 })
}
