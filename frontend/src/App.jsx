import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import RegisterEmployerPage from './pages/auth/RegisterEmployerPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import TalentPoolPage from './pages/talent-pool/TalentPoolPage';
import JobsPage from './pages/jobs/JobsPage';
import ApplicationsPage from './pages/applications/ApplicationsPage';

// Admin pages
import AdminLayout from './features/admin/components/AdminLayout';
import AdminDashboard from './features/admin/pages/DashboardPage';
import CoursesPage from './features/admin/pages/CoursesPage';
import EventsPage from './features/admin/pages/EventsPage';
import EmployersPage from './features/admin/pages/EmployersPage';
import PaymentsPage from './features/admin/pages/PaymentsPage';
import UsersPage from './features/admin/pages/UsersPage';
import AnalyticsPage from './features/admin/pages/AnalyticsPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function AdminProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AdminLayout><Outlet /></AdminLayout>;
}

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterEmployerPage />} />
      
      {/* Employer routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/talent-pool" element={<ProtectedRoute><TalentPoolPage /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
      <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<AdminProtectedRoute />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="employers" element={<EmployersPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
