import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  route_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  current_latitude: { type: Number, default: null },
  current_longitude: { type: Number, default: null },
  current_point_index: { type: Number, default: 0 },
  direction: { type: Number, default: 1 },
  status: { type: String, enum: ['running', 'stopped'], default: 'running' },
  start_time: { type: Date, default: Date.now },
  end_time: { type: Date, default: null }
});

export default mongoose.model('Trip', tripSchema);
