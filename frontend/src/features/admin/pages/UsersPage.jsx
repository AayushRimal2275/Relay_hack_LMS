import { useEffect, useState } from 'react'
import { userService } from '../services/userService'
import { Table } from '../components/Table'
import { Badge } from '../components/Badge'
import { SearchInput } from '../components/Filters'
import { formatDate } from '@/lib/utils'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await userService.list({ search })
      const payload = res.data.data
      setUsers(payload.results ?? payload)
      setTotal(payload.count ?? (payload.results ?? payload).length)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [search])

  const toggleActive = async (user) => {
    try {
      await userService.update(user.id, { is_active: !user.is_active })
      load()
    } catch {
      alert('Update failed')
    }
  }

  const columns = [
    {
      key: 'avatar',
      label: '',
      render: (r) => (
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
          {(r.full_name || r.username)[0]?.toUpperCase()}
        </div>
      ),
    },
    { key: 'full_name', label: 'Name', render: (r) => <span className="font-medium text-white">{r.full_name}</span> },
    { key: 'username', label: 'Username', render: (r) => <span className="text-slate-400">@{r.username}</span> },
    { key: 'email', label: 'Email' },
    {
      key: 'learner_profile',
      label: 'Skills',
      render: (r) => (
        <div className="flex gap-1 flex-wrap">
          {r.learner_profile?.skills?.slice(0, 2).map((s) => (
            <Badge key={s} variant="blue">{s}</Badge>
          ))}
          {(r.learner_profile?.skills?.length || 0) > 2 && (
            <Badge variant="slate">+{r.learner_profile.skills.length - 2}</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'is_active', label: 'Status',
      render: (r) => <Badge variant={r.is_active ? 'green' : 'red'}>{r.is_active ? 'Active' : 'Inactive'}</Badge>,
    },
    { key: 'date_joined', label: 'Joined', render: (r) => formatDate(r.date_joined) },
    {
      key: 'actions', label: '',
      render: (r) => (
        <button
          onClick={() => toggleActive(r)}
          className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
            r.is_active
              ? 'text-red-400 border-red-500/30 hover:bg-red-500/10'
              : 'text-green-400 border-green-500/30 hover:bg-green-500/10'
          }`}
        >
          {r.is_active ? 'Deactivate' : 'Activate'}
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search users…" />
      </div>
      <div className="card p-0">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="font-semibold text-white">Learners <span className="text-slate-400 font-normal text-sm">({total})</span></h2>
        </div>
        <Table columns={columns} data={users} loading={loading} emptyMsg="No users found" />
      </div>
    </div>
  )
}
