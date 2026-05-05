import client from '../../../api/client';

export const employerService = {
  getAll: (params = {}) => client.get('/api/companies/', { params }),
  getById: (id) => client.get(`/api/companies/${id}/`),
  update: (id, data) => client.patch(`/api/companies/${id}/`, data),
};

// Also export as jobService for compatibility
export const jobService = {
  getAll: (params = {}) => client.get('/api/jobs/', { params }),
  getById: (id) => client.get(`/api/jobs/${id}/`),
  create: (data) => client.post('/api/jobs/', data),
  update: (id, data) => client.patch(`/api/jobs/${id}/`, data),
  delete: (id) => client.delete(`/api/jobs/${id}/`),
};
