import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getJobs, createJob, updateJob, deleteJob } from '../../api/jobs';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import JobFormModal from './JobFormModal';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchJobs = async () => {
    try {
      const { data } = await getJobs();
      setJobs(Array.isArray(data) ? data : data.results || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleOpen = (job = null) => { setEditJob(job); setModalOpen(true); };
  const handleClose = () => { setEditJob(null); setModalOpen(false); };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editJob) {
        await updateJob(editJob.id, formData);
      } else {
        await createJob(formData);
      }
      await fetchJobs();
      handleClose();
    } catch {}
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    try { await deleteJob(id); await fetchJobs(); } catch {}
    setDeleteId(null);
  };

  if (loading) return (
    <div className="flex justify-center py-16"><Spinner size="lg" className="text-brand-accent" /></div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Postings</h1>
          <p className="text-gray-400 text-sm mt-1">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <Button onClick={() => handleOpen()} size="md">
          <Plus size={16} /> Post New Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-brand-surface border border-brand-border rounded-xl">
          <p className="text-gray-500 text-lg">No jobs yet</p>
          <p className="text-gray-600 text-sm mt-1">Post your first job to start hiring</p>
          <Button onClick={() => handleOpen()} className="mt-4">
            <Plus size={16} /> Post First Job
          </Button>
        </div>
      ) : (
        <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="text-left text-xs text-gray-400 font-medium px-6 py-4">Title</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-6 py-4 hidden md:table-cell">Required Skills</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-6 py-4">Status</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-brand-border last:border-0 hover:bg-brand-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium text-sm">{job.title}</p>
                      {job.description && (
                        <p className="text-gray-500 text-xs mt-0.5 line-clamp-1 max-w-xs">{job.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(job.required_skills) ? job.required_skills : []).slice(0, 4).map((skill) => (
                          <span key={skill} className="px-2 py-0.5 bg-brand-bg border border-brand-border rounded text-xs text-gray-300">{skill}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${job.is_active ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                        {job.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpen(job)}
                          className="p-1.5 text-gray-400 hover:text-brand-accent hover:bg-brand-bg rounded-lg transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          disabled={deleteId === job.id}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-brand-bg rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleteId === job.id ? <Spinner size="sm" /> : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <JobFormModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialData={editJob}
        loading={submitting}
      />
    </div>
  );
}
