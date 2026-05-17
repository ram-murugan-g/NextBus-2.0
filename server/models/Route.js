import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  route_name: { type: String, required: true },
  start_location: { type: String, required: true },
  end_location: { type: String, required: true }
}, { timestamps: { createdAt: 'created_at' } });

export default mongoose.model('Route', routeSchema);
