import client from './client';

export const getApplications = () => client.get('/api/applications/');
export const applyForJob = (jobId) => client.post('/api/applications/', { job: jobId });
export const updateApplication = (id, data) => client.patch(`/api/applications/${id}/`, data);
