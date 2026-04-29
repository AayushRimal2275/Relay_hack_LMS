import client from './client';

export const login = (email, password) =>
  client.post('/api/auth/token/', { username: email, password });

export const registerEmployer = (data) =>
  client.post('/api/auth/employer/register/', data);

export const refreshToken = (refresh) =>
  client.post('/api/auth/token/refresh/', { refresh });
