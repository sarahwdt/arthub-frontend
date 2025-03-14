import {defineStore} from "@/ts/store";
import {ref, Ref} from "vue";

export interface AuthToken {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    authorities: string[];
}

export class AuthTokenImpl implements AuthToken {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    authorities: string[];

    constructor(accessToken: string, refreshToken: string, expiresIn: number, authorities: string[]) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.authorities = authorities;
    }

    static is(obj: any): obj is AuthTokenImpl {
        return (
            typeof obj === 'object' &&
            typeof obj['accessToken'] === 'string' &&
            typeof obj['refreshToken'] === 'string' &&
            typeof obj['expiresIn'] === 'number' &&
            typeof Array.isArray(obj['authorities'])
        ) && obj
    }
}

export const useAuthStore = defineStore('auth', () => {
    const auth: Ref<AuthToken, AuthToken> = ref({
        accessToken: null,
        refreshToken: null,
        expiresIn: null,
        authorities: []
    })

    function isLogged() {
        return !!auth.value?.refreshToken;
    }

    function isAuthenticated() {
        return !!auth.value?.accessToken;
    }

    function clearAuth() {
        auth.value = null;
    }

    function clearToken() {
        auth.value.accessToken = null;
    }

    function setAuth(newToken: AuthToken) {
        auth.value = {...newToken};
    }

    function getRefreshToken() {
        return auth.value.refreshToken;
    }

    function getAccessToken() {
        return auth.value?.accessToken;
    }

    function getAuthorities() {
        return auth.value.authorities;
    }

    return {
        setAuth, clearAuth, getRefreshToken, isLogged, isAuthenticated, clearToken, getAccessToken, getAuthorities
    }
})