import { CountryCodeEnum } from '../../../enums/index/index';

export interface PrimaryAddressInfo {
    id: string;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    countryCode: CountryCodeEnum;
    latitude: number | null;
    longitude: number | null;
}
