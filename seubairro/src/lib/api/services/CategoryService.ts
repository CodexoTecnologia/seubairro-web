import { apiClient } from '../Client/apiClientInstance';
import type { CategoryResponse } from '../dtos/Response/index/index';
import type { CreateCategoryRequest } from '../dtos/Request/index/index';

class CategoryServiceImpl {
    async getAll(): Promise<CategoryResponse[]> {
        return apiClient.get<CategoryResponse[]>('/api/ListingCategory');
    }

    async getById(id: string): Promise<CategoryResponse> {
        return apiClient.get<CategoryResponse>(`/api/ListingCategory/${id}`);
    }

    async create(data: CreateCategoryRequest): Promise<CategoryResponse> {
        return apiClient.post<CategoryResponse, CreateCategoryRequest>('/api/ListingCategory', data, {
            requiresAuth: true,
        });
    }

    async activate(id: string): Promise<void> {
        return apiClient.patch<void>(`/api/ListingCategory/${id}/active`, undefined, {
            requiresAuth: true,
        });
    }

    async deactivate(id: string): Promise<void> {
        return apiClient.patch<void>(`/api/ListingCategory/${id}/deactive`, undefined, {
            requiresAuth: true,
        });
    }
}

export const CategoryService = new CategoryServiceImpl();
