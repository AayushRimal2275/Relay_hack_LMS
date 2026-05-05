import client from '../../api/client';

export const getEvents = (params = {}) => client.get('/api/admin/events/', { params });
export const getEvent = (id) => client.get(`/api/admin/events/${id}/`);
export const createEvent = (data) => client.post('/api/admin/events/', data);
export const updateEvent = (id, data) => client.patch(`/api/admin/events/${id}/`, data);
export const deleteEvent = (id) => client.delete(`/api/admin/events/${id}/`);
