export interface ProfileResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    birthDate: string; // ISO date
    taxId: string;
    phoneCountryCode: string | null;
    phoneNumber: string | null;
    profilePictureUrl: string | null;
}
