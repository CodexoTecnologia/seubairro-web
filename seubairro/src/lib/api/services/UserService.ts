import { apiClient } from '../Client/apiClientInstance';
import type {
    CreateCustomerRequest,
    CreateEntrepeneurRequest
} from '../dtos/Request/index/index';
import type { CustomerProfileResponse } from '../dtos/Response/index/index';
import { CountryCodeEnum } from '../enums/index/index';

export interface UserResponse {
    id: string;
    name: string | null;
    email: string | null;
    birthDate?: string;
    taxId?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginResponse {
    expiration: string;
    token?: string;
}

class UserServiceImpl {
    async getCurrentUser(): Promise<UserResponse> {

        const profile = await apiClient.get<CustomerProfileResponse>('/api/User/profile', {
            requiresAuth: true,
        });
        return {
            id: profile.id,
            name: [profile.firstName, profile.lastName].filter(Boolean).join(' ') || null,
            email: profile.email,
            birthDate: profile.birthDate,
            taxId: profile.taxId,
        };
    }

    async registerCustomer(
        data: CreateCustomerRequest,
        countryCode: CountryCodeEnum = CountryCodeEnum.Brasil
    ): Promise<UserResponse> {
        return apiClient.post<UserResponse, CreateCustomerRequest>(
            '/api/Auth/customer',
            data,
            {
                params: { countryCode },
                requiresAuth: false,
            }
        );
    }

    async registerEntrepeneur(
        data: CreateEntrepeneurRequest,
        countryCode: CountryCodeEnum = CountryCodeEnum.Brasil
    ): Promise<UserResponse> {
        return apiClient.post<UserResponse, CreateEntrepeneurRequest>(
            '/api/Auth/entrepeneur',
            data,
            {
                params: { countryCode },
                requiresAuth: false,
            }
        );
    }

}

export const UserService = new UserServiceImpl();
