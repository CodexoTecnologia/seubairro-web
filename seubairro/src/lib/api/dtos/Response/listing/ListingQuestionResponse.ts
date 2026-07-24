export interface ListingQuestionResponse {
    id: string;
    listingId: string;
    questionerId: string;
    questionText: string;
    responderId: string | null;
    answerText: string | null;
    answeredAt: string | null; // ISO date-time
    isActive: boolean;
    createdAt: string; // ISO date-time
}
