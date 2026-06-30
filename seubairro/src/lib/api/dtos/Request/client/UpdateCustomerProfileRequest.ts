export interface UpdateCustomerProfileRequest {
    firstName?: string | null;
    lastName?: string | null;
    birthDate?: string | null; // ISO date (yyyy-MM-dd)
    taxId?: string | null;
    phoneCountryCode?: string | null; // só dígitos, ex.: "55"
    phoneNumber?: string | null; // só dígitos, sem máscara
    primaryAddressId?: string | null; // Guid
}
