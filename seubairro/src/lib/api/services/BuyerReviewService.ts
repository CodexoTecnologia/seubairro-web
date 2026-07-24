import { apiClient } from '../Client/apiClientInstance';
import type {
    CreateBuyerReviewRequest,
    UpdateBuyerReviewRequest,
} from '../dtos/Request/review/BuyerReviewRequests';
import type { BuyerReviewResponse, PagedResult } from '../dtos/Response/index';

export interface BuyerReviewListParams {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDesc?: boolean;
}

const toQuery = (params: BuyerReviewListParams = {}) => ({
    Page: params.page,
    PageSize: params.pageSize,
    SortBy: params.sortBy,
    SortDesc: params.sortDesc,
});

class BuyerReviewServiceImpl {
    /** Avaliação do comprador em um pedido concluído (uma por pedido — 409 na segunda). */
    async create(payload: CreateBuyerReviewRequest): Promise<BuyerReviewResponse> {
        return apiClient.post<BuyerReviewResponse, CreateBuyerReviewRequest>(
            '/api/BuyerReview',
            payload,
            { requiresAuth: true }
        );
    }

    /** Avaliações recebidas pelo comprador. */
    async getByUser(
        userId: string,
        params?: BuyerReviewListParams
    ): Promise<PagedResult<BuyerReviewResponse>> {
        return apiClient.get<PagedResult<BuyerReviewResponse>>(`/api/BuyerReview/${userId}`, {
            params: toQuery(params),
            requiresAuth: true,
        });
    }

    /**
     * Variante `/all` do contrato. A diferença para `getByUser` não está
     * documentada no OpenAPI — confirmar com o backend antes de usar.
     */
    async getAllByUser(
        userId: string,
        params?: BuyerReviewListParams
    ): Promise<PagedResult<BuyerReviewResponse>> {
        return apiClient.get<PagedResult<BuyerReviewResponse>>(`/api/BuyerReview/all/${userId}`, {
            params: toQuery(params),
            requiresAuth: true,
        });
    }

    async update(id: number, payload: UpdateBuyerReviewRequest): Promise<BuyerReviewResponse> {
        return apiClient.put<BuyerReviewResponse, UpdateBuyerReviewRequest>(
            `/api/BuyerReview/${id}`,
            payload,
            { requiresAuth: true }
        );
    }

    async remove(id: number): Promise<void> {
        return apiClient.delete<void>(`/api/BuyerReview/${id}`, { requiresAuth: true });
    }
}

export const BuyerReviewService = new BuyerReviewServiceImpl();
