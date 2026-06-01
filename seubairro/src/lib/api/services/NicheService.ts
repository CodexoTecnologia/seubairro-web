import { apiClient } from '../Client/apiClientInstance';
import type { NicheResponse } from '../dtos/Response/business/NicheResponse';
import type { CreateNicheRequest } from '../dtos/Request/business/CreateNicheRequest';
import type { UpdateNicheRequest } from '../dtos/Request/business/UpdateNicheRequest';

class NicheServiceImpl {
    async getAll(): Promise<NicheResponse[]> {
        return apiClient.get<NicheResponse[]>('/api/niches', { requiresAuth: false });
    }

    async getById(id: string): Promise<NicheResponse> {
        return apiClient.get<NicheResponse>(`/api/niches/${id}`, { requiresAuth: false });
    }

    async create(data: CreateNicheRequest): Promise<NicheResponse> {
        return apiClient.post<NicheResponse, CreateNicheRequest>('/api/niches', data, {
            requiresAuth: true,
        });
    }

    async update(id: string, data: UpdateNicheRequest): Promise<NicheResponse> {
        return apiClient.put<NicheResponse, UpdateNicheRequest>(`/api/niches/${id}`, data, {
            requiresAuth: true,
        });
    }

    async delete(id: string): Promise<void> {
        return apiClient.delete<void>(`/api/niches/${id}`, { requiresAuth: true });
    }
}

export const NicheService = new NicheServiceImpl();
