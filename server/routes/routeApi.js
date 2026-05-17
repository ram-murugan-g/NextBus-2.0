import express from 'express';
import Route from '../models/Route.js';
import RoutePoint from '../models/RoutePoint.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id/points', async (req, res) => {
  try {
    const points = await RoutePoint.find({ route_id: req.params.id }).sort({ sequence_order: 1 });
    res.json(points);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
