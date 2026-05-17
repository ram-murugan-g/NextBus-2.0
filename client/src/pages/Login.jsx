import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}! 🚌`);
      navigate(res.data.user.role === 'driver' ? '/driver' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-auth-gradient">
      {/* Decorative orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }} />
      <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />

      <div className="w-full max-w-md mx-4 relative">
        {/* Card */}
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)', boxShadow: '0 8px 32px rgba(59,130,246,0.4)' }}>
              <Bus size={32} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-sm" style={{ color: '#64748B' }}>Sign in to NextBus 2.0 — Chennai</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-4"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
              <AlertCircle size={15} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: '#94A3B8' }}>Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }} />
                <input id="login-email" type="email" className="input-dark" style={{ paddingLeft: '2.5rem' }} placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: '#94A3B8' }}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }} />
                <input id="login-password" type={showPw ? 'text' : 'password'} className="input-dark"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  placeholder="Enter your password"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#475569' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button id="login-submit" type="submit" className="btn-primary mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#475569' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold no-underline" style={{ color: '#60A5FA' }}>Create one</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#60A5FA' }}>🎯 Demo Credentials</p>
            <div className="space-y-1 text-xs" style={{ color: '#475569' }}>
              <p>User: <span style={{ color: '#94A3B8' }}>user@nextbus.in / password123</span></p>
              <p>Driver: <span style={{ color: '#94A3B8' }}>driver@nextbus.in / password123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
