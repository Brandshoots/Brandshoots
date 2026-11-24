import React, { useState, useEffect } from 'react';
import { WithMediaNavbar } from './components/WithMediaNavbar';
import { WithMediaCurtainWipe } from './components/WithMediaCurtainWipe';
import { WithMediaHero } from './components/WithMediaHero';
import { WithMediaServices } from './components/WithMediaServices';
import { WithMediaSystems } from './components/WithMediaSystems';
import { WithMediaPortfolio } from './components/WithMediaPortfolio';
import { WithMediaClientele } from './components/WithMediaClientele';
import { WithMediaAbout } from './components/WithMediaAbout';
import { WithMediaContact } from './components/WithMediaContact';
import { WithMediaFooter } from './components/WithMediaFooter';
import { WithMediaRecceModal } from './components/WithMediaRecceModal';

export const WithMediaReferenceLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isWiping, setIsWiping] = useState<boolean>(false);
  const [isRecceOpen, setIsRecceOpen] = useState<boolean>(false);
  const [inquiryService, setInquiryService] = useState<string>('Commercial Video Production');

  useEffect(() => {
    document.title = 'BrandShoots // With Media Reference Lab — Cinema Meets Commerce';
    window.scrollTo(0, 0);
  }, []);

  // Handle high-velocity page transition with curtain wipe
  const handleNavigate = (tabId: string) => {
    if (tabId === activeTab) {
      const el = document.getElementById(tabId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Trigger curtain wipe animation
    setIsWiping(true);
    setTimeout(() => {
      setActiveTab(tabId);
      window.scrollTo(0, 0);

      // Release wipe
      setTimeout(() => {
        setIsWiping(false);
      }, 350);
    }, 300);
  };

  const handleStartInquiry = (serviceName?: string) => {
    if (serviceName) setInquiryService(serviceName);
    handleNavigate('contact');
  };

  const handleExploreWork = () => {
    handleNavigate('portfolio');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#05070B] text-white selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden">
      {/* 1. Cinematic Curtain Wipe Transition Overlay */}
      <WithMediaCurtainWipe isWiping={isWiping} />

      {/* 2. Top Navigation Bar with Mobile Drawer */}
      <WithMediaNavbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenRecce={() => setIsRecceOpen(true)}
        onOpenInquiry={() => handleStartInquiry()}
      />

      {/* 3. Main Views & Continuous Cinematic Flow */}
      <main className="w-full">
        {/* If tab is 'home', render the complete master story flow */}
        {activeTab === 'home' && (
          <>
            <WithMediaHero
              onExploreWork={handleExploreWork}
              onOpenRecce={() => setIsRecceOpen(true)}
              onOpenInquiry={() => handleStartInquiry()}
            />
            <WithMediaServices
              onStartInquiry={handleStartInquiry}
              onOpenRecce={() => setIsRecceOpen(true)}
            />
            <WithMediaSystems
              onOpenRecce={() => setIsRecceOpen(true)}
              onStartInquiry={handleStartInquiry}
            />
            <WithMediaPortfolio onStartInquiry={handleStartInquiry} />
            <WithMediaClientele onStartInquiry={() => handleStartInquiry()} />
            <WithMediaAbout
              onStartInquiry={() => handleStartInquiry()}
              onOpenRecce={() => setIsRecceOpen(true)}
            />
            <WithMediaContact initialService={inquiryService} />
          </>
        )}

        {/* Dedicated Tab Views when navigating specifically */}
        {activeTab === 'services' && (
          <div className="pt-16 sm:pt-20">
            <WithMediaServices
              onStartInquiry={handleStartInquiry}
              onOpenRecce={() => setIsRecceOpen(true)}
            />
          </div>
        )}

        {activeTab === 'systems' && (
          <div className="pt-16 sm:pt-20">
            <WithMediaSystems
              onOpenRecce={() => setIsRecceOpen(true)}
              onStartInquiry={handleStartInquiry}
            />
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="pt-16 sm:pt-20">
            <WithMediaPortfolio onStartInquiry={handleStartInquiry} />
          </div>
        )}

        {activeTab === 'clientele' && (
          <div className="pt-16 sm:pt-20">
            <WithMediaClientele onStartInquiry={() => handleStartInquiry()} />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="pt-16 sm:pt-20">
            <WithMediaAbout
              onStartInquiry={() => handleStartInquiry()}
              onOpenRecce={() => setIsRecceOpen(true)}
            />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="pt-16 sm:pt-20">
            <WithMediaContact initialService={inquiryService} />
          </div>
        )}
      </main>

      {/* 4. Editorial 4-Column Footer */}
      <WithMediaFooter
        onNavigate={handleNavigate}
        onOpenRecce={() => setIsRecceOpen(true)}
        onStartInquiry={() => handleStartInquiry()}
      />

      {/* 5. On-Location Technical Recce Booking Modal */}
      <WithMediaRecceModal
        isOpen={isRecceOpen}
        onClose={() => setIsRecceOpen(false)}
      />
    </div>
  );
};

export default WithMediaReferenceLab;
