/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BuildPainStep } from './components/BuildPainStep';
import { CirculatingPainDeck } from './components/CirculatingPainDeck';
import { ControllerRosterModal } from './components/ControllerRosterModal';
import { EnterLabModal } from './components/EnterLabModal';
import { FacilitatorHub } from './components/FacilitatorHub';
import { Footer } from './components/Footer';
import { MethodologyGuide } from './components/MethodologyGuide';
import { NetworkCanvas } from './components/NetworkCanvas';
import { OpportunityExplainerModal } from './components/OpportunityExplainerModal';
import { PainWallStep } from './components/PainWallStep';
import { PresentationMode } from './components/PresentationMode';
import { TopNavbar } from './components/TopNavbar';
import { useWorkshop, WorkshopProvider } from './context/WorkshopContext';

const MainContent: React.FC = () => {
  const { activeView, isDark } = useWorkshop();

  return (
    <div
      className={`min-h-screen flex flex-col relative overflow-x-hidden font-sans transition-colors duration-200 ${
        isDark ? 'bg-[#000000] text-white' : 'bg-[#ffffff] text-[#0f172a]'
      }`}
    >
      {/* Background Interactive Particle/Constellation Canvas from Screenshots */}
      <NetworkCanvas isDark={isDark} />

      {/* Subtle ambient lighting vignette */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 ${
          isDark
            ? 'bg-radial-[ellipse_80%_80%_at_50%_-20%] from-[#0047ff]/10 via-transparent to-transparent'
            : 'bg-radial-[ellipse_80%_80%_at_50%_-20%] from-[#0047ff]/6 via-transparent to-transparent'
        }`}
      />

      {/* Sleek, Modern Top Navigation with official EPAM logo and country pill */}
      <TopNavbar />

      {/* Main View Area */}
      <main className="flex-1 z-10 relative flex flex-col pb-12">
        {(activeView === 'starters' || activeView === 'dashboard') && <CirculatingPainDeck />}
        {activeView === 'build' && <BuildPainStep />}
        {activeView === 'wall' && <PainWallStep />}
        {activeView === 'presentation' && <PresentationMode />}
        {activeView === 'facilitator' && <FacilitatorHub />}
        {activeView === 'framework' && <MethodologyGuide />}
      </main>

      {/* Official Footer: Controllership | CFO Office | EPAM Systems */}
      <Footer />

      {/* Modals */}
      <ControllerRosterModal />
      <EnterLabModal />
      <OpportunityExplainerModal />
    </div>
  );
};

export default function App() {
  return (
    <WorkshopProvider>
      <MainContent />
    </WorkshopProvider>
  );
}
