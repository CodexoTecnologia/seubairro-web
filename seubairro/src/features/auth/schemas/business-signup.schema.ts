import {
  AccountSignupSchema,
  type AccountSignupInput,
  ACCOUNT_SIGNUP_STEP_FIELDS,
} from './account-signup.schema'

/**
 * Cadastro do empreendedor (Opção B): cria apenas o usuário, com endereço
 * pessoal e telefone — mesmo payload do cliente. O negócio é criado depois, na
 * etapa autenticada.
 */
export const BusinessSignupSchema = AccountSignupSchema
export type BusinessSignupInput = AccountSignupInput
export const BUSINESS_SIGNUP_STEP_FIELDS = ACCOUNT_SIGNUP_STEP_FIELDS
