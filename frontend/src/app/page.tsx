'use client';


//main landing page!!


import { useEffect, useState } from 'react';
//import navbar and Footer from the components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


export default function Home() {
  const [message, setMessage] = useState('');
  //backend stuff has no effect yet
  useEffect(() => {
    fetch('http://localhost:5001/api/message')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('API error:', err));
  }, []);

  return (  
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#121212' }}>
      <Navbar />

      {/*Main content */}
      <main className="flex-grow-1 text-white text-center py-5">
        <section className="container mb-5">
          <h1 className="display-4 mb-4" style={{ color: 'rgb(230,119,71)' }}>
            Start Studying
          </h1>
          <p className="lead mb-4" style={{ color: 'rgb(181,170,170)' }}>
            BRAIN ROT STUDYING FUCK YEAH
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button className="btn btn-primary px-4 py-2" style={{ backgroundColor: 'rgb(230,119,71)', border: 'none' }}>
              Start Studying
            </button>
            <button className="btn btn-outline-light px-4 py-2">
              Sign Up
            </button>
          </div>
        </section>

        <section className="container mt-5 p-4" style={{ backgroundColor: '#1c1c1c', borderRadius: '10px' }}>
          <h2 className="h4 mb-3" style={{ color: 'rgb(230,119,71)' }}>How StudyBean Works</h2>
          <p style={{ color: 'rgb(181,170,170)' }}>
            WHOLE LOT OF YAPPING NO ONE CARES AHHAHA
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
