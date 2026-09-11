export enum APIEndpoints {
    SIGNUP = '/api/auth/signup',
    LOGIN = '/api/auth/login',
    GET_CURRENT_USER = '/api/users/me',
    GET_USER = '/user',
    GET_USER_BY_ID = '/user/{userId}',
    UPDATE_USER = '/user/{userId}/update',
    DELETE_USER = '/user/{userId}/delete',
    CREATE_USER = '/user/create',
    GET_PRODUCTS = 'https://api.escuelajs.co/api/v1/products',
    GET_HEALTH = '/api/health',
}

export enum HttpStatusCodes {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export const enum ApiStatus {
    DEFAULT = 1,
    LOADING,
    SUCCESS,
    ERROR,
}

export const enum QueryParams {
    SEARCH_STRING = 'searchString'
}