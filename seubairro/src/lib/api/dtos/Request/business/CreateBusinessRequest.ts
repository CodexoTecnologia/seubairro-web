import { CreateBusinessAddressRequest } from './CreateBusinessAddressRequest';

/**
 * Criação da empresa (Opção B): dono autenticado cria o negócio **junto com o
 * endereço** numa só chamada. `POST /api/Business` (Bearer). O backend
 * geocodifica o endereço ao salvar e retorna a visão completa de gestão.
 */
export interface CreateBusinessRequest {
    businessName: string | null;
    legalName: string | null;
    taxId: string | null;
    description: string | null;
    logoUrl: string | null;
    coverImageUrl: string | null;
    publicPhone: string | null;
    phoneCountryCode?: string | null;
    phoneNumber?: string | null;
    instagramUrl: string | null;
    address: CreateBusinessAddressRequest;
}
