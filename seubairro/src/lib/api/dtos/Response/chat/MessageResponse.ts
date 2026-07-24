export interface MessageResponse {
    id: string;
    conversationId: string;
    senderUserId: string;
    content: string;
    createdAt: string; // ISO date-time
    readAt: string | null; // ISO date-time
}

/** Página de mensagens em ordem decrescente, paginada por cursor. */
export interface MessagesPageResponse {
    items: MessageResponse[];
    /** Passar em `before` para carregar mensagens mais antigas; null = fim. */
    nextCursor: string | null;
}
