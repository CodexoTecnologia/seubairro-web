import { CreateAddressRequest } from './CreateAddressRequest';

export interface CreateCustomerRequest {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
    birthDate: string;
    taxId: string | null;
    phoneCountryCode?: string | null;
    phoneNumber?: string | null;
    /** Endereço pessoal — obrigatório (sem ele: `AddressRequired`). */
    address: CreateAddressRequest;
}
