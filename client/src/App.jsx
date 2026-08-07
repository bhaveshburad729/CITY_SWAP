import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/ecopulse/Navbar';
import HeroSection from './components/ecopulse/HeroSection';
import RolesSection from './components/ecopulse/RolesSection';
import HowItWorksSection from './components/ecopulse/HowItWorksSection';
import ImpactSection from './components/ecopulse/ImpactSection';
import FooterSection from './components/ecopulse/FooterSection';
import AuthModal from './components/auth/AuthModal';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DriverDashboardPage from './pages/DriverDashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Agentation } from 'agentation';
import './index.css';
import './App.css';

function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'
  const navigate = useNavigate();

  const handleOpenLogin = () => {
    navigate('/login');
  };

  const handleOpenSignup = () => {
    navigate('/signup');
  };

  const handleAuthSuccess = (user) => {
    localStorage.setItem('ecopulse_user', JSON.stringify(user));
    if (user?.role === 'driver') {
      navigate('/driver');
    } else if (user?.role === 'admin' || user?.role === 'collector') {
      navigate('/admin');
    } else {
      navigate('/citizen');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#005C2B] selection:text-white relative overflow-x-hidden">
      {/* Main Page Header & Sections */}
      <Navbar onOpenLogin={handleOpenLogin} onOpenSignup={handleOpenSignup} />
      <main className="relative z-10">
        <HeroSection />
        <RolesSection />
        <HowItWorksSection />
        <ImpactSection />
      </main>
      <FooterSection />

      {/* Floating Auth Experience Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes with Role-Based Access Control (RBAC) */}
        <Route
          path="/citizen"
          element={
            <ProtectedRoute allowedRoles={['citizen', 'admin']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/citzen" element={<Navigate to="/citizen" replace />} />
        <Route path="/dashboard" element={<Navigate to="/citizen" replace />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'collector']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/collector" element={<Navigate to="/admin" replace />} />

        <Route
          path="/driver"
          element={
            <ProtectedRoute allowedRoles={['driver', 'admin']}>
              <DriverDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Agentation Visual Feedback & Annotation Toolbar */}
      {import.meta.env.DEV && <Agentation />}
    </Router>
  );
}

export default App;
