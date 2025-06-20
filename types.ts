
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // In a real app, this would be properly hashed
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  createdBy: string; // userId
  createdAt: number;
}

export interface NoteMessage {
  id: string;
  candidateId: string;
  userId: string; // author's ID
  userName: string; // author's name for display
  text: string;
  timestamp: number;
  taggedUserIds: string[];
}

export interface AppNotification {
  id: string;
  recipientUserId: string;
  candidateId: string;
  candidateName: string;
  messageId: string;
  messagePreview: string;
  timestamp: number;
  read: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
    