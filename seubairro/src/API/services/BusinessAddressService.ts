import { BaseService } from './BaseService';
import type { CreateBusinessAddressRequest, UpdateBusinessAddressRequest } from '../dtos/Request/index';
import type { BusinessAddressResponse } from '../dtos/Response/index';

class BusinessAddressServiceImpl extends BaseService<
    BusinessAddressResponse,
    CreateBusinessAddressRequest,
    UpdateBusinessAddressRequest
> {
    constructor() {
        super({
            basePath: '/api/BusinessAddress',
            requiresAuth: true,
            idParamName: 'id',
            usePathId: false,
        });
    }
}

export const BusinessAddressService = new BusinessAddressServiceImpl();
