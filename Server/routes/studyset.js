// server/src/routes/studyset.js

import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

/**
 * GET /api/study-sets
 * Returns all study sets (with their terms) for the authenticated user.
 */
router.get('/study-sets', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    // Validate user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Fetch sets + nested terms
    const { data, error } = await supabase
      .from('study_sets')
      .select(`
        id,
        title,
        description,
        created_at,
        terms (
          id,
          term,
          definition,
          created_at
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error('GET /api/study-sets error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/study-sets
 * Creates a new study set (and all its terms) for the authenticated user.
 * Expects body: { title: string, description?: string, terms: Array<{term: string, definition: string}> }
 */
router.post('/study-sets', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    // Validate user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { title, description, terms } = req.body;
    if (!title || !Array.isArray(terms) || terms.length === 0) {
      return res
        .status(400)
        .json({ error: 'Title and at least one term are required.' });
    }

    // 1) Insert the study set
    const { data: newSet, error: setError } = await supabase
      .from('study_sets')
      .insert([{ user_id: user.id, title, description }])
      .select('id')
      .single();
    if (setError) {
      return res.status(500).json({ error: setError.message });
    }

    // 2) Insert all associated terms
    const termRows = terms.map((t) => ({
      set_id: newSet.id,
      term: t.term,
      definition: t.definition
    }));
    const { error: termsError } = await supabase
      .from('terms')
      .insert(termRows);
    if (termsError) {
      return res.status(500).json({ error: termsError.message });
    }

    return res.status(201).json({ id: newSet.id });
  } catch (err) {
    console.error('POST /api/study-sets error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
