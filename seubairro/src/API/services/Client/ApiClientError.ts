import { ApiError, ApiErrorResponse } from '../../interfaces';
export class ApiClientError extends Error {
    public readonly statusCode: number;
    public readonly apiError: ApiError;
    public readonly validationErrors?: Array<{ field: string; message: string }>;
    constructor(errorResponse: ApiErrorResponse) {
        super(errorResponse.error.message);
        this.name = 'ApiClientError';
        this.statusCode = errorResponse.error.statusCode;
        this.apiError = errorResponse.error;
        this.validationErrors = errorResponse.validationErrors;
    }
    isUnauthorized(): boolean {
        return this.statusCode === 401;
    }
    isForbidden(): boolean {
        return this.statusCode === 403;
    }
    isValidationError(): boolean {
        return this.statusCode === 422 && !!this.validationErrors;
    }
    isNotFound(): boolean {
        return this.statusCode === 404;
    }
    isServerError(): boolean {
        return this.statusCode >= 500 && this.statusCode < 600;
    }
}
export class NetworkError extends Error {
    constructor(message: string = 'Erro de conexão com o servidor') {
        super(message);
        this.name = 'NetworkError';
    }
}
export class TimeoutError extends Error {
    constructor(message: string = 'A requisição excedeu o tempo limite') {
        super(message);
        this.name = 'TimeoutError';
    }
}

