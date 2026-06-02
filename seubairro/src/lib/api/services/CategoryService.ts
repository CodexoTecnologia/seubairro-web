import { apiClient } from '../Client/apiClientInstance';
import type { CategoryResponse } from '../dtos/Response/index/index';
import type { CreateCategoryRequest } from '../dtos/Request/index/index';

class CategoryServiceImpl {
    async getById(id: string): Promise<CategoryResponse> {
        return apiClient.get<CategoryResponse>(`/api/ListingCategory`, { params: { id } });
    }

    async create(data: CreateCategoryRequest): Promise<CategoryResponse> {
        return apiClient.post<CategoryResponse, CreateCategoryRequest>('/api/ListingCategory', data);
    }

    async getAll(): Promise<CategoryResponse[]> {
        return apiClient.get<CategoryResponse[]>('/api/ListingCategory/all');
    }

    async deactivate(id: string): Promise<void> {
        return apiClient.patch<void>('/api/ListingCategory/deactive', undefined, { params: { id } });
    }

    async activate(id: string): Promise<void> {
        return apiClient.patch<void>('/api/ListingCategory/active', undefined, { params: { id } });
    }
}

export const CategoryService = new CategoryServiceImpl();
