import { apiClient } from '../Client/apiClientInstance';
import { ApiClientError } from '../Client/ApiClientError';
import { BaseService } from './BaseService';
import type { CreateBusinessRequest, UpdateBusinessRequest } from '../dtos/Request/index';
import type { UpdateClosedStatusRequest } from '../dtos/Request/business/UpdateClosedStatusRequest';

export interface BusinessResponse {
    id: string;
    ownerId: string;
    slug: string | null;
    businessName: string | null;
    legalName: string | null;
    taxId: string | null;
    description: string | null;
    logoUrl: string | null;
    coverImageUrl: string | null;
    publicPhone: string | null;
    instagramUrl: string | null;
    isActive: boolean;
    isClosed: boolean;
    closedReason?: string | null;
    closedUntil?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

class BusinessServiceImpl extends BaseService<
    BusinessResponse,
    CreateBusinessRequest,
    UpdateBusinessRequest
> {
    constructor() {
        super({
            basePath: '/api/Business',
            requiresAuth: true,
            usePathId: true,
        });
    }

    async getByOwnerId(ownerId: string): Promise<BusinessResponse | null> {
        try {
            return await apiClient.get<BusinessResponse>(`/api/Business/owner/${ownerId}`, {
                requiresAuth: true,
            });
        } catch (err) {
            if (err instanceof ApiClientError && err.statusCode === 404) return null;
            throw err;
        }
    }

    async getActive(): Promise<BusinessResponse[]> {
        return apiClient.get<BusinessResponse[]>('/api/Business/active', {
            requiresAuth: true,
        });
    }

    async activate(id: string): Promise<BusinessResponse> {
        return apiClient.put<BusinessResponse>(`/api/Business/${id}/activate`, undefined, {
            requiresAuth: true,
        });
    }

    async uploadLogo(id: string, file: File): Promise<BusinessResponse> {
        const formData = new FormData();
        formData.append('logo', file);
        return apiClient.putForm<BusinessResponse>(
            `/api/Business/${id}/logo`,
            formData,
            { requiresAuth: true }
        );
    }

    async uploadCover(id: string, file: File): Promise<BusinessResponse> {
        const formData = new FormData();
        formData.append('cover', file);
        return apiClient.putForm<BusinessResponse>(
            `/api/Business/${id}/cover`,
            formData,
            { requiresAuth: true }
        );
    }

    async updateClosedStatus(
        id: string,
        data: UpdateClosedStatusRequest
    ): Promise<BusinessResponse> {
        return apiClient.patch<BusinessResponse, UpdateClosedStatusRequest>(
            `/api/Business/${id}/closed-status`,
            data,
            { requiresAuth: true }
        );
    }
}

export const BusinessService = new BusinessServiceImpl();
