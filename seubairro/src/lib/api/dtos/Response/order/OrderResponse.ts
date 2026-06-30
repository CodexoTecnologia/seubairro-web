import type { OrderItemResponse } from './OrderItemResponse';

export interface OrderResponse {
    id: number; // identificador inteiro do pedido
    customerId: string;
    sellerBusinessId: string;
    status: string;
    currencyCode: string;
    totalValue: number;
    shippingAddressSnapshot: string;
    createdAt: string; // ISO date-time
    items: OrderItemResponse[];
}
