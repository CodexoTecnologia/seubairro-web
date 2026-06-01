import { z } from 'zod'

/**
 * Schema canônico do negócio no frontend. Reflete o `BusinessResponse` do backend.
 * Use `BusinessSchema.parse(raw)` na fronteira para garantir tipo em runtime.
 */
export const BusinessSchema = z
  .object({
    id: z.string(),
    ownerId: z.string(),
    slug: z.string().nullable(),
    businessName: z.string().nullable(),
    legalName: z.string().nullable(),
    description: z.string().nullable(),
    logoUrl: z.string().nullable(),
    coverImageUrl: z.string().nullable(),
    publicPhone: z.string().nullable(),
    instagramUrl: z.string().nullable(),
    isActive: z.boolean().optional().default(false),
    isClosed: z.boolean().optional().default(false),
  })
  .passthrough()

export type Business = z.infer<typeof BusinessSchema>

/**
 * Aceita o retorno do endpoint, que pode ser:
 *   - null (404 silencioso)
 *   - objeto Business
 *   - { data: Business }
 * Normaliza para `Business | null`.
 */
export const BusinessOrNullSchema = z.preprocess((raw) => {
  if (raw == null) return null
  if (typeof raw === 'object' && 'data' in raw) return (raw as { data: unknown }).data ?? null
  return raw
}, z.union([BusinessSchema, z.null()]))
