import { z } from 'zod'

/**
 * Endereço da empresa. Reflete o body de `POST/PUT /api/business/{id}/address`
 * do contrato (o backend geocodifica lat/lng automaticamente). O `countryCode`
 * é fixado como Brasil no mapeamento para o DTO.
 */
export const businessAddressSchema = z.object({
  postalCode: z.string().regex(/^\d{8}$/, 'CEP deve ter 8 dígitos (somente números)'),
  street: z.string().min(1, 'Informe a rua'),
  number: z.string().min(1, 'Informe o número'),
  neighborhood: z.string().min(1, 'Informe o bairro'),
  city: z.string().min(1, 'Informe a cidade'),
  stateProvince: z.string().regex(/^[A-Za-z]{2}$/, 'UF deve ter 2 letras'),
})

export type BusinessAddressFormValues = z.infer<typeof businessAddressSchema>
