import { CategoryTypeEnum } from '../../../enums/index/index';

export interface CategoryResponse {
    id: string;
    name: string | null;
    iconUrl: string | null;
    categoryType: CategoryTypeEnum;
    isActive: boolean;
}
