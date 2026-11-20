import React, { useState, useEffect } from 'react';

interface WithMediaNavbarProps {
  activeTab: string;
  onNavigate: (tabId: string) => void;
  onOpenRecce: () => void;
  onOpenInquiry: () => void;
}

export const WithMediaNavbar: React.FC<WithMediaNavbarProps> = ({
  activeTab,
  onNavigate,
  onOpenRecce,
  onOpenInquiry,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'systems', label: 'Studio Systems' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'clientele', label: 'Clientele' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#05070B]/90 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-2xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#1E293B] to-[#0A0F1D] border border-blue-500/30 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(37,99,235,0.25)] group-hover:border-blue-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300">
              <img
                src="/logo.svg"
                alt="BrandShoots Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base tracking-[0.18em] uppercase text-white group-hover:text-blue-400 transition-colors">
                BRAND<span className="text-blue-500">SHOOTS</span>
              </span>
              <span className="text-[9px] tracking-[0.24em] uppercase text-slate-400 font-mono">
                CINEMA · COMMERCE
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-1.5 text-xs xl:text-sm font-medium tracking-wider uppercase transition-all duration-200 rounded-full ${
                    isActive
                      ? 'text-white bg-blue-600/20 text-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-blue-500 rounded-full shadow-[0_0_8px_#3B82F6]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Direct Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenRecce}
              className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-full hover:bg-blue-500/20 hover:border-blue-400 transition-all shadow-[0_0_12px_rgba(37,99,235,0.15)] flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Recce (₹2,000)
            </button>

            <button
              onClick={onOpenInquiry}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all flex items-center gap-1.5 group"
            >
              <span>Start Project</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>

          {/* Mobile Hamburger Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white hover:text-blue-400 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-current transition-all transform origin-left ${
                  mobileMenuOpen ? 'rotate-45 translate-x-0.5' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current transition-all ${
                  mobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current transition-all transform origin-left ${
                  mobileMenuOpen ? '-rotate-45 translate-x-0.5' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu (Designed with intentional mobile ergonomics) */}
      <div
        className={`fixed inset-0 z-40 bg-[#05070B]/98 backdrop-blur-xl lg:hidden transition-all duration-300 flex flex-col justify-between pt-24 pb-8 px-6 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-4'
        }`}
      >
        <div className="flex flex-col gap-2">
          <div className="text-[10px] tracking-[0.24em] uppercase text-blue-400 font-mono mb-2">
            // Navigation Matrix
          </div>
          {navItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-left py-3 px-4 rounded-xl text-lg font-bold tracking-wider uppercase transition-all flex items-center justify-between border ${
                activeTab === item.id
                  ? 'text-blue-400 bg-blue-950/40 border-blue-500/30'
                  : 'text-white hover:text-blue-300 bg-white/[0.02] border-white/[0.04]'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-xs font-mono text-slate-500">0{idx + 1}</span>
            </button>
          ))}
        </div>

        {/* Mobile Quick Action Buttons */}
        <div className="flex flex-col gap-3 pt-6 border-t border-white/[0.08]">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRecce();
            }}
            className="w-full py-3.5 text-center text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-xl"
          >
            Book On-Location Recce (₹2,000)
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenInquiry();
            }}
            className="w-full py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white bg-blue-600 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            Start Your Retainer →
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2">
            <span>Rajamahendravaram · Hyderabad</span>
            <a href="https://instagram.com/wearebrandshoots" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
              @wearebrandshoots
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
