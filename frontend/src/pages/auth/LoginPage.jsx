import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import useAuthStore from '../../store/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { getMyCompany } from '../../api/companies';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError('');

  try {
    // FAKE USER (bypass backend completely)
    const fakeUser = {
      access: 'fake-token',
      refresh: 'fake-refresh',
      email: form.email,
      name: 'Test User',
      company_id: 1,
    };

    localStorage.setItem('access_token', fakeUser.access);
    localStorage.setItem('refresh_token', fakeUser.refresh);

    storeLogin(fakeUser);

    navigate('/dashboard');
  } catch (err) {
    setError('Something went wrong');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand-accent flex items-center justify-center">
              <span className="text-black font-bold">LC</span>
            </div>
            <span className="text-white text-xl font-bold">Leapfrog Connect</span>
          </div>
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-xl p-8">
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-gray-400 text-sm mb-6">Sign in to your employer account</p>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username or Email"
              name="email"
              type="text"
              autoComplete="username"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" loading={loading} className="w-full mt-2">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-brand-accent hover:underline font-medium">
              Register your company
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
