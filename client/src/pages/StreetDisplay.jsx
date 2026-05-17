import { useEffect, useState } from 'react';
import { Clock, Bus, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import { useBusStore } from '../store/busStore';

export default function StreetDisplay() {
  useSocket();
  const buses = useBusStore(s => s.buses);
  const [time, setTime] = useState(new Date());
  const [tick, setTick] = useState(false);

  useEffect(() => {
    const t = setInterval(() => { setTime(new Date()); setTick(p => !p); }, 1000);
    return () => clearInterval(t);
  }, []);

  const sortedBuses = [...buses].sort((a, b) => (a.eta || 99) - (b.eta || 99));

  const getStatusColor = (eta) => {
    if (eta <= 3) return '#EF4444';
    if (eta <= 8) return '#F59E0B';
    return '#10B981';
  };

  const getStatusText = (eta, status) => {
    if (status === 'stopped') return 'HALTED';
    if (eta <= 2) return 'ARRIVING';
    if (eta <= 5) return 'CLOSE';
    return 'EN ROUTE';
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#000810', color: '#E2E8F0', fontFamily: 'Inter, monospace' }}>
      {/* Header board */}
      <div className="border-b py-5 px-8 flex items-center justify-between"
        style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'linear-gradient(90deg, rgba(59,130,246,0.08), rgba(99,102,241,0.08))' }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)', boxShadow: '0 0 30px rgba(59,130,246,0.5)' }}>
            <Bus size={28} color="white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight led-text" style={{ color: '#F1F5F9', textShadow: '0 0 20px rgba(59,130,246,0.5)' }}>
              NEXTBUS 2.0
            </h1>
            <p className="text-sm tracking-widest uppercase" style={{ color: '#3B82F6' }}>Chennai Metro Transit — Live Departures</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-5xl font-black led-text" style={{ color: tick ? '#F1F5F9' : '#CBD5E1', textShadow: '0 0 15px rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
            {time.toLocaleTimeString('en-IN', { hour12: false })}
          </div>
          <p className="text-sm mt-1 tracking-widest" style={{ color: '#475569' }}>
            {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <div className="flex items-center justify-end gap-2 mt-1">
            <div className="live-dot" />
            <span className="text-xs tracking-wider" style={{ color: '#34D399' }}>LIVE FEED</span>
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div className="px-8 py-3 grid grid-cols-12 text-xs font-bold tracking-widest uppercase border-b"
        style={{ borderColor: 'rgba(255,255,255,0.05)', color: '#334155', background: 'rgba(255,255,255,0.02)' }}>
        <span className="col-span-1">Route</span>
        <span className="col-span-2">Bus No.</span>
        <span className="col-span-4">Destination</span>
        <span className="col-span-2 text-center">ETA</span>
        <span className="col-span-2 text-center">Occupancy</span>
        <span className="col-span-1 text-center">Status</span>
      </div>

      {/* Bus rows */}
      <div className="flex-1 overflow-hidden px-6 py-3 space-y-2">
        {sortedBuses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Bus size={48} style={{ color: '#1E293B' }} className="mb-4" />
            <p className="text-xl tracking-widest" style={{ color: '#1E293B' }}>AWAITING FEED...</p>
          </div>
        ) : sortedBuses.map((bus, i) => {
          const etaColor = getStatusColor(bus.eta);
          const statusText = getStatusText(bus.eta, bus.status);
          const occPct = Math.round((bus.passengerCount / bus.capacity) * 100);

          return (
            <div key={bus.vehicleId}
              className="grid grid-cols-12 items-center px-4 py-4 rounded-xl transition-all"
              style={{
                background: i === 0 ? 'rgba(59,130,246,0.07)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${i === 0 ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)'}`,
                animation: i === 0 ? 'none' : undefined
              }}>

              {/* Route badge */}
              <div className="col-span-1">
                <span className="text-sm font-black px-2 py-1 rounded-lg"
                  style={{ background: bus.routeColor + '22', color: bus.routeColor, border: `1px solid ${bus.routeColor}44` }}>
                  {bus.routeName}
                </span>
              </div>

              {/* Bus number */}
              <div className="col-span-2">
                <p className="font-bold text-white led-text text-base tracking-wider">{bus.busNumber}</p>
                <p className="text-xs" style={{ color: '#334155' }}>{bus.busName}</p>
              </div>

              {/* Route */}
              <div className="col-span-4 flex items-center gap-2">
                <span className="text-sm font-medium text-white">{bus.routeStart}</span>
                <ArrowRight size={12} style={{ color: '#334155', flexShrink: 0 }} />
                <span className="text-sm font-bold" style={{ color: bus.routeColor }}>{bus.routeEnd}</span>
              </div>

              {/* ETA */}
              <div className="col-span-2 text-center">
                <span className="text-3xl font-black led-text" style={{ color: etaColor, textShadow: `0 0 15px ${etaColor}66` }}>
                  {bus.eta}
                </span>
                <span className="text-xs ml-1" style={{ color: '#475569' }}>min</span>
                <p className="text-xs mt-0.5" style={{ color: '#334155' }}>Next: {bus.nextStop}</p>
              </div>

              {/* Occupancy */}
              <div className="col-span-2 px-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: '#475569' }}>{bus.passengerCount}/{bus.capacity}</span>
                  <span style={{ color: occPct > 85 ? '#EF4444' : occPct > 60 ? '#F59E0B' : '#10B981' }}>{occPct}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${occPct}%`,
                      background: `linear-gradient(90deg, ${occPct > 85 ? '#EF444466' : occPct > 60 ? '#F59E0B66' : '#10B98166'}, ${occPct > 85 ? '#EF4444' : occPct > 60 ? '#F59E0B' : '#10B981'})`
                    }} />
                </div>
              </div>

              {/* Status */}
              <div className="col-span-1 text-center">
                <span className="text-xs font-black tracking-widest px-2 py-1 rounded-lg led-text"
                  style={{ color: etaColor, background: etaColor + '15', border: `1px solid ${etaColor}33`, textShadow: `0 0 8px ${etaColor}66` }}>
                  {statusText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer ticker */}
      <div className="border-t py-3 px-8 flex items-center gap-6" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
        <Zap size={14} style={{ color: '#3B82F6', flexShrink: 0 }} />
        <div className="flex-1 overflow-hidden">
          <p className="text-xs tracking-widest" style={{ color: '#1E3A5F', animation: 'pulse 2s infinite' }}>
            POWERED BY NEXTBUS 2.0 · SMART CITY TRANSPORT INITIATIVE · CHENNAI · REAL-TIME TRACKING · NO GPS REQUIRED ·
            ALL TIMES ARE ESTIMATED · PLEASE CHECK THE DISPLAY BEFORE BOARDING
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#1E3A5F', flexShrink: 0 }}>
          <RefreshCw size={10} className="animate-spin" style={{ animationDuration: '3s' }} />
          Auto-refresh
        </div>
      </div>
    </div>
  );
}
