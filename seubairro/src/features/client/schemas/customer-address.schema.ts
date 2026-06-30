import { z } from 'zod'

export const customerAddressSchema = z.object({
  postalCode: z.string().regex(/^\d{8}$/, 'CEP deve ter 8 dígitos (somente números)'),
  street: z.string().min(1, 'Informe a rua'),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Informe o bairro'),
  city: z.string().min(1, 'Informe a cidade'),
  stateProvince: z.string().regex(/^[A-Za-z]{2}$/, 'UF deve ter 2 letras'),
})

export type CustomerAddressFormValues = z.infer<typeof customerAddressSchema>
