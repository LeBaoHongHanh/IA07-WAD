import axios from 'axios';
import { tokenService } from '../services/tokenService';
import { handleApiError } from '../utils/handleApiError';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = tokenService.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshPromise = null;

async function refreshAccessToken() {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  const refreshToken = tokenService.getRefreshToken();
  if (!refreshToken) {
    isRefreshing = false;
    throw new Error('No refresh token');
  }

  const base = API_BASE_URL || '';
  refreshPromise = axios
    .post(`${base}/auth/refresh`, { refreshToken })
    .then((res) => {
      const newAccessToken = res.data.accessToken;
      tokenService.setAccessToken(newAccessToken);
      return newAccessToken;
    })
    .catch((err) => {
      tokenService.clearTokens();
      window.location.href = '/login';
      throw err;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(handleApiError(error));
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken();
        const accessToken = tokenService.getAccessToken();
        if (accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return axiosClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(handleApiError(refreshError));
      }
    }

    return Promise.reject(handleApiError(error));
  }
);

export { axiosClient };
