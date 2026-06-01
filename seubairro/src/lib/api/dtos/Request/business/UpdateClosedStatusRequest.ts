export interface UpdateClosedStatusRequest {
    isClosed: boolean;
    reason?: string | null;
    until?: string | null;
}
