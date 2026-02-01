import { CountryCodeEnum } from '../../enums/index';

export interface CreateBusinessAddressRequest {
    businessId: string;
    street: string | null;
    number: string | null;
    neighborhood: string | null;
    city: string | null;
    stateProvince: string | null;
    postalCode: string | null;
    countryCode: CountryCodeEnum;
}
