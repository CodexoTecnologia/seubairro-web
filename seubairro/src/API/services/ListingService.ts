import { apiClient } from './Client/apiClientInstance';
import { BaseService } from './BaseService';
import type { CreateListingRequest, UpdateListingRequest } from '../dtos/Request/index';
export interface ListingResponse {
    id: string;
    categoryId: string;
    title: string | null;
    slug: string | null;
    stockQuantity: number;
    description: string | null;
    price: number;
    currencyCode: string | null;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}
class ListingServiceImpl extends BaseService<
    ListingResponse,
    CreateListingRequest,
    UpdateListingRequest
> {
    constructor() {
        super({
            basePath: '/api/Listing',
            requiresAuth: true,
            idParamName: 'id',
            usePathId: false,
        });
    }
    async activate(id: string): Promise<ListingResponse> {
        return apiClient.patch<ListingResponse>('/api/Listing/active', undefined, {
            params: { id },
            requiresAuth: true,
        });
    }
    async deactivate(id: string): Promise<ListingResponse> {
        return apiClient.patch<ListingResponse>('/api/Listing/deactive', undefined, {
            params: { id },
            requiresAuth: true,
        });
    }
}
export const ListingService = new ListingServiceImpl();

