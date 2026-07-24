import { apiClient } from '../Client/apiClientInstance';
import type {
    CreateBusinessAddressRequest,
    UpdateBusinessAddressRequest,
} from '../dtos/Request/index';
import type { BusinessAddressResponse } from '../dtos/Response/index';

class BusinessAddressServiceImpl {
    async getByBusiness(businessId: string): Promise<BusinessAddressResponse> {
        return apiClient.get<BusinessAddressResponse>(
            `/api/business/${businessId}/address`,
            { requiresAuth: true }
        );
    }

    async create(
        businessId: string,
        data: CreateBusinessAddressRequest
    ): Promise<BusinessAddressResponse> {
        return apiClient.post<BusinessAddressResponse, CreateBusinessAddressRequest>(
            `/api/business/${businessId}/address`,
            data,
            { requiresAuth: true }
        );
    }

    async update(
        businessId: string,
        data: UpdateBusinessAddressRequest
    ): Promise<BusinessAddressResponse> {
        return apiClient.put<BusinessAddressResponse, UpdateBusinessAddressRequest>(
            `/api/business/${businessId}/address`,
            data,
            { requiresAuth: true }
        );
    }
}

export const BusinessAddressService = new BusinessAddressServiceImpl();
