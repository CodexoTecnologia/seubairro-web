import type { ApiErrorResponse } from '../Interfaces';

export type { ApiErrorResponse, ApiErrorDetail } from '../Interfaces';

export class ApiClientError extends Error {
    public readonly statusCode: number;
    public readonly data: ApiErrorResponse;

    constructor(response: ApiErrorResponse) {
        super(response.error.message || 'Erro na requisição da API');
        this.name = 'ApiClientError';
        this.statusCode = response.error.statusCode;
        this.data = response;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiClientError);
        }
    }
}

export class NetworkError extends Error {
    constructor(message = 'Erro de conexão. Verifique sua internet ou tente novamente mais tarde.') {
        super(message);
        this.name = 'NetworkError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NetworkError);
        }
    }
}

export class TimeoutError extends Error {
    constructor(message = 'A requisição demorou muito para responder.') {
        super(message);
        this.name = 'TimeoutError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TimeoutError);
        }
    }
}
