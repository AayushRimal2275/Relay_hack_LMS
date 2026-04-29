import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';

export default function JobFormModal({ open, onClose, onSubmit, initialData, loading }) {
  const [form, setForm] = useState({ title: '', description: '', required_skills: '', is_active: true });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        required_skills: Array.isArray(initialData.required_skills)
          ? initialData.required_skills.join(', ')
          : initialData.required_skills || '',
        is_active: initialData.is_active ?? true,
      });
    } else {
      setForm({ title: '', description: '', required_skills: '', is_active: true });
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const skills = form.required_skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    onSubmit({ ...form, required_skills: skills });
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Job' : 'Post New Job'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Job Title"
          name="title"
          placeholder="Senior MERN Developer"
          value={form.title}
          onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: '' }); }}
          error={errors.title}
          required
        />
        <Textarea
          label="Description"
          name="description"
          rows={4}
          placeholder="Describe the role, responsibilities, and requirements..."
          value={form.description}
          onChange={(e) => { setForm({ ...form, description: e.target.value }); setErrors({ ...errors, description: '' }); }}
          error={errors.description}
          required
        />
        <Input
          label="Required Skills (comma-separated)"
          name="required_skills"
          placeholder="React, Node.js, MongoDB"
          value={form.required_skills}
          onChange={(e) => setForm({ ...form, required_skills: e.target.value })}
        />
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent" />
          </label>
          <span className="text-sm text-gray-300">Active listing</span>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">{initialData ? 'Update Job' : 'Post Job'}</Button>
        </div>
      </form>
    </Modal>
  );
}
