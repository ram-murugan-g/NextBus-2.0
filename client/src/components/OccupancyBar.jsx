import { Users } from 'lucide-react';

const getOccupancyColor = (count, capacity) => {
  const pct = count / capacity;
  if (pct >= 0.85) return '#EF4444';
  if (pct >= 0.6) return '#F59E0B';
  return '#10B981';
};

const getOccupancyLabel = (count, capacity) => {
  const pct = count / capacity;
  if (pct >= 0.85) return 'Crowded';
  if (pct >= 0.6) return 'Moderate';
  return 'Available';
};

export default function OccupancyBar({ count, capacity, showLabel = true }) {
  const pct = Math.min(100, Math.round((count / capacity) * 100));
  const color = getOccupancyColor(count, capacity);

  return (
    <div>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: '#94A3B8' }}>
            <Users size={12} />
            <span>Occupancy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold" style={{ color }}>{count}/{capacity}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}>
              {getOccupancyLabel(count, capacity)}
            </span>
          </div>
        </div>
      )}
      <div className="occ-bar">
        <div className="occ-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}aa, ${color})` }} />
      </div>
      {!showLabel && (
        <p className="text-right text-xs mt-1 font-medium" style={{ color }}>{count}/{capacity}</p>
      )}
    </div>
  );
}
