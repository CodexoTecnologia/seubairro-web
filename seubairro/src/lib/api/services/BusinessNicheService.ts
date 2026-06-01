import { apiClient } from '../Client/apiClientInstance';
import type { BusinessNicheResponse } from '../dtos/Response/business/BusinessNicheResponse';
import type { AddBusinessNicheRequest } from '../dtos/Request/business/AddBusinessNicheRequest';

class BusinessNicheServiceImpl {
    async getByBusiness(businessId: string): Promise<BusinessNicheResponse[]> {
        return apiClient.get<BusinessNicheResponse[]>(`/api/business/${businessId}/niches`, {
            requiresAuth: true,
        });
    }

    async add(businessId: string, data: AddBusinessNicheRequest): Promise<BusinessNicheResponse> {
        return apiClient.post<BusinessNicheResponse, AddBusinessNicheRequest>(
            `/api/business/${businessId}/niches`,
            data,
            { requiresAuth: true }
        );
    }

    async setPrincipal(businessId: string, businessNicheId: string): Promise<BusinessNicheResponse> {
        return apiClient.patch<BusinessNicheResponse>(
            `/api/business/${businessId}/niches/${businessNicheId}/principal`,
            undefined,
            { requiresAuth: true }
        );
    }

    async remove(businessId: string, businessNicheId: string): Promise<void> {
        return apiClient.delete<void>(
            `/api/business/${businessId}/niches/${businessNicheId}`,
            { requiresAuth: true }
        );
    }
}

export const BusinessNicheService = new BusinessNicheServiceImpl();
