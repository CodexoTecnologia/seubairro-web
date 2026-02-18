import { apiClient } from '../Client/apiClientInstance';
import type { CreateUserRequest, UserLoginRequest } from '../dtos/Request/index';
import { CountryCodeEnum } from '../enums/index';

export interface UserResponse {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    birthDate: string;
    taxId: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginResponse {
    expiration: string;
    token?: string;
}

class UserServiceImpl {
    async getCurrentUser(): Promise<UserResponse> {
        return apiClient.get<UserResponse>('/api/User', {
            requiresAuth: true,
        });
    }

    async register(
        data: CreateUserRequest,
        countryCode: CountryCodeEnum = CountryCodeEnum.Brasil
    ): Promise<UserResponse> {
        return apiClient.post<UserResponse, CreateUserRequest>(
            '/api/User',
            data,
            {
                params: { countryCode },
                requiresAuth: false,
            }
        );
    }
}

export const UserService = new UserServiceImpl();