export interface AddressResponse {
    id: string;
    userId: string;
    active: boolean;
    street?: string | null;
    number?: string | null;
    neighborhood?: string | null;
    city?: string | null;
    stateProvince?: string | null;
    postalCode?: string | null;
    countryCode?: number;
}

