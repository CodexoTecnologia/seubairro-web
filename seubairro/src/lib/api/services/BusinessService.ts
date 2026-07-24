import { apiClient } from '../Client/apiClientInstance';
import { ApiClientError } from '../Client/ApiClientError';
import { BaseService } from './BaseService';
import type {
    CreateBusinessRequest,
    UpdateBusinessRequest,
} from '../dtos/Request/index';
import type { UpdateClosedStatusRequest } from '../dtos/Request/business/UpdateClosedStatusRequest';
import type { BusinessAddressResponse } from '../dtos/Response/business/BusinessAddressResponse';
import type { BusinessNicheResponse } from '../dtos/Response/business/BusinessNicheResponse';
import type { BusinessOperationResponse } from '../dtos/Response/business/BusinessOperationResponse';

export interface BusinessResponse {
    id: string;
    ownerId: string;
    slug: string | null;
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
    isActive: boolean;
    isClosed: boolean;
    closedReason?: string | null;
    closedUntil?: string | null;
    averageRating?: number;
    reviewCount?: number;
    totalSalesCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Visão completa da empresa para a página de gestão: retornada por
 * `GET /api/business/owner/{ownerId}` conforme o contrato atualizado.
 * `address` vem `null` enquanto a empresa não tiver endereço cadastrado.
 */
export interface BusinessOwnerOverviewResponse {
    business: BusinessResponse;
    address: BusinessAddressResponse | null;
    niches: BusinessNicheResponse[];
    operations: BusinessOperationResponse[];
}

class BusinessServiceImpl extends BaseService<
    BusinessResponse,
    CreateBusinessRequest,
    UpdateBusinessRequest
> {
    private ownerOverviewPromises: Map<string, Promise<BusinessOwnerOverviewResponse | null>> = new Map();
    private cacheTimeouts: Map<string, any> = new Map();

    constructor() {
        super({
            basePath: '/api/Business',
            requiresAuth: true,
            usePathId: true,
        });
    }

    clearOwnerOverviewCache(ownerId?: string): void {
        if (ownerId) {
            this.ownerOverviewPromises.delete(ownerId);
            if (this.cacheTimeouts.has(ownerId)) {
                clearTimeout(this.cacheTimeouts.get(ownerId));
                this.cacheTimeouts.delete(ownerId);
            }
        } else {
            this.ownerOverviewPromises.clear();
            this.cacheTimeouts.forEach((timer) => clearTimeout(timer));
            this.cacheTimeouts.clear();
        }
    }

    /**
     * Carrega a visão completa da empresa do dono (negócio + endereço + nichos +
     * horários) numa só chamada. Tolerante ao formato: aceita tanto o envelope
     * novo `{ business, address, niches, operations }` quanto o legado, em que a
     * rota devolvia apenas o objeto do negócio.
     */
    async getOwnerOverview(ownerId: string): Promise<BusinessOwnerOverviewResponse | null> {
        if (this.ownerOverviewPromises.has(ownerId)) {
            return this.ownerOverviewPromises.get(ownerId)!;
        }

        const promise = (async () => {
            try {
                const raw = await apiClient.get<unknown>(`/api/Business/owner/${ownerId}`, {
                    requiresAuth: true,
                });
                return normalizeOverview(raw);
            } catch (err: any) {
                if (
                    err?.statusCode === 404 ||
                    err?.error?.statusCode === 404 ||
                    err?.status === 404 ||
                    (err instanceof ApiClientError && err.statusCode === 404)
                ) {
                    return null;
                }
                this.clearOwnerOverviewCache(ownerId);
                throw err;
            }
        })();

        this.ownerOverviewPromises.set(ownerId, promise);

        if (this.cacheTimeouts.has(ownerId)) {
            clearTimeout(this.cacheTimeouts.get(ownerId));
        }
        const timer = setTimeout(() => {
            this.ownerOverviewPromises.delete(ownerId);
            this.cacheTimeouts.delete(ownerId);
        }, 2000);
        this.cacheTimeouts.set(ownerId, timer);

        return promise;
    }

    async getByOwnerId(ownerId: string): Promise<BusinessResponse | null> {
        const overview = await this.getOwnerOverview(ownerId);
        return overview?.business ?? null;
    }

    /**
     * Cria a empresa junto com o endereço numa só chamada (owner derivado do
     * JWT; o backend geocodifica). `POST /api/Business` retorna a visão completa
     * de gestão (business + address + niches + operations).
     */
    async createWithAddress(
        data: CreateBusinessRequest
    ): Promise<BusinessOwnerOverviewResponse | null> {
        this.clearOwnerOverviewCache();
        const raw = await apiClient.post<unknown, CreateBusinessRequest>(
            '/api/Business',
            data,
            { requiresAuth: true }
        );
        return normalizeOverview(raw);
    }

    async uploadLogo(id: string, file: File): Promise<BusinessResponse> {
        const formData = new FormData();
        formData.append('logo', file);
        return apiClient.putForm<BusinessResponse>(
            `/api/Business/${id}/logo`,
            formData,
            { requiresAuth: true }
        );
    }

    /** Capa (banner) do perfil público — multipart com o campo `cover`. */
    async uploadCover(id: string, file: File): Promise<BusinessResponse> {
        const formData = new FormData();
        formData.append('cover', file);
        return apiClient.putForm<BusinessResponse>(
            `/api/Business/${id}/cover`,
            formData,
            { requiresAuth: true }
        );
    }

    async updateClosedStatus(
        id: string,
        data: UpdateClosedStatusRequest
    ): Promise<BusinessResponse> {
        return apiClient.patch<BusinessResponse, UpdateClosedStatusRequest>(
            `/api/Business/${id}/closed-status`,
            data,
            { requiresAuth: true }
        );
    }
}

/**
 * Normaliza a resposta da rota `owner/{ownerId}` para o formato completo.
 * Se o backend ainda devolver só o negócio (formato legado), monta o envelope
 * com endereço nulo e listas vazias.
 */
function normalizeOverview(raw: unknown): BusinessOwnerOverviewResponse | null {
    if (!raw || typeof raw !== 'object') return null;
    const obj = raw as Record<string, unknown>;

    if (obj.business && typeof obj.business === 'object') {
        return {
            business: obj.business as BusinessResponse,
            address: (obj.address as BusinessAddressResponse | null) ?? null,
            niches: Array.isArray(obj.niches) ? (obj.niches as BusinessNicheResponse[]) : [],
            operations: Array.isArray(obj.operations)
                ? (obj.operations as BusinessOperationResponse[])
                : [],
        };
    }

    // Formato legado: a rota devolvia apenas o objeto do negócio.
    return {
        business: raw as BusinessResponse,
        address: null,
        niches: [],
        operations: [],
    };
}

export const BusinessService = new BusinessServiceImpl();
