import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from 'recharts'
import { analyticsService } from '../services/analyticsService'
import { formatCurrency } from '@/lib/utils'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16']

const CHART_STYLE = {
  tooltip: {
    contentStyle: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' },
    cursor: { fill: 'rgba(255,255,255,0.05)' },
  },
}

export default function AnalyticsPage() {
  const [courseData, setCourseData] = useState(null)
  const [eventData, setEventData] = useState(null)
  const [revenueData, setRevenueData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      analyticsService.getCourseAnalytics(),
      analyticsService.getEventAnalytics(),
      analyticsService.getRevenueAnalytics(),
    ]).then(([c, e, r]) => {
      setCourseData(c.data)
      setEventData(e.data)
      setRevenueData(r.data)
    }).catch((err) => {
      console.error('Analytics error:', err)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-400">Loading analytics…</div>
  }

  return (
    <div className="space-y-6">
      {/* Courses by Track */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-base font-semibold text-white mb-4">Courses by Track</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={courseData?.by_track || []} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="track" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip {...CHART_STYLE.tooltip} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Courses" />
              <Bar dataKey="enrollments" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Enrollments" />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-white mb-4">Courses by Level</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={courseData?.by_level || []}
                dataKey="count"
                nameKey="level"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ level, percent }) => `${level} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: '#475569' }}
              >
                {(courseData?.by_level || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Courses */}
      <div className="card">
        <h3 className="text-base font-semibold text-white mb-4">Top Courses by Enrollment</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={(courseData?.top_courses || []).slice(0, 8)} layout="vertical" barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis dataKey="title" type="category" width={160} tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip {...CHART_STYLE.tooltip} />
            <Bar dataKey="enrollment_count" fill="#10b981" radius={[0, 4, 4, 0]} name="Enrollments" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-base font-semibold text-white mb-4">Monthly Revenue ({new Date().getFullYear()})</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData?.monthly_revenue || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
                formatter={(v) => [formatCurrency(v), 'Revenue']}
              />
              <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-white mb-4">Revenue by Payment Method</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={revenueData?.by_method || []}
                dataKey="total"
                nameKey="payment_method"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ payment_method, percent }) => `${payment_method} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: '#475569' }}
              >
                {(revenueData?.by_method || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Events by type */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-base font-semibold text-white mb-4">Events by Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={eventData?.by_type || []} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="event_type" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => v.replace('_', ' ')} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip {...CHART_STYLE.tooltip} formatter={(v, n, p) => [v, 'Events']} />
              <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Events" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-white mb-4">Top Events by Registration</h3>
          <div className="space-y-2 overflow-y-auto max-h-52">
            {(eventData?.top_events || []).map((e, i) => (
              <div key={e.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-slate-500 w-5 text-right shrink-0">{i + 1}.</span>
                  <span className="text-slate-300 truncate">{e.title}</span>
                </div>
                <span className="text-blue-400 font-medium shrink-0 ml-2">{e.reg_count} regs</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
