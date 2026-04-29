import client from './client';

export const getJobs = () => client.get('/api/jobs/');
export const createJob = (data) => client.post('/api/jobs/', data);
export const updateJob = (id, data) => client.patch(`/api/jobs/${id}/`, data);
export const deleteJob = (id) => client.delete(`/api/jobs/${id}/`);
