import apiClient from './api'

export const employerService = {
  list: (params) => apiClient.get('/admin/employers/', { params }),
  get: (id) => apiClient.get(`/admin/employers/${id}/`),
  create: (data) => apiClient.post('/admin/employers/', data),
  update: (id, data) => apiClient.put(`/admin/employers/${id}/`, data),
  delete: (id) => apiClient.delete(`/admin/employers/${id}/`),
}

export const jobService = {
  list: (params) => apiClient.get('/admin/jobs/', { params }),
  get: (id) => apiClient.get(`/admin/jobs/${id}/`),
  create: (data) => apiClient.post('/admin/jobs/', data),
  update: (id, data) => apiClient.put(`/admin/jobs/${id}/`, data),
  delete: (id) => apiClient.delete(`/admin/jobs/${id}/`),
}
