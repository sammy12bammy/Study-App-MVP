/**
 * This is a universal footer used by all the pages. Simple links to point to various information.
 * Not need for authenication
 * 
 * @returns HTML skeletion
 */

export default function Footer() {
    return (
      <footer className="text-white" style={{ backgroundColor: '#000' }}>
        <div className="container text-center">
          <div className="d-flex flex-wrap justify-content-center gap-4 mb-2">
            <a href="#" className="text-muted text-decoration-none">Privacy</a>
            <a href="#" className="text-muted text-decoration-none">About</a>
            <a href="#" className="text-muted text-decoration-none">Buy me a coffee</a>
            <a href="#" className="text-muted text-decoration-none">Contact</a>
          </div>
          <div className="text-muted" style={{ fontSize: '0.9rem' }}>
            © {new Date().getFullYear()} StudyBean. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }
  