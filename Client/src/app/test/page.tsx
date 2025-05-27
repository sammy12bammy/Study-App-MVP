/** This page allows the users to create a practice test using their flashcard
 * The user will be authencated and thier study sets will be pulled from supabase.
 * Then a practice multiple choice test will be generated (20 questions) from random
 * flashcards. Random words similar to the answer will be generated with Datamuse Api
 * 
 *  @return : 
 */

'use client'

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Term {
  id: string;
  term: string;
  definition: string;
  created_at: string;
}

interface StudySet {
  id: string;
  title: string;
  description: string;
  created_at: string;
  terms: Term[];      // ← include nested terms
}

interface Question {
  prompt: string;
  options: string[];
  answer: string;
}

/** This function gets words similar to the word passed into the param using
 * the datamuse api. Used when user creates a practice test
 * 
 * @param word 
 * @returns 3 of the most similar words to 'word'
 */
async function getSimilarWords(word: string): Promise<string[]> {
  const response = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(word)}`);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data: { word: string; score: number }[] = await response.json();
  //Get the top 3 similar words
  return data.slice(0, 3).map(item => item.word);
}

/** Shuffle an array in‑place using Fisher‑Yates - fucking sick*/
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CreateTestPage() {
  const router = useRouter();

  // error handling
  const [error, setError] = useState('');
  // all the user's study sets
  const [sets, setSets] = useState<StudySet[]>([]);
  // which set the user chose
  const [selectedSetId, setSelectedSetId] = useState<string>('');
  // generated quiz questions
  const [questions, setQuestions] = useState<Question[]>([]);
  // user's answers keyed by question index
  const [answers, setAnswers] = useState<{ [idx: number]: string }>({});
  // whether to show results instead of the quiz form
  const [showResults, setShowResults] = useState(false);

  // on mount: fetch the user's study sets
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:5001/api/study-sets', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        const data: StudySet[] = await res.json();
        setSets(data);
      } catch (err: any) {
        console.error('Failed to fetch sets:', err);
        setError('Could not load your study sets.');
      }
    })();
  }, [router]);

  /** Generate a multiple‑choice quiz for the selected set */
  const generateQuestions = async () => {
    setError('');
    const setObj = sets.find(s => s.id === selectedSetId);
    if (!setObj) {
      setError('Please select a valid study set.');
      return;
    }

    try {
      // pick up to 20 random flashcards
      const pool = shuffle(setObj.terms);
      const sample = pool.slice(0, Math.min(20, pool.length));

      const qs: Question[] = [];
      for (const card of sample) {
        const correct = card.term;
        // two synonyms
        let sims = await getSimilarWords(correct).catch(() => []);
        sims = sims.filter(w => w.toLowerCase() !== correct.toLowerCase());
        // pick up to 2
        const distractors = sims.slice(0, 2);

        // one random term from another flashcard
        const others = setObj.terms
          .map(t => t.term)
          .filter(t => t !== correct && !distractors.includes(t));
        if (others.length > 0) {
          const rand = others[Math.floor(Math.random() * others.length)];
          distractors.push(rand);
        }

        // if still under 3 distractors, fill from pool
        while (distractors.length < 3) {
          const fallback = pool[Math.floor(Math.random() * pool.length)].term;
          if (fallback !== correct && !distractors.includes(fallback)) {
            distractors.push(fallback);
          }
        }

        // combine & shuffle options
        const options = shuffle([correct, ...distractors]).slice(0, 4);
        qs.push({
          prompt: card.definition,
          options,
          answer: correct,
        });
      }

      setQuestions(qs);
    } catch (err: any) {
      console.error('Error generating questions:', err);
      setError('Failed to generate test. Try again.');
    }
  };

  /** Track user selecting an answer */
  const handleAnswerChange = (idx: number, value: string) => {
    setAnswers(prev => ({ ...prev, [idx]: value }));
  };

  /** When user submits the quiz, show results */
  const handleSubmitTest = (e: FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  // if no sets loaded yet
  if (error && sets.length === 0) {
    return (
      <div className="container py-5 text-white">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <Navbar />

      <main className="flex-grow-1 container py-5">
        <h2 className="mb-4">Create a Practice Test</h2>
        {error && <p className="text-danger">{error}</p>}

        {/* Step 1: select which set to test on */}
        {!selectedSetId && (
          <div className="mb-4">
            <label className="form-label">Pick a Study Set:</label>
            <select
              className="form-select"
              value={selectedSetId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSelectedSetId(e.target.value)
              }
            >
              <option value="">-- Select one --</option>
              {sets.map(s => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
            <button
              className="btn btn-primary mt-3"
              onClick={generateQuestions}
              disabled={!selectedSetId}
            >
              Generate Test
            </button>
          </div>
        )}

        {/* Step 2: show quiz form */}
        {selectedSetId && questions.length > 0 && !showResults && (
          <form onSubmit={handleSubmitTest}>
            {questions.map((q, idx) => (
              <div key={idx} className="mb-4">
                <p>
                  <strong>Q{idx + 1}:</strong> {q.prompt}
                </p>
                {q.options.map(opt => (
                  <div className="form-check" key={opt}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`q-${idx}`}
                      value={opt}
                      id={`q-${idx}-${opt}`}
                      onChange={() => handleAnswerChange(idx, opt)}
                      required
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`q-${idx}-${opt}`}
                    >
                      {opt}
                    </label>
                  </div>
                ))}
              </div>
            ))}
            <button type="submit" className="btn btn-success">
              Submit Test
            </button>
          </form>
        )}

        {/* Step 3: show results */}
        {showResults && (
          <div>
            <h3>Your Results</h3>
            <p>
              Score:{' '}
              {questions.filter((q, i) => answers[i] === q.answer).length} /{' '}
              {questions.length}
            </p>
            {questions.map((q, idx) => (
              <div key={idx} className="mb-3">
                <p>
                  <strong>Q{idx + 1}:</strong> {q.prompt}
                </p>
                <p>
                  Your answer: <em>{answers[idx] || 'No answer'}</em>
                </p>
                <p>
                  Correct answer: <strong>{q.answer}</strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
