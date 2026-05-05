import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Calendar, CreditCard,
  Users, Building2, BarChart2, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
  { to: '/admin/events', icon: Calendar, label: 'Events' },
  { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/employers', icon: Building2, label: 'Employers' },
  { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-700">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">Leapfrog</p>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Version */}
      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">Leapfrog Connect v0.1</p>
      </div>
    </aside>
  )
}
