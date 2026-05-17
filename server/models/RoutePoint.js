import mongoose from 'mongoose';

const routePointSchema = new mongoose.Schema({
  route_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  sequence_order: { type: Number, required: true },
  stop_name: { type: String }
});

routePointSchema.index({ route_id: 1, sequence_order: 1 });

export default mongoose.model('RoutePoint', routePointSchema);
