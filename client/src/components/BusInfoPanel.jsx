import { X, Navigation, Clock, MapPin, Zap, ArrowRight } from 'lucide-react';
import OccupancyBar from './OccupancyBar';

export default function BusInfoPanel({ bus, onClose }) {
  if (!bus) return null;

  const directionLabel = bus.bearing != null
    ? ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(bus.bearing / 45) % 8]
    : '—';

  return (
    <div className="panel-enter absolute top-0 right-0 h-full w-80 z-20 flex flex-col"
      style={{ background: 'rgba(7,11,22,0.97)', borderLeft: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(24px)' }}>

      {/* Header */}
      <div className="p-5 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                style={{ background: bus.routeColor + '22', color: bus.routeColor, border: `1px solid ${bus.routeColor}44` }}>
                {bus.routeName}
              </span>
              {bus.isDriverControlled && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(245,158,11,0.15)', color: '#FBBF24', border: '1px solid rgba(245,158,11,0.3)' }}>
                  Live Driver
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white">{bus.busNumber}</h2>
            <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>{bus.busName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-all hover:bg-white/10" style={{ color: '#475569' }}>
            <X size={18} />
          </button>
        </div>

        {/* Route path */}
        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="text-center">
            <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: bus.routeColor }} />
            <p className="text-xs font-medium text-white">{bus.routeStart}</p>
          </div>
          <div className="flex-1 flex items-center gap-1">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${bus.routeColor}66, ${bus.routeColor})` }} />
            <ArrowRight size={12} style={{ color: bus.routeColor }} />
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${bus.routeColor}, ${bus.routeColor}66)` }} />
          </div>
          <div className="text-center">
            <div className="w-2 h-2 rounded-full mx-auto mb-1 border-2" style={{ borderColor: bus.routeColor, background: 'transparent' }} />
            <p className="text-xs font-medium text-white">{bus.routeEnd}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-5 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {/* Live status */}
        <div className="flex items-center gap-2 mb-4">
          <div className="live-dot" />
          <span className="text-sm font-medium" style={{ color: '#34D399' }}>Live Tracking Active</span>
        </div>

        {/* Key stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <Clock size={13} style={{ color: '#3B82F6' }} />
              <span className="text-xs" style={{ color: '#64748B' }}>ETA</span>
            </div>
            <p className="text-2xl font-bold text-white">{bus.eta}<span className="text-sm font-normal ml-1" style={{ color: '#64748B' }}>min</span></p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <Zap size={13} style={{ color: '#F59E0B' }} />
              <span className="text-xs" style={{ color: '#64748B' }}>Speed</span>
            </div>
            <p className="text-2xl font-bold text-white">{bus.speed}<span className="text-sm font-normal ml-1" style={{ color: '#64748B' }}>km/h</span></p>
          </div>
        </div>

        {/* Occupancy */}
        <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <OccupancyBar count={bus.passengerCount} capacity={bus.capacity} />
        </div>

        {/* Next stop */}
        <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={14} style={{ color: bus.routeColor }} />
            <span className="text-xs" style={{ color: '#64748B' }}>Next Stop</span>
          </div>
          <p className="text-base font-semibold text-white">{bus.nextStop || '—'}</p>
        </div>

        {/* Direction */}
        <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Navigation size={14} style={{ color: '#8B5CF6' }} />
            <span className="text-xs" style={{ color: '#64748B' }}>Heading</span>
          </div>
          <p className="text-base font-semibold text-white">{directionLabel} — {Math.round(bus.bearing || 0)}°</p>
        </div>

        {/* Coordinates */}
        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs mb-1" style={{ color: '#475569' }}>Location</p>
          <p className="text-xs font-mono" style={{ color: '#64748B' }}>
            {bus.lat?.toFixed(5)}, {bus.lng?.toFixed(5)}
          </p>
          <p className="text-xs mt-1" style={{ color: '#334155' }}>
            Updated {new Date(bus.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
