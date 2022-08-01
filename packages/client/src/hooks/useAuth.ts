import { User } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Register a new user.
 * @param {User} user The user to register.
 * @returns {Promise<User>}
 */
function register(user: User): Promise<User> {
  return fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(response.statusText);
  });
}

/**
 * Logout the user.
 * @returns {Promise<Response>}
 */
function logout(): Promise<Response> {
  return fetch('/api/v1/auth/logout', {
    method: 'GET',
  });
}

/**
 * Get the current user.
 * @returns {Promise<User>}
 */
function me(): Promise<User> {
  return fetch('/api/v1/users/me', {
    method: 'GET',
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }

    return Promise.reject(response.statusText);
  });
}

/**
 * Register a new user.
 * @param {Object} credentials The user credentials.
 * @param {User['username' | 'email']} credentials.username The username or email.
 * @param {User['password']} credentials.password The password.
 * @returns {Promise<User>}
 */
function login(credentials: {
  login: User['username' | 'email'];
  password: User['password'];
}): Promise<User> {
  return fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(response.statusText);
  });
}

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

    user,
    error,
    status,
  };
}
