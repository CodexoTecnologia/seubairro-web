import type { PaymentMethodEnum } from '../../../enums/PaymentEnums';

export interface CreatePaymentRequest {
    orderId: number;
    /** Nulo delega a escolha do método ao checkout hospedado do gateway. */
    method?: PaymentMethodEnum | null;
}
