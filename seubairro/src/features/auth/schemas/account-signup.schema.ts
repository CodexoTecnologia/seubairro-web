import { z } from 'zod'

const onlyDigits = (s: string) => s.replace(/\D/g, '')
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Cadastro de conta (cliente ou empreendedor). Na Opção B os dois papéis têm o
 * mesmo payload: dados pessoais, telefone (opcional) e endereço pessoal
 * obrigatório. Wizard de 2 passos: dados pessoais (+ telefone) e endereço.
 */
export const AccountSignupStep1Schema = z.object({
  fullName: z
    .string()
    .min(2, 'Informe seu nome completo')
    .refine((v) => v.trim().split(/\s+/).length >= 2, 'Informe nome e sobrenome'),
  email: z.email('Email inválido').min(1, 'Informe seu email'),
  birthDate: z.string().refine((v) => ISO_DATE.test(v), 'Data inválida'),
  cpf: z
    .string()
    .min(1, 'Informe seu CPF')
    .refine((v) => onlyDigits(v).length === 11, 'CPF deve ter 11 dígitos'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
  phoneCountryCode: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{1,3}$/.test(onlyDigits(v)), 'DDI deve ter de 1 a 3 dígitos'),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (v) => !v || (onlyDigits(v).length >= 8 && onlyDigits(v).length <= 15),
      'Telefone deve ter de 8 a 15 dígitos',
    ),
})

export const AccountSignupStep2Schema = z.object({
  postalCode: z
    .string()
    .min(1, 'Informe o CEP')
    .refine((v) => onlyDigits(v).length === 8, 'CEP deve ter 8 dígitos'),
  street: z.string().min(2, 'Informe a rua'),
  number: z.string().min(1, 'Informe o número'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Informe o bairro'),
  city: z.string().min(2, 'Informe a cidade'),
  stateProvince: z
    .string()
    .min(2, 'Informe a UF')
    .max(2, 'Use a sigla com 2 letras (ex: PR)')
    .transform((s) => s.toUpperCase()),
})

export const AccountSignupSchema = z.object({
  ...AccountSignupStep1Schema.shape,
  ...AccountSignupStep2Schema.shape,
})

export type AccountSignupInput = z.infer<typeof AccountSignupSchema>

/** Campos por passo do wizard, para validação incremental com `trigger`. */
export const ACCOUNT_SIGNUP_STEP_FIELDS = {
  1: ['fullName', 'email', 'birthDate', 'cpf', 'password', 'phoneCountryCode', 'phoneNumber'],
  2: ['postalCode', 'street', 'number', 'neighborhood', 'city', 'stateProvince'],
} as const satisfies Record<1 | 2, (keyof AccountSignupInput)[]>
