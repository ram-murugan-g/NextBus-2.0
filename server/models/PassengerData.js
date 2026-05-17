import mongoose from 'mongoose';

const passengerDataSchema = new mongoose.Schema({
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  current_count: { type: Number, default: 0 },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('PassengerData', passengerDataSchema);
