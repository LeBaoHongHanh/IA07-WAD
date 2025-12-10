import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from '../auth/components/RegisterForm';
import { useRegisterMutation } from '../hooks/useAuthQuery';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending, error } = useRegisterMutation();
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (values) => {
    setSuccessMessage('');
    try {
      await mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password
      });
      setSuccessMessage('Account created successfully. You can now sign in.');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (e) {
      // error handled in error object
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
        <h2 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Create account</h2>
        <p style={{ marginTop: 0, marginBottom: '1.25rem', fontSize: '0.9rem', color: '#4b5563' }}>
          Sign up with a name, email and password.
        </p>
        <RegisterForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          error={error?.message}
        />
        {successMessage && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#15803d' }}>
            {successMessage}
          </div>
        )}
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};
