import { apiClient } from '../Client/apiClientInstance';
import { BaseService } from './BaseService';
import type { CreateListingRequest, UpdateListingRequest } from '../dtos/Request/index';
import type { PagedResult } from '../dtos/Response/index';

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
    url?: string;
    imageUrl?: string;
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
    /** Contrato v1: a capa vem em `coverImageUrl` — não existe `imageUrl` aqui. */
    coverImageUrl: string | null;
    images?: ListingImage[];
    isActive: boolean;
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
        // v3: criação é JSON (CreateListingRequest); imagens vão em endpoint separado.
        const body: CreateListingRequest = {
            ...data,
            slug: data.slug?.trim() || slugify(data.title ?? ''),
            currencyCode: data.currencyCode?.trim() || 'BRL',
        };
        const created = await apiClient.post<ListingResponse, CreateListingRequest>(
            '/api/Listing',
            body,
            { requiresAuth: true }
        );

        if (images && images.length > 0) {
            await this.addImages(created.id, images, coverIndex);
        }

        return created;
    }

    /**
     * O contrato do PUT é idêntico ao do POST — inclui `slug` e `currencyCode`.
     * O `update` herdado do BaseService enviaria o payload cru e o servidor
     * responde 400. Aqui a normalização espelha a do `create`.
     *
     * `slug` é preservado quando o chamador informa o atual: renomear o anúncio
     * não deve trocar a URL pública. Sem ele, deriva do título.
     */
    async update(id: string, data: UpdateListingRequest): Promise<ListingResponse> {
        // `||` e não `??`: o servidor trata string vazia como campo ausente
        // ("The Slug field is required"), então '' precisa cair no fallback.
        const body: UpdateListingRequest = {
            ...data,
            slug: data.slug?.trim() || slugify(data.title ?? ''),
            currencyCode: data.currencyCode?.trim() || 'BRL',
        };
        return super.update(id, body);
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
        // v3: endpoint paginado (PagedResultOfListingResponse). Retornamos os items
        // da primeira página com pageSize amplo — paginação real fica para depois.
        const result = await apiClient.get<PagedResult<ListingResponse>>(
            `/api/Listing/business/${businessId}`,
            { params: { PageSize: 100 }, requiresAuth: true }
        );
        return result.items;
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
