import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['bus', 'school_bus', 'office_van', 'car', 'bike'], required: true },
  vehicle_number: { type: String, required: true, unique: true },
  capacity: { type: Number, default: 50 },
  is_public: { type: Boolean, default: false },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  driver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model('Vehicle', vehicleSchema);
