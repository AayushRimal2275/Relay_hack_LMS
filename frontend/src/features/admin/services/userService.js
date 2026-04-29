import apiClient from './api'

export const userService = {
  list: (params) => apiClient.get('/admin/users/', { params }),
  get: (id) => apiClient.get(`/admin/users/${id}/`),
  update: (id, data) => apiClient.patch(`/admin/users/${id}/`, data),
}
