import { z } from 'zod'

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const customerAvatarSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_SIZE_BYTES, 'Tamanho máximo de 5 MB')
  .refine((file) => ACCEPTED_TYPES.includes(file.type), 'Formato não suportado — use JPG, PNG ou WebP')

export type CustomerAvatarInput = z.infer<typeof customerAvatarSchema>
