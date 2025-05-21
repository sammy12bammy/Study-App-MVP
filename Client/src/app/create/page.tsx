'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CreateSetPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'manual' | 'pdf' | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    const res = await fetch('http://localhost:5001/api/study-sets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      router.push('/sets');
    } else {
      const body = await res.json();
      setError(body.error || 'Failed to create study set');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <Navbar />

      <main className="flex-grow-1 container py-5">
        <h2 className="mb-4">Create a New Study Set</h2>

        {mode === null && (
          <div className="d-flex gap-3 flex-wrap justify-content-center">
            <button
              className="btn btn-outline-primary px-4 py-2"
              onClick={() => setMode('manual')}
            >
              Create Set Manually
            </button>

            <button
              className="btn btn-outline-light px-4 py-2"
              onClick={() => setMode('pdf')}
            >
              Upload a PDF (Coming Soon)
            </button>
          </div>
        )}

        {mode === 'manual' && (
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                Create
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setMode(null)}
              >
                Back
              </button>
            </div>
          </form>
        )}

        {mode === 'pdf' && (
          <div className="mt-4 text-center">
            <p>📄 PDF upload functionality coming soon!</p>
            <button className="btn btn-secondary" onClick={() => setMode(null)}>
              Back
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
