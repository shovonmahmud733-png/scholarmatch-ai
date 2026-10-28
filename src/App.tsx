import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CompareTray } from './components/scholarships/CompareTray';
import { ScrollToTop } from './components/common/ScrollToTop';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ScholarshipsPage } from './pages/ScholarshipsPage';
import { ScholarshipDetailPage } from './pages/ScholarshipDetailPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ComparePage } from './pages/ComparePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SavedScholarshipsPage } from './pages/SavedScholarshipsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage, PrivacyPage, TermsPage } from './pages/InformationalPages';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 font-sans">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* Core public and discovery routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/scholarships" element={<ScholarshipsPage />} />
              <Route path="/scholarships/:id" element={<ScholarshipDetailPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/compare" element={<ComparePage />} />

              {/* Onboarding & Student Dashboard */}
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/saved" element={<SavedScholarshipsPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Informational & Legal */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <CompareTray />
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
