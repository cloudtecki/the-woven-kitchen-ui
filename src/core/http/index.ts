import axios from 'axios';
import { API_URL } from 'core/base/const/env';
import AuthService from './auth.service';

const Axios = axios.create({
    baseURL: API_URL,
});

Axios.interceptors.request.use(async (config) => {
    const headers = AuthService.getAuthHeaders();
    if (headers.Authorization) {
        config.headers.Authorization = headers.Authorization;
    }
    return config;
});

export { Axios };