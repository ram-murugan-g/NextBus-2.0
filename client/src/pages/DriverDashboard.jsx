import { useState, useEffect, useRef } from 'react';
import { Play, Square, Users, Bus, TrendingUp, AlertCircle, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import MapView from '../components/MapView';
import { useAuthStore } from '../store/authStore';
import { useSocket } from '../hooks/useSocket';
import { useBusStore } from '../store/busStore';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ROUTES = [
  { id: 'route_21c', name: '21C: Central → Koyambedu' },
  { id: 'route_5', name: '5: Parrys → Anna Nagar' },
  { id: 'route_27e', name: '27E: Egmore → Velachery' },
  { id: 'route_15', name: '15: T.Nagar → Poonamallee' },
  { id: 'route_airport', name: 'M70: Airport Express' },
  { id: 'route_m9', name: 'M9: Marina → Velachery' },
  { id: 'route_12d', name: '12D: Perambur → Guindy' },
  { id: 'route_29c', name: '29C: Central → Tondiarpet' },
  { id: 'route_47a', name: '47A: Koyambedu → Tambaram' },
  { id: 'route_23b', name: '23B: Kolathur → Marina' },
  { id: 'route_11c', name: '11C: T.Nagar → Adyar' },
  { id: 'route_52d', name: '52D: Anna Nagar → Velachery' }
];

export default function DriverDashboard() {
  useSocket();
  const { user } = useAuthStore();
  const buses = useBusStore(s => s.buses);
  const [trip, setTrip] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(ROUTES[0].id);
  const [passengerCount, setPassengerCount] = useState(0);
  const [vehicleId, setVehicleId] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (trip) {
      timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setElapsed(0);
    }
    return () => clearInterval(timerRef.current);
  }, [trip]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const startTrip = async () => {
    if (!vehicleNumber.trim()) { toast.error('Enter your vehicle number'); return; }
    setLoading(true);
    try {
      const vehRes = await api.post('/vehicles', {
        name: `Bus ${vehicleNumber}`, type: 'bus',
        vehicle_number: vehicleNumber, capacity: 60, is_public: true
      });
      const vId = vehRes.data.vehicle._id;
      setVehicleId(vId);
      const res = await api.post('/driver/start-trip', { vehicleId: vId, routeId: selectedRoute });
      setTrip(res.data.trip);
      toast.success('Trip started! Bus is now live on the map 🚌');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start trip');
    } finally {
      setLoading(false);
    }
  };

  const stopTrip = async () => {
    if (!trip) return;
    setLoading(true);
    try {
      await api.post('/driver/stop-trip', { tripId: trip._id });
      setTrip(null);
      setVehicleId('');
      toast.success('Trip ended successfully');
    } catch (err) {
      toast.error('Failed to stop trip');
    } finally {
      setLoading(false);
    }
  };

  const updateCount = async () => {
    if (!vehicleId) return;
    try {
      await api.post('/driver/update-count', { vehicleId, count: passengerCount });
      toast.success('Passenger count updated!');
    } catch { toast.error('Update failed'); }
  };

  const totalRiders = buses.reduce((a, b) => a + (b.passengerCount || 0), 0);

  return (
    <div className="flex flex-col h-screen" style={{ background: '#060B18' }}>
      <Navbar />
      <div className="flex flex-1 overflow-hidden" style={{ paddingTop: '57px' }}>
        {/* Control panel */}
        <div className="w-96 flex flex-col p-5 gap-4 overflow-y-auto" style={{ background: 'rgba(7,11,22,0.98)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Driver info card */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>🧑‍✈️</div>
              <div>
                <p className="font-bold text-white">{user?.name}</p>
                <p className="text-sm" style={{ color: '#64748B' }}>Bus Driver · {user?.phone}</p>
              </div>
            </div>
            {trip && (
              <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                  <div className="live-dot" />
                  <span className="text-sm text-emerald-400 font-medium">Trip Active</span>
                </div>
                <span className="font-mono text-lg font-bold text-white">{formatTime(elapsed)}</span>
              </div>
            )}
          </div>

          {/* Vehicle setup */}
          {!trip && (
            <div className="glass-card p-4 space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2"><Bus size={16} style={{ color: '#F59E0B' }} /> Start a Trip</h3>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: '#94A3B8' }}>Vehicle Number</label>
                <input className="input-dark text-sm" placeholder="e.g. TN01-A-1234"
                  value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value.toUpperCase())} />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: '#94A3B8' }}>Select Route</label>
                <div className="relative">
                  <select className="input-dark text-sm pr-8 appearance-none"
                    value={selectedRoute} onChange={e => setSelectedRoute(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {ROUTES.map(r => <option key={r.id} value={r.id} style={{ background: '#0F1629' }}>{r.name}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }} />
                </div>
              </div>
              <button onClick={startTrip} disabled={loading} className="btn-primary flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                <Play size={16} fill="white" />
                {loading ? 'Starting...' : 'Start Trip'}
              </button>
            </div>
          )}

          {/* Passenger counter */}
          {trip && (
            <div className="glass-card p-4">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Users size={16} style={{ color: '#3B82F6' }} /> Passenger Control</h3>
              <div className="text-center mb-4">
                <p className="text-5xl font-black text-white mb-1">{passengerCount}</p>
                <p className="text-sm" style={{ color: '#64748B' }}>onboard</p>
              </div>
              <div className="flex gap-2 mb-4">
                {[-5, -1, +1, +5].map(d => (
                  <button key={d}
                    onClick={() => setPassengerCount(p => Math.max(0, p + d))}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{
                      background: d > 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)',
                      border: `1px solid ${d > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.25)'}`,
                      color: d > 0 ? '#34D399' : '#F87171'
                    }}>
                    {d > 0 ? `+${d}` : d}
                  </button>
                ))}
              </div>
              <button onClick={updateCount} className="btn-primary text-sm py-2.5 flex items-center justify-center gap-2">
                <TrendingUp size={14} /> Broadcast Update
              </button>
            </div>
          )}

          {/* Stop trip */}
          {trip && (
            <button onClick={stopTrip} disabled={loading}
              className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}>
              <Square size={16} fill="currentColor" />
              {loading ? 'Stopping...' : 'End Trip'}
            </button>
          )}

          {/* Live stats */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#64748B' }}>Network Overview</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Buses Live', value: buses.length, color: '#3B82F6' },
                { label: 'Total Riders', value: totalRiders, color: '#10B981' }
              ].map(s => (
                <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs" style={{ color: '#475569' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapView />
          {trip && (
            <div className="absolute top-4 left-4 px-4 py-2.5 rounded-xl flex items-center gap-2"
              style={{ background: 'rgba(7,11,22,0.9)', border: '1px solid rgba(16,185,129,0.3)', backdropFilter: 'blur(10px)' }}>
              <div className="live-dot" />
              <span className="text-sm font-medium" style={{ color: '#34D399' }}>Your bus is broadcasting live</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
