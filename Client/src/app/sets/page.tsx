'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface StudySet {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export default function SetsPage() {
  const router = useRouter();
  const [sets, setSets] = useState<StudySet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSets = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/study-sets', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.status === 401) {
          router.push('/login');
          return;
        }

        const data = await response.json();
        setSets(data);
      } catch (error) {
        console.error('Failed to fetch sets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, [router]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <Navbar />

      <main className="flex-grow-1 container py-5">
        {loading ? (
          <p>Loading your study sets...</p>
        ) : sets.length === 0 ? (
          <div className="text-center">
            <p>You do not have any sets yet.</p>
            <Link href="/create">
              <button className="btn btn-primary mt-3">Create a New Set</button>
            </Link>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Your Study Sets</h2>
              <Link href="/create">
                <button className="btn btn-primary">Create Set</button>
              </Link>
            </div>
            <div className="row g-4">
              {sets.map((set) => (
                <div key={set.id} className="col-12 col-sm-6 col-md-4">
                  <div className="card h-100 bg-secondary text-white">
                    <div className="card-body">
                      <h5 className="card-title">{set.title}</h5>
                      <p className="card-text">{set.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
