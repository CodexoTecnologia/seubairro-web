export interface OrderItemResponse {
    id: string;
    listingId: string;
    quantity: number;
    unitPrice: number;
    subTotal: number;
    // Snapshots do anúncio — imunes a edição/exclusão posterior do anúncio.
    listingTitle: string;
    listingImageUrl: string | null;
}
