import { apiClient } from '../Client/apiClientInstance';
import type { OrderResponse } from '../dtos/Response/index';

class OrderServiceImpl {
    async getByBusiness(businessId: string): Promise<OrderResponse[]> {
        return apiClient.get<OrderResponse[]>(`/api/Order/business/${businessId}`, {
            requiresAuth: true,
        });
    }

    async getById(id: number): Promise<OrderResponse> {
        return apiClient.get<OrderResponse>(`/api/Order/${id}`, { requiresAuth: true });
    }

    async cancel(id: number): Promise<void> {
        return apiClient.delete<void>(`/api/Order/${id}`, { requiresAuth: true });
    }
}

export const OrderService = new OrderServiceImpl();
