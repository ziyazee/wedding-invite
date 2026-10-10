export function slugify(groomName: string, brideName: string): string {
  const raw = `${groomName}-weds-${brideName}`;
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function appendSuffix(slug: string): string {
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${slug}-${suffix}`;
}
