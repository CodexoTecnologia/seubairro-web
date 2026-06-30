import { apiClient } from '../Client/apiClientInstance';
import type { ListingReviewResponse, PagedResult } from '../dtos/Response/index';

class ListingReviewServiceImpl {
    async getByListing(listingId: string): Promise<PagedResult<ListingReviewResponse>> {
        return apiClient.get<PagedResult<ListingReviewResponse>>(
            `/api/ListingReview/listing/${listingId}`,
            { params: { PageSize: 100 }, requiresAuth: true }
        );
    }
}

export const ListingReviewService = new ListingReviewServiceImpl();
