import { CategoryTypeEnum } from '../../../enums/index/index';

export interface CreateCategoryRequest {
    name: string | null;
    categoryType: CategoryTypeEnum;
}
