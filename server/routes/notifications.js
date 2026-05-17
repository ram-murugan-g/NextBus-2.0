import express from 'express';
import { db } from '../config/db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await db.read();
    res.json(db.data.notifications?.filter(n => n.user_id === req.user?.id) || []);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/read', async (req, res) => {
  try {
    await db.read();
    const idx = db.data.notifications?.findIndex(n => n.id === req.params.id);
    if (idx >= 0) { db.data.notifications[idx].is_read = true; await db.write(); }
    res.json({ message: 'Marked as read' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
