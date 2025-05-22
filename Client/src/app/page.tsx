'use client';


//main landing page!!
/** This is the main landing/ home page. Although not fully impemented, this page should contain info
 * about StudyBean, as well as have users sign up/ login.
 * 
 * @returns : HTML Skeletion
 */

import { useEffect, useState } from 'react';
//import navbar and Footer from the components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';

/*
  The function home has no effect on the actual website. All it does is makes a request to the Server. This server
  actually handles writting to the supabase databse. Home test that the backend works and throws a error if it doesn't
  Will probably get rid of in production
*/
export default function Home() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    //call to the Server which is hosted on the port below
    fetch('http://localhost:5001/api/message')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('API error:', err));
  }, []);

  return (  
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#121212' }}>
      {/*NavBar uploaded from imported module above*/}
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
            <Link href="/signup" className="btn btn-outline-light px-4 py-2">
              Sign Up
            </Link>
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
