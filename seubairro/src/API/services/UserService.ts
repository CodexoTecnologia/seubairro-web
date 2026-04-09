import { apiClient } from '../Client/apiClientInstance';
import type {
    CreateUserRequest,
    CreateCustomerRequest,
    CreateEntrepeneurRequest
} from '../dtos/Request/index/index';
import { CountryCodeEnum } from '../enums/index/index';

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

    async registerCustomer(
        data: CreateCustomerRequest,
        countryCode: CountryCodeEnum = CountryCodeEnum.Brasil
    ): Promise<UserResponse> {
        return apiClient.post<UserResponse, CreateCustomerRequest>(
            '/api/User/customer',
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
            '/api/User/entrepeneur',
            data,
            {
                params: { countryCode },
                requiresAuth: false,
            }
        );
    }

}

export const UserService = new UserServiceImpl();
