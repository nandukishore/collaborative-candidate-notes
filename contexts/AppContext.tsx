
import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { User, Candidate, NoteMessage, AppNotification, ToastMessage } from '../types';
import { TOAST_TIMEOUT } from '../constants';

interface AppContextType {
  // Users
  users: User[];
  addUser: (user: User) => void;
  findUserByName: (name: string) => User | undefined;
  getAllUsers: () => User[];

  // Candidates
  candidates: Candidate[];
  addCandidate: (candidateData: Omit<Candidate, 'id' | 'createdAt' | 'createdBy'>, creatorId: string) => Candidate | null;
  getCandidates: () => Candidate[];
  getCandidateById: (candidateId: string) => Candidate | undefined;

  // Notes
  notes: Map<string, NoteMessage[]>; // candidateId -> notes array
  addNote: (candidateId: string, userId: string, userName: string, text: string, taggedUsernames: string[]) => NoteMessage | null;
  getNotesForCandidate: (candidateId: string) => NoteMessage[];
  
  // Notifications
  notifications: AppNotification[]; // All notifications, will be filtered by user
  getNotificationsForUser: (userId: string) => AppNotification[];
  getUnreadNotificationCountForUser: (userId: string) => number;
  markNotificationAsRead: (notificationId: string, userId: string) => void;
  markAllNotificationsAsReadForUser: (userId: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'> & { id?: string }) => void;
  removeToast: (id: string) => void;
}

// Simple ID generator
const generateId = (): string => Date.now().toString(36) + Math.random().toString(36).substring(2, 9);


const initialUsers: User[] = [
  { id: 'user1', name: 'Alice Wonderland', email: 'alice@example.com', passwordHash: 'password123' },
  { id: 'user2', name: 'Bob The Builder', email: 'bob@example.com', passwordHash: 'password123' },
  { id: 'user3', name: 'Charlie Brown', email: 'charlie@example.com', passwordHash: 'password123' },
];

const initialCandidates: Candidate[] = [
  { id: 'cand1', name: 'John Doe', email: 'john.doe@example.com', createdBy: 'user1', createdAt: Date.now() - 100000 },
  { id: 'cand2', name: 'Jane Smith', email: 'jane.smith@example.com', createdBy: 'user2', createdAt: Date.now() - 200000 },
];

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [notes, setNotes] = useState<Map<string, NoteMessage[]>>(new Map());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast functions first
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []); // setToasts is stable

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'> & { id?: string }) => {
    const id = toast.id || generateId();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id); // removeToast is defined above
    }, TOAST_TIMEOUT);
  }, [removeToast]); // Depends on removeToast

  // User functions
  const addUser = useCallback((user: User) => {
    setUsers(prev => [...prev, user]);
  }, []); // setUsers is stable
  
  const findUserByName = useCallback((name: string): User | undefined => {
    return users.find(u => u.name.toLowerCase() === name.toLowerCase());
  }, [users]);

  const getAllUsers = useCallback((): User[] => {
    return users;
  }, [users]);

  // Candidate functions
  const getCandidateById = useCallback((candidateId: string): Candidate | undefined => {
    return candidates.find(c => c.id === candidateId);
  }, [candidates]);

  const addCandidate = useCallback((candidateData: Omit<Candidate, 'id' | 'createdAt' | 'createdBy'>, creatorId: string): Candidate | null => {
    if (!users.find(u => u.id === creatorId)) {
      console.error("Creator user not found");
      addToast({ message: 'Error creating candidate: Creator not found.', type: 'error' }); // addToast defined above
      return null;
    }
    const newCandidate: Candidate = {
      ...candidateData,
      id: generateId(),
      createdBy: creatorId,
      createdAt: Date.now(),
    };
    setCandidates(prev => [...prev, newCandidate]);
    addToast({ message: `Candidate ${newCandidate.name} created.`, type: 'success' }); // addToast defined above
    return newCandidate;
  }, [users, addToast]); // Depends on users (state) and addToast (defined above)

  const getCandidates = useCallback((): Candidate[] => {
    return candidates.sort((a,b) => b.createdAt - a.createdAt);
  }, [candidates]);
  
  // Note functions
  const addNote = useCallback((candidateId: string, userId: string, userName: string, text: string, taggedUsernames: string[]): NoteMessage | null => {
    const candidate = getCandidateById(candidateId); // getCandidateById defined above
    const user = users.find(u => u.id === userId); // users is state

    if (!candidate || !user) {
      addToast({ message: 'Error adding note: Candidate or user not found.', type: 'error' }); // addToast defined above
      return null;
    }

    const taggedUserIds: string[] = taggedUsernames
      .map(name => findUserByName(name)?.id) // findUserByName defined above
      .filter((id): id is string => !!id);

    const newNote: NoteMessage = {
      id: generateId(),
      candidateId,
      userId,
      userName,
      text,
      timestamp: Date.now(),
      taggedUserIds,
    };

    setNotes(prev => {
      const newMap = new Map(prev);
      const candidateNotes = newMap.get(candidateId) || [];
      newMap.set(candidateId, [...candidateNotes, newNote]);
      return newMap;
    });

    taggedUserIds.forEach(taggedUserId => {
      if (taggedUserId !== userId) { 
        const newNotification: AppNotification = {
          id: generateId(),
          recipientUserId: taggedUserId,
          candidateId,
          candidateName: candidate.name,
          messageId: newNote.id,
          messagePreview: text.length > 50 ? `${text.substring(0, 47)}...` : text,
          timestamp: newNote.timestamp,
          read: false,
        };
        setNotifications(prevNots => [...prevNots, newNotification]);
        
        // const taggedUserDetails = users.find(u => u.id === taggedUserId);
        // if (taggedUserDetails) {
        //      // Toast for current user handled below
        // }
      }
    });
    addToast({message: `Note added for ${candidate.name}.`, type: 'info'}); // addToast defined above
    return newNote;
  }, [getCandidateById, users, findUserByName, addToast]); // Depends on getCandidateById, users, findUserByName, addToast (all defined above or state)

  const getNotesForCandidate = useCallback((candidateId: string): NoteMessage[] => {
    return (notes.get(candidateId) || []).sort((a,b) => a.timestamp - b.timestamp);
  }, [notes]);

  // Notification functions
  const getNotificationsForUser = useCallback((userId: string): AppNotification[] => {
    return notifications
      .filter(n => n.recipientUserId === userId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [notifications]);

  const getUnreadNotificationCountForUser = useCallback((userId: string): number => {
    return notifications.filter(n => n.recipientUserId === userId && !n.read).length;
  }, [notifications]);

  const markNotificationAsRead = useCallback((notificationId: string, userId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId && n.recipientUserId === userId ? { ...n, read: true } : n
      )
    );
  }, []); // setNotifications is stable

  const markAllNotificationsAsReadForUser = useCallback((userId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.recipientUserId === userId ? { ...n, read: true } : n
      )
    );
     addToast({ message: 'All notifications marked as read.', type: 'info' }); // addToast defined above
  }, [addToast]); // Depends on addToast (defined above)


  // Effect to load data from localStorage (example for persistence, can be expanded)
  useEffect(() => {
    const storedNotes = localStorage.getItem('appNotes');
    if (storedNotes) {
      try {
        const parsedNotesArray: [string, NoteMessage[]][] = JSON.parse(storedNotes);
        setNotes(new Map(parsedNotesArray));
      } catch (e) { console.error("Error parsing notes from localStorage", e); }
    }
    const storedNotifications = localStorage.getItem('appNotifications');
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (e) { console.error("Error parsing notifications from localStorage", e); }
    }
  }, []);

  // Effect to save data to localStorage
  useEffect(() => {
    localStorage.setItem('appNotes', JSON.stringify(Array.from(notes.entries())));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('appNotifications', JSON.stringify(notifications));
  }, [notifications]);


  return (
    <AppContext.Provider value={{ 
      users, addUser, findUserByName, getAllUsers,
      candidates, addCandidate, getCandidates, getCandidateById,
      notes, addNote, getNotesForCandidate,
      notifications, getNotificationsForUser, getUnreadNotificationCountForUser, markNotificationAsRead, markAllNotificationsAsReadForUser,
      toasts, addToast, removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
};
