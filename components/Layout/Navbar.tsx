
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import { APP_NAME } from '../../constants';
import { BellIcon, UserCircleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { getUnreadNotificationCountForUser } = useAppContext();
  const navigate = useNavigate();

  const unreadCount = currentUser ? getUnreadNotificationCountForUser(currentUser.id) : 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-sky-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-white">
              {APP_NAME}
            </Link>
          </div>
          {currentUser && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard', { state: { showNotifications: true } })}
                className="relative p-1 rounded-full text-sky-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-700 focus:ring-white"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
                {unreadCount > 0 && (
                  <Badge count={unreadCount} className="absolute -top-1 -right-1" size="sm" />
                )}
              </button>
              <div className="flex items-center text-sky-100">
                <UserCircleIcon className="h-6 w-6 mr-1" />
                <span className="hidden sm:inline">{currentUser.name}</span>
              </div>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-sky-100 hover:bg-sky-600 hover:text-white border-sky-500">
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1 sm:mr-2"/>
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
    