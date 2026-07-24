/**
 * Método de pagamento aceito pelo gateway, conforme `PaymentMethodEnum` (v1).
 * `CreatePaymentRequest.method` é anulável — nulo delega a escolha ao checkout
 * hospedado do gateway.
 */
export enum PaymentMethodEnum {
    CreditCard = 'CreditCard',
    Pix = 'Pix',
}

/** Status do pagamento no gateway, conforme `GatewayStatusEnum` (v1). */
export enum GatewayStatusEnum {
    Pending = 'Pending',
    Approved = 'Approved',
    Refused = 'Refused',
    Refunded = 'Refunded',
}

const PAYMENT_METHOD_LABELS: Record<PaymentMethodEnum, string> = {
    [PaymentMethodEnum.CreditCard]: 'Cartão de crédito',
    [PaymentMethodEnum.Pix]: 'PIX',
};

const GATEWAY_STATUS_LABELS: Record<GatewayStatusEnum, string> = {
    [GatewayStatusEnum.Pending]: 'Aguardando pagamento',
    [GatewayStatusEnum.Approved]: 'Aprovado',
    [GatewayStatusEnum.Refused]: 'Recusado',
    [GatewayStatusEnum.Refunded]: 'Estornado',
};

const GATEWAY_STATUS_TONES: Record<GatewayStatusEnum, 'neutral' | 'info' | 'warning' | 'success' | 'danger'> = {
    [GatewayStatusEnum.Pending]: 'warning',
    [GatewayStatusEnum.Approved]: 'success',
    [GatewayStatusEnum.Refused]: 'danger',
    [GatewayStatusEnum.Refunded]: 'neutral',
};

export const isPaymentMethod = (value: string): value is PaymentMethodEnum =>
    Object.values(PaymentMethodEnum).includes(value as PaymentMethodEnum);

export const isGatewayStatus = (value: string): value is GatewayStatusEnum =>
    Object.values(GatewayStatusEnum).includes(value as GatewayStatusEnum);

export const getPaymentMethodLabel = (method: string): string =>
    isPaymentMethod(method) ? PAYMENT_METHOD_LABELS[method] : method;

export const getGatewayStatusLabel = (status: string): string =>
    isGatewayStatus(status) ? GATEWAY_STATUS_LABELS[status] : status;

export const getGatewayStatusTone = (status: string) =>
    isGatewayStatus(status) ? GATEWAY_STATUS_TONES[status] : 'neutral';
