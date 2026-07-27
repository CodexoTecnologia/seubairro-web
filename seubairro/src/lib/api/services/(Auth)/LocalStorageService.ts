interface ITokenService {
    save(token: string): void;
    get(): string | null;
    remove(): void;
}

export class LocalStorageService implements ITokenService {
    private readonly storageKey: string;

    constructor(storageKey: string = 'auth_token') {
        this.storageKey = storageKey;
    }

    save(token: string): void {
        if (typeof window === 'undefined') {
            return;
        }

        try {
            localStorage.setItem(this.storageKey, token);
        } catch {
            // localStorage indisponível (modo privado/quota): o token segue em memória no ApiClient.
        }
    }

    get(): string | null {
        if (typeof window === 'undefined') {
            return null;
        }

        try {
            return localStorage.getItem(this.storageKey);
        } catch {
            return null;
        }
    }

    remove(): void {
        if (typeof window === 'undefined') {
            return;
        }

        try {
            localStorage.removeItem(this.storageKey);
        } catch {
            // localStorage indisponível: nada a limpar.
        }
    }
}
