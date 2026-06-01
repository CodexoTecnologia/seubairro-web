export type ApiErrorCode =
    | 'IdCannotBeEmpty'
    | 'InvalidCategory'
    | 'InvalidCountryCode'
    | 'AddressRequiresBusiness'
    | 'MaxNichesExceeded'
    | 'ImagesRequired'
    | 'CloudinaryFileTooLarge'
    | 'CloudinaryFileTypeNotAllowed'
    | 'CloudinaryFolderCannotBeEmpty'
    | 'MaxImagesExceeded'
    | 'InvalidCoverIndex'
    | 'ValidationFailed'
    | 'IncorrectOldPassword'
    | 'BusinessNotFound'
    | 'AddressNotFound'
    | 'UserNotFound'
    | 'UserBusinessNotFound'
    | 'CategoryNotFound'
    | 'ListingNotFound'
    | 'ImageNotFound'
    | 'NicheNotFound'
    | 'BusinessNicheNotFound'
    | 'BusinessOperationNotFound'
    | 'TaxIdAlreadyInUse'
    | 'EmailAlreadyInUse'
    | 'NicheAlreadyAdded'
    | 'InvalidCredentials'
    | 'InvalidPassword'
    | 'Forbidden'
    | 'InternalServerError'
    | (string & {});

export interface ApiErrorDetail {
    code: ApiErrorCode;
    message: string;
    details: string[] | null;
    statusCode: number;
}

export interface ApiErrorResponse {
    success: false;
    error: ApiErrorDetail;
}

export class ApiClientError extends Error {
    public readonly statusCode: number;
    public readonly code: ApiErrorCode;
    public readonly details: string[] | null;
    public readonly data: ApiErrorResponse;

    constructor(response: ApiErrorResponse) {
        super(response.error.message || 'Erro na requisição da API');
        this.name = 'ApiClientError';
        this.statusCode = response.error.statusCode;
        this.code = response.error.code;
        this.details = response.error.details ?? null;
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
