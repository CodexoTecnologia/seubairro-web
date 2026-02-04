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
            usePathId: false,
        });
    }
}
export const AddressService = new AddressServiceImpl();

