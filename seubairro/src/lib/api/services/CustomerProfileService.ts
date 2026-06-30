import { apiClient } from '../Client/apiClientInstance';
import type {
    CreateCustomerProfileRequest,
    UpdateCustomerProfileRequest,
    UpdateAddressRequest,
} from '../dtos/Request/index/index';
import type {
    CustomerProfileResponse,
    ProfileResponse,
    PrimaryAddressInfo,
} from '../dtos/Response/index/index';

class CustomerProfileServiceImpl {
    async getMe(): Promise<CustomerProfileResponse> {
        return apiClient.get<CustomerProfileResponse>('/api/User/profile', {
            requiresAuth: true,
        });
    }

    async createMe(payload: CreateCustomerProfileRequest): Promise<CustomerProfileResponse> {
        return apiClient.post<CustomerProfileResponse, CreateCustomerProfileRequest>(
            '/api/User/profile',
            payload,
            { requiresAuth: true }
        );
    }

    async updateMe(payload: UpdateCustomerProfileRequest): Promise<CustomerProfileResponse> {
        return apiClient.patch<CustomerProfileResponse, UpdateCustomerProfileRequest>(
            '/api/User/profile',
            payload,
            { requiresAuth: true }
        );
    }

    async deleteMe(): Promise<void> {
        return apiClient.delete<void>('/api/User/profile', { requiresAuth: true });
    }

    async updateAddress(payload: UpdateAddressRequest): Promise<PrimaryAddressInfo> {
        return apiClient.put<PrimaryAddressInfo, UpdateAddressRequest>(
            '/api/User/address',
            payload,
            { requiresAuth: true }
        );
    }

    async uploadAvatar(file: File): Promise<ProfileResponse> {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.putForm<ProfileResponse>('/api/User/avatar', formData, {
            requiresAuth: true,
        });
    }

    async deleteAvatar(): Promise<void> {
        return apiClient.delete<void>('/api/User/avatar', { requiresAuth: true });
    }
}

export const CustomerProfileService = new CustomerProfileServiceImpl();
