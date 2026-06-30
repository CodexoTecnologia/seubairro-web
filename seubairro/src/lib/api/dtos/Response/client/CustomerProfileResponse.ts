import type { PrimaryAddressInfo } from './PrimaryAddressInfo';

export interface CustomerProfileResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    birthDate: string; // ISO date
    taxId: string;
    profilePictureUrl: string | null;
    phoneCountryCode: string | null;
    phoneNumber: string | null;
    primaryAddress: PrimaryAddressInfo | null;
}
