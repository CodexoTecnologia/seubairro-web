export interface CreateOrderItemRequest {
    listingId: string;
    quantity: number;
}

/**
 * O negócio vendedor é inferido pelo servidor a partir dos itens (pedido é
 * mono-negócio) e `unitPrice` é snapshotado do anúncio — nunca enviado pelo front.
 */
export interface CreateOrderRequest {
    shippingAddressSnapshot: string;
    items: CreateOrderItemRequest[];
}
