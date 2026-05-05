import client from '../../../api/client';

export const courseService = {
  list: (params = {}) => client.get('/api/admin/courses/', { params }),
  getAll: (params = {}) => client.get('/api/admin/courses/', { params }),
  getById: (id) => client.get(`/api/admin/courses/${id}/`),
  create: (data) => client.post('/api/admin/courses/', data),
  update: (id, data) => client.patch(`/api/admin/courses/${id}/`, data),
  delete: (id) => client.delete(`/api/admin/courses/${id}/`),
};
