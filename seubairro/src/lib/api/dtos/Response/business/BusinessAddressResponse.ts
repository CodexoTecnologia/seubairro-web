import { CountryCodeEnum } from '../../../enums/index/index';

export interface BusinessAddressResponse {
    id: string;
    businessId: string;
    street: string | null;
    number: string | null;
    complement: string | null;
    neighborhood: string | null;
    city: string | null;
    stateProvince: string | null;
    postalCode: string | null;
    countryCode: CountryCodeEnum;
    latitude: number | null;
    longitude: number | null;
}
