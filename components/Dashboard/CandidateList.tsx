
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { useAuth } from '../../hooks/useAuth';
import Card from '../UI/Card';
import { UserGroupIcon, ChevronRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const CandidateList: React.FC = () => {
  const { getCandidates, users } = useAppContext();
  const { currentUser } = useAuth();
  const candidates = getCandidates();

  if (!currentUser) return null;

  const getUserName = (userId: string) => users.find(u => u.id === userId)?.name || 'Unknown User';

  return (
    <Card title="Candidates" className="shadow-xl">
      {candidates.length === 0 ? (
        <div className="text-center py-10">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">No candidates yet</h3>
          <p className="mt-1 text-sm text-slate-500">Get started by creating a new candidate.</p>
        </div>
      ) : (
        <ul role="list" className="divide-y divide-slate-200">
          {candidates.map((candidate) => (
            <li key={candidate.id} className="py-4 hover:bg-slate-50 transition-colors duration-150">
              <Link to={`/candidate/${candidate.id}/notes`} className="flex items-center justify-between px-2">
                <div className="flex-1 min-w-0">
                  <p className="text-md font-semibold text-sky-700 truncate">{candidate.name}</p>
                  <p className="text-sm text-slate-500 truncate">{candidate.email}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Added by: {getUserName(candidate.createdBy)} on {new Date(candidate.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-slate-400" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default CandidateList;
    