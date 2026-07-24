import { z } from 'zod'

const optionalDigits = (regex: RegExp, message: string) =>
  z.union([z.string().regex(regex, message), z.literal('')]).optional()

export const customerProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Nome deve ter entre 2 e 60 caracteres')
    .max(60, 'Nome deve ter entre 2 e 60 caracteres'),
  lastName: z
    .string()
    .min(2, 'Sobrenome deve ter entre 2 e 60 caracteres')
    .max(60, 'Sobrenome deve ter entre 2 e 60 caracteres'),
  // Telefone em dígitos puros, sem `+` nem máscara. O valor exibido pode ter máscara,
  // mas o que vai ao backend é apenas dígitos.
  phoneCountryCode: optionalDigits(/^\d{1,3}$/, 'Código do país inválido — use apenas dígitos, ex.: 55'),
  phoneNumber: optionalDigits(/^\d{8,15}$/, 'Número de telefone inválido — use apenas dígitos, sem máscara'),
})

export type CustomerProfileFormValues = z.infer<typeof customerProfileSchema>
