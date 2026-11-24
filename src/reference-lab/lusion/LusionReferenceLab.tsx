import React, { useState, useEffect, useRef } from 'react';
import { CLIENT_PROJECTS, ClientProject } from '../../data/clientsData';
import { LusionCanvas3D } from './components/LusionCanvas3D';
import { LusionNavbar } from './components/LusionNavbar';
import { LusionHero } from './components/LusionHero';
import { LusionShowreelSection } from './components/LusionShowreelSection';
import { LusionPortfolioSection } from './components/LusionPortfolioSection';
import { LusionAboutSection } from './components/LusionAboutSection';
import { LusionServicesSection } from './components/LusionServicesSection';
import { LusionClienteleSection } from './components/LusionClienteleSection';
import { LusionContactSection } from './components/LusionContactSection';
import { LusionFooter } from './components/LusionFooter';
import { LusionProjectModal } from './components/LusionProjectModal';
import { LusionVideoOverlay } from './components/LusionVideoOverlay';
import { LusionMenuDrawer } from './components/LusionMenuDrawer';
import { LusionPreloader } from './components/LusionPreloader';

export const LusionReferenceLab: React.FC = () => {
  const [preloaderActive, setPreloaderActive] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('nopreload')) {
      return false;
    }
    return true;
  });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);
  const [videoOverlay, setVideoOverlay] = useState<{ url: string; title: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'BrandShoots // Lusion Architecture Reference Lab';
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalScroll));
        setScrollProgress(progress);
      }

      // Check active section
      const sections = ['home', 'showreel', 'portfolio', 'about', 'services', 'clientele', 'contact'];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2) {
            setActiveSection(s);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenContact = () => {
    handleNavigate('contact');
  };

  const handleWatchShowreel = () => {
    setVideoOverlay({
      url: '/reels/wearebrandshoots/wearebrandshoots_2025-10-16_15-04-28_3744567634965812934_77785749886.mp4',
      title: 'BrandShoots Commercial Master Showreel 2026',
    });
  };

  const handlePlayReel = (reelUrl: string, title: string) => {
    setVideoOverlay({ url: reelUrl, title });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#05070B] text-white selection:bg-[#139EF2] selection:text-white font-sans overflow-x-hidden"
    >
      {/* 1. Master Digital Preloader */}
      {preloaderActive && (
        <LusionPreloader onComplete={() => setPreloaderActive(false)} />
      )}

      {/* 2. Unified 3D WebGL Canvas Layer (Pinned Background) */}
      <LusionCanvas3D
        scrollProgress={scrollProgress}
        activeSection={activeSection}
      />

      {/* 3. Fixed Viewfinder Navbar */}
      <LusionNavbar
        onOpenMenu={() => setIsMenuOpen(true)}
        isMenuOpen={isMenuOpen}
        onOpenContact={handleOpenContact}
        activeSection={activeSection}
      />

      {/* 4. Main Continuous Visual Flow Content */}
      <main className="relative z-10">
        <LusionHero
          onWatchReel={handleWatchShowreel}
          onExplorePortfolio={() => handleNavigate('portfolio')}
        />

        <LusionShowreelSection
          onWatchReelFullscreen={handleWatchShowreel}
        />

        <LusionPortfolioSection
          onSelectProject={(p) => setSelectedProject(p)}
          onPlayReel={handlePlayReel}
        />

        <LusionAboutSection
          onStartInquiry={() => handleOpenContact()}
        />

        <LusionServicesSection
          onStartInquiry={() => handleOpenContact()}
        />

        <LusionClienteleSection
          onSelectProject={(p) => setSelectedProject(p)}
        />

        <LusionContactSection />

        <LusionFooter />
      </main>

      {/* 5. Zero Tech-Inspired Spatial Case Study Modal */}
      <LusionProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(p) => setSelectedProject(p)}
        onStartInquiry={() => {
          setSelectedProject(null);
          handleOpenContact();
        }}
        allProjects={CLIENT_PROJECTS}
      />

      {/* 6. Fullscreen Cinema Reel Video Overlay */}
      <LusionVideoOverlay
        videoUrl={videoOverlay?.url || null}
        title={videoOverlay?.title || ''}
        onClose={() => setVideoOverlay(null)}
      />

      {/* 7. Fullscreen Navigation Menu Drawer */}
      <LusionMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigate}
        onOpenContact={handleOpenContact}
      />
    </div>
  );
};

export default LusionReferenceLab;
