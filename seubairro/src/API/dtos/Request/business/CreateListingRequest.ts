export interface CreateListingRequest {
    listingCategoryId: string;
    title: string | null;
    slug: string | null;
    stockQuantity: number;
    description: string | null;
    price: number;
    currencyCode: string | null;
}

