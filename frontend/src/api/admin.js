import client from '../../api/client';

export const getPayments = (params = {}) => client.get('/api/admin/payments/', { params });
export const getPayment = (id) => client.get(`/api/admin/payments/${id}/`);
export const createPayment = (data) => client.post('/api/admin/payments/', data);
export const updatePayment = (id, data) => client.patch(`/api/admin/payments/${id}/`, data);
export const deletePayment = (id) => client.delete(`/api/admin/payments/${id}/`);
export const getDashboardStats = () => client.get('/api/admin/dashboard-stats/');
