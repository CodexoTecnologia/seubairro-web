import { apiClient } from '../Client/apiClientInstance';
import type {
    CreateConversationRequest,
    SendMessageRequest,
} from '../dtos/Request/chat/ChatRequests';
import type {
    ConversationResponse,
    MessageResponse,
    MessagesPageResponse,
    PagedResult,
} from '../dtos/Response/index';

export interface ConversationListParams {
    page?: number;
    pageSize?: number;
}

export interface MessageListParams {
    /** Cursor da página anterior (`nextCursor`) para carregar mensagens mais antigas. */
    before?: string;
    pageSize?: number;
}

class ChatServiceImpl {
    /** Conversas do usuário autenticado, ordenadas por última mensagem. */
    async getConversations(
        params?: ConversationListParams
    ): Promise<PagedResult<ConversationResponse>> {
        return apiClient.get<PagedResult<ConversationResponse>>('/api/Chat/conversations', {
            params: { Page: params?.page, PageSize: params?.pageSize },
            requiresAuth: true,
        });
    }

    /** Abre a conversa ou devolve a existente (idempotente por par cliente/negócio). */
    async startConversation(payload: CreateConversationRequest): Promise<ConversationResponse> {
        return apiClient.post<ConversationResponse, CreateConversationRequest>(
            '/api/Chat/conversations',
            payload,
            { requiresAuth: true }
        );
    }

    async getMessages(
        conversationId: string,
        params?: MessageListParams
    ): Promise<MessagesPageResponse> {
        return apiClient.get<MessagesPageResponse>(
            `/api/Chat/conversations/${conversationId}/messages`,
            {
                params: { before: params?.before, pageSize: params?.pageSize },
                requiresAuth: true,
            }
        );
    }

    /** 429 quando o rate limit de envio é atingido. */
    async sendMessage(conversationId: string, content: string): Promise<MessageResponse> {
        return apiClient.post<MessageResponse, SendMessageRequest>(
            `/api/Chat/conversations/${conversationId}/messages`,
            { content },
            { requiresAuth: true }
        );
    }

    /** Marca como lidas todas as mensagens recebidas até a última. */
    async markAsRead(conversationId: string): Promise<void> {
        return apiClient.patch<void>(
            `/api/Chat/conversations/${conversationId}/read`,
            undefined,
            { requiresAuth: true }
        );
    }
}

export const ChatService = new ChatServiceImpl();
