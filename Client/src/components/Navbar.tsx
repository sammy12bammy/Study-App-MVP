/**
 * This is a universal navbar used by all the pages hence why its in components.
 * Supabase is imported because the login button is used. Might have 2 different 
 * navbars later for logged in users and not login in users.
 * frame
 *
 * @returns HTML Skeleton + Bootstrap
 */

'use client';
//image not in use but will change when I get a logo
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navbar() {
  const router = useRouter();

  //This is where the authencation from Supabase happens, speciffically for trying to access a set. A if/else statement lets the router
  //know if the user is login and if not, the user is redirect to the login page

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#000' }}>
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          <img
            //the logo does not currently exsist so I used a place holder for now
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
              <Link className="nav-link" href="/test">Practice Set</Link>
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
