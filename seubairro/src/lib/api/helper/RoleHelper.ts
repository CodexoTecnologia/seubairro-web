import { JwtHelper } from './JwtHelper';
import { authService } from '../services/(Auth)/AuthInstance';

export const ROLE_CUSTOMER = 'Customer';
export const ROLE_ENTREPENEUR = 'Entrepeneur';

export type AppRole = typeof ROLE_CUSTOMER | typeof ROLE_ENTREPENEUR;

export const DASHBOARD_BY_ROLE: Record<AppRole, string> = {
    [ROLE_CUSTOMER]: '/dashboard-client',
    [ROLE_ENTREPENEUR]: '/dashboard-business',
};

function normalize(role: string): AppRole | null {
    const r = role.toLowerCase();
    if (r.includes('entrepeneur') || r.includes('entrepreneur') || r.includes('business')) {
        return ROLE_ENTREPENEUR;
    }
    if (r.includes('customer') || r.includes('client') || r === 'user') {
        return ROLE_CUSTOMER;
    }
    return null;
}

export class RoleHelper {
    static getRoles(token?: string | null): AppRole[] {
        const t = token ?? authService.getToken();
        if (!t) return [];

        const raw = JwtHelper.getRoles(t);
        const mapped = raw
            .map(normalize)
            .filter((r): r is AppRole => r !== null);

        return Array.from(new Set(mapped));
    }

    static hasRole(role: AppRole, token?: string | null): boolean {
        return this.getRoles(token).includes(role);
    }

    static getRedirectPath(token?: string | null): string {
        const roles = this.getRoles(token);
        if (roles.length === 0) return DASHBOARD_BY_ROLE[ROLE_CUSTOMER];
        if (roles.length === 1) return DASHBOARD_BY_ROLE[roles[0]];
        return '/choose-profile';
    }
}
