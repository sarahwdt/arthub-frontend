import axios from "axios";
import {AuthTokenImpl, useAuthStore} from "@/ts/stores/auth";
import vuetify from "@/ts/vuetify";
import env from "@/js/env"

const authStore = useAuthStore();

const api = axios.create({
    baseURL: env.VITE_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    timeout: 5000
})
api.interceptors.request.use(config => {
    config.headers['Accept-Language'] = vuetify.locale.current.value;
    config.headers['X-TimeZone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return config;
})

const apiPublic = axios.create({
    baseURL: env.VITE_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    timeout: 5000
})
apiPublic.interceptors.request.use(config => {
    config.headers['Accept-Language'] = vuetify.locale.current.value;
    config.headers['X-TimeZone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return config;
})

api.interceptors.request.use(async config => {
    if (authStore.isAuthenticated()) {
        config.headers.Authorization = `Bearer ${authStore.getAccessToken()}`;
    } else if (authStore.isLogged()) {
        await refresh()
            .then(() => config.headers.Authorization = `Bearer ${authStore.getAccessToken()}`);
    }
    return config;
})

api.interceptors.response.use(response => response, async error => {
    if (!error.response) throw error;

    const {status, data} = error.response;
    if (status === 401) {
        const originalRequest = error.config;
        authStore.clearToken();
        if (authStore.isLogged()) {
            return await refresh().then(ignore => api.request(originalRequest))
        }
    }
    if (status === 422) {
        error.fieldErrors = data?.errors || {};
        error.objectErrors = data?.objectErrors || [];
    }
    throw error;
});

async function refresh() {
    let response = await apiPublic.post(`/auth/refresh`, {refreshToken: authStore.getRefreshToken()});
    if (!response) {
        throw Error("Failed to load response");
    }
    if (response.status !== 200) {
        if (response.status === 401) {
            authStore.clearAuth();
        }
        throw Error("Failed to refresh");
    }
    if (!AuthTokenImpl.is(response.data)) {
        throw Error("Wrong format");
    }
    authStore.setAuth(response.data);
    return response.data;
}

export {
    apiPublic,
    api
}