
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { useAuth } from '../../hooks/useAuth';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { AppNotification } from '../../types';
import { BellAlertIcon, CheckCircleIcon, EnvelopeOpenIcon } from '@heroicons/react/24/outline';
import { MAX_NOTIFICATIONS_DISPLAYED } from '../../constants';


const NotificationsCard: React.FC = () => {
  const { getNotificationsForUser, markNotificationAsRead, markAllNotificationsAsReadForUser, users } = useAppContext();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const notifications = getNotificationsForUser(currentUser.id);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: AppNotification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id, currentUser.id);
    }
    navigate(`/candidate/${notification.candidateId}/notes`, { 
      state: { highlightedMessageId: notification.messageId } 
    });
  };
  
  const handleMarkAllRead = () => {
    markAllNotificationsAsReadForUser(currentUser.id);
  };

  const getSenderName = (messageId: string, candidateId: string): string => {
    const notesForCandidate = useAppContext().getNotesForCandidate(candidateId);
    const note = notesForCandidate.find(n => n.id === messageId);
    if (note) {
      const sender = users.find(u => u.id === note.userId);
      return sender ? sender.name : 'Unknown User';
    }
    return 'System';
  };


  return (
    <Card 
      title="Your Mentions" 
      className="shadow-xl"
      actions={
        unreadCount > 0 && (
          <Button onClick={handleMarkAllRead} variant="ghost" size="sm">
            <CheckCircleIcon className="h-4 w-4 mr-1" /> Mark all read
          </Button>
        )
      }
    >
      {notifications.length === 0 ? (
        <div className="text-center py-10">
          <BellAlertIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">No new mentions</h3>
          <p className="mt-1 text-sm text-slate-500">You'll be notified here when someone @mentions you.</p>
        </div>
      ) : (
        <ul role="list" className="divide-y divide-slate-200 -mx-4 -my-6 sm:-mx-6">
          {notifications.slice(0, MAX_NOTIFICATIONS_DISPLAYED).map((notification) => (
            <li 
              key={notification.id} 
              className={`p-4 sm:p-6 hover:bg-slate-50 cursor-pointer transition-colors duration-150 ${!notification.read ? 'bg-sky-50' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 h-2.5 w-2.5 rounded-full mt-1.5 ${!notification.read ? 'bg-sky-500' : 'bg-slate-300'}`}></div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${!notification.read ? 'text-sky-700' : 'text-slate-800'}`}>
                    New mention in <span className="font-semibold">{notification.candidateName}</span>
                  </p>
                  <p className={`text-sm ${!notification.read ? 'text-slate-600' : 'text-slate-500'} truncate`}>
                    From {getSenderName(notification.messageId, notification.candidateId)}: "{notification.messagePreview}"
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                <EnvelopeOpenIcon className="h-5 w-5 text-slate-400 hover:text-sky-600"/>
              </div>
            </li>
          ))}
          {notifications.length > MAX_NOTIFICATIONS_DISPLAYED && (
             <li className="p-4 text-center text-sm text-slate-500">
                And {notifications.length - MAX_NOTIFICATIONS_DISPLAYED} more older notifications...
            </li>
          )}
        </ul>
      )}
    </Card>
  );
};

export default NotificationsCard;
    