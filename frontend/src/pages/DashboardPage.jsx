import React from 'react';
import { useLogoutMutation, useMeQuery } from '../hooks/useAuthQuery';

export const DashboardPage = () => {
  const { data: me, isLoading } = useMeQuery();
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ marginTop: 0, marginBottom: '0.25rem' }}>Dashboard</h2>
            <p style={{ marginTop: 0, fontSize: '0.9rem', color: '#4b5563' }}>
              This page is protected by JWT access token.
            </p>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => logout()}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Signing out...' : 'Logout'}
          </button>
        </div>

        {isLoading ? (
          <p>Loading your profile...</p>
        ) : me ? (
          <div style={{ marginTop: '1rem' }}>
            <div className="badge">Authenticated</div>
            <h3 style={{ marginTop: '0.75rem', marginBottom: '0.25rem' }}>
              Welcome, {me.name}
            </h3>
            <p style={{ marginTop: 0, fontSize: '0.9rem', color: '#4b5563' }}>
              Email: {me.email}
            </p>
          </div>
        ) : (
          <p>Could not load user information.</p>
        )}
      </div>
    </div>
  );
};
