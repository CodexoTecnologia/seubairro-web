import type { GatewayStatusEnum, PaymentMethodEnum } from '../../../enums/PaymentEnums';

export interface PaymentResponse {
    id: string;
    orderId: number;
    gatewayProvider: string;
    gatewayTransactionId: string;
    amount: number;
    status: GatewayStatusEnum;
    method: PaymentMethodEnum;
    /** URL do checkout hospedado do gateway, quando o fluxo for por redirect. */
    checkoutUrl: string | null;
    processedAt: string; // ISO date-time
    createdAt: string; // ISO date-time
}
