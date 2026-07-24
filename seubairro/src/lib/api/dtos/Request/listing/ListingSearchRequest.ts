export interface ListingSearchRequest {
    latitude?: number;
    longitude?: number;
    listingCategoryId?: string;
    nicheIds?: string[]; // serializado como chave repetida: ?NicheIds=a&NicheIds=b
    query?: string;
    maxDistanceKm?: number;
    /** Busca todos os anúncios, sem filtro de raio. Quando true, MaxDistanceKm não é enviado. */
    searchAll?: boolean;
    openNow?: boolean;
    page?: number;
    pageSize?: number;
}
