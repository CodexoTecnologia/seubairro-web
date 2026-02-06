export interface UpdateListingRequest {
    readonly categoryId?: string;
    readonly title?: string | null;
    readonly slug?: string | null;
    readonly stockQuantity?: number;
    readonly description?: string | null;
    readonly price?: number;
    readonly currencyCode?: string | null;
}

