import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Mail, Lock, Phone, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { signup } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'user' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.phone.length < 10) { setError('Enter a valid 10-digit phone number'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await signup(form);
      setAuth(res.data.user, res.data.token);
      toast.success(`Account created! Welcome, ${res.data.user.name.split(' ')[0]}! 🚌`);
      navigate(res.data.user.role === 'driver' ? '/driver' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-auth-gradient overflow-auto py-8">
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #10B981, transparent)' }} />
      <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #6366F1, transparent)' }} />

      <div className="w-full max-w-md mx-4">
        <div className="glass-card p-8">
          <div className="text-center mb-7">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 8px 32px rgba(16,185,129,0.4)' }}>
              <Bus size={32} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Join NextBus 2.0</h1>
            <p className="text-sm" style={{ color: '#64748B' }}>Create your free account</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-4"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
              <AlertCircle size={15} /><span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {['user', 'driver'].map(r => (
                <button key={r} type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  className={`py-2 rounded-lg text-sm font-semibold capitalize transition-all ${form.role === r ? 'text-white' : 'text-slate-500'}`}
                  style={form.role === r ? { background: 'linear-gradient(135deg, #3B82F6, #6366F1)' } : {}}>
                  {r === 'user' ? '👤 Passenger' : '🚌 Driver'}
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: '#94A3B8' }}>Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }} />
                <input id="signup-name" type="text" className="input-dark" style={{ paddingLeft: '2.5rem' }} placeholder="Ram Murugan"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: '#94A3B8' }}>Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }} />
                <input id="signup-email" type="email" className="input-dark" style={{ paddingLeft: '2.5rem' }} placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: '#94A3B8' }}>Phone Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }} />
                <input id="signup-phone" type="tel" className="input-dark" style={{ paddingLeft: '2.5rem' }} placeholder="9876543210"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required maxLength={10} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: '#94A3B8' }}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }} />
                <input id="signup-password" type={showPw ? 'text' : 'password'} className="input-dark"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#475569' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button id="signup-submit" type="submit" className="btn-primary mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#475569' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold no-underline" style={{ color: '#60A5FA' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
