
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/UI/Card';
import MessageList from '../components/CandidateNotes/MessageList';
import MessageInput from '../components/CandidateNotes/MessageInput';
import Spinner from '../components/UI/Spinner';
import { ArrowLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const CandidateNotesPage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { getCandidateById, getNotesForCandidate, users, addToast } = useAppContext();
  const { currentUser } = useAuth();
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState(true);
  const highlightedMessageIdRef = useRef<string | null>(location.state?.highlightedMessageId || null);

  useEffect(() => {
    // Clear the highlightedMessageId from location state after first use
    // to prevent re-highlighting on page refresh or back navigation if state persists.
    if (location.state?.highlightedMessageId) {
      window.history.replaceState({...window.history.state, highlightedMessageId: null }, '');
    }
  }, [location.state]);


  useEffect(() => {
    setIsLoading(true);
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [candidateId]);

  if (!candidateId || !currentUser) {
    // Should be caught by ProtectedRoute or router, but as a fallback:
    return <Navigate to="/dashboard" replace />; // Or an error page
  }
  
  const candidate = getCandidateById(candidateId);
  const notes = getNotesForCandidate(candidateId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!candidate) {
    addToast({message: `Candidate with ID ${candidateId} not found.`, type: 'error'});
    return (
      <Card title="Error">
        <p>Candidate not found.</p>
        <Link to="/dashboard" className="text-sky-600 hover:underline mt-4 block">
          Back to Dashboard
        </Link>
      </Card>
    );
  }
  
  const getUsernameById = (userId: string): string => {
    return users.find(u => u.id === userId)?.name || 'Unknown User';
  };

  return (
    <div className="space-y-6">
      <Link to="/dashboard" className="inline-flex items-center text-sm text-sky-600 hover:text-sky-800 font-medium">
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Link>
      <Card title={`Notes for ${candidate.name}`} className="shadow-xl">
        <div className="mb-4 pb-4 border-b border-slate-200">
            <p className="text-slate-600">Email: {candidate.email}</p>
            <p className="text-slate-500 text-sm">
                Candidate created by {getUsernameById(candidate.createdBy)} on {new Date(candidate.createdAt).toLocaleDateString()}
            </p>
        </div>
        <div className="flex flex-col h-[calc(100vh-300px)] md:h-[calc(100vh-350px)]"> {/* Adjust height as needed */}
          <MessageList 
            notes={notes} 
            currentUserId={currentUser.id} 
            users={users} 
            highlightedMessageId={highlightedMessageIdRef.current}
          />
          <MessageInput candidateId={candidate.id} />
        </div>
      </Card>
    </div>
  );
};
// Helper, as Navigate is not available at top-level in this file
const Navigate: React.FC<{ to: string, replace?: boolean }> = ({ to, replace }) => {
  const navigate = ReactRouterDom_useNavigate(); // Alias to avoid conflict if `useNavigate` is imported above
  React.useEffect(() => {
    navigate(to, { replace });
  }, [navigate, to, replace]);
  return null;
};
// Explicitly import useNavigate from react-router-dom for the Navigate helper
import { useNavigate as ReactRouterDom_useNavigate } from 'react-router-dom';


export default CandidateNotesPage;
    