import { CreateAddressRequest } from '../client/CreateAddressRequest';

/**
 * Cadastro do empreendedor (Opção B): cria **apenas o usuário**, com endereço
 * pessoal e telefone. O negócio e o endereço da empresa são criados depois, na
 * etapa autenticada (`POST /api/business`). Estruturalmente igual ao cadastro
 * do cliente.
 *
 * `POST /api/auth/entrepeneur?countryCode=1` (anônimo).
 */
export interface CreateEntrepeneurRequest {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
    birthDate: string;
    taxId: string | null;
    phoneCountryCode?: string | null;
    phoneNumber?: string | null;
    /** Endereço pessoal do responsável — obrigatório (sem ele: `AddressRequired`). */
    address: CreateAddressRequest;
}
