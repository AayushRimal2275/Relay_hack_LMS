import { useEffect, useState } from 'react'
import { usePaymentStore } from '../store/paymentStore'
import { Table } from '../components/Table'
import { Badge, statusVariant } from '../components/Badge'
import { SearchInput, Select } from '../components/Filters'
import { formatCurrency, formatDate } from '@/lib/utils'

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
]
const METHODS = [
  { value: 'card', label: 'Card' },
  { value: 'esewa', label: 'eSewa' },
  { value: 'khalti', label: 'Khalti' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
]

export default function PaymentsPage() {
  const { payments, total, loading, fetchPayments, updatePayment } = usePaymentStore()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [method, setMethod] = useState('')

  const load = () => fetchPayments({ search, status, payment_method: method })
  useEffect(() => { load() }, [search, status, method])

  const handleStatusChange = async (payment, newStatus) => {
    try {
      await updatePayment(payment.id, { status: newStatus })
      load()
    } catch {
      alert('Update failed')
    }
  }

  // Summary stats
  const completed = payments.filter((p) => p.status === 'completed')
  const totalRevenue = completed.reduce((s, p) => s + Number(p.amount), 0)

  const columns = [
    { key: 'transaction_id', label: 'Transaction ID', render: (r) => <span className="font-mono text-xs text-slate-300">{r.transaction_id}</span> },
    { key: 'user_username', label: 'User' },
    { key: 'course_title', label: 'Course', render: (r) => r.course_title || '—' },
    { key: 'amount', label: 'Amount', render: (r) => <span className="font-medium text-white">{formatCurrency(r.amount, r.currency)}</span> },
    { key: 'payment_method', label: 'Method', render: (r) => r.payment_method?.replace('_', ' ') },
    {
      key: 'status', label: 'Status',
      render: (r) => (
        <select
          value={r.status}
          onChange={(e) => handleStatusChange(r, e.target.value)}
          className="bg-transparent border-none text-xs cursor-pointer"
          style={{ color: 'inherit' }}
          onClick={(e) => e.stopPropagation()}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value} className="bg-slate-800">{s.label}</option>
          ))}
        </select>
      ),
    },
    { key: 'created_at', label: 'Date', render: (r) => formatDate(r.created_at) },
  ]

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', val: total, color: 'text-white' },
          { label: 'Completed', val: completed.length, color: 'text-green-400' },
          { label: 'Pending', val: payments.filter((p) => p.status === 'pending').length, color: 'text-yellow-400' },
          { label: 'Revenue', val: formatCurrency(totalRevenue), color: 'text-blue-400' },
        ].map(({ label, val, color }) => (
          <div key={label} className="card py-4">
            <p className="text-xs text-slate-400">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search transaction ID…" />
        <Select value={status} onChange={setStatus} options={STATUSES} placeholder="All statuses" />
        <Select value={method} onChange={setMethod} options={METHODS} placeholder="All methods" />
      </div>

      <div className="card p-0">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="font-semibold text-white">Payments <span className="text-slate-400 font-normal text-sm">({total})</span></h2>
        </div>
        <Table columns={columns} data={payments} loading={loading} emptyMsg="No payments found" />
      </div>
    </div>
  )
}
