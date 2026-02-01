import { CountryCodeEnum } from '../../enums/index';

export interface UpdateBusinessAddressRequest {
    street: string | null;
    number: string | null;
    neighborhood: string | null;
    city: string | null;
    stateProvince: string | null;
    postalCode: string | null;
    countryCode: CountryCodeEnum;
}
