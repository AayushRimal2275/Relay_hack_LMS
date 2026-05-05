import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { useCourseStore } from '../store/courseStore'
import { Table } from '../components/Table'
import { Modal } from '../components/Modal'
import { Badge, statusVariant } from '../components/Badge'
import { SearchInput, Select } from '../components/Filters'
import { formatCurrency, formatDate, truncate } from '@/lib/utils'

const TRACKS = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'fullstack', label: 'Full Stack' },
  { value: 'devops', label: 'DevOps' },
  { value: 'data', label: 'Data Science' },
  { value: 'design', label: 'Design' },
  { value: 'mobile', label: 'Mobile' },
]
const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

const EMPTY_FORM = {
  title: '', track: 'frontend', instructor_name: '', youtube_video_id: '',
  thumbnail_url: '', description: '', level: 'beginner',
  duration_hours: '', price: '', is_published: false,
}

export default function CoursesPage() {
  const { courses, total, loading, fetchCourses, createCourse, updateCourse, deleteCourse } = useCourseStore()
  const [search, setSearch] = useState('')
  const [track, setTrack] = useState('')
  const [level, setLevel] = useState('')
  const [modal, setModal] = useState({ open: false, editing: null })
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const load = () => fetchCourses({ search, track, level })

  useEffect(() => { load() }, [search, track, level])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setModal({ open: true, editing: null })
  }
  const openEdit = (course) => {
    setForm({ ...course, duration_hours: course.duration_hours, price: course.price })
    setModal({ open: true, editing: course.id })
  }
  const closeModal = () => setModal({ open: false, editing: null })

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modal.editing) {
        await updateCourse(modal.editing, form)
      } else {
        await createCourse(form)
      }
      closeModal()
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this course?')) return
    try {
      await deleteCourse(id)
      load()
    } catch {
      alert('Delete failed')
    }
  }

  const columns = [
    {
      key: 'thumbnail_url',
      label: '',
      render: (r) => r.thumbnail_url
        ? <img src={r.thumbnail_url} alt="" className="w-12 h-8 object-cover rounded" />
        : <div className="w-12 h-8 bg-slate-700 rounded" />,
    },
    { key: 'title', label: 'Title', render: (r) => <span className="font-medium text-white">{truncate(r.title, 35)}</span> },
    { key: 'track', label: 'Track', render: (r) => <Badge variant="blue">{r.track}</Badge> },
    { key: 'level', label: 'Level', render: (r) => <Badge variant="purple">{r.level}</Badge> },
    { key: 'instructor_name', label: 'Instructor' },
    { key: 'price', label: 'Price', render: (r) => formatCurrency(r.price) },
    { key: 'enrollment_count', label: 'Enrollments', render: (r) => r.enrollment_count.toLocaleString() },
    {
      key: 'is_published', label: 'Status',
      render: (r) => <Badge variant={r.is_published ? 'green' : 'slate'}>{r.is_published ? 'Published' : 'Draft'}</Badge>,
    },
    { key: 'created_at', label: 'Created', render: (r) => formatDate(r.created_at) },
    {
      key: 'actions', label: '',
      render: (r) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(r)} className="text-slate-400 hover:text-blue-400 transition-colors"><Pencil size={15} /></button>
          <button onClick={() => handleDelete(r.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ]

  const field = (key) => ({
    value: form[key] ?? '',
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  })

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search courses…" />
          <Select value={track} onChange={setTrack} options={TRACKS} placeholder="All tracks" />
          <Select value={level} onChange={setLevel} options={LEVELS} placeholder="All levels" />
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Course
        </button>
      </div>

      {/* Table */}
      <div className="card p-0">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="font-semibold text-white">Courses <span className="text-slate-400 font-normal text-sm">({total})</span></h2>
        </div>
        <Table columns={columns} data={courses} loading={loading} emptyMsg="No courses found" />
      </div>

      {/* Create / Edit Modal */}
      <Modal
        open={modal.open}
        onClose={closeModal}
        title={modal.editing ? 'Edit Course' : 'New Course'}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Title *</label>
            <input {...field('title')} className="input" placeholder="React Fundamentals" required />
          </div>
          <div>
            <label className="label">Track *</label>
            <select {...field('track')} className="input">
              {TRACKS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Level</label>
            <select {...field('level')} className="input">
              {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Instructor Name *</label>
            <input {...field('instructor_name')} className="input" placeholder="Jane Smith" />
          </div>
          <div>
            <label className="label">Price (NPR)</label>
            <input {...field('price')} type="number" min="0" className="input" placeholder="0" />
          </div>
          <div>
            <label className="label">YouTube Video ID</label>
            <input {...field('youtube_video_id')} className="input" placeholder="dQw4w9WgXcQ" />
          </div>
          <div>
            <label className="label">Duration (hours)</label>
            <input {...field('duration_hours')} type="number" min="0" className="input" placeholder="12" />
          </div>
          <div className="col-span-2">
            <label className="label">Thumbnail URL</label>
            <input {...field('thumbnail_url')} className="input" placeholder="https://…" />
          </div>
          <div className="col-span-2">
            <label className="label">Description</label>
            <textarea
              {...field('description')}
              className="input resize-none"
              rows={3}
              placeholder="Course description…"
            />
          </div>
          <div className="col-span-2 flex items-center gap-3">
            <input
              id="is_published"
              type="checkbox"
              checked={!!form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <label htmlFor="is_published" className="text-sm text-slate-300">Publish immediately</label>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={closeModal} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Saving…' : modal.editing ? 'Update' : 'Create'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
