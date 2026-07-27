
export interface ApiErrorDetail {
    statusCode: number;
    message: string;
    [key: string]: unknown;
}

export interface ValidationError extends ApiErrorDetail {
    errors?: Record<string, string[]>;
}

export interface ApiErrorResponse {
    success: boolean;
    error: ApiErrorDetail;
    [key: string]: unknown;
}

export interface ApiSuccessResponse<T> {
    success: boolean;
    data: T;
    [key: string]: unknown;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedResponse<T> extends ApiSuccessResponse<T[]> {
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export type ApiError = ApiErrorDetail;
