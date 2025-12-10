import { axiosClient } from './axiosClient';

export const authApi = {
  login(payload) {
    return axiosClient.post('/auth/login', payload).then((res) => res.data);
  },
  register(payload) {
    return axiosClient.post('/auth/register', payload).then((res) => res.data);
  },
  logout(refreshToken) {
    return axiosClient.post('/auth/logout', { refreshToken }).then((res) => res.data);
  },
  getMe() {
    return axiosClient.get('/me').then((res) => res.data);
  }
};
