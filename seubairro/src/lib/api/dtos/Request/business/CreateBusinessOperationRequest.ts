import type { DaysWeek } from '../../Response/business/BusinessOperationResponse';

export interface CreateBusinessOperationRequest {
    daysWeek: DaysWeek;
    openTime: string;
    closeTime: string;
}
