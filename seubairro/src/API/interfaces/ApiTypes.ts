export interface ApiError {
    statusCode: number;
    message: string;
    details?: Record<string, unknown>;
    timestamp?: string;
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface ApiErrorResponse {
    success: false;
    error: ApiError;
    validationErrors?: ValidationError[];
}

export interface ApiSuccessResponse<T = unknown> {
    success: true;
    data: T;
    message?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationParams {
    page?: number;
    pageSize?: number;
    sortBy?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
