import { z } from 'zod'

const onlyDigits = (s: string) => s.replace(/\D/g, '')
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const PHONE_CHARS = /^[\d\s()+-]+$/

export const BusinessSignupStep1Schema = z.object({
  fullName: z.string().min(2, 'Informe seu nome completo'),
  email: z.email('Email inválido').min(1, 'Informe seu email'),
  birthDate: z
    .string()
    .refine((v) => ISO_DATE.test(v), 'Data inválida'),
  cpf: z
    .string()
    .min(1, 'Informe seu CPF')
    .refine((v) => onlyDigits(v).length === 11, 'CPF deve ter 11 dígitos'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export const BusinessSignupStep2Schema = z.object({
  businessName: z.string().min(2, 'Informe o nome do negócio'),
  cnpj: z
    .string()
    .min(1, 'Informe o CNPJ')
    .refine((v) => onlyDigits(v).length === 14, 'CNPJ deve ter 14 dígitos'),
  description: z
    .string()
    .min(10, 'Descreva seu negócio em pelo menos 10 caracteres')
    .max(500, 'Máximo de 500 caracteres'),
  category: z.string().min(1, 'Selecione uma categoria'),
  whatsapp: z
    .string()
    .min(10, 'Informe um WhatsApp válido')
    .refine((v) => PHONE_CHARS.test(v), 'Use apenas números e separadores'),
})

export const BusinessSignupStep3Schema = z.object({
  postalCode: z
    .string()
    .min(1, 'Informe o CEP')
    .refine((v) => onlyDigits(v).length === 8, 'CEP deve ter 8 dígitos'),
  street: z.string().min(2, 'Informe a rua'),
  number: z.string().min(1, 'Informe o número'),
  neighborhood: z.string().min(2, 'Informe o bairro'),
  city: z.string().min(2, 'Informe a cidade'),
  stateProvince: z
    .string()
    .min(2, 'Informe a UF')
    .max(2, 'Use a sigla com 2 letras (ex: PR)')
    .transform((s) => s.toUpperCase()),
})

export const BusinessSignupSchema = z.object({
  ...BusinessSignupStep1Schema.shape,
  ...BusinessSignupStep2Schema.shape,
  ...BusinessSignupStep3Schema.shape,
})

export type BusinessSignupStep1Input = z.infer<typeof BusinessSignupStep1Schema>
export type BusinessSignupStep2Input = z.infer<typeof BusinessSignupStep2Schema>
export type BusinessSignupStep3Input = z.infer<typeof BusinessSignupStep3Schema>
export type BusinessSignupInput = z.infer<typeof BusinessSignupSchema>
