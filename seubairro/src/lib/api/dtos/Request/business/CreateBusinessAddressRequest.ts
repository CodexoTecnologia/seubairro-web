import { CountryCodeEnum } from '../../../enums/index/index';
export interface CreateBusinessAddressRequest {
    street: string | null;
    number: string | null;
    neighborhood: string | null;
    city: string | null;
    stateProvince: string | null;
    postalCode: string | null;
    countryCode: CountryCodeEnum;
}
