import { User } from '@prisma/client';

/**
 * Register a new user.
 * @param {User} user The user to register.
 * @returns {Promise<User>}
 */
export function register(user: Pick<User, 'firstname' | 'lastname' | 'email' | 'password'>): Promise<User> {
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
    body: JSON.stringify({
      id: user.id,
      email: user.email,
      lastname: user.lastname,
      firstname: user.firstname,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(response.statusText);
  });
}

/**
 * Change the user's avatar
 */
export function changeAvatar(file: File | null): Promise<User> {
  const form = new FormData();

  if (file) {
    form.append('avatar', file);
  }

  return fetch('/api/v1/users/me/avatar', {
    method: 'PATCH',
    body: form,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(response.statusText);
  });
}

/**
 * Update the user's password.
 * @param {Partial<User>} user The user to update.
 * @returns {Promise<User>}
 */
export function updatePassword(
  otp: User['otp'],
  email: User['email'],
  password: User['password']
): Promise<User> {
  return fetch('/api/v1/users/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      otp,
      password,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(response.statusText);
  });
}

export function requestOTP(email: User['email']): Promise<boolean> {
  return fetch('/api/v1/users/request-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(response.statusText);
  });
}

export function validateOTP(email: User['email'], otp: User['otp']): Promise<boolean> {
  return fetch('/api/v1/users/validate-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(response.statusText);
  });
}

export function forgottenPassword(email: User['email']): Promise<boolean> {
  return fetch('/api/v1/users/forgotten', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(response.statusText);
  });
}
