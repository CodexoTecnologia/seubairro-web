import { apiClient } from './Client/apiClientInstance';
interface BaseServiceConfig {
    basePath: string;
    requiresAuth?: boolean;
    idParamName?: string;
    usePathId?: boolean;
}
export abstract class BaseService<
    TResponse,
    TCreateRequest = unknown,
    TUpdateRequest = unknown
> {
    protected config: Required<BaseServiceConfig>;
    constructor(config: BaseServiceConfig) {
        this.config = {
            basePath: config.basePath,
            requiresAuth: config.requiresAuth ?? true,
            idParamName: config.idParamName ?? 'id',
            usePathId: config.usePathId ?? false,
        };
    }
    async getById(id: string): Promise<TResponse> {
        const path = this.config.usePathId
            ? `${this.config.basePath}/${id}`
            : this.config.basePath;
        const options = this.config.usePathId
            ? { requiresAuth: this.config.requiresAuth }
            : {
                params: { [this.config.idParamName]: id },
                requiresAuth: this.config.requiresAuth
            };
        return apiClient.get<TResponse>(path, options);
    }
    async getAll(): Promise<TResponse[]> {
        return apiClient.get<TResponse[]>(`${this.config.basePath}/all`, {
            requiresAuth: this.config.requiresAuth,
        });
    }
    async create(data: TCreateRequest): Promise<TResponse> {
        return apiClient.post<TResponse, TCreateRequest>(
            this.config.basePath,
            data,
            { requiresAuth: this.config.requiresAuth }
        );
    }
    async update(id: string, data: TUpdateRequest): Promise<TResponse> {
        const path = this.config.usePathId
            ? `${this.config.basePath}/${id}`
            : this.config.basePath;
        const options = this.config.usePathId
            ? { requiresAuth: this.config.requiresAuth }
            : {
                params: { [this.config.idParamName]: id },
                requiresAuth: this.config.requiresAuth,
            };
        return apiClient.put<TResponse, TUpdateRequest>(path, data, options);
    }
    async delete(id: string): Promise<void> {
        const path = this.config.usePathId
            ? `${this.config.basePath}/${id}`
            : this.config.basePath;
        const options = this.config.usePathId
            ? { requiresAuth: this.config.requiresAuth }
            : {
                params: { [this.config.idParamName]: id },
                requiresAuth: this.config.requiresAuth,
            };
        return apiClient.delete<void>(path, options);
    }
}

