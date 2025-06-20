
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CandidateList from '../components/Dashboard/CandidateList';
import CreateCandidateForm from '../components/Dashboard/CreateCandidateForm';
import NotificationsCard from '../components/Dashboard/NotificationsCard';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { PlusIcon } from '@heroicons/react/24/solid';

const DashboardHomePage: React.FC = () => {
  const [showCreateCandidateForm, setShowCreateCandidateForm] = useState(false);
  const location = useLocation();

  // For focusing notification card if navigated from bell icon
  const notificationsCardRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (location.state?.showNotifications) {
      notificationsCardRef.current?.scrollIntoView({ behavior: 'smooth' });
      // Remove the state to prevent re-scrolling on refresh/other navigation
      window.history.replaceState({}, document.title) 
    }
  }, [location.state]);


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <Button 
          onClick={() => setShowCreateCandidateForm(prev => !prev)}
          variant="primary"
        >
          <PlusIcon className="h-5 w-5 mr-2"/>
          {showCreateCandidateForm ? 'Cancel' : 'New Candidate'}
        </Button>
      </div>

      {showCreateCandidateForm && (
        <Card title="Create New Candidate" className="mb-6">
          <CreateCandidateForm onSuccess={() => setShowCreateCandidateForm(false)} />
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CandidateList />
        </div>
        <div className="lg:col-span-1" ref={notificationsCardRef}>
          <NotificationsCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
    