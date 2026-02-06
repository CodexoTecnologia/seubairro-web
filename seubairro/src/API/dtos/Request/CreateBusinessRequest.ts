export interface CreateBusinessRequest {
    ownerId: string;
    businessName: string | null;
    legalName: string | null;
    taxId: string | null;
    description: string | null;
    logoUrl: string | null;
    coverImageUrl: string | null;
    publicPhone: string | null;
    instagramUrl: string | null;
}

