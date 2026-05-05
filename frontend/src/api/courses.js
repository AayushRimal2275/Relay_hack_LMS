import client from '../../api/client';

export const getCourses = (params = {}) => client.get('/api/admin/courses/', { params });
export const getCourse = (id) => client.get(`/api/admin/courses/${id}/`);
export const createCourse = (data) => client.post('/api/admin/courses/', data);
export const updateCourse = (id, data) => client.patch(`/api/admin/courses/${id}/`, data);
export const deleteCourse = (id) => client.delete(`/api/admin/courses/${id}/`);
