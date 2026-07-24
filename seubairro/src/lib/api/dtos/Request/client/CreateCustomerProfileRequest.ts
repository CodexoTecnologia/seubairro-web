export interface CreateCustomerProfileRequest {
    firstName: string;
    lastName: string;
    birthDate: string; // ISO date (yyyy-MM-dd)
    taxId: string;
    phoneCountryCode?: string | null;
    phoneNumber?: string | null;
    primaryAddressId?: string | null; // Guid
}
