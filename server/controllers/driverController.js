import { v4 as uuidv4 } from 'uuid';
import { db, saveDB } from '../config/db.js';
import { addDriverBus, removeDriverBus, updateBusPassengers } from '../simulation/busSimulator.js';

export const getDriverVehicles = async (req, res) => {
  try {
    await db.read();
    const vehicles = db.data.vehicles.filter(v => v.driver_id === req.user.id && v.is_public);
    res.json(vehicles.map(v => ({ ...v, _id: v.id })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const startDriverTrip = async (req, res) => {
  try {
    const { vehicleId, routeId } = req.body;
    await db.read();
    let vehicle = db.data.vehicles.find(v => v.id === vehicleId);

    // If no vehicleId provided, create on-the-fly
    if (!vehicle && req.body.vehicleNumber) {
      vehicle = { id: uuidv4(), name: `Bus ${req.body.vehicleNumber}`, type: 'bus', vehicle_number: req.body.vehicleNumber, capacity: 60, is_public: true, owner_id: req.user.id, driver_id: req.user.id, created_at: new Date().toISOString() };
      db.data.vehicles.push(vehicle);
      await saveDB();
    }

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const trip = { id: uuidv4(), vehicle_id: vehicle.id, route_id: routeId, status: 'running', start_time: new Date().toISOString(), end_time: null };
    db.data.trips.push(trip);
    await saveDB();

    addDriverBus(trip.id, vehicle.id, routeId, vehicle);
    res.json({ message: 'Trip started', trip: { ...trip, _id: trip.id } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePassengerCount = async (req, res) => {
  try {
    const { vehicleId, count } = req.body;
    await db.read();
    const idx = db.data.passengerData.findIndex(p => p.vehicle_id === vehicleId);
    if (idx >= 0) {
      db.data.passengerData[idx].current_count = count;
      db.data.passengerData[idx].updated_at = new Date().toISOString();
    } else {
      db.data.passengerData.push({ id: uuidv4(), vehicle_id: vehicleId, current_count: count, updated_at: new Date().toISOString() });
    }
    await saveDB();
    updateBusPassengers(vehicleId, count);
    res.json({ message: 'Count updated', count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const stopDriverTrip = async (req, res) => {
  try {
    const { tripId } = req.body;
    await db.read();
    const idx = db.data.trips.findIndex(t => t.id === tripId);
    if (idx >= 0) {
      db.data.trips[idx].status = 'stopped';
      db.data.trips[idx].end_time = new Date().toISOString();
      await saveDB();
    }
    removeDriverBus(tripId);
    res.json({ message: 'Trip stopped' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
