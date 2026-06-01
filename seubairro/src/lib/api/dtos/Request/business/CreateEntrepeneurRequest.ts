import { CreateBusinessRequest } from './CreateBusinessRequest';
import { CreateBusinessAddressRequest } from './CreateBusinessAddressRequest';

export interface CreateEntrepeneurRequest {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
    birthDate: string;
    taxId: string | null;
    business?: CreateBusinessRequest;
    businessAddress?: CreateBusinessAddressRequest;
}
