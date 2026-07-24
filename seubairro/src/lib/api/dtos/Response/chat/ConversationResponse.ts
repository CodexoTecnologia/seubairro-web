/**
 * Conversa entre um cliente e um negócio. A identidade é o par
 * (customerUserId, businessId); a visão exibida deriva do papel do usuário
 * autenticado dentro da conversa.
 */
export interface ConversationResponse {
    id: string;
    businessId: string;
    businessName: string;
    businessLogoUrl: string | null;
    customerUserId: string;
    customerName: string;
    customerAvatarUrl: string | null;
    lastMessagePreview: string | null;
    lastMessageAt: string | null; // ISO date-time
    /** Não lidas para o usuário autenticado. */
    unreadCount: number;
}
