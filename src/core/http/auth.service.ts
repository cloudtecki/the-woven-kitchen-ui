const TOKEN_KEY = 'twk_access_token';
const REFRESH_TOKEN_KEY = 'twk_refresh_token';

export class AuthService {
    static getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    static setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    }

    static getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    static setRefreshToken(token: string): void {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }

    static isAuthenticated(): boolean {
        const token = AuthService.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expMs = payload.exp * 1000;
            return Date.now() < expMs;
        } catch {
            return false;
        }
    }

    static setAuthTokens(accessToken: string, refreshToken?: string): void {
        AuthService.setToken(accessToken);
        if (refreshToken) {
            AuthService.setRefreshToken(refreshToken);
        }
    }

    static clearAuth(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }

    static getAuthHeaders(): Record<string, string> {
        const token = AuthService.getToken();
        if (token) {
            return { Authorization: `Bearer ${token}` };
        }
        return {};
    }
}

export default AuthService;
