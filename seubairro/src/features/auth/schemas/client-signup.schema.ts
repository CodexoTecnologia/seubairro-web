import {
  AccountSignupSchema,
  type AccountSignupInput,
  ACCOUNT_SIGNUP_STEP_FIELDS,
} from './account-signup.schema'

/**
 * Cadastro do cliente (Opção B): dados pessoais, telefone (opcional) e endereço
 * pessoal obrigatório — mesmo payload do empreendedor.
 */
export const ClientSignupSchema = AccountSignupSchema
export type ClientSignupInput = AccountSignupInput
export const CLIENT_SIGNUP_STEP_FIELDS = ACCOUNT_SIGNUP_STEP_FIELDS
