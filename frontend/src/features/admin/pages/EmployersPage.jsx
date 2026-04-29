import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react'
import { employerService, jobService } from '../services/employerService'
import { Table } from '../components/Table'
import { Modal } from '../components/Modal'
import { Badge, statusVariant } from '../components/Badge'
import { SearchInput } from '../components/Filters'
import { formatDate, truncate } from '@/lib/utils'

const EMPTY_EMP = { company_name: '', industry: '', website: '', logo_url: '', contact_email: '', contact_name: '', is_active: true }
const EMPTY_JOB = { employer: '', title: '', description: '', required_skills: '', job_type: 'full_time', location: '', is_remote: false, salary_min: '', salary_max: '', status: 'open' }

export default function EmployersPage() {
  const [employers, setEmployers] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('employers')
  const [empModal, setEmpModal] = useState({ open: false, editing: null })
  const [jobModal, setJobModal] = useState({ open: false, editing: null })
  const [empForm, setEmpForm] = useState(EMPTY_EMP)
  const [jobForm, setJobForm] = useState(EMPTY_JOB)
  const [saving, setSaving] = useState(false)

  const loadAll = async () => {
    setLoading(true)
    try {
      const [eRes, jRes] = await Promise.all([
        employerService.list({ search }),
        jobService.list(),
      ])
      setEmployers(eRes.data.data.results ?? eRes.data.data)
      setJobs(jRes.data.data.results ?? jRes.data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadAll() }, [search])

  const empField = (key) => ({ value: empForm[key] ?? '', onChange: (e) => setEmpForm({ ...empForm, [key]: e.target.value }) })
  const jobField = (key) => ({ value: jobForm[key] ?? '', onChange: (e) => setJobForm({ ...jobForm, [key]: e.target.value }) })

  const saveEmployer = async () => {
    setSaving(true)
    try {
      if (empModal.editing) await employerService.update(empModal.editing, empForm)
      else await employerService.create(empForm)
      setEmpModal({ open: false, editing: null })
      loadAll()
    } catch (err) { alert(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const saveJob = async () => {
    setSaving(true)
    try {
      const payload = {
        ...jobForm,
        required_skills: typeof jobForm.required_skills === 'string'
          ? jobForm.required_skills.split(',').map((s) => s.trim()).filter(Boolean)
          : jobForm.required_skills,
      }
      if (jobModal.editing) await jobService.update(jobModal.editing, payload)
      else await jobService.create(payload)
      setJobModal({ open: false, editing: null })
      loadAll()
    } catch (err) { alert(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const deleteEmployer = async (id) => {
    if (!confirm('Delete employer?')) return
    try { await employerService.delete(id); loadAll() }
    catch { alert('Delete failed') }
  }

  const deleteJob = async (id) => {
    if (!confirm('Delete job?')) return
    try { await jobService.delete(id); loadAll() }
    catch { alert('Delete failed') }
  }

  const empColumns = [
    {
      key: 'logo_url', label: '',
      render: (r) => r.logo_url
        ? <img src={r.logo_url} alt="" className="w-8 h-8 rounded-full object-cover" />
        : <div className="w-8 h-8 bg-slate-700 rounded-full" />,
    },
    { key: 'company_name', label: 'Company', render: (r) => <span className="font-medium text-white">{r.company_name}</span> },
    { key: 'industry', label: 'Industry' },
    { key: 'contact_name', label: 'Contact' },
    { key: 'contact_email', label: 'Email' },
    { key: 'job_count', label: 'Jobs', render: (r) => r.job_count ?? 0 },
    { key: 'is_active', label: 'Status', render: (r) => <Badge variant={r.is_active ? 'green' : 'red'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
    {
      key: 'actions', label: '',
      render: (r) => (
        <div className="flex items-center gap-2">
          <button onClick={() => { setEmpForm(r); setEmpModal({ open: true, editing: r.id }) }} className="text-slate-400 hover:text-blue-400"><Pencil size={15} /></button>
          <button onClick={() => deleteEmployer(r.id)} className="text-slate-400 hover:text-red-400"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ]

  const jobColumns = [
    { key: 'title', label: 'Title', render: (r) => <span className="font-medium text-white">{r.title}</span> },
    { key: 'employer_name', label: 'Company' },
    { key: 'job_type', label: 'Type', render: (r) => <Badge variant="blue">{r.job_type.replace('_', ' ')}</Badge> },
    { key: 'location', label: 'Location', render: (r) => r.is_remote ? 'Remote' : (r.location || '—') },
    { key: 'required_skills', label: 'Skills', render: (r) => (r.required_skills || []).slice(0, 2).join(', ') },
    { key: 'application_count', label: 'Apps' },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={statusVariant[r.status]}>{r.status}</Badge> },
    {
      key: 'actions', label: '',
      render: (r) => (
        <div className="flex items-center gap-2">
          <button onClick={() => {
            setJobForm({ ...r, required_skills: (r.required_skills || []).join(', ') })
            setJobModal({ open: true, editing: r.id })
          }} className="text-slate-400 hover:text-blue-400"><Pencil size={15} /></button>
          <button onClick={() => deleteJob(r.id)} className="text-slate-400 hover:text-red-400"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-4 flex-wrap justify-between">
        <div className="flex gap-2">
          {['employers', 'jobs'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {tab === 'employers' && <SearchInput value={search} onChange={setSearch} placeholder="Search employers…" />}
          {tab === 'employers' && (
            <button onClick={() => { setEmpForm(EMPTY_EMP); setEmpModal({ open: true, editing: null }) }} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Add Employer
            </button>
          )}
          {tab === 'jobs' && (
            <button onClick={() => { setJobForm({ ...EMPTY_JOB, employer: employers[0]?.id || '' }); setJobModal({ open: true, editing: null }) }} className="btn-primary flex items-center gap-2">
              <Briefcase size={16} /> Post Job
            </button>
          )}
        </div>
      </div>

      <div className="card p-0">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="font-semibold text-white capitalize">{tab} <span className="text-slate-400 font-normal text-sm">({tab === 'employers' ? employers.length : jobs.length})</span></h2>
        </div>
        {tab === 'employers'
          ? <Table columns={empColumns} data={employers} loading={loading} emptyMsg="No employers found" />
          : <Table columns={jobColumns} data={jobs} loading={loading} emptyMsg="No job postings found" />
        }
      </div>

      {/* Employer Modal */}
      <Modal open={empModal.open} onClose={() => setEmpModal({ open: false, editing: null })} title={empModal.editing ? 'Edit Employer' : 'Add Employer'} size="md">
        <div className="space-y-3">
          {[
            { key: 'company_name', label: 'Company Name *', ph: 'TechCorp Nepal' },
            { key: 'industry', label: 'Industry', ph: 'Technology' },
            { key: 'website', label: 'Website', ph: 'https://…' },
            { key: 'logo_url', label: 'Logo URL', ph: 'https://…' },
            { key: 'contact_name', label: 'Contact Name', ph: 'John Doe' },
            { key: 'contact_email', label: 'Contact Email', ph: 'john@company.com' },
          ].map(({ key, label, ph }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input {...empField(key)} className="input" placeholder={ph} />
            </div>
          ))}
          <div className="flex items-center gap-3">
            <input id="emp_active" type="checkbox" checked={!!empForm.is_active} onChange={(e) => setEmpForm({ ...empForm, is_active: e.target.checked })} className="w-4 h-4 accent-blue-600" />
            <label htmlFor="emp_active" className="text-sm text-slate-300">Active</label>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setEmpModal({ open: false, editing: null })} className="btn-secondary">Cancel</button>
          <button onClick={saveEmployer} disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Saving…' : empModal.editing ? 'Update' : 'Create'}</button>
        </div>
      </Modal>

      {/* Job Modal */}
      <Modal open={jobModal.open} onClose={() => setJobModal({ open: false, editing: null })} title={jobModal.editing ? 'Edit Job' : 'Post Job'} size="lg">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="label">Employer *</label>
            <select value={jobForm.employer} onChange={(e) => setJobForm({ ...jobForm, employer: e.target.value })} className="input">
              <option value="">Select employer</option>
              {employers.map((e) => <option key={e.id} value={e.id}>{e.company_name}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="label">Job Title *</label>
            <input {...jobField('title')} className="input" placeholder="Frontend Developer" />
          </div>
          <div>
            <label className="label">Type</label>
            <select {...jobField('job_type')} className="input">
              {[['full_time','Full-time'],['part_time','Part-time'],['contract','Contract'],['internship','Internship']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select {...jobField('status')} className="input">
              {[['open','Open'],['closed','Closed'],['paused','Paused']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Location</label>
            <input {...jobField('location')} className="input" placeholder="Kathmandu" />
          </div>
          <div>
            <label className="label">Required Skills (comma-separated)</label>
            <input {...jobField('required_skills')} className="input" placeholder="React, TypeScript, Node.js" />
          </div>
          <div>
            <label className="label">Min Salary (NPR)</label>
            <input {...jobField('salary_min')} type="number" className="input" />
          </div>
          <div>
            <label className="label">Max Salary (NPR)</label>
            <input {...jobField('salary_max')} type="number" className="input" />
          </div>
          <div className="col-span-2">
            <label className="label">Description</label>
            <textarea {...jobField('description')} className="input resize-none" rows={3} />
          </div>
          <div className="col-span-2 flex items-center gap-3">
            <input id="is_remote" type="checkbox" checked={!!jobForm.is_remote} onChange={(e) => setJobForm({ ...jobForm, is_remote: e.target.checked })} className="w-4 h-4 accent-blue-600" />
            <label htmlFor="is_remote" className="text-sm text-slate-300">Remote position</label>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setJobModal({ open: false, editing: null })} className="btn-secondary">Cancel</button>
          <button onClick={saveJob} disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Saving…' : jobModal.editing ? 'Update' : 'Post'}</button>
        </div>
      </Modal>
    </div>
  )
}
