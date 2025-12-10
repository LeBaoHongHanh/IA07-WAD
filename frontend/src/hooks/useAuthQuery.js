import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuth } from '../auth/hooks/useAuth';
import { tokenService } from '../services/tokenService';

export const useLoginMutation = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    }
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authApi.register
  });
};

export const useLogoutMutation = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = tokenService.getRefreshToken();
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    },
    onSettled: () => {
      logout();
      queryClient.removeQueries({ queryKey: ['me'] });
    }
  });
};

export const useMeQuery = (options = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
    ...options
  });
};
