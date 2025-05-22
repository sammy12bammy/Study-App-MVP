/**
 * This is where the signup happens. Makes a direct call to supabase and supabase does most of the heavy lifting.
 * Navbar and Footer imported from components
 * 
 * @returns : HTML Skeleton
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/*
  variables declared with react states as imported above. A react event is created that gets 
  data from supabase. Error is checked with this event and if there is no error, the user is
  directed to the sets page
*/
export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/sets'); // Or show verification notice
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <Navbar />

      <main className="flex-grow-1 container py-5">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label>Email</label>
            <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
