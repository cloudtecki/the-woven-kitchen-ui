import axios from 'axios';
import { API_URL } from 'core/base/const/env';

const Axios = axios.create({
    baseURL: API_URL,
});

Axios.interceptors.request.use(async (config) => {
    //Add Bearer token to request headers
    // Enable the following code when authentication is set up
    // const token = await AuthService.getAuthToken([API_SCOPE]);
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});

export { Axios };