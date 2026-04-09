import { ITokenService } from '../../Interfaces/(Auth)/ITokenService';

export class LocalStorageService implements ITokenService {
    private readonly storageKey: string;

    constructor(storageKey: string = 'auth_token') {
        this.storageKey = storageKey;
    }

    save(token: string): void {
        if (typeof window === 'undefined') {
            console.warn('localStorage não disponível no servidor');
            return;
        }

        try {
            localStorage.setItem(this.storageKey, token);
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    }

    get(): string | null {
        if (typeof window === 'undefined') {
            return null;
        }

        try {
            return localStorage.getItem(this.storageKey);
        } catch (error) {
            console.error('Erro ao recuperar do localStorage:', error);
            return null;
        }
    }

    remove(): void {
        if (typeof window === 'undefined') {
            return;
        }

        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
        }
    }
}
