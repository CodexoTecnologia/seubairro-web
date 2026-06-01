
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
    // Add other common pagination params as needed
}

export interface PaginatedResponse<T> extends ApiSuccessResponse<T[]> {
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Alias for ApiErrorDetail if needed, or a separate type
export type ApiError = ApiErrorDetail;
