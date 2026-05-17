import { v4 as uuidv4 } from 'uuid';
import { db, saveDB } from '../config/db.js';

export const addPersonalVehicle = async (req, res) => {
  try {
    const { name, type, vehicle_number, capacity, nickname } = req.body;
    if (!name || !vehicle_number)
      return res.status(400).json({ message: 'Name and vehicle number required' });

    await db.read();
    const exists = db.data.vehicles.find(v => v.vehicle_number === vehicle_number);
    if (exists) return res.status(400).json({ message: 'Vehicle number already exists' });

    const vehicle = {
      id: uuidv4(), name, type: type || 'car', vehicle_number,
      capacity: capacity || 5, is_public: false, owner_id: req.user.id,
      driver_id: null, created_at: new Date().toISOString()
    };
    db.data.vehicles.push(vehicle);

    const userVehicle = {
      id: uuidv4(), user_id: req.user.id, vehicle_id: vehicle.id, nickname: nickname || name
    };
    db.data.userVehicles.push(userVehicle);

    const passengerData = { id: uuidv4(), vehicle_id: vehicle.id, current_count: 0, updated_at: new Date().toISOString() };
    db.data.passengerData.push(passengerData);

    await saveDB();
    res.status(201).json({ vehicle: { ...vehicle, _id: vehicle.id }, userVehicle: { ...userVehicle, _id: userVehicle.id, vehicle_id: { ...vehicle, _id: vehicle.id } } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserVehicles = async (req, res) => {
  try {
    await db.read();
    const uvs = db.data.userVehicles.filter(uv => uv.user_id === req.user.id);
    const result = uvs.map(uv => {
      const vehicle = db.data.vehicles.find(v => v.id === uv.vehicle_id);
      return { ...uv, _id: uv.id, vehicle_id: vehicle ? { ...vehicle, _id: vehicle.id } : null };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const { nickname } = req.body;
    await db.read();
    const idx = db.data.userVehicles.findIndex(uv => uv.id === req.params.id && uv.user_id === req.user.id);
    if (idx === -1) return res.status(404).json({ message: 'Vehicle not found' });
    db.data.userVehicles[idx].nickname = nickname;
    await saveDB();
    const uv = db.data.userVehicles[idx];
    const vehicle = db.data.vehicles.find(v => v.id === uv.vehicle_id);
    res.json({ ...uv, _id: uv.id, vehicle_id: vehicle ? { ...vehicle, _id: vehicle.id } : null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    await db.read();
    const uvIdx = db.data.userVehicles.findIndex(uv => uv.id === req.params.id && uv.user_id === req.user.id);
    if (uvIdx === -1) return res.status(404).json({ message: 'Vehicle not found' });
    const [uv] = db.data.userVehicles.splice(uvIdx, 1);
    db.data.vehicles = db.data.vehicles.filter(v => v.id !== uv.vehicle_id);
    db.data.passengerData = db.data.passengerData.filter(p => p.vehicle_id !== uv.vehicle_id);
    await saveDB();
    res.json({ message: 'Vehicle removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
