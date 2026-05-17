import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bus, Map, Car, Monitor, LogOut, User, Bell, Wifi, WifiOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useBusStore } from '../store/busStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const isConnected = useBusStore(s => s.isConnected);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  const navLinks = user?.role === 'driver'
    ? [{ path: '/driver', icon: Bus, label: 'Driver Panel' }]
    : [
        { path: '/dashboard', icon: Map, label: 'Live Tracking' },
        { path: '/personal', icon: Car, label: 'My Vehicles' },
        { path: '/display', icon: Monitor, label: 'Street Display' }
      ];

  return (
    <nav style={{ background: 'rgba(9,13,26,0.95)', borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3">
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2 no-underline">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)' }}>
          <Bus size={20} color="white" />
        </div>
        <div>
          <span className="font-bold text-white text-lg leading-none">NextBus</span>
          <span className="text-xs block" style={{ color: '#64748B' }}>2.0 · Chennai</span>
        </div>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-1">
        {navLinks.map(({ path, icon: Icon, label }) => (
          <Link key={path} to={path}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all no-underline ${
              isActive(path)
                ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
            style={isActive(path) ? { background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' } : {}}>
            <Icon size={16} /> {label}
          </Link>
        ))}
      </div>

      {/* Right: Status + User info */}
      <div className="flex items-center gap-3">
        {/* Connection status */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
          isConnected ? 'text-emerald-400' : 'text-red-400'
        }`} style={{ background: isConnected ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${isConnected ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
          {isConnected ? <><div className="live-dot" />Live</> : <><WifiOff size={12} />Offline</>}
        </div>

        {/* User chip */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium text-white leading-none">{user?.name?.split(' ')[0]}</p>
            <p className="text-xs capitalize" style={{ color: '#64748B' }}>{user?.role}</p>
          </div>
        </div>

        <button onClick={handleLogout} className="p-2 rounded-lg transition-all text-slate-400 hover:text-red-400"
          style={{ background: 'rgba(239,68,68,0.05)' }} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
