export interface CreateUserRequest {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
    birthDate: string;
    taxId: string | null;
}
