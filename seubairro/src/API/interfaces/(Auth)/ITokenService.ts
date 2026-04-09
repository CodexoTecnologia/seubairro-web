export interface ITokenService {
    save(token: string): void;
    get(): string | null;
    remove(): void;
}