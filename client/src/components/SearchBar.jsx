import { Search, X } from 'lucide-react';
import { useBusStore } from '../store/busStore';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, setSelectedBus } = useBusStore();

  return (
    <div className="relative">
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }} />
      <input
        id="bus-search-input"
        type="text"
        className="input-dark text-sm"
        style={{ height: '40px', paddingLeft: '2.25rem', paddingRight: searchQuery ? '2rem' : '0.75rem' }}
        placeholder="Search bus, route, stop..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button onClick={() => { setSearchQuery(''); setSelectedBus(null); }}
          className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}
