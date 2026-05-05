import client from '../../../api/client';

export const analyticsService = {
  getDashboard: () => client.get('/api/admin/dashboard-stats/'),
  getCourseAnalytics: () => client.get('/api/admin/analytics/courses/'),
  getEventAnalytics: () => client.get('/api/admin/analytics/events/'),
  getRevenueAnalytics: () => client.get('/api/admin/analytics/revenue/'),
};
