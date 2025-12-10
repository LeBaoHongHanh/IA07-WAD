import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center' }}>
        <h2 style={{ marginTop: 0 }}>404 - Page not found</h2>
        <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>
          The page you are looking for does not exist.
        </p>
        <Link to="/" className="btn" style={{ marginTop: '1rem' }}>
          Go to dashboard
        </Link>
      </div>
    </div>
  );
};
