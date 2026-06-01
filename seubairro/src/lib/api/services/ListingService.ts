import { apiClient } from '../Client/apiClientInstance';
import { BaseService } from './BaseService';
import type { CreateListingRequest, UpdateListingRequest } from '../dtos/Request/index';

function slugify(input: string): string {
    return input
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

export interface ListingImage {
    id: string;
    url: string;
    isCover: boolean;
}

export interface ListingResponse {
    id: string;
    listingCategoryId: string;
    title: string | null;
    slug: string | null;
    stockQuantity: number;
    description: string | null;
    price: number;
    currencyCode: string | null;
    imageUrl: string | null;
    isActive: boolean;
    // Quando o backend popular esses campos, o badge "Aberto agora" começa a aparecer
    // automaticamente nos cards. Enquanto não vier, ficam undefined e o badge se omite.
    businessId?: string | null;
    businessSlug?: string | null;
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

    async create(
        data: CreateListingRequest,
        images?: File[] | null,
        coverIndex?: number
    ): Promise<ListingResponse> {
        const formData = new FormData();
        formData.append('ListingCategoryId', data.listingCategoryId);
        formData.append('Title', data.title ?? '');
        formData.append('Slug', data.slug ?? slugify(data.title ?? ''));
        formData.append('StockQuantity', String(data.stockQuantity));
        formData.append('Description', data.description ?? '');
        formData.append('Price', String(data.price));
        formData.append('CurrencyCode', data.currencyCode ?? 'BRL');

        if (images && images.length > 0) {
            images.forEach(file => formData.append('images', file));
            if (typeof coverIndex === 'number') {
                formData.append('coverIndex', String(coverIndex));
            }
        }

        return apiClient.postForm<ListingResponse>('/api/Listing', formData, {
            requiresAuth: true,
        });
    }

    async addImages(
        listingId: string,
        images: File[],
        coverIndex?: number
    ): Promise<ListingImage[]> {
        const formData = new FormData();
        images.forEach(file => formData.append('images', file));
        if (typeof coverIndex === 'number') {
            formData.append('coverIndex', String(coverIndex));
        }
        return apiClient.postForm<ListingImage[]>(
            `/api/Listing/${listingId}/images`,
            formData,
            { requiresAuth: true }
        );
    }

    async getImages(listingId: string): Promise<ListingImage[]> {
        return apiClient.get<ListingImage[]>(`/api/Listing/${listingId}/images`, {
            requiresAuth: true,
        });
    }

    async setCoverImage(imageId: string): Promise<ListingImage> {
        return apiClient.patch<ListingImage>(
            `/api/Listing/images/${imageId}/set-cover`,
            undefined,
            { requiresAuth: true }
        );
    }

    async deleteImage(imageId: string): Promise<void> {
        return apiClient.delete<void>(`/api/Listing/images/${imageId}`, {
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
