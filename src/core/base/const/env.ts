import { getAppEnv } from "utils/env-vars";
const DEFAULT_SCOPE = './default-scope';

export const API_SCOPE = getAppEnv().apiScope + DEFAULT_SCOPE;
export const API_URL = getAppEnv().apiUrl;
export const CLIENT_ID = getAppEnv().clientId;
export const AUTHORITY = getAppEnv().authority;