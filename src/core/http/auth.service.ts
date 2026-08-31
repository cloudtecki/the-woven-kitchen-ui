import { PublicClientApplication } from '@azure/msal-browser';

export class AuthService {
    private static getToken: (scopes: string[]) => Promise<string>;
    private static msalInstance: PublicClientApplication;
    private static mode: 'callback' | 'msalInstance' | undefined;

    //Use this method when running as an MFE remote to register a callback function that will be used to get the access token
    static registerCallback(getToken: (scopes: string[]) => Promise<string>) {
        AuthService.getToken = getToken;
        AuthService.mode = 'callback';
    }

    //Use this method when running as a Standalone app to register the MSAL instance that will be used to get the access token
    static registerMSAL(msalInstance: PublicClientApplication) {
        AuthService.msalInstance = msalInstance;
        AuthService.mode = 'msalInstance';
    }

    static async getAuthToken(scopes: string[]): Promise<string> {
        switch (AuthService.mode) {
            case 'callback':
                return AuthService.getToken(scopes);
            case 'msalInstance': {
                const accounts = AuthService.msalInstance.getAllAccounts();
                if (!accounts || accounts.length === 0) {
                    throw new Error('No accounts found. Please sign in first.');
                }
                return AuthService.msalInstance
                    .acquireTokenSilent({
                        scopes: scopes,
                        account: accounts[0],
                    })
                    .then((response) => response.accessToken);
            }
            default:
                throw new Error('AuthService not initialized');
        }
    }

    static async logout() {
        if (AuthService.mode === 'msalInstance') {
            AuthService.msalInstance.logoutRedirect({
                onRedirectNavigate: () => true,
                postLogoutRedirectUri: '/',
            });
        }
    }

    static async login() {
        if (AuthService.mode === 'msalInstance') {
            AuthService.msalInstance.loginRedirect();
        }
    }
}

export default AuthService;