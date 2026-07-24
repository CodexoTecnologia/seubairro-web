import { apiClient } from '../Client/apiClientInstance';
import type { AnswerListingQuestionRequest } from '../dtos/Request/index';
import type { ListingQuestionResponse, PagedResult } from '../dtos/Response/index';

class ListingQuestionServiceImpl {
    async getByListing(listingId: string): Promise<PagedResult<ListingQuestionResponse>> {
        return apiClient.get<PagedResult<ListingQuestionResponse>>(
            `/api/ListingQuestion/listing/${listingId}`,
            { params: { PageSize: 100 }, requiresAuth: true }
        );
    }

    async answer(
        id: string,
        payload: AnswerListingQuestionRequest
    ): Promise<ListingQuestionResponse> {
        return apiClient.post<ListingQuestionResponse, AnswerListingQuestionRequest>(
            `/api/ListingQuestion/${id}/answer`,
            payload,
            { requiresAuth: true }
        );
    }
}

export const ListingQuestionService = new ListingQuestionServiceImpl();
