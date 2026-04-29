import apiClient from './api'

export const analyticsService = {
  getDashboard: () => apiClient.get('/admin/analytics/dashboard/'),
  getCourseAnalytics: () => apiClient.get('/admin/analytics/courses/'),
  getEventAnalytics: () => apiClient.get('/admin/analytics/events/'),
  getRevenueAnalytics: () => apiClient.get('/admin/analytics/revenue/'),
}
