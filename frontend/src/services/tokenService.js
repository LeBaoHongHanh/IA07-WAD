const REFRESH_TOKEN_KEY = 'jwt_demo_refresh_token';

let accessTokenMemory = null;

export const tokenService = {
  getAccessToken() {
    return accessTokenMemory;
  },
  setAccessToken(token) {
    accessTokenMemory = token || null;
  },
  getRefreshToken() {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken(token) {
    if (typeof window === 'undefined') return;
    if (token) {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
  clearTokens() {
    accessTokenMemory = null;
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }
};
