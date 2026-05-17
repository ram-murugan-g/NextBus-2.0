import mongoose from 'mongoose';

const userVehicleSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  nickname: { type: String, default: '' }
});

export default mongoose.model('UserVehicle', userVehicleSchema);
