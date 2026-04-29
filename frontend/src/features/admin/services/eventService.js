import apiClient from './api'

export const eventService = {
  list: (params) => apiClient.get('/admin/events/', { params }),
  get: (id) => apiClient.get(`/admin/events/${id}/`),
  create: (data) => apiClient.post('/admin/events/', data),
  update: (id, data) => apiClient.put(`/admin/events/${id}/`, data),
  delete: (id) => apiClient.delete(`/admin/events/${id}/`),
  getRegistrations: (eventId) => apiClient.get(`/admin/events/${eventId}/registrations/`),
  updateRegistration: (regId, data) => apiClient.patch(`/admin/events/registrations/${regId}/`, data),
}
