import apiClient from './api'

export const authService = {
  login: (credentials) => apiClient.post('/auth/login/', credentials),
  logout: () => apiClient.post('/auth/logout/'),
  refresh: (refresh) => apiClient.post('/auth/refresh/', { refresh }),
}
