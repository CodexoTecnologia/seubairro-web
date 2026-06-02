export type DaysWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface BusinessOperationResponse {
    id: string;
    businessId: string;
    daysWeek: DaysWeek;
    dayName: string;
    openTime: string;
    closeTime: string;
}
