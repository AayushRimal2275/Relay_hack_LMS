import client from '../../../api/client';

export const eventService = {
  list: (params = {}) => client.get('/api/admin/events/', { params }),
  getAll: (params = {}) => client.get('/api/admin/events/', { params }),
  getById: (id) => client.get(`/api/admin/events/${id}/`),
  create: (data) => client.post('/api/admin/events/', data),
  update: (id, data) => client.patch(`/api/admin/events/${id}/`, data),
  delete: (id) => client.delete(`/api/admin/events/${id}/`),
  getRegistrations: (eventId) => client.get('/api/admin/registrations/', { params: { event: eventId } }),
};
