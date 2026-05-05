import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
import { useEventStore } from '../store/eventStore'
import { eventService } from '../services/eventService'
import { Table } from '../components/Table'
import { Modal } from '../components/Modal'
import { Badge, statusVariant } from '../components/Badge'
import { SearchInput, Select } from '../components/Filters'
import { formatDateTime, formatDate, truncate } from '@/lib/utils'

const EVENT_TYPES = [
  { value: 'workshop', label: 'Workshop' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'career_fair', label: 'Career Fair' },
  { value: 'bootcamp', label: 'Bootcamp' },
  { value: 'networking', label: 'Networking' },
]
const STATUSES = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const EMPTY_FORM = {
  title: '', description: '', event_type: 'workshop', status: 'upcoming',
  start_date: '', end_date: '', location: '', is_online: false,
  meeting_url: '', max_capacity: 100, banner_url: '',
}

export default function EventsPage() {
  const { events, total, loading, fetchEvents, createEvent, updateEvent, deleteEvent } = useEventStore()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [modal, setModal] = useState({ open: false, editing: null })
  const [regModal, setRegModal] = useState({ open: false, event: null, registrations: [] })
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const load = () => fetchEvents({ search, status })
  useEffect(() => { load() }, [search, status])

  const openEdit = (event) => {
    setForm({
      ...event,
      start_date: event.start_date?.slice(0, 16) || '',
      end_date: event.end_date?.slice(0, 16) || '',
    })
    setModal({ open: true, editing: event.id })
  }
  const openCreate = () => {
    setForm(EMPTY_FORM)
    setModal({ open: true, editing: null })
  }

  const openRegistrations = async (event) => {
    try {
      const res = await eventService.getRegistrations(event.id)
      setRegModal({ open: true, event, registrations: res.data.data })
    } catch {
      alert('Failed to load registrations')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modal.editing) await updateEvent(modal.editing, form)
      else await createEvent(form)
      setModal({ open: false, editing: null })
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return
    try { await deleteEvent(id); load() }
    catch { alert('Delete failed') }
  }

  const field = (key) => ({
    value: form[key] ?? '',
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  })

  const columns = [
    { key: 'title', label: 'Title', render: (r) => <span className="font-medium text-white">{truncate(r.title, 35)}</span> },
    { key: 'event_type', label: 'Type', render: (r) => <Badge variant="blue">{r.event_type.replace('_', ' ')}</Badge> },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={statusVariant[r.status]}>{r.status}</Badge> },
    { key: 'start_date', label: 'Date', render: (r) => formatDateTime(r.start_date) },
    { key: 'is_online', label: 'Mode', render: (r) => <Badge variant={r.is_online ? 'green' : 'slate'}>{r.is_online ? 'Online' : 'In-person'}</Badge> },
    { key: 'registration_count', label: 'Registered', render: (r) => `${r.registration_count} / ${r.max_capacity}` },
    {
      key: 'actions', label: '',
      render: (r) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openRegistrations(r)} className="text-slate-400 hover:text-green-400 transition-colors" title="View registrations"><Users size={15} /></button>
          <button onClick={() => openEdit(r)} className="text-slate-400 hover:text-blue-400 transition-colors"><Pencil size={15} /></button>
          <button onClick={() => handleDelete(r.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ]

  const regColumns = [
    { key: 'learner_full_name', label: 'Name' },
    { key: 'learner_username', label: 'Username' },
    { key: 'learner_email', label: 'Email' },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={statusVariant[r.status]}>{r.status}</Badge> },
    { key: 'registered_at', label: 'Registered', render: (r) => formatDate(r.registered_at) },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search events…" />
          <Select value={status} onChange={setStatus} options={STATUSES} placeholder="All statuses" />
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Event
        </button>
      </div>

      <div className="card p-0">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="font-semibold text-white">Events <span className="text-slate-400 font-normal text-sm">({total})</span></h2>
        </div>
        <Table columns={columns} data={events} loading={loading} emptyMsg="No events found" />
      </div>

      {/* Create / Edit */}
      <Modal open={modal.open} onClose={() => setModal({ open: false, editing: null })} title={modal.editing ? 'Edit Event' : 'New Event'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Title *</label>
            <input {...field('title')} className="input" placeholder="React Workshop 2024" />
          </div>
          <div>
            <label className="label">Type</label>
            <select {...field('event_type')} className="input">
              {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select {...field('status')} className="input">
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Start Date *</label>
            <input {...field('start_date')} type="datetime-local" className="input" />
          </div>
          <div>
            <label className="label">End Date *</label>
            <input {...field('end_date')} type="datetime-local" className="input" />
          </div>
          <div>
            <label className="label">Location</label>
            <input {...field('location')} className="input" placeholder="Kathmandu, Nepal" />
          </div>
          <div>
            <label className="label">Max Capacity</label>
            <input {...field('max_capacity')} type="number" min="1" className="input" />
          </div>
          <div className="col-span-2">
            <label className="label">Meeting URL (if online)</label>
            <input {...field('meeting_url')} className="input" placeholder="https://meet.google.com/…" />
          </div>
          <div className="col-span-2">
            <label className="label">Banner URL</label>
            <input {...field('banner_url')} className="input" placeholder="https://…" />
          </div>
          <div className="col-span-2">
            <label className="label">Description</label>
            <textarea {...field('description')} className="input resize-none" rows={3} />
          </div>
          <div className="col-span-2 flex items-center gap-3">
            <input
              id="is_online"
              type="checkbox"
              checked={!!form.is_online}
              onChange={(e) => setForm({ ...form, is_online: e.target.checked })}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <label htmlFor="is_online" className="text-sm text-slate-300">Online event</label>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModal({ open: false, editing: null })} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Saving…' : modal.editing ? 'Update' : 'Create'}
          </button>
        </div>
      </Modal>

      {/* Registrations Modal */}
      <Modal
        open={regModal.open}
        onClose={() => setRegModal({ open: false, event: null, registrations: [] })}
        title={`Registrations — ${regModal.event?.title || ''}`}
        size="xl"
      >
        <Table columns={regColumns} data={regModal.registrations} loading={false} emptyMsg="No registrations yet" />
      </Modal>
    </div>
  )
}
