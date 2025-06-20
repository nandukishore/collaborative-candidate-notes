
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useAuth } from '../../hooks/useAuth';
import Button from '../UI/Button';
import { MAX_NOTE_LENGTH } from '../../constants';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface MessageInputProps {
  candidateId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ candidateId }) => {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isTypingTag, setIsTypingTag] = useState(false);
  const [tagQuery, setTagQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { addNote, getAllUsers, addToast } = useAppContext();
  const { currentUser } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const users = getAllUsers();

  useEffect(() => {
    if (isTypingTag && tagQuery) {
      const filteredUsers = users
        .filter(user => user.name.toLowerCase().startsWith(tagQuery.toLowerCase()))
        .map(user => user.name);
      setSuggestions(filteredUsers);
    } else {
      setSuggestions([]);
    }
  }, [tagQuery, isTypingTag, users]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);

    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = newText.substring(0, cursorPos);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);

    if (atMatch) {
      setIsTypingTag(true);
      setTagQuery(atMatch[1]);
    } else {
      setIsTypingTag(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setText(prevText => {
      const cursorPos = textareaRef.current?.selectionStart || prevText.length;
      const textBeforeCursor = prevText.substring(0, cursorPos);
      const atMatchIndex = textBeforeCursor.lastIndexOf('@');
      
      if (atMatchIndex !== -1) {
        const prefix = prevText.substring(0, atMatchIndex);
        const suffix = prevText.substring(cursorPos);
        return `${prefix}@${name} ${suffix}`; // Add a space after tag
      }
      return prevText; // Should not happen if suggestion is clicked
    });
    setSuggestions([]);
    setIsTypingTag(false);
    textareaRef.current?.focus();
  };

  const handleSubmit = async () => {
    if (!text.trim() || !currentUser) return;
    if (text.length > MAX_NOTE_LENGTH) {
        addToast({message: `Note is too long. Max ${MAX_NOTE_LENGTH} characters.`, type: 'error'});
        return;
    }
    setLoading(true);

    // Extract @mentions
    const taggedUsernames = [...text.matchAll(/@(\w+(?:\s\w+)*)/g)].map(match => match[1]);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    addNote(candidateId, currentUser.id, currentUser.name, text.trim(), taggedUsernames);
    setText('');
    setLoading(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative border-t border-slate-200 pt-4">
      {isTypingTag && suggestions.length > 0 && (
        <div className="absolute bottom-full left-0 mb-1 w-full max-h-40 overflow-y-auto bg-white border border-slate-300 rounded-md shadow-lg z-10">
          {suggestions.map(name => (
            <div
              key={name}
              onClick={() => handleSuggestionClick(name)}
              className="p-2 hover:bg-sky-100 cursor-pointer text-sm text-slate-700"
            >
              {name}
            </div>
          ))}
        </div>
      )}
      <div className="flex items-start space-x-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your note... use @ to mention users."
          className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none shadow-sm transition-shadow focus:shadow-md"
          rows={3}
          maxLength={MAX_NOTE_LENGTH}
          disabled={loading}
        />
        <Button onClick={handleSubmit} variant="primary" isLoading={loading} disabled={!text.trim() || loading}>
          <PaperAirplaneIcon className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
      <p className={`text-xs text-right mt-1 ${text.length > MAX_NOTE_LENGTH ? 'text-red-500' : 'text-slate-500'}`}>
        {text.length}/{MAX_NOTE_LENGTH}
      </p>
    </div>
  );
};

export default MessageInput;
    