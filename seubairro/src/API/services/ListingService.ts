import { apiClient } from '../Client/apiClientInstance';
import { BaseService } from './BaseService';
import type { CreateListingRequest, UpdateListingRequest } from '../dtos/Request/index';
export interface ListingResponse {
    id: string;
    listingCategoryId: string;
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
            usePathId: true,
        });
    }

    async create(data: CreateListingRequest): Promise<ListingResponse> {
        const formData = new FormData();
        formData.append('ListingCategoryId', data.listingCategoryId);
        formData.append('Title', data.title ?? '');
        formData.append('Slug', data.slug ?? '');
        formData.append('StockQuantity', String(data.stockQuantity));
        formData.append('Description', data.description ?? '');
        formData.append('Price', String(data.price));
        formData.append('CurrencyCode', data.currencyCode ?? 'BRL');
        return apiClient.postForm<ListingResponse>('/api/Listing', formData, {
            requiresAuth: true,
        });
    }

    async getByBusiness(businessId: string): Promise<ListingResponse[]> {
        return apiClient.get<ListingResponse[]>(`/api/Listing/business/${businessId}`, {
            requiresAuth: true,
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

    async getNearby(maxDistanceKm: number = 50): Promise<ListingResponse[]> {
        return apiClient.get<ListingResponse[]>('/api/Listing/nearby', {
            params: { maxDistanceKm },
            requiresAuth: true,
        });
    }
}
export const ListingService = new ListingServiceImpl();
