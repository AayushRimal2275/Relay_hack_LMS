import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Zap, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading } = useAuthStore()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await login(form)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Leapfrog Connect</h1>
          <p className="text-slate-400 text-sm mt-1">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-6">Sign in</h2>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="admin"
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="text-xs text-slate-500 text-center mt-4">
            Demo credentials: <span className="text-slate-300">admin / admin123</span>
          </p>
        </div>
      </div>
    </div>
  )
}
