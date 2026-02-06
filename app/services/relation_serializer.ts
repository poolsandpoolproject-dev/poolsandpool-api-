export function slimRelation(row: { id: string; name: string; slug: string; imageUrl: string | null } | null) {
  if (!row) return null
  return { id: row.id, name: row.name, slug: row.slug, imageUrl: row.imageUrl }
}
