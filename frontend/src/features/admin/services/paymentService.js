import client from '../../../api/client';

export const paymentService = {
  list: (params = {}) => client.get('/api/admin/payments/', { params }),
  getAll: (params = {}) => client.get('/api/admin/payments/', { params }),
  getById: (id) => client.get(`/api/admin/payments/${id}/`),
  create: (data) => client.post('/api/admin/payments/', data),
  update: (id, data) => client.patch(`/api/admin/payments/${id}/`, data),
  delete: (id) => client.delete(`/api/admin/payments/${id}/`),
};
