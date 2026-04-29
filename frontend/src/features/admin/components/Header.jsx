import { useLocation } from 'react-router-dom'
import { LogOut, Bell } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/courses': 'Course Management',
  '/events': 'Event Management',
  '/payments': 'Payments',
  '/users': 'User Management',
  '/employers': 'Employers & Jobs',
  '/analytics': 'Analytics',
}

export default function Header() {
  const { pathname } = useLocation()
  const { user, logout } = useAuthStore()
  const title = PAGE_TITLES[pathname] || 'Admin Panel'

  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 px-6 flex items-center justify-between shrink-0">
      <h1 className="text-lg font-semibold text-white">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full text-xs flex items-center justify-center text-white">3</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
            {user?.full_name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white leading-none">{user?.full_name || 'Admin'}</p>
            <p className="text-xs text-slate-400">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-slate-400 hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
