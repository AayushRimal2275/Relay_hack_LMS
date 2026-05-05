import { useEffect, useState } from 'react'
import { Users, BookOpen, Calendar, CreditCard, Building2, Briefcase, TrendingUp, DollarSign } from 'lucide-react'
import { analyticsService } from '../services/analyticsService'
import { StatCard } from '../components/StatCard'
import { Badge, statusVariant } from '../components/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsService.getDashboard()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        Loading dashboard…
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.total_users.toLocaleString()} icon={Users} color="blue" trend="Active learners" />
        <StatCard label="Courses" value={stats.total_courses} icon={BookOpen} color="purple" trend={`${stats.published_courses} published`} />
        <StatCard label="Events" value={stats.total_events} icon={Calendar} color="green" trend={`${stats.upcoming_events} upcoming`} />
        <StatCard label="Revenue" value={formatCurrency(stats.total_revenue)} icon={DollarSign} color="orange" trend="Completed payments" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Employers" value={stats.total_employers} icon={Building2} color="yellow" />
        <StatCard label="Open Jobs" value={stats.total_job_postings} icon={Briefcase} color="red" />
        <StatCard label="Enrollments" value={stats.total_enrollments.toLocaleString()} icon={TrendingUp} color="green" />
        <StatCard label="Upcoming Events" value={stats.upcoming_events} icon={Calendar} color="blue" />
      </div>

      {/* Recent Payments */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4">Recent Payments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                {['Transaction', 'User', 'Course', 'Amount', 'Method', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recent_payments.map((p) => (
                <tr key={p.id} className="border-b border-slate-700/40 hover:bg-slate-700/30 transition-colors">
                  <td className="px-3 py-2.5 text-slate-300 font-mono text-xs">{p.transaction_id}</td>
                  <td className="px-3 py-2.5 text-slate-300">{p.user_username}</td>
                  <td className="px-3 py-2.5 text-slate-400">{p.course_title || '—'}</td>
                  <td className="px-3 py-2.5 text-white font-medium">{formatCurrency(p.amount, p.currency)}</td>
                  <td className="px-3 py-2.5 text-slate-400 capitalize">{p.payment_method?.replace('_', ' ')}</td>
                  <td className="px-3 py-2.5">
                    <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
                  </td>
                  <td className="px-3 py-2.5 text-slate-400">{formatDate(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
