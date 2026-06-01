import { apiClient } from '../Client/apiClientInstance';
import { BaseService } from './BaseService';
import type { CreateAddressRequest, UpdateAddressRequest } from '../dtos/Request/index';
import type { AddressResponse } from '../dtos/Response/index';

class AddressServiceImpl extends BaseService<
    AddressResponse,
    CreateAddressRequest,
    UpdateAddressRequest
> {
    constructor() {
        super({
            basePath: '/api/Address',
            requiresAuth: true,
            idParamName: 'id',
            usePathId: true,
        });
    }

    async getMine(): Promise<AddressResponse[]> {
        return apiClient.get<AddressResponse[]>('/api/Address/me', {
            requiresAuth: true,
        });
    }

    async getAll(): Promise<AddressResponse[]> {
        return this.getMine();
    }
}

export const AddressService = new AddressServiceImpl();
