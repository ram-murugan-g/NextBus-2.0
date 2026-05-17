import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useBusStore } from '../store/busStore';

// ─── Bus marker using pure CSS div (no SVG filters that break anchor calc) ───
const createBusIcon = (color, bearing = 0, isSelected = false) => {
  // Fixed 32×32 px marker regardless of selection — selection shown via ring only
  const SIZE = 32;
  const HALF = SIZE / 2;

  // Direction arrow (small triangle on top)
  const arrowSvg = `
    <svg width="10" height="8" viewBox="0 0 10 8" style="position:absolute;top:-7px;left:11px;display:block;">
      <polygon points="5,0 10,8 0,8" fill="${color}" opacity="0.95"/>
    </svg>`;

  const ring = isSelected
    ? `position:absolute;top:-5px;left:-5px;width:${SIZE + 10}px;height:${SIZE + 10}px;border-radius:50%;border:2px solid ${color};opacity:0.6;pointer-events:none;`
    : '';

  const html = `
    <div style="
      position:relative;
      width:${SIZE}px;
      height:${SIZE}px;
    ">
      ${isSelected ? `<div style="${ring}"></div>` : ''}
      <div style="
        width:${SIZE}px;
        height:${SIZE}px;
        background:${color};
        border-radius:50%;
        border:2.5px solid rgba(255,255,255,0.85);
        box-shadow:0 2px 6px rgba(0,0,0,0.45);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:15px;
        line-height:1;
        transform:rotate(${bearing}deg);
        box-sizing:border-box;
        overflow:hidden;
      ">🚌</div>
      ${arrowSvg}
    </div>`;

  return L.divIcon({
    html,
    // CRITICAL: className must be empty string to prevent Leaflet adding
    // its own .leaflet-div-icon styles (white bg + border) that shift the element
    className: '',
    // iconSize must exactly match the outer div dimensions
    iconSize: [SIZE, SIZE],
    // iconAnchor = center of the icon so lat/lng maps to center
    iconAnchor: [HALF, HALF],
    popupAnchor: [0, -(HALF + 8)]
  });
};

// ─── Personal vehicle marker ─────────────────────────────────────────────────
const createVehicleIcon = (type) => {
  const emojis = { car: '🚗', bike: '🏍️', school_bus: '🚌', office_van: '🚐', bus: '🚌' };
  const emoji = emojis[type] || '🚗';
  const html = `
    <div style="
      width:34px;height:34px;
      background:rgba(10,14,26,0.92);
      border:2px solid rgba(139,92,246,0.7);
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:17px;line-height:1;
      box-shadow:0 0 10px rgba(139,92,246,0.35);
      box-sizing:border-box;overflow:hidden;
    ">${emoji}</div>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -21]
  });
};

// ─── Auto-fly to selected bus ────────────────────────────────────────────────
function MapController({ selectedBus }) {
  const map = useMap();
  useEffect(() => {
    if (selectedBus) {
      map.flyTo([selectedBus.lat, selectedBus.lng], 15, { duration: 1.2, easeLinearity: 0.5 });
    }
  }, [selectedBus?.vehicleId, selectedBus?.lat, selectedBus?.lng]);
  return null;
}

// ─── Main map component ──────────────────────────────────────────────────────
export default function MapView({ personalVehicles = [] }) {
  const { selectedBus, setSelectedBus, getFilteredBuses } = useBusStore();
  const filteredBuses = getFilteredBuses();

  return (
    <MapContainer
      center={[13.0500, 80.2350]}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
      preferCanvas={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={19}
      />
      <MapController selectedBus={selectedBus} />

      {/* Route polyline for selected bus */}
      {selectedBus?.routePoints && (
        <Polyline
          positions={selectedBus.routePoints.map(p => [p.lat, p.lng])}
          pathOptions={{
            color: selectedBus.routeColor || '#3B82F6',
            weight: 4,
            opacity: 0.75,
            dashArray: '10 6',
            lineCap: 'round'
          }}
        />
      )}

      {/* Bus markers */}
      {filteredBuses.map((bus) => (
        <Marker
          key={bus.vehicleId}
          position={[bus.lat, bus.lng]}
          icon={createBusIcon(
            bus.routeColor || '#3B82F6',
            bus.bearing || 0,
            selectedBus?.vehicleId === bus.vehicleId
          )}
          eventHandlers={{ click: () => setSelectedBus(bus) }}
        >
          <Popup closeButton={false} className="bus-popup">
            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '210px', padding: '4px 2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{
                  background: bus.routeColor + '28', color: bus.routeColor,
                  padding: '2px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700,
                  border: `1px solid ${bus.routeColor}44`
                }}>
                  {bus.routeName}
                </span>
                <span style={{ color: '#10B981', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 6, height: 6, background: '#10B981', borderRadius: '50%', display: 'inline-block' }}></span>
                  Live
                </span>
              </div>
              <p style={{ fontWeight: 700, fontSize: '15px', margin: '0 0 2px 0', color: '#F1F5F9' }}>{bus.busNumber}</p>
              <p style={{ color: '#64748B', fontSize: '11px', margin: '0 0 10px 0' }}>{bus.busName} · {bus.routeDisplayName}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '12px', marginBottom: '10px' }}>
                <div style={{ background: 'rgba(59,130,246,0.08)', padding: '6px 8px', borderRadius: '8px' }}>
                  <div style={{ color: '#64748B', fontSize: '10px', marginBottom: '2px' }}>ETA</div>
                  <strong style={{ color: '#F1F5F9' }}>{bus.eta} min</strong>
                </div>
                <div style={{ background: 'rgba(245,158,11,0.08)', padding: '6px 8px', borderRadius: '8px' }}>
                  <div style={{ color: '#64748B', fontSize: '10px', marginBottom: '2px' }}>Speed</div>
                  <strong style={{ color: '#F1F5F9' }}>{bus.speed} km/h</strong>
                </div>
                <div style={{ background: 'rgba(16,185,129,0.08)', padding: '6px 8px', borderRadius: '8px', gridColumn: '1/-1' }}>
                  <div style={{ color: '#64748B', fontSize: '10px', marginBottom: '2px' }}>Passengers</div>
                  <strong style={{ color: '#F1F5F9' }}>{bus.passengerCount} / {bus.capacity}</strong>
                </div>
              </div>
              <button
                onClick={() => setSelectedBus(bus)}
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                  color: 'white', border: 'none', borderRadius: '8px',
                  padding: '7px 16px', width: '100%', cursor: 'pointer',
                  fontWeight: 600, fontSize: '12px', fontFamily: 'Inter, sans-serif'
                }}>
                Track This Bus →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Personal vehicle markers */}
      {personalVehicles.map((pv) => pv.simLat && (
        <Marker
          key={pv._id || pv.id}
          position={[pv.simLat, pv.simLng]}
          icon={createVehicleIcon(pv.vehicle_id?.type || 'car')}
        >
          <Popup closeButton={false}>
            <div style={{ fontFamily: 'Inter, sans-serif' }}>
              <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px 0', color: '#F1F5F9' }}>{pv.nickname}</p>
              <p style={{ color: '#94A3B8', fontSize: '12px', margin: 0 }}>{pv.vehicle_id?.vehicle_number}</p>
              <p style={{ color: '#64748B', fontSize: '11px', margin: '2px 0 0 0', textTransform: 'capitalize' }}>
                {pv.vehicle_id?.type?.replace('_', ' ')}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
