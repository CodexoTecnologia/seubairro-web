import { apiClient } from '../Client/apiClientInstance';
import type { CreatePaymentRequest } from '../dtos/Request/payment/CreatePaymentRequest';
import type { PaymentMethodEnum } from '../enums/PaymentEnums';
import type { PaymentResponse } from '../dtos/Response/index';

/**
 * Pagamento online. O gateway e o modelo de repasse ainda não estão definidos
 * (webhook do contrato v1 continua genérico) — este service cobre o contrato
 * publicado, mas o épico de checkout depende dessas decisões de infraestrutura.
 */
class PaymentServiceImpl {
    /** Cria a cobrança do pedido; `checkoutUrl` traz o checkout hospedado. */
    async create(orderId: number, method?: PaymentMethodEnum): Promise<PaymentResponse> {
        return apiClient.post<PaymentResponse, CreatePaymentRequest>(
            '/api/Payment',
            { orderId, method: method ?? null },
            { requiresAuth: true }
        );
    }

    /** Pagamentos do usuário autenticado. */
    async getMine(): Promise<PaymentResponse[]> {
        return apiClient.get<PaymentResponse[]>('/api/Payment', { requiresAuth: true });
    }

    async getById(id: string): Promise<PaymentResponse> {
        return apiClient.get<PaymentResponse>(`/api/Payment/${id}`, { requiresAuth: true });
    }

    /** Pagamentos de um pedido — usado na tela de pedido e no retorno do gateway. */
    async getByOrder(orderId: number): Promise<PaymentResponse[]> {
        return apiClient.get<PaymentResponse[]>(`/api/Payment/order/${orderId}`, {
            requiresAuth: true,
        });
    }

    /** Política de estorno (quem pode acionar, prazo, parcial) ainda em aberto. */
    async refund(id: string): Promise<PaymentResponse> {
        return apiClient.patch<PaymentResponse>(`/api/Payment/${id}/refund`, undefined, {
            requiresAuth: true,
        });
    }
}

export const PaymentService = new PaymentServiceImpl();
