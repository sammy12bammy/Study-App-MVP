'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5001/api/message')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('API error:', err));
  }, []);

  return (
    <main className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
      <h1 className="display-4 text-primary mb-3">📚 StudyBean</h1>
      <p className="lead">Backend says: {message}</p>
      <button className="btn btn-primary mt-3">Get Started</button>
    </main>
  );
}
