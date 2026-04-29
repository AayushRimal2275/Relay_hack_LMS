import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerEmployer } from '../../api/auth';
import useAuthStore from '../../store/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function RegisterEmployerPage() {
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();
  const [form, setForm] = useState({
    name: '',
    industry: '',
    website: '',
    contact_email: '',
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const required = ['name', 'industry', 'contact_email', 'username', 'email', 'password'];
    const errs = {};
    required.forEach((f) => {
      if (!form[f]?.trim()) errs[f] = 'This field is required';
    });
    if (form.password && form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setApiError('');
    setLoading(true);
    try {
      const { data } = await registerEmployer(form);
      storeLogin(data);
      navigate('/dashboard');
    } catch (err) {
      const d = err.response?.data;
      if (d && typeof d === 'object') {
        const msgs = Object.entries(d).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ');
        setApiError(msgs);
      } else {
        setApiError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand-accent flex items-center justify-center">
              <span className="text-black font-bold">LC</span>
            </div>
            <span className="text-white text-xl font-bold">Leapfrog Connect</span>
          </div>
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-xl p-8">
          <h1 className="text-2xl font-bold text-white mb-1">Register your company</h1>
          <p className="text-gray-400 text-sm mb-6">Start hiring top talent from Leapfrog</p>

          {apiError && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm mb-5">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Company Name" name="name" placeholder="Acme Corp" value={form.name} onChange={handleChange} error={errors.name} required />
              <Input label="Industry" name="industry" placeholder="Technology" value={form.industry} onChange={handleChange} error={errors.industry} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Website" name="website" type="url" placeholder="https://acme.com" value={form.website} onChange={handleChange} error={errors.website} />
              <Input label="Contact Email" name="contact_email" type="email" placeholder="hr@acme.com" value={form.contact_email} onChange={handleChange} error={errors.contact_email} required />
            </div>
            <div className="border-t border-brand-border pt-4 mt-2">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Account credentials</p>
              <div className="space-y-4">
                <Input label="Username" name="username" placeholder="acme_hr" value={form.username} onChange={handleChange} error={errors.username} required />
                <Input label="Email" name="email" type="email" placeholder="you@acme.com" value={form.email} onChange={handleChange} error={errors.email} required />
                <Input label="Password" name="password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} error={errors.password} required />
              </div>
            </div>
            <Button type="submit" loading={loading} className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-accent hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
