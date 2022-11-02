import { User } from '@prisma/client';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { me, login, logout, register, updateProfile, changeAvatar } from 'services/auth';

/**
 * Hook to get the current user.
 */
export default function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    error,
    status,
    isLoading,
    refetch,
  } = useQuery<User, Error>({
    queryKey: ['user'],
    queryFn: me,
    retry: false,
  });

  const navigate = useNavigate();

  const setUser = useCallback((user: User) => queryClient.setQueryData(['user'], user), [queryClient]);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setUser(user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();

      navigate('/login');
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (user) => {
      setUser(user);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      setUser(user);
    },
  });

  const changeAvatarMutation = useMutation({
    mutationFn: changeAvatar,
    onSuccess: (user) => {
      setUser(user);
    },
  });

  return {
    // Login the user.
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isLoading,

    // Logout the user.
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isLoading,

    // Register a new user.
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isLoading,

    // Get the current user.
    refetch,
    isLoading,

    // Update the profile.
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isLoading,

    // Change avatar
    changeAvatar: changeAvatarMutation.mutateAsync,
    isChangingAvatar: changeAvatarMutation.isLoading,

    user,
    error,
    status,
  };
}
