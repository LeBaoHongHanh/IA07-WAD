import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '../auth/components/LoginForm';
import { useLoginMutation } from '../hooks/useAuthQuery';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const { mutateAsync, isPending, error } = useLoginMutation();

  const handleSubmit = async (values) => {
    try {
      await mutateAsync(values);
      navigate(from, { replace: true });
    } catch (e) {
      // error handled via error object
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
        <h2 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Login</h2>
        <p style={{ marginTop: 0, marginBottom: '1.25rem', fontSize: '0.9rem', color: '#4b5563' }}>
          Use your email and password to access the dashboard.
        </p>
        <LoginForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          error={error?.message}
        />
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};
