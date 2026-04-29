import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getApplications, updateApplication } from '../../api/applications';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';

const STATUSES = ['All', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'HIRED', 'REJECTED'];

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [editState, setEditState] = useState({});
  const [saving, setSaving] = useState(null);

  const fetchApps = async () => {
    try {
      const { data } = await getApplications();
      setApplications(Array.isArray(data) ? data : data.results || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const filtered = filter === 'All' ? applications : applications.filter((a) => a.status === filter);

  const toggleExpand = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
    if (!editState[id]) {
      const app = applications.find((a) => a.id === id);
      if (app) setEditState((s) => ({ ...s, [id]: { status: app.status, employer_notes: app.employer_notes || '' } }));
    }
  };

  const handleSave = async (id) => {
    setSaving(id);
    try {
      await updateApplication(id, editState[id]);
      await fetchApps();
      setExpanded(null);
    } catch {}
    setSaving(null);
  };

  if (loading) return (
    <div className="flex justify-center py-16"><Spinner size="lg" className="text-brand-accent" /></div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start sm:items-center flex-col sm:flex-row justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Applications</h1>
          <p className="text-gray-400 text-sm mt-1">{applications.length} total application{applications.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="w-full sm:w-48">
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-brand-surface border border-brand-border rounded-xl">
          <p className="text-gray-500 text-lg">No applications found</p>
          <p className="text-gray-600 text-sm mt-1">
            {filter !== 'All' ? `No ${filter} applications` : 'Applications will appear here'}
          </p>
        </div>
      ) : (
        <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden">
          {filtered.map((app, idx) => {
            const isOpen = expanded === app.id;
            const edit = editState[app.id] || { status: app.status, employer_notes: app.employer_notes || '' };
            const learnerName = app.learner_name || app.learner?.username || app.learner?.full_name || `Learner #${app.learner}`;
            const jobTitle = app.job_title || app.job?.title || `Job #${app.job}`;

            return (
              <div key={app.id} className={`${idx !== 0 ? 'border-t border-brand-border' : ''}`}>
                <button
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-brand-bg/40 transition-colors text-left"
                  onClick={() => toggleExpand(app.id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{learnerName}</p>
                      <p className="text-gray-500 text-xs mt-0.5 truncate">{jobTitle}</p>
                    </div>
                    <Badge label={app.status} type="status" className="hidden sm:inline-flex" />
                    <span className="text-gray-500 text-xs hidden md:block">{formatDate(app.applied_at)}</span>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-gray-400 ml-3 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 ml-3 flex-shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 border-t border-brand-border bg-brand-bg/30">
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select
                        label="Update Status"
                        value={edit.status}
                        onChange={(e) => setEditState((s) => ({ ...s, [app.id]: { ...edit, status: e.target.value } }))}
                      >
                        {STATUSES.filter((s) => s !== 'All').map((s) => <option key={s} value={s}>{s}</option>)}
                      </Select>
                      <div className="sm:col-span-2">
                        <Textarea
                          label="Employer Notes"
                          rows={3}
                          placeholder="Add notes about this candidate..."
                          value={edit.employer_notes}
                          onChange={(e) => setEditState((s) => ({ ...s, [app.id]: { ...edit, employer_notes: e.target.value } }))}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="secondary" size="sm" onClick={() => setExpanded(null)}>Cancel</Button>
                      <Button size="sm" loading={saving === app.id} onClick={() => handleSave(app.id)}>Save Changes</Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
