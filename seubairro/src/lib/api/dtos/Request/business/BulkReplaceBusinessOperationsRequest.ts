import type { DaysWeek } from '../../Response/business/BusinessOperationResponse';

export interface BulkReplaceBusinessOperationItem {
    daysWeek: DaysWeek;
    openTime: string | null;
    closeTime: string | null;
}

export interface BulkReplaceBusinessOperationsRequest {
    operations: BulkReplaceBusinessOperationItem[];
}
