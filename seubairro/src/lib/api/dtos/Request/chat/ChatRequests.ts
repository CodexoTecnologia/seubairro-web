/** Abre a conversa com o negócio; idempotente por par (cliente, negócio). */
export interface CreateConversationRequest {
    businessId: string;
    /** Contexto opcional de origem da conversa. */
    orderId?: number | null;
    listingId?: string | null;
}

export interface SendMessageRequest {
    content: string;
}
