import { apiClient } from '../Client/apiClientInstance';
import { OrderStatusEnum } from '../enums/OrderStatusEnum';
import type { ChangeOrderStatusRequest } from '../dtos/Request/order/ChangeOrderStatusRequest';
import type { CreateOrderRequest } from '../dtos/Request/order/CreateOrderRequest';
import type { OrderResponse, PagedResult } from '../dtos/Response/index';

export interface OrderListParams {
    status?: OrderStatusEnum;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDesc?: boolean;
}

const toQuery = (params: OrderListParams = {}) => ({
    Status: params.status,
    Page: params.page,
    PageSize: params.pageSize,
    SortBy: params.sortBy,
    SortDesc: params.sortDesc,
});

class OrderServiceImpl {
    /** Cria o pedido a partir da sacola. O vendedor e os preços vêm do servidor. */
    async create(payload: CreateOrderRequest): Promise<OrderResponse> {
        return apiClient.post<OrderResponse, CreateOrderRequest>('/api/Order', payload, {
            requiresAuth: true,
        });
    }

    /** Pedidos do cliente autenticado. */
    async getMine(params?: OrderListParams): Promise<PagedResult<OrderResponse>> {
        return apiClient.get<PagedResult<OrderResponse>>('/api/Order', {
            params: toQuery(params),
            requiresAuth: true,
        });
    }

    async getByBusiness(
        businessId: string,
        params?: OrderListParams
    ): Promise<PagedResult<OrderResponse>> {
        return apiClient.get<PagedResult<OrderResponse>>(`/api/Order/business/${businessId}`, {
            params: toQuery(params),
            requiresAuth: true,
        });
    }

    async getById(id: number): Promise<OrderResponse> {
        return apiClient.get<OrderResponse>(`/api/Order/${id}`, { requiresAuth: true });
    }

    /**
     * Transição de status validada no servidor (409 em transição inválida,
     * 403 quando o papel não pode conduzi-la).
     */
    async updateStatus(
        id: number,
        status: OrderStatusEnum,
        reason?: string
    ): Promise<OrderResponse> {
        return apiClient.patch<OrderResponse, ChangeOrderStatusRequest>(
            `/api/Order/${id}/status`,
            { status, reason: reason ?? null },
            { requiresAuth: true }
        );
    }

    /** Cancelamento é uma transição de status — não use DELETE (semântica em aberto). */
    async cancel(id: number, reason?: string): Promise<OrderResponse> {
        return this.updateStatus(id, OrderStatusEnum.Cancelled, reason);
    }
}

export const OrderService = new OrderServiceImpl();
