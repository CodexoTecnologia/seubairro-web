import { apiClient } from '../Client/apiClientInstance';
import { BaseService } from './BaseService';
import type { CreateBusinessRequest, UpdateBusinessRequest } from '../dtos/Request/index';

export interface BusinessResponse {
    id: string;
    ownerId: string;
    businessName: string | null;
    legalName: string | null;
    taxId: string | null;
    description: string | null;
    logoUrl: string | null;
    coverImageUrl: string | null;
    publicPhone: string | null;
    instagramUrl: string | null;
    isActive: boolean;
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
    async getByOwnerId(ownerId: string): Promise<BusinessResponse[]> {
        return apiClient.get<BusinessResponse[]>(`/api/Business/owner/${ownerId}`, {
            requiresAuth: true,
        });
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
}
export const BusinessService = new BusinessServiceImpl();

