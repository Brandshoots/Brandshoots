import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BrandShootsFooterProps {
  onOpenContact?: () => void;
}

export const BrandShootsFooter: React.FC<BrandShootsFooterProps> = () => {
  const footerRef = useRef<HTMLElement>(null);
  const instagramUrl = 'https://instagram.com/wearebrandshoots';
  const youtubeUrl = 'https://youtube.com/@wearebrandshoots';
  const facebookUrl = 'https://facebook.com/wearebrandshoots';
  const whatsappUrl = 'https://wa.me/917075960672';

  const scrollToTop = () => {
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 0.9 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServicesClick = (event: React.MouseEvent) => {
    if (window.location.pathname !== '/') return;
    const section = document.getElementById('what-we-do');
    if (!section) return;
    event.preventDefault();
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(section, { duration: 0.9 });
    else section.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const context = gsap.context(() => {
      if (!footerRef.current) return;
      gsap.fromTo(footerRef.current.querySelectorAll('nav a, footer a, footer button'), { opacity: 0, y: 14 }, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: { trigger: footerRef.current, start: 'top 88%', once: true },
      });
    }, footerRef);
    return () => context.revert();
  }, []);

  return (
    <footer ref={footerRef} id="footer" className="w-full bg-[#08090C] text-white">
      <div className="mx-auto w-full max-w-[1380px] px-5 pb-8 pt-16 sm:px-8 sm:pt-20 lg:px-12">
        <div className="flex flex-col gap-10 border-b border-white/20 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link to="/" onClick={() => window.location.pathname === '/' && scrollToTop()} className="inline-block">
              <img src="/Logo Official.svg" alt="BrandShoots Official Logo" width={1600} height={365} loading="lazy" decoding="async" className="h-12 w-auto sm:h-14" />
            </Link>
            <p className="mt-4 text-[11px] font-medium tracking-[0.28em] text-white/55 uppercase">
              CREATE. <span className="text-[#1497F5]">SHOOT.</span> GROW.
            </p>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/50">
              A high-end creative agency engineering commercial films, visual architecture, and high-retention content systems for ambitious brands.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-4 text-xs font-medium tracking-[0.14em] text-white/65 uppercase sm:flex sm:flex-wrap sm:gap-8">
            <Link to="/" className="transition-colors hover:text-[#1497F5]">HOME</Link>
            <Link to="/about" className="transition-colors hover:text-[#1497F5]">ABOUT</Link>
            <Link to="/portfolio" className="transition-colors hover:text-[#1497F5]">PORTFOLIO</Link>
            <Link to="/packages" className="transition-colors hover:text-[#1497F5]">PACKAGES</Link>
            <Link to="/#what-we-do" onClick={handleServicesClick} className="transition-colors hover:text-[#1497F5]">SERVICES</Link>
            <Link to="/contact" className="text-[#1497F5] transition-colors hover:text-white">CONTACT</Link>
          </nav>
        </div>

        <div className="flex flex-col gap-8 border-b border-white/20 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/55">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">YouTube</a>
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
          </div>
          <button type="button" onClick={scrollToTop} className="self-start text-xs tracking-[0.14em] text-white/45 uppercase transition-colors hover:text-[#1497F5] sm:self-auto">
            Back to Top ↑
          </button>
        </div>

        <div className="flex flex-col gap-2 pt-6 text-[10px] tracking-[0.14em] text-white/65 uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>Rajahmundry &amp; Hyderabad, India</span>
          <span>© {new Date().getFullYear()} BRANDSHOOTS. ALL RIGHTS RESERVED.</span>
        </div>
      </div>
    </footer>
  );
};

export default BrandShootsFooter;
