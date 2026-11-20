import React, { useState, useEffect } from 'react';
import { CLIENT_PROJECTS, ClientProject } from '../../data/clientsData';
import { BunqNavbar } from './components/BunqNavbar';
import { BunqHero } from './components/BunqHero';
import { BunqWorkCarousel } from './components/BunqWorkCarousel';
import { BunqServicesTrinity } from './components/BunqServicesTrinity';
import { BunqAboutStudio } from './components/BunqAboutStudio';
import { BunqClienteleWall } from './components/BunqClienteleWall';
import { BunqFooterIndex } from './components/BunqFooterIndex';
import { BunqProjectDrawer } from './components/BunqProjectDrawer';
import { BunqInquiryDrawer } from './components/BunqInquiryDrawer';

export const BunqReferenceLab: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryService, setInquiryService] = useState<string>('Commercial Video Production');

  useEffect(() => {
    document.title = 'BRANDSHOOTS // Bunq Labs Architecture Lab';
    window.scrollTo(0, 0);
  }, []);

  const handleOpenInquiry = (service?: string) => {
    if (service) setInquiryService(service);
    setIsInquiryOpen(true);
  };

  const handleExploreWork = () => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full min-h-screen bg-[#04060A] text-white selection:bg-[#139EF2] selection:text-white font-['Figtree'] overflow-x-hidden">
      {/* Floating Pill Navbar with 2-Column Menu & Audio Synthesizer */}
      <BunqNavbar onOpenInquiry={handleOpenInquiry} />

      {/* 01. Hero Section */}
      <BunqHero
        onStartInquiry={handleOpenInquiry}
        onExploreWork={handleExploreWork}
      />

      {/* 02. Work Section: 3D Cylindrical Coverflow Perspective Carousel */}
      <BunqWorkCarousel
        projects={CLIENT_PROJECTS}
        onSelectProject={(p) => setSelectedProject(p)}
      />

      {/* 03. Capabilities Section: The Integrated Content Trinity (Create • Shoot • Grow) */}
      <BunqServicesTrinity onStartInquiry={handleOpenInquiry} />

      {/* 04. About & Studio Manifesto: Anti-Template Philosophy & Founder Profile */}
      <BunqAboutStudio onStartInquiry={handleOpenInquiry} />

      {/* 05. Clientele Wall: Verified Brand Partners & Industry Matrix */}
      <BunqClienteleWall onSelectProject={(p) => setSelectedProject(p)} />

      {/* 06. Footer & Editorial 4-Column Site Index */}
      <BunqFooterIndex
        onSelectProject={(p) => setSelectedProject(p)}
        onStartInquiry={handleOpenInquiry}
      />

      {/* Project Case Study Drawer / Full Modal */}
      <BunqProjectDrawer
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(p) => setSelectedProject(p)}
        onStartInquiry={(service) => {
          setSelectedProject(null);
          handleOpenInquiry(service);
        }}
        allProjects={CLIENT_PROJECTS}
      />

      {/* 3-Step Structured Inquiry & WhatsApp Direct Drawer */}
      <BunqInquiryDrawer
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        initialService={inquiryService}
      />
    </div>
  );
};

export default BunqReferenceLab;
