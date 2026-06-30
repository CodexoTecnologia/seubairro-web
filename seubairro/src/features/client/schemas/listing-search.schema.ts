import { z } from 'zod'

export const listingSearchSchema = z.object({
  type: z.enum(['all', 'product', 'service']).default('all'),
  listingCategoryId: z.string().optional(),
  nicheIds: z.array(z.string()).default([]),
  query: z.string().max(80).optional(),
  maxDistanceKm: z
    .union([z.literal(1), z.literal(2), z.literal(5), z.literal(10), z.literal(20)])
    .default(5),
  openNow: z.boolean().default(false),
  view: z.enum(['list', 'grid']).default('list'),
})

export type ListingSearchFilters = z.infer<typeof listingSearchSchema>

const DEFAULTS: ListingSearchFilters = listingSearchSchema.parse({})

/** Lê a URL e devolve filtros tipados, aplicando defaults. `nicheIds` vem como CSV. */
export function parseSearchParams(params: URLSearchParams): ListingSearchFilters {
  const raw: Record<string, unknown> = {}
  const type = params.get('type')
  if (type) raw.type = type
  const listingCategoryId = params.get('listingCategoryId')
  if (listingCategoryId) raw.listingCategoryId = listingCategoryId
  const nicheIds = params.get('nicheIds')
  if (nicheIds) raw.nicheIds = nicheIds.split(',').filter(Boolean)
  const query = params.get('query')
  if (query) raw.query = query
  const maxDistanceKm = params.get('maxDistanceKm')
  if (maxDistanceKm) raw.maxDistanceKm = Number(maxDistanceKm)
  const openNow = params.get('openNow')
  if (openNow) raw.openNow = openNow === 'true'
  const view = params.get('view')
  if (view) raw.view = view

  const parsed = listingSearchSchema.safeParse(raw)
  return parsed.success ? parsed.data : DEFAULTS
}

/** Serializa filtros para a URL, omitindo defaults para manter o link limpo. */
export function serializeFilters(filters: ListingSearchFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.type !== 'all') params.set('type', filters.type)
  if (filters.listingCategoryId) params.set('listingCategoryId', filters.listingCategoryId)
  if (filters.nicheIds.length > 0) params.set('nicheIds', filters.nicheIds.join(','))
  if (filters.query) params.set('query', filters.query)
  if (filters.maxDistanceKm !== 5) params.set('maxDistanceKm', String(filters.maxDistanceKm))
  if (filters.openNow) params.set('openNow', 'true')
  if (filters.view !== 'list') params.set('view', filters.view)
  return params
}
