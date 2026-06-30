import { apiClient } from '../Client/apiClientInstance';
import type { ListingSearchRequest } from '../dtos/Request/index/index';
import type {
    PublicListingNearbyResponse,
    PublicListingDetailResponse,
    PagedResult,
} from '../dtos/Response/index/index';

function buildListingSearchQuery(filters: ListingSearchRequest): string {
    const params = new URLSearchParams();
    const append = (key: string, value: string | number | boolean | undefined) => {
        if (value !== undefined && value !== null) {
            params.append(key, String(value));
        }
    };
    append('Latitude', filters.latitude);
    append('Longitude', filters.longitude);
    append('ListingCategoryId', filters.listingCategoryId);
    append('MaxDistanceKm', filters.maxDistanceKm);
    append('OpenNow', filters.openNow);
    append('Query', filters.query);
    append('Page', filters.page);
    append('PageSize', filters.pageSize);
    // NicheIds vai como chave repetida (?NicheIds=a&NicheIds=b) — binding default do ASP.NET.
    filters.nicheIds?.forEach(id => params.append('NicheIds', id));
    const qs = params.toString();
    return qs ? `?${qs}` : '';
}

class DiscoveryServiceImpl {
    // Endpoints anônimos; enviamos o token mesmo assim porque o módulo cliente
    // está sempre autenticado (AuthGuard) e o back aceita para personalização.
    async searchListings(
        filters: ListingSearchRequest
    ): Promise<PagedResult<PublicListingNearbyResponse>> {
        return apiClient.get<PagedResult<PublicListingNearbyResponse>>(
            `/api/Discovery/listings${buildListingSearchQuery(filters)}`,
            { requiresAuth: true }
        );
    }

    async getListingDetail(id: string): Promise<PublicListingDetailResponse> {
        return apiClient.get<PublicListingDetailResponse>(
            `/api/Discovery/listings/${id}`,
            { requiresAuth: true }
        );
    }
}

export const DiscoveryService = new DiscoveryServiceImpl();
