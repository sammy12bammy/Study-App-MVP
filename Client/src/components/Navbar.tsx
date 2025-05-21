'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navbar() {
  const router = useRouter();

  const handleCreateSet = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      router.push('/sets');
    } else {
      router.push('/login');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#000' }}>
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          <img
            src="/logo-placeholder.png"
            alt="StudyBean Logo"
            width="40"
            height="40"
            className="d-inline-block align-text-top me-2"
          />
          <span style={{ color: 'rgb(230,119,71)', fontWeight: 'bold' }}>StudyBean</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
          <li className="nav-item">
              <Link className="nav-link" href="/sets">My Sets</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/create-cards">Create Cards</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/quick-study">Quick Study</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
