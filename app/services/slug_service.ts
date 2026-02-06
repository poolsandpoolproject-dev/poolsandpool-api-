export function toTitleCase(input: string): string {
  return input
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function toSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function ensureUniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const normalized = toSlug(base)
  let candidate = normalized

  for (let i = 0; i < 1000; i++) {
    if (!(await exists(candidate))) return candidate
    candidate = `${normalized}-${i + 2}`
  }

  throw new Error('Unable to generate unique slug')
}
