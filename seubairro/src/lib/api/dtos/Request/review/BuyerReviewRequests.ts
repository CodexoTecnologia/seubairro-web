export interface CreateBuyerReviewRequest {
    orderId: number;
    /** Inteiro de 1 a 5. */
    rating: number;
    comment: string;
}

export interface UpdateBuyerReviewRequest {
    rating: number;
    comment: string;
}
