import apiClient from './api'

export const paymentService = {
  list: (params) => apiClient.get('/admin/payments/', { params }),
  get: (id) => apiClient.get(`/admin/payments/${id}/`),
  create: (data) => apiClient.post('/admin/payments/', data),
  update: (id, data) => apiClient.put(`/admin/payments/${id}/`, data),
  delete: (id) => apiClient.delete(`/admin/payments/${id}/`),
}
