/** Avaliação que o negócio faz do comprador após o pedido concluído. */
export interface BuyerReviewResponse {
    id: number;
    orderId: number;
    businessId: string;
    targetUserId: string;
    /** Response é double (contrato); o request aceita apenas inteiro de 1 a 5. */
    rating: number;
    comment: string;
    createdAt: string; // ISO date-time
}
