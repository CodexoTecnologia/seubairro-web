export interface ListingSearchRequest {
    latitude?: number;
    longitude?: number;
    listingCategoryId?: string;
    nicheIds?: string[]; // serializado como chave repetida: ?NicheIds=a&NicheIds=b
    query?: string;
    maxDistanceKm?: number;
    openNow?: boolean;
    page?: number;
    pageSize?: number;
}
