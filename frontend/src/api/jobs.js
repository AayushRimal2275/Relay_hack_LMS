import client from './client';

export const getJobs = (params = {}) => client.get('/api/jobs/', { params });
export const createJob = (data) => client.post('/api/jobs/', data);
export const updateJob = (id, data) => client.patch(`/api/jobs/${id}/`, data);
export const deleteJob = (id) => client.delete(`/api/jobs/${id}/`);
