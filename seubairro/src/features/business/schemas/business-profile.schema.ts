import { z } from 'zod'
import { businessAddressSchema } from './business-address.schema'

/**
 * Campos cadastrais do negócio exigidos pelo backend (não-nulos no contrato →
 * obrigatórios). `instagramUrl` é nullable → opcional.
 */
const businessCoreFields = {
  businessName: z.string().min(1, 'Informe o nome do negócio').max(120, 'No máximo 120 caracteres'),
  legalName: z.string().min(1, 'Informe a razão social').max(160, 'No máximo 160 caracteres'),
  description: z
    .string()
    .min(1, 'Descreva o seu negócio')
    .max(1000, 'No máximo 1000 caracteres'),
  publicPhone: z
    .string()
    .regex(/^\d{8,15}$/, 'Telefone deve ter de 8 a 15 dígitos (somente números)'),
  instagramUrl: z.string().max(200, 'No máximo 200 caracteres').optional().or(z.literal('')),
}

/**
 * Dados cadastrais editáveis da empresa. Reflete o body de `PUT /api/business/{id}`
 * (o `id` é anexado no mapeamento; logo/capa vão por multipart em rotas próprias).
 */
export const businessProfileSchema = z.object({ ...businessCoreFields })

export type BusinessProfileFormValues = z.infer<typeof businessProfileSchema>

/**
 * Criação da empresa por um dono autenticado. Reflete `CreateBusinessRequest`
 * (`POST /api/Business`). Inclui o `taxId` (CNPJ/CPF), que identifica o negócio
 * e não é editável depois.
 */
export const businessCreateSchema = z.object({
  ...businessCoreFields,
  taxId: z
    .string()
    .regex(/^(\d{11}|\d{14})$/, 'Informe um CPF (11) ou CNPJ (14) — somente números'),
})

export type BusinessCreateFormValues = z.infer<typeof businessCreateSchema>

/**
 * Criação da empresa **com endereço obrigatório** num único formulário.
 * Combina os dados do negócio com os do endereço (geocodificado no backend).
 */
export const businessWithAddressCreateSchema = businessCreateSchema.merge(businessAddressSchema)

export type BusinessWithAddressCreateFormValues = z.infer<
  typeof businessWithAddressCreateSchema
>
