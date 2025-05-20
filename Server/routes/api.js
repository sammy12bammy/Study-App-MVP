import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Get study sets for the logged-in user
router.get('/study-sets', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  // Validate the user
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user) return res.status(401).json({ error: 'Invalid token' });

  // Fetch the sets for the user
  const { data, error } = await supabase
    .from('study_sets')
    .select('*')
    .eq('user_id', user.id);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

export default router;

