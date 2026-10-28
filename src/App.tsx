import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Login } from './pages/Login';
import { Dashboard } from './pages/citizen/Dashboard';
import { ProjectsList } from './pages/citizen/ProjectsList';
import { NewProject } from './pages/citizen/NewProject';
import { CreditsLedger } from './pages/citizen/CreditsLedger';
import { TradingExchange } from './pages/citizen/TradingExchange';
import { Reports } from './pages/citizen/Reports';
import { Profile } from './pages/citizen/Profile';
import { Settings } from './pages/citizen/Settings';

import { VerifierQueue } from './pages/verifier/VerifierQueue';
import { Marketplace } from './pages/marketplace/Marketplace';
import { ProjectDetail } from './pages/marketplace/ProjectDetail';
import { ImpactAnalytics } from './pages/corporate/ImpactAnalytics';

const RootRedirect: React.FC = () => {
  const { currentRole } = useAuth();
  if (currentRole === 'verifier') return <Navigate to="/verifier/queue" replace />;
  if (currentRole === 'corporate') return <Navigate to="/marketplace" replace />;
  return <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Login / Role Switcher */}
            <Route path="/login" element={<Login />} />

            {/* Layout Wrapper */}
            <Route element={<Layout />}>
              <Route path="/" element={<RootRedirect />} />

              {/* Citizen Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['citizen']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute allowedRoles={['citizen', 'verifier']}>
                    <ProjectsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/new"
                element={
                  <ProtectedRoute allowedRoles={['citizen']}>
                    <NewProject />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/credits"
                element={
                  <ProtectedRoute allowedRoles={['citizen']}>
                    <CreditsLedger />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trading"
                element={
                  <ProtectedRoute allowedRoles={['citizen', 'corporate']}>
                    <TradingExchange />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute allowedRoles={['citizen', 'verifier', 'corporate']}>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['citizen', 'verifier', 'corporate']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={['citizen', 'verifier', 'corporate']}>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Verifier Routes */}
              <Route
                path="/verifier/queue"
                element={
                  <ProtectedRoute allowedRoles={['verifier']}>
                    <VerifierQueue />
                  </ProtectedRoute>
                }
              />

              {/* Corporate Routes */}
              <Route
                path="/marketplace"
                element={
                  <ProtectedRoute allowedRoles={['corporate', 'citizen']}>
                    <Marketplace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/marketplace/:id"
                element={
                  <ProtectedRoute allowedRoles={['corporate', 'citizen', 'verifier']}>
                    <ProjectDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/impact"
                element={
                  <ProtectedRoute allowedRoles={['corporate']}>
                    <ImpactAnalytics />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
