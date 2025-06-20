
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardHomePage from './pages/DashboardHomePage';
import CandidateNotesPage from './pages/CandidateNotesPage';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import ToastContainer from './components/UI/ToastContainer';

function App(): React.ReactNode {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-xl font-semibold text-slate-700">Loading Application...</div>
      </div>
    );
  }

  return (
    <HashRouter>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHomePage />} />
          <Route path="candidate/:candidateId/notes" element={<CandidateNotesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
    