'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Flashcard = { term: string; definition: string };

export default function CreateSetPage(){
  const router = useRouter();
  const [mode, setMode] = useState<'manual' | 'pdf' | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { term: '', definition: '' },
  ]);
  const [error, setError] = useState('');

  //3 modes for manipulating flashcards
  const addFlashcard = () =>
    setFlashcards([...flashcards, { term: '', definition: '' }]);
  const removeFlashcard = (i: number) =>
    setFlashcards(flashcards.filter((_, idx) => idx !== i));
  const updateFlashcard = (i: number, field: keyof Flashcard, v: string) => {
    const copy = [...flashcards];
    copy[i][field] = v;
    setFlashcards(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1) ensure logged in
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if(!session) {
      router.push('/login');
      return;
    }
    console.log('user is logged in');

    // 2) validation
    if(!title.trim() || flashcards.some((f) => !f.term.trim())) {
      setError('Please provide a title and at least one term.');
      return;
    }
    console.log('user enter valid card');

    // 3) POST to  server
    const res = await fetch('http://localhost:5001/api/study-sets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ title, description, terms: flashcards }),
    });
    console.log('res has been fetched with or without error');

    if (res.ok) {
      router.push('/sets');
    } else {
      const body = await res.json();
      setError(body.error || 'Failed to create study set');
      console.log('error creating set');
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
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>

            <div>
              <label className="form-label">Terms & Definitions</label>
              {flashcards.map((f, i) => (
                <div key={i} className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Term"
                    className="form-control"
                    value={f.term}
                    onChange={(e) =>
                      updateFlashcard(i, 'term', e.target.value)
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Definition"
                    className="form-control"
                    value={f.definition}
                    onChange={(e) =>
                      updateFlashcard(i, 'definition', e.target.value)
                    }
                  />
                  {flashcards.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => removeFlashcard(i)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={addFlashcard}
              >
                + Add another term
              </button>
            </div>

            {error && <p className="text-danger">{error}</p>}

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                Create Set
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
            <p>PDF upload coming soon!</p>
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
