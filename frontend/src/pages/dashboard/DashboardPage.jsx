import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Briefcase, Users, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { getJobs } from '../../api/jobs';
import { getApplications } from '../../api/applications';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

const STATUS_COLORS = {
  APPLIED: '#6B7280',
  SHORTLISTED: '#3B82F6',
  INTERVIEW: '#EAB308',
  HIRED: '#00C48C',
  REJECTED: '#EF4444',
};

export default function DashboardPage() {
  const { companyName } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([getJobs(), getApplications()]);
        setJobs(jobsRes.data || []);
        setApplications(appsRes.data || []);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const statusCounts = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'HIRED', 'REJECTED'].map((status) => ({
    status,
    count: applications.filter((a) => a.status === status).length,
  }));

  const hiredCount = applications.filter((a) => a.status === 'HIRED').length;
  const activeJobs = jobs.filter((j) => j.is_active).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" className="text-brand-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back{companyName ? `, ${companyName}` : ''}! 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here&apos;s what&apos;s happening with your hiring pipeline</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Jobs', value: jobs.length, icon: Briefcase, color: 'text-blue-400' },
          { label: 'Active Jobs', value: activeJobs, icon: Briefcase, color: 'text-brand-accent' },
          { label: 'Total Applications', value: applications.length, icon: FileText, color: 'text-yellow-400' },
          { label: 'Hired', value: hiredCount, icon: CheckCircle, color: 'text-brand-accent' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-brand-bg ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-white mb-4">Applications by Status</h2>
          {applications.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No applications yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={statusCounts} barCategoryGap="30%">
                <XAxis dataKey="status" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {statusCounts.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-white mb-4">Quick Links</h2>
          <div className="space-y-2">
            {[
              { to: '/talent-pool', label: 'Browse Talent Pool', icon: Users },
              { to: '/jobs', label: 'Manage Jobs', icon: Briefcase },
              { to: '/applications', label: 'View Applications', icon: FileText },
            ].map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-brand-bg hover:bg-[#1a1a1a] border border-brand-border hover:border-brand-accent/30 transition-colors group"
              >
                <div className="flex items-center gap-3 text-sm text-gray-300 group-hover:text-white">
                  <Icon size={16} className="text-brand-accent" />
                  {label}
                </div>
                <ArrowRight size={14} className="text-gray-500 group-hover:text-brand-accent transition-colors" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
