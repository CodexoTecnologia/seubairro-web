import { z } from 'zod'

export const ClientSignupSchema = z.object({
  fullName: z.string().min(2, 'Informe seu nome completo'),
  email: z.string().min(1, 'Informe seu email').email('Email inválido'),
  birthDate: z.string().min(1, 'Informe sua data de nascimento'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export type ClientSignupInput = z.infer<typeof ClientSignupSchema>
