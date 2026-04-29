import client from './client';

export const getMyCompany = () => client.get('/api/companies/');

export const updateCompany = (id, data) => client.patch(`/api/companies/${id}/`, data);
