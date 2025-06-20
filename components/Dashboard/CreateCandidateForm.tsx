
import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useAuth } from '../../hooks/useAuth';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { UserPlusIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface CreateCandidateFormProps {
  onSuccess?: () => void;
}

const CreateCandidateForm: React.FC<CreateCandidateFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addCandidate } = useAppContext();
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email) {
      setError('Please fill in all fields.');
      return;
    }
    if (!currentUser) {
      setError('You must be logged in to create a candidate.');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newCandidate = addCandidate({ name, email }, currentUser.id);
    setLoading(false);

    if (newCandidate) {
      setName('');
      setEmail('');
      if (onSuccess) onSuccess();
    } else {
      setError('Failed to create candidate. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md">{error}</p>}
      <Input
        id="candidateName"
        label="Candidate Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Ada Lovelace"
        Icon={UserPlusIcon}
        disabled={loading}
        required
      />
      <Input
        id="candidateEmail"
        label="Candidate Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="e.g., ada@example.com"
        Icon={EnvelopeIcon}
        disabled={loading}
        required
      />
      <div className="flex justify-end">
        <Button type="submit" variant="primary" isLoading={loading}>
          Create Candidate
        </Button>
      </div>
    </form>
  );
};

export default CreateCandidateForm;
    