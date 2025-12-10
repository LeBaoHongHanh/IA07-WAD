import React from 'react';
import { useForm } from 'react-hook-form';

export const RegisterForm = ({ onSubmit, isLoading, error }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const passwordValue = watch('password');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          className="input"
          type="text"
          placeholder="Your name"
          {...register('name', {
            required: 'Name is required'
          })}
        />
        {errors.name && <div className="error">{errors.name.message}</div>}
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          className="input"
          type="email"
          placeholder="you@example.com"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email format'
            }
          })}
        />
        {errors.email && <div className="error">{errors.email.message}</div>}
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          className="input"
          type="password"
          placeholder="••••••••"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'At least 6 characters' }
          })}
        />
        {errors.password && <div className="error">{errors.password.message}</div>}
      </div>

      <div className="field">
        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          className="input"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === passwordValue || 'Passwords do not match'
          })}
        />
        {errors.confirmPassword && <div className="error">{errors.confirmPassword.message}</div>}
      </div>

      {error && <div className="error" style={{ marginBottom: '0.75rem' }}>{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Logging up...' : 'Create account'}
        </button>
      </div>
    </form>
  );
};
