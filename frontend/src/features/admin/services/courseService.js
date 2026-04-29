import apiClient from './api'

export const courseService = {
  list: (params) => apiClient.get('/admin/courses/', { params }),
  get: (id) => apiClient.get(`/admin/courses/${id}/`),
  create: (data) => apiClient.post('/admin/courses/', data),
  update: (id, data) => apiClient.put(`/admin/courses/${id}/`, data),
  delete: (id) => apiClient.delete(`/admin/courses/${id}/`),
}
