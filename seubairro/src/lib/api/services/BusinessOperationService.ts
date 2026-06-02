import { apiClient } from '../Client/apiClientInstance';
import type { BusinessOperationResponse } from '../dtos/Response/business/BusinessOperationResponse';
import type { BusinessOperationStatusResponse } from '../dtos/Response/business/BusinessOperationStatusResponse';
import type { CreateBusinessOperationRequest } from '../dtos/Request/business/CreateBusinessOperationRequest';
import type { UpdateBusinessOperationRequest } from '../dtos/Request/business/UpdateBusinessOperationRequest';
import type { BulkReplaceBusinessOperationsRequest } from '../dtos/Request/business/BulkReplaceBusinessOperationsRequest';

export const DAYS_WEEK_LABELS: Record<number, string> = {
    0: 'Domingo',
    1: 'Segunda',
    2: 'Terça',
    3: 'Quarta',
    4: 'Quinta',
    5: 'Sexta',
    6: 'Sábado',
};

class BusinessOperationServiceImpl {
    async getByBusiness(businessId: string): Promise<BusinessOperationResponse[]> {
        return apiClient.get<BusinessOperationResponse[]>(
            `/api/business/${businessId}/operations`,
            { requiresAuth: true }
        );
    }

    async create(
        businessId: string,
        data: CreateBusinessOperationRequest
    ): Promise<BusinessOperationResponse> {
        return apiClient.post<BusinessOperationResponse, CreateBusinessOperationRequest>(
            `/api/business/${businessId}/operations`,
            data,
            { requiresAuth: true }
        );
    }

    async update(
        businessId: string,
        operationId: string,
        data: UpdateBusinessOperationRequest
    ): Promise<BusinessOperationResponse> {
        return apiClient.put<BusinessOperationResponse, UpdateBusinessOperationRequest>(
            `/api/business/${businessId}/operations/${operationId}`,
            data,
            { requiresAuth: true }
        );
    }

    async remove(businessId: string, operationId: string): Promise<void> {
        return apiClient.delete<void>(
            `/api/business/${businessId}/operations/${operationId}`,
            { requiresAuth: true }
        );
    }

    async bulkReplace(
        businessId: string,
        data: BulkReplaceBusinessOperationsRequest
    ): Promise<BusinessOperationResponse[]> {
        return apiClient.put<BusinessOperationResponse[], BulkReplaceBusinessOperationsRequest>(
            `/api/business/${businessId}/operations/bulk`,
            data,
            { requiresAuth: true }
        );
    }

    async getStatus(businessId: string): Promise<BusinessOperationStatusResponse> {
        return apiClient.get<BusinessOperationStatusResponse>(
            `/api/business/${businessId}/operations/status`,
            { requiresAuth: true }
        );
    }
}

export const BusinessOperationService = new BusinessOperationServiceImpl();

export function toApiTime(value: string): string {
    if (!value) return value;
    return /^\d{2}:\d{2}$/.test(value) ? `${value}:00` : value;
}

export function fromApiTime(value: string | null | undefined): string {
    if (!value) return '';
    const parts = value.split(':');
    if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
    return value;
}
