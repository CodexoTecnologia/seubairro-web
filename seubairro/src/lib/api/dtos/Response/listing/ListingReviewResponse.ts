export interface ListingReviewResponse {
    id: string;
    orderId: number;
    listingId: string;
    reviewerId: string;
    rating: number; // 1..5
    comment: string;
    createdAt: string; // ISO date-time
}
