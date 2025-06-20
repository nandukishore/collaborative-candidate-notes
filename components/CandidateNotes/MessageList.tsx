
import React, { useEffect, useRef } from 'react';
import { NoteMessage, User } from '../../types';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface MessageListProps {
  notes: NoteMessage[];
  currentUserId: string;
  users: User[];
  highlightedMessageId: string | null;
}

const MessageList: React.FC<MessageListProps> = ({ notes, currentUserId, users, highlightedMessageId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const highlightedMessageRef = useRef<HTMLDivElement>(null);

  const getUser = (userId: string) => users.find(u => u.id === userId);

  useEffect(() => {
    if (highlightedMessageId && highlightedMessageRef.current) {
      highlightedMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [notes, highlightedMessageId]);

  if (notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 p-4">
        No notes yet for this candidate. Be the first to add one!
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 rounded-md mb-4">
      {notes.map((note) => {
        const isCurrentUser = note.userId === currentUserId;
        const sender = getUser(note.userId);
        const isHighlighted = note.id === highlightedMessageId;

        return (
          <div
            key={note.id}
            ref={isHighlighted ? highlightedMessageRef : null}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow
                ${isCurrentUser ? 'bg-sky-600 text-white ml-auto' : 'bg-white text-slate-800 mr-auto'}
                ${isHighlighted ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}
              `}
            >
              {!isCurrentUser && sender && (
                <div className="flex items-center mb-1">
                   <UserCircleIcon className="h-5 w-5 text-slate-400 mr-1.5" />
                  <span className="text-xs font-semibold text-slate-600">{sender.name}</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap break-words">{note.text}</p>
              <p className={`text-xs mt-1.5 ${isCurrentUser ? 'text-sky-200' : 'text-slate-400'} text-right`}>
                {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
    