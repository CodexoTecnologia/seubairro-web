import type { OrderStatusEnum } from '../../../enums/OrderStatusEnum';
import type { OrderItemResponse } from './OrderItemResponse';

export interface OrderResponse {
    id: number; // identificador inteiro do pedido
    customerId: string;
    sellerBusinessId: string;
    status: OrderStatusEnum;
    currencyCode: string;
    totalValue: number;
    shippingAddressSnapshot: string;
    cancelReason: string | null;
    createdAt: string; // ISO date-time
    updatedAt: string; // ISO date-time
    // Snapshots do vendedor — preenchidos na criação, sobrevivem a rename/exclusão.
    sellerBusinessName: string;
    sellerBusinessSlug: string;
    sellerBusinessLogoUrl: string | null;
    // Snapshots do comprador — visíveis para o negócio atender o pedido.
    customerName: string | null;
    customerPhone: string | null;
    buyerAverageRating: number | null;
    items: OrderItemResponse[];
}
