
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <footer className="bg-slate-200 text-center p-4 text-sm text-slate-600">
        © {new Date().getFullYear()} CandidateConnect MVP. All rights reserved (not really).
      </footer>
    </div>
  );
};

export default DashboardLayout;
    