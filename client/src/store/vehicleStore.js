import { create } from 'zustand';

export const useVehicleStore = create((set) => ({
  vehicles: [],
  loading: false,
  setVehicles: (vehicles) => set({ vehicles }),
  setLoading: (loading) => set({ loading }),
  addVehicle: (v) => set((s) => ({ vehicles: [...s.vehicles, v] })),
  removeVehicle: (id) => set((s) => ({ vehicles: s.vehicles.filter(v => v._id !== id) })),
  updateVehicle: (id, data) => set((s) => ({
    vehicles: s.vehicles.map(v => v._id === id ? { ...v, ...data } : v)
  }))
}));
