/**
 * Status canônicos do pedido, conforme o enum publicado no OpenAPI (v1).
 * Serializados como string no `OrderResponse.status`.
 */
export enum OrderStatusEnum {
    AwaitingPayment = 'AwaitingPayment',
    Pending = 'Pending',
    Accepted = 'Accepted',
    InProgress = 'InProgress',
    Ready = 'Ready',
    Completed = 'Completed',
    Rejected = 'Rejected',
    Cancelled = 'Cancelled',
}

/** Papel do usuário autenticado em relação ao pedido. */
export type OrderRole = 'customer' | 'business';

/** Tom visual do status, consumido pelo StatusBadge do Design System. */
export type OrderStatusTone = 'neutral' | 'info' | 'warning' | 'success' | 'danger';

const ORDER_STATUS_LABELS: Record<OrderStatusEnum, string> = {
    [OrderStatusEnum.AwaitingPayment]: 'Aguardando pagamento',
    [OrderStatusEnum.Pending]: 'Pendente',
    [OrderStatusEnum.Accepted]: 'Aceito',
    [OrderStatusEnum.InProgress]: 'Em preparo',
    [OrderStatusEnum.Ready]: 'Pronto',
    [OrderStatusEnum.Completed]: 'Concluído',
    [OrderStatusEnum.Rejected]: 'Recusado',
    [OrderStatusEnum.Cancelled]: 'Cancelado',
};

const ORDER_STATUS_TONES: Record<OrderStatusEnum, OrderStatusTone> = {
    [OrderStatusEnum.AwaitingPayment]: 'warning',
    [OrderStatusEnum.Pending]: 'warning',
    [OrderStatusEnum.Accepted]: 'info',
    [OrderStatusEnum.InProgress]: 'info',
    [OrderStatusEnum.Ready]: 'info',
    [OrderStatusEnum.Completed]: 'success',
    [OrderStatusEnum.Rejected]: 'danger',
    [OrderStatusEnum.Cancelled]: 'neutral',
};

const TERMINAL_STATUSES: readonly OrderStatusEnum[] = [
    OrderStatusEnum.Completed,
    OrderStatusEnum.Rejected,
    OrderStatusEnum.Cancelled,
];

/**
 * Máquina de estados por papel. A autoridade é o servidor (responde 409 em
 * transição inválida); este mapa existe para o front exibir apenas as ações
 * possíveis, nunca para autorizar.
 */
const ORDER_TRANSITIONS: Record<OrderRole, Partial<Record<OrderStatusEnum, OrderStatusEnum[]>>> = {
    customer: {
        [OrderStatusEnum.AwaitingPayment]: [OrderStatusEnum.Cancelled],
        [OrderStatusEnum.Pending]: [OrderStatusEnum.Cancelled],
    },
    business: {
        [OrderStatusEnum.AwaitingPayment]: [OrderStatusEnum.Cancelled],
        [OrderStatusEnum.Pending]: [OrderStatusEnum.Accepted, OrderStatusEnum.Rejected],
        [OrderStatusEnum.Accepted]: [OrderStatusEnum.InProgress, OrderStatusEnum.Cancelled],
        [OrderStatusEnum.InProgress]: [OrderStatusEnum.Ready, OrderStatusEnum.Cancelled],
        [OrderStatusEnum.Ready]: [OrderStatusEnum.Completed, OrderStatusEnum.Cancelled],
    },
};

export const isOrderStatus = (value: string): value is OrderStatusEnum =>
    Object.values(OrderStatusEnum).includes(value as OrderStatusEnum);

/** Rótulo em pt-BR; status desconhecido (contrato à frente do front) volta cru. */
export const getOrderStatusLabel = (status: string): string =>
    isOrderStatus(status) ? ORDER_STATUS_LABELS[status] : status;

export const getOrderStatusTone = (status: string): OrderStatusTone =>
    isOrderStatus(status) ? ORDER_STATUS_TONES[status] : 'neutral';

export const isTerminalOrderStatus = (status: string): boolean =>
    isOrderStatus(status) && TERMINAL_STATUSES.includes(status);

/** Transições que o papel pode disparar a partir do status atual. */
export const getNextOrderStatuses = (status: string, role: OrderRole): OrderStatusEnum[] =>
    isOrderStatus(status) ? (ORDER_TRANSITIONS[role][status] ?? []) : [];

export const canCancelOrder = (status: string, role: OrderRole): boolean =>
    getNextOrderStatuses(status, role).includes(OrderStatusEnum.Cancelled);
