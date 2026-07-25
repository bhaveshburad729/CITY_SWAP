import React from 'react';
import Navbar from './components/ecopulse/Navbar';
import HeroSection from './components/ecopulse/HeroSection';
import RolesSection from './components/ecopulse/RolesSection';
import HowItWorksSection from './components/ecopulse/HowItWorksSection';
import ImpactSection from './components/ecopulse/ImpactSection';
import FooterSection from './components/ecopulse/FooterSection';
import { Agentation } from 'agentation';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-emerald-600 selection:text-white relative overflow-x-hidden">
      {/* Main Page Header & Sections */}
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <RolesSection />
        <HowItWorksSection />
        <ImpactSection />
      </main>
      <FooterSection />

      {/* Agentation Visual Feedback & Annotation Toolbar */}
      {import.meta.env.DEV && <Agentation />}
    </div>
  );
}

export default App;
