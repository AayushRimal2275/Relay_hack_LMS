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

// Prospect pages
import PrivateRoute from './features/prospect/components/PrivateRoute';
import ProspectDashboard from './features/prospect/pages/Dashboard';
import ProspectCourses from './features/prospect/pages/Courses';
import CourseLearn from './features/prospect/pages/CourseLearn';
import QuizPage from './features/prospect/pages/QuizPage';
import ProspectJobs from './features/prospect/pages/Jobs';
import JobDetail from './features/prospect/pages/JobDetail';
import ProspectProfile from './features/prospect/pages/Profile';
import MyCourses from './features/prospect/pages/MyCourses';
import MyApplications from './features/prospect/pages/MyApplications';
import Certificates from './features/prospect/pages/Certificates';

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
      
      {/* Prospect routes */}
      <Route path="/learner" element={<PrivateRoute />}>
        <Route index element={<Navigate to="/learner/dashboard" replace />} />
        <Route path="dashboard" element={<ProspectDashboard />} />
        <Route path="courses" element={<ProspectCourses />} />
        <Route path="courses/:id/learn" element={<CourseLearn />} />
        <Route path="courses/:id/quiz" element={<QuizPage />} />
        <Route path="jobs" element={<ProspectJobs />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="profile" element={<ProspectProfile />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="my-applications" element={<MyApplications />} />
        <Route path="certificates" element={<Certificates />} />
      </Route>
      
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
