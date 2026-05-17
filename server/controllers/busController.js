import { getActiveBuses } from '../simulation/busSimulator.js';

export const getAllBuses = (req, res) => {
  try {
    const buses = getActiveBuses();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBusById = (req, res) => {
  try {
    const buses = getActiveBuses();
    const bus = buses.find(b => b.vehicleId === req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found or inactive' });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
