import type { DaysWeek } from './BusinessOperationResponse';

export interface TodayStatusResponse {
    daysWeek: DaysWeek;
    dayName: string;
    openTime: string | null;
    closeTime: string | null;
}

export interface BusinessOperationStatusResponse {
    isOpenNow: boolean;
    today: TodayStatusResponse | null;
    nextOpenAt: string | null;
    serverTime: string;
}
