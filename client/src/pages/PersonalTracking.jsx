import { useState, useEffect, useRef } from 'react';
import { Plus, Car, Bus, Bike, Trash2, Edit3, Check, X, MapPin, School } from 'lucide-react';
import Navbar from '../components/Navbar';
import MapView from '../components/MapView';
import OccupancyBar from '../components/OccupancyBar';
import { getVehicles, addVehicle, updateVehicle, deleteVehicle } from '../api/vehicleApi';
import toast from 'react-hot-toast';

const TYPE_INFO = {
  car: { icon: '🚗', label: 'Car', color: '#3B82F6' },
  bike: { icon: '🏍️', label: 'Bike', color: '#8B5CF6' },
  school_bus: { icon: '🚌', label: 'School Bus', color: '#F59E0B' },
  office_van: { icon: '🚐', label: 'Office Van', color: '#10B981' },
  bus: { icon: '🚌', label: 'Bus', color: '#EF4444' }
};

// Simulate movement for personal vehicles
const PERSONAL_ROUTES = [
  [{ lat: 13.0418, lng: 80.2341 }, { lat: 13.0524, lng: 80.2120 }, { lat: 13.0696, lng: 80.1948 }],
  [{ lat: 13.0827, lng: 80.2707 }, { lat: 13.0732, lng: 80.2609 }, { lat: 13.0850, lng: 80.2101 }],
  [{ lat: 13.0500, lng: 80.2824 }, { lat: 13.0338, lng: 80.2619 }, { lat: 13.0067, lng: 80.2570 }]
];

export default function PersonalTracking() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editNick, setEditNick] = useState('');
  const [form, setForm] = useState({ name: '', vehicle_number: '', type: 'car', capacity: 5, nickname: '' });
  const [submitting, setSubmitting] = useState(false);
  const [simVehicles, setSimVehicles] = useState([]);
  const simRef = useRef({});

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Simulate movement for personal vehicles
  useEffect(() => {
    const interval = setInterval(() => {
      setSimVehicles(prev => prev.map((sv, i) => {
        const route = PERSONAL_ROUTES[i % PERSONAL_ROUTES.length];
        const pts = route;
        sv.progress = (sv.progress || 0) + 0.02;
        if (sv.progress >= 1) { sv.progress = 0; sv.idx = (sv.idx + 1) % (pts.length - 1); }
        const cur = pts[sv.idx || 0];
        const nxt = pts[Math.min((sv.idx || 0) + 1, pts.length - 1)];
        return { ...sv, simLat: cur.lat + (nxt.lat - cur.lat) * sv.progress, simLng: cur.lng + (nxt.lng - cur.lng) * sv.progress };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await getVehicles();
      setVehicles(res.data);
      setSimVehicles(res.data.map((v, i) => {
        const route = PERSONAL_ROUTES[i % PERSONAL_ROUTES.length];
        return { ...v, simLat: route[0].lat, simLng: route[0].lng, idx: 0, progress: 0 };
      }));
    } catch { toast.error('Failed to load vehicles'); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await addVehicle(form);
      const newV = res.data.userVehicle;
      const route = PERSONAL_ROUTES[vehicles.length % PERSONAL_ROUTES.length];
      setVehicles(prev => [...prev, newV]);
      setSimVehicles(prev => [...prev, { ...newV, simLat: route[0].lat, simLng: route[0].lng, idx: 0, progress: 0 }]);
      setForm({ name: '', vehicle_number: '', type: 'car', capacity: 5, nickname: '' });
      setShowForm(false);
      toast.success('Vehicle added successfully! 🚗');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add vehicle');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this vehicle?')) return;
    try {
      await deleteVehicle(id);
      setVehicles(prev => prev.filter(v => v._id !== id));
      setSimVehicles(prev => prev.filter(v => v._id !== id));
      toast.success('Vehicle removed');
    } catch { toast.error('Failed to remove'); }
  };

  const handleRename = async (id) => {
    try {
      await updateVehicle(id, { nickname: editNick });
      setVehicles(prev => prev.map(v => v._id === id ? { ...v, nickname: editNick } : v));
      setSimVehicles(prev => prev.map(v => v._id === id ? { ...v, nickname: editNick } : v));
      setEditId(null);
      toast.success('Renamed!');
    } catch { toast.error('Failed to rename'); }
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: '#060B18' }}>
      <Navbar />
      <div className="flex flex-1 overflow-hidden" style={{ paddingTop: '57px' }}>
        {/* Left panel */}
        <div className="w-88 flex flex-col overflow-hidden" style={{ width: '360px', background: 'rgba(7,11,22,0.98)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Header */}
          <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Car size={16} style={{ color: '#8B5CF6' }} /> My Vehicles
              </h2>
              <button onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{ background: showForm ? 'rgba(239,68,68,0.12)' : 'rgba(139,92,246,0.15)', color: showForm ? '#F87171' : '#A78BFA', border: `1px solid ${showForm ? 'rgba(239,68,68,0.3)' : 'rgba(139,92,246,0.3)'}` }}>
                {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add</>}
              </button>
            </div>
            <p className="text-xs" style={{ color: '#475569' }}>{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} tracked</p>
          </div>

          {/* Add form */}
          {showForm && (
            <form onSubmit={handleAdd} className="p-4 border-b space-y-3 animate-fade-in" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(139,92,246,0.04)' }}>
              <h3 className="text-sm font-semibold text-white">Add New Vehicle</h3>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#94A3B8' }}>Type</label>
                <div className="grid grid-cols-5 gap-1">
                  {Object.entries(TYPE_INFO).map(([key, { icon, label }]) => (
                    <button key={key} type="button"
                      onClick={() => setForm({ ...form, type: key, capacity: key === 'bus' ? 50 : key === 'school_bus' ? 40 : key === 'office_van' ? 15 : key === 'bike' ? 2 : 5 })}
                      className="flex flex-col items-center gap-0.5 p-2 rounded-lg text-center transition-all"
                      style={{ background: form.type === key ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${form.type === key ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.06)'}` }}
                      title={label}>
                      <span className="text-lg">{icon}</span>
                      <span className="text-xs" style={{ color: form.type === key ? '#A78BFA' : '#475569', fontSize: '9px' }}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <input className="input-dark text-sm" placeholder="Vehicle Name (e.g. My Honda City)"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input className="input-dark text-sm" placeholder="Vehicle Number (e.g. TN10-AB-1234)"
                value={form.vehicle_number} onChange={e => setForm({ ...form, vehicle_number: e.target.value.toUpperCase() })} required />
              <input className="input-dark text-sm" placeholder="Nickname (optional)"
                value={form.nickname} onChange={e => setForm({ ...form, nickname: e.target.value })} />
              <button type="submit" className="btn-primary text-sm py-2" disabled={submitting}
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}>
                {submitting ? 'Adding...' : 'Add Vehicle'}
              </button>
            </form>
          )}

          {/* Vehicle list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              <div className="flex justify-center pt-10"><div className="spinner" /></div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-12">
                <Car size={36} style={{ color: '#1E293B' }} className="mx-auto mb-3" />
                <p className="text-sm font-medium" style={{ color: '#334155' }}>No vehicles added</p>
                <p className="text-xs mt-1" style={{ color: '#1E293B' }}>Add your car, bike, or school bus to track it</p>
              </div>
            ) : vehicles.map((v) => {
              const info = TYPE_INFO[v.vehicle_id?.type] || TYPE_INFO.car;
              return (
                <div key={v._id} className="p-4 rounded-xl hover-card"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: info.color + '18', border: `1px solid ${info.color}33` }}>
                        {info.icon}
                      </div>
                      <div>
                        {editId === v._id ? (
                          <div className="flex items-center gap-1">
                            <input className="input-dark text-sm py-1 px-2" style={{ height: '28px', width: '120px' }}
                              value={editNick} onChange={e => setEditNick(e.target.value)} autoFocus />
                            <button onClick={() => handleRename(v._id)} className="p-1 rounded" style={{ color: '#34D399' }}><Check size={14} /></button>
                            <button onClick={() => setEditId(null)} className="p-1 rounded" style={{ color: '#F87171' }}><X size={14} /></button>
                          </div>
                        ) : (
                          <p className="font-semibold text-white text-sm">{v.nickname || v.vehicle_id?.name}</p>
                        )}
                        <p className="text-xs font-mono mt-0.5" style={{ color: '#475569' }}>{v.vehicle_id?.vehicle_number}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditId(v._id); setEditNick(v.nickname); }}
                        className="p-1.5 rounded-lg transition-all" style={{ color: '#64748B' }}><Edit3 size={13} /></button>
                      <button onClick={() => handleDelete(v._id)}
                        className="p-1.5 rounded-lg transition-all" style={{ color: '#64748B' }}><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-md font-medium"
                      style={{ background: info.color + '18', color: info.color }}>{info.label}</span>
                    <div className="live-dot" style={{ width: 6, height: 6 }} />
                    <span className="text-xs" style={{ color: '#34D399' }}>Simulating</span>
                    <div className="flex items-center gap-1 ml-auto text-xs" style={{ color: '#475569' }}>
                      <MapPin size={10} />Tracking
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapView personalVehicles={simVehicles} />
          {vehicles.length > 0 && (
            <div className="absolute top-4 left-4 px-4 py-2 rounded-xl text-sm"
              style={{ background: 'rgba(7,11,22,0.9)', border: '1px solid rgba(139,92,246,0.3)', backdropFilter: 'blur(10px)', color: '#A78BFA' }}>
              🚗 {vehicles.length} personal vehicle{vehicles.length !== 1 ? 's' : ''} on map
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
