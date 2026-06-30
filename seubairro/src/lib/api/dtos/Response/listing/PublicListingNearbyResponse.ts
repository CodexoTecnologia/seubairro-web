export interface PublicListingNearbyResponse {
    listingId: string;
    title: string;
    slug: string;
    price: number;
    currencyCode: string;
    coverImageUrl: string | null;
    distanceInKm: number;
    listingCategoryId: string;
    businessId: string;
    businessName: string;
    businessSlug: string;
    businessLogoUrl: string | null;
    city: string;
    neighborhood: string;
    businessLatitude: number;
    businessLongitude: number;
    isOpenNow: boolean;
    whatsappLink: string | null;
}
