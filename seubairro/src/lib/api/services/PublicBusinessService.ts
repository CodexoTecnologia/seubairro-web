import { apiClient } from '../Client/apiClientInstance';
import type { BusinessOperationStatusResponse } from '../dtos/Response/business/BusinessOperationStatusResponse';

export interface PublicBusinessAddress {
    street: string | null;
    number: string | null;
    complement: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    latitude: number | null;
    longitude: number | null;
}

export interface PublicBusinessOperatingHour {
    daysWeek: number;
    dayName: string;
    openTime: string | null;
    closeTime: string | null;
}

export interface PublicBusinessNiche {
    id: string;
    nicheId: string;
    nicheName: string;
    isPrincipal: boolean;
}

export interface PublicBusinessRating {
    average: number;
    count: number;
}

export interface PublicBusinessResponse {
    id: string;
    slug: string;
    businessName: string | null;
    description: string | null;
    logoUrl: string | null;
    coverImageUrl: string | null;
    publicPhone: string | null;
    instagramUrl: string | null;
    isActive: boolean;
    isClosed: boolean;
    closedReason?: string | null;
    closedUntil?: string | null;
    niches: PublicBusinessNiche[];
    address: PublicBusinessAddress | null;
    operatingHours: PublicBusinessOperatingHour[];
    rating: PublicBusinessRating | null;
}

export interface PublicListingResponse {
    id: string;
    title: string | null;
    description: string | null;
    price: number;
    currencyCode: string | null;
    imageUrl: string | null;
    slug: string | null;
    stockQuantity: number;
}

class PublicBusinessServiceImpl {
    async getBySlug(slug: string): Promise<PublicBusinessResponse> {
        return apiClient.get<PublicBusinessResponse>(`/api/public/business/${slug}`, {
            requiresAuth: false,
        });
    }

    async getListingsBySlug(slug: string): Promise<PublicListingResponse[]> {
        return apiClient.get<PublicListingResponse[]>(`/api/public/business/${slug}/listings`, {
            requiresAuth: false,
        });
    }

    async getStatusBySlug(slug: string): Promise<BusinessOperationStatusResponse> {
        return apiClient.get<BusinessOperationStatusResponse>(
            `/api/public/business/${slug}/status`,
            { requiresAuth: false }
        );
    }
}

export const PublicBusinessService = new PublicBusinessServiceImpl();

export function isBusinessOpenNow(
    operatingHours: PublicBusinessOperatingHour[],
    isClosed: boolean
): boolean {
    if (isClosed) return false;
    if (!operatingHours || operatingHours.length === 0) return false;

    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todayHours = operatingHours.find(h => h.daysWeek === dayOfWeek);
    if (!todayHours || !todayHours.openTime || !todayHours.closeTime) {
        return false;
    }

    const [openH, openM] = todayHours.openTime.split(':').map(Number);
    const [closeH, closeM] = todayHours.closeTime.split(':').map(Number);

    return currentMinutes >= openH * 60 + openM && currentMinutes < closeH * 60 + closeM;
}
