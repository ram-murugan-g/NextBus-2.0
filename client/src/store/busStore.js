import { create } from 'zustand';

export const useBusStore = create((set, get) => ({
  buses: [],
  selectedBus: null,
  searchQuery: '',
  isConnected: false,

  setBuses: (buses) => set({ buses }),
  setSelectedBus: (bus) => set({ selectedBus: bus }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setConnected: (v) => set({ isConnected: v }),

  getFilteredBuses: () => {
    const { buses, searchQuery } = get();
    if (!searchQuery.trim()) return buses;
    const q = searchQuery.toLowerCase();
    return buses.filter(b =>
      b.busNumber?.toLowerCase().includes(q) ||
      b.routeName?.toLowerCase().includes(q) ||
      b.routeDisplayName?.toLowerCase().includes(q) ||
      b.busName?.toLowerCase().includes(q) ||
      b.routeStart?.toLowerCase().includes(q) ||
      b.routeEnd?.toLowerCase().includes(q)
    );
  }
}));
