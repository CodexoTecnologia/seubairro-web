export interface ListingImageInfo {
    url?: string;
    imageUrl?: string;
    isCover: boolean;
}

export interface PublicListingBusinessInfo {
    businessId: string;
    businessName: string;
    businessSlug: string;
    businessLogoUrl: string | null;
    isOpenNow: boolean;
}

export interface PublicListingLocation {
    city: string;
    neighborhood: string;
    latitude: number;
    longitude: number;
}

export interface PublicListingDetailResponse {
    listingId: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    currencyCode: string;
    stockQuantity: number;
    type: string;
    images: ListingImageInfo[];
    business: PublicListingBusinessInfo;
    businessLocation: PublicListingLocation;
    whatsappLink: string | null;
}