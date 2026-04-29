import React, { useEffect, useState, useCallback } from 'react';
import { Search, Star } from 'lucide-react';
import { getTalentPool } from '../../api/talentPool';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const TRACKS = ['All', 'MERN', 'DevOps', 'QA', 'Design', 'Data Science'];

function getInitials(name) {
  return name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';
}

const TRACK_BG = {
  MERN: 'bg-blue-900',
  DevOps: 'bg-orange-900',
  QA: 'bg-purple-900',
  Design: 'bg-pink-900',
  'Data Science': 'bg-yellow-900',
};

export default function TalentPoolPage() {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ track: 'All', min_score: '', search: '' });
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  const fetchLearners = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getTalentPool({ ...filters, search: debouncedSearch });
      setLearners(Array.isArray(data) ? data : data.results || []);
    } catch {
      setLearners([]);
    }
    setLoading(false);
  }, [filters.track, filters.min_score, debouncedSearch]);

  useEffect(() => { fetchLearners(); }, [fetchLearners]);

  const handleFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Talent Pool</h1>
        <p className="text-gray-400 text-sm mt-1">Browse certified learners ready to be hired</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select
          label="Track"
          value={filters.track}
          onChange={(e) => handleFilter('track', e.target.value)}
        >
          {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Input
          label="Min Score"
          type="number"
          min="0"
          max="100"
          placeholder="e.g. 70"
          value={filters.min_score}
          onChange={(e) => handleFilter('min_score', e.target.value)}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-300">Search</label>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              className="w-full rounded-lg bg-brand-surface border border-brand-border text-white placeholder-gray-500 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-colors"
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => handleFilter('search', e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" className="text-brand-accent" />
        </div>
      ) : learners.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No learners found</p>
          <p className="text-gray-600 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {learners.map((learner) => (
            <LearnerCard key={learner.id} learner={learner} />
          ))}
        </div>
      )}
    </div>
  );
}

function LearnerCard({ learner }) {
  const initials = getInitials(learner.full_name || learner.username || learner.name);
  const trackKey = learner.track || 'MERN';
  const bgColor = TRACK_BG[trackKey] || 'bg-gray-800';
  const score = learner.score ?? learner.average_score ?? 0;
  const skills = learner.skills || [];
  const certCount = learner.cert_count ?? learner.certificate_count ?? 0;

  return (
    <Card className="flex flex-col gap-4 hover:border-brand-accent/30 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white font-semibold text-sm">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">
            {learner.full_name || learner.username || learner.name || 'Unknown'}
          </p>
          <p className="text-gray-500 text-xs truncate">{learner.email || ''}</p>
        </div>
        <Badge label={trackKey} type="track" />
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 5).map((skill) => (
            <span key={skill} className="px-2 py-0.5 bg-brand-bg border border-brand-border rounded-md text-xs text-gray-300">
              {skill}
            </span>
          ))}
          {skills.length > 5 && (
            <span className="px-2 py-0.5 text-xs text-gray-500">+{skills.length - 5}</span>
          )}
        </div>
      )}

      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400 flex items-center gap-1"><Star size={11} className="text-yellow-400" /> Score</span>
          <span className="text-white font-medium">{score}%</span>
        </div>
        <div className="w-full bg-brand-bg rounded-full h-1.5">
          <div
            className="bg-brand-accent h-1.5 rounded-full transition-all"
            style={{ width: `${Math.min(score, 100)}%` }}
          />
        </div>
      </div>

      {certCount > 0 && (
        <p className="text-xs text-gray-500">🎓 {certCount} certificate{certCount !== 1 ? 's' : ''}</p>
      )}
    </Card>
  );
}
