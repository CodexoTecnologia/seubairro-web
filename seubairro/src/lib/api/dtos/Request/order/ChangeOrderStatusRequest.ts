import type { OrderStatusEnum } from '../../../enums/OrderStatusEnum';

export interface ChangeOrderStatusRequest {
    /** Contrato aceita string livre; o front restringe ao enum canônico. */
    status: OrderStatusEnum;
    reason?: string | null;
}
