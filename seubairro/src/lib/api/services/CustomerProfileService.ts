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
    private getMePromise: Promise<CustomerProfileResponse> | null = null;
    private cacheTimeout: any = null;

    clearCache(): void {
        this.getMePromise = null;
        if (this.cacheTimeout) {
            clearTimeout(this.cacheTimeout);
            this.cacheTimeout = null;
        }
    }

    async getMe(): Promise<CustomerProfileResponse> {
        if (this.getMePromise) {
            return this.getMePromise;
        }

        this.getMePromise = (async () => {
            try {
                return await apiClient.get<CustomerProfileResponse>('/api/User/profile', {
                    requiresAuth: true,
                });
            } catch (err) {
                this.clearCache();
                throw err;
            }
        })();

        if (this.cacheTimeout) clearTimeout(this.cacheTimeout);
        this.cacheTimeout = setTimeout(() => {
            this.getMePromise = null;
        }, 2000);

        return this.getMePromise;
    }

    async createMe(payload: CreateCustomerProfileRequest): Promise<CustomerProfileResponse> {
        this.clearCache();
        return apiClient.post<CustomerProfileResponse, CreateCustomerProfileRequest>(
            '/api/User/profile',
            payload,
            { requiresAuth: true }
        );
    }

    async updateMe(payload: UpdateCustomerProfileRequest): Promise<CustomerProfileResponse> {
        this.clearCache();
        return apiClient.patch<CustomerProfileResponse, UpdateCustomerProfileRequest>(
            '/api/User/profile',
            payload,
            { requiresAuth: true }
        );
    }

    async deleteMe(): Promise<void> {
        this.clearCache();
        return apiClient.delete<void>('/api/User/profile', { requiresAuth: true });
    }

    async updateAddress(payload: UpdateAddressRequest): Promise<PrimaryAddressInfo> {
        this.clearCache();
        return apiClient.put<PrimaryAddressInfo, UpdateAddressRequest>(
            '/api/User/address',
            payload,
            { requiresAuth: true }
        );
    }

    async uploadAvatar(file: File): Promise<ProfileResponse> {
        this.clearCache();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('avatar', file);
        formData.append('image', file);

        let res: any;
        try {
            res = await apiClient.postForm<any>('/api/User/avatar', formData, {
                requiresAuth: true,
            });
        } catch {
            res = await apiClient.putForm<any>('/api/User/avatar', formData, {
                requiresAuth: true,
            });
        }

        const url = res?.profilePictureUrl ?? res?.avatarUrl ?? res?.imageUrl ?? res?.url ?? null;
        return {
            id: res?.id ?? '',
            firstName: res?.firstName ?? '',
            lastName: res?.lastName ?? '',
            email: res?.email ?? '',
            profilePictureUrl: url,
        } as ProfileResponse;
    }

    async deleteAvatar(): Promise<void> {
        this.clearCache();
        return apiClient.delete<void>('/api/User/avatar', { requiresAuth: true });
    }
}

export const CustomerProfileService = new CustomerProfileServiceImpl();
