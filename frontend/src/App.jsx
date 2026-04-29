import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/admin/store/authStore'
import AdminLayout from '@/features/admin/components/AdminLayout'
import LoginPage from '@/features/admin/pages/LoginPage'
import DashboardPage from '@/features/admin/pages/DashboardPage'
import CoursesPage from '@/features/admin/pages/CoursesPage'
import EventsPage from '@/features/admin/pages/EventsPage'
import PaymentsPage from '@/features/admin/pages/PaymentsPage'
import UsersPage from '@/features/admin/pages/UsersPage'
import EmployersPage from '@/features/admin/pages/EmployersPage'
import AnalyticsPage from '@/features/admin/pages/AnalyticsPage'

function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="employers" element={<EmployersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
