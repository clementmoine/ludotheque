import { User } from '@prisma/client';

/**
 * Register a new user.
 * @param {User} user The user to register.
 * @returns {Promise<User>}
 */
export function register(user: User): Promise<User> {
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
export function logout(): Promise<Response> {
  return fetch('/api/v1/auth/logout', {
    method: 'GET',
  });
}

/**
 * Get the current user.
 * @returns {Promise<User>}
 */
export function me(): Promise<User> {
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
export function login(credentials: {
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
 * Update the user's profile.
 * @param {Partial<User>} user The user to update.
 * @returns {Promise<User>}
 */
export function updateProfile(user: Partial<User>): Promise<User> {
  return fetch('/api/v1/users/me', {
    method: 'PUT',
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
