import { useEffect } from 'react';
import { Bus, Map } from 'lucide-react';
import Navbar from '../components/Navbar';
import MapView from '../components/MapView';
import BusInfoPanel from '../components/BusInfoPanel';
import SearchBar from '../components/SearchBar';
import OccupancyBar from '../components/OccupancyBar';
import { useSocket } from '../hooks/useSocket';
import { useBusStore } from '../store/busStore';

export default function Dashboard() {
  useSocket();
  const { buses, selectedBus, setSelectedBus, getFilteredBuses, searchQuery } = useBusStore();
  const filtered = getFilteredBuses();

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#060B18' }}>
      <Navbar />

      <div className="flex flex-1 overflow-hidden" style={{ paddingTop: '57px' }}>
        {/* Left sidebar */}
        <div className="w-80 flex flex-col border-r overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(7,11,22,0.95)' }}>
          {/* Header */}
          <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Map size={16} style={{ color: '#3B82F6' }} /> Live Buses
              </h2>
              <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#34D399', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div className="live-dot" style={{ width: 6, height: 6 }} />
                {buses.length} Active
              </div>
            </div>
            <SearchBar />
          </div>

          {/* Bus list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <Bus size={32} style={{ color: '#334155' }} className="mx-auto mb-3" />
                <p className="text-sm" style={{ color: '#475569' }}>
                  {searchQuery ? 'No buses match your search' : 'Waiting for bus data...'}
                </p>
              </div>
            ) : filtered.map((bus) => (
              <button key={bus.vehicleId}
                onClick={() => setSelectedBus(selectedBus?.vehicleId === bus.vehicleId ? null : bus)}
                className="w-full text-left p-3.5 rounded-xl transition-all hover-card"
                style={{
                  background: selectedBus?.vehicleId === bus.vehicleId
                    ? `${bus.routeColor}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedBus?.vehicleId === bus.vehicleId ? bus.routeColor + '44' : 'rgba(255,255,255,0.06)'}`,
                  cursor: 'pointer'
                }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md mr-2"
                      style={{ background: bus.routeColor + '22', color: bus.routeColor }}>
                      {bus.routeName}
                    </span>
                    <span className="text-xs font-medium text-white">{bus.busNumber}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: '#34D399' }}>{bus.eta}m</span>
                </div>
                <p className="text-xs mb-2 truncate" style={{ color: '#64748B' }}>{bus.routeDisplayName}</p>
                <OccupancyBar count={bus.passengerCount} capacity={bus.capacity} showLabel={false} />
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs" style={{ color: '#475569' }}>Next: {bus.nextStop}</span>
                  <span className="text-xs" style={{ color: '#475569' }}>{bus.speed} km/h</span>
                </div>
              </button>
            ))}
          </div>

          {/* Stats footer */}
          <div className="p-3 border-t grid grid-cols-3 gap-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {[
              { label: 'Buses', value: buses.length, color: '#3B82F6' },
              { label: 'Avg ETA', value: `${Math.round(buses.reduce((a, b) => a + (b.eta || 0), 0) / Math.max(buses.length, 1))}m`, color: '#F59E0B' },
              { label: 'Riders', value: buses.reduce((a, b) => a + (b.passengerCount || 0), 0), color: '#10B981' }
            ].map(s => (
              <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-base font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs" style={{ color: '#475569' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map area */}
        <div className="flex-1 relative overflow-hidden">
          <MapView />
          {selectedBus && <BusInfoPanel bus={selectedBus} onClose={() => setSelectedBus(null)} />}

          {/* Floating info */}
          {!selectedBus && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-sm font-medium pointer-events-none"
              style={{ background: 'rgba(7,11,22,0.9)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', backdropFilter: 'blur(10px)' }}>
              🚌 Click any bus marker to track it
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
