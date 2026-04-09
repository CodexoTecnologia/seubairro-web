export interface JwtPayload {
    sub?: string;
    exp?: number;
    iat?: number;
    nbf?: number;
    iss?: string;
    aud?: string | string[];
    jti?: string;
    [key: string]: any;
}

export class JwtHelper {
    static decode(token: string): JwtPayload | null {
        try {
            const parts = token.split('.');

            if (parts.length !== 3) {
                console.error('Token JWT inválido: formato incorreto');
                return null;
            }

            const payload = parts[1];
            const decoded = this.base64UrlDecode(payload);

            return JSON.parse(decoded) as JwtPayload;
        } catch (error) {
            console.error('Erro ao decodificar token JWT:', error);
            return null;
        }
    }

    static isExpired(token: string): boolean {
        const payload = this.decode(token);

        if (!payload || !payload.exp) {
            return true;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    }

    static getTimeToExpiration(token: string): number | null {
        const payload = this.decode(token);

        if (!payload || !payload.exp) {
            return null;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        const timeRemaining = payload.exp - currentTime;

        return Math.max(0, timeRemaining);
    }

    static isValidFormat(token: string): boolean {
        if (!token || typeof token !== 'string') {
            return false;
        }

        const parts = token.split('.');
        return parts.length === 3 && parts.every(part => part.length > 0);
    }

    private static base64UrlDecode(base64Url: string): string {
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        const padding = base64.length % 4;
        if (padding) {
            base64 += '='.repeat(4 - padding);
        }

        try {
            if (typeof window !== 'undefined' && window.atob) {
                return decodeURIComponent(
                    Array.from(window.atob(base64))
                        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
            }

            return Buffer.from(base64, 'base64').toString('utf-8');
        } catch (error) {
            throw new Error('Erro ao decodificar Base64: ' + error);
        }
    }
}
