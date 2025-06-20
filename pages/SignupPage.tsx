
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';
import { APP_NAME } from '../constants';
import { UserIcon, AtSymbolIcon, LockClosedIcon } from '@heroicons/react/24/outline';


const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    const success = await signup(name, email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      // Error toast is handled by AuthContext, can also set local error
      setError('Signup failed. The email might already be in use.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-sky-700">{APP_NAME}</h1>
         <p className="text-slate-600">Create an account to start collaborating.</p>
      </div>
      <Card className="w-full max-w-md" title="Create your account">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          <Input
            id="name"
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            Icon={UserIcon}
            disabled={authLoading}
            required
          />
          <Input
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            Icon={AtSymbolIcon}
            disabled={authLoading}
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            Icon={LockClosedIcon}
            disabled={authLoading}
            required
          />
          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            Icon={LockClosedIcon}
            disabled={authLoading}
            required
          />
          <Button type="submit" variant="primary" className="w-full" isLoading={authLoading}>
            Sign Up
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-sky-600 hover:text-sky-500">
            Log In
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default SignupPage;
    