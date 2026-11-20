import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCMSContent } from '../../lib/cms/useCMSContent';

gsap.registerPlugin(ScrollTrigger);

interface FinalCtaSectionProps {
  onOpenContact?: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = () => {
  const { contact } = useCMSContent();
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const contactGridRef = useRef<HTMLDivElement>(null);
  const whatsappPhone = '917075960672';
  const displayPhone = contact?.displayPhone || '+91 70759 60672';
  const cityState = contact?.cityState || 'Rajamahendravaram, AP';

  useEffect(() => {
    const context = gsap.context(() => {
      if (headlineRef.current) {
        gsap.fromTo(headlineRef.current.children, { opacity: 0, y: 28 }, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        });
      }
      if (contactGridRef.current) {
        gsap.fromTo(contactGridRef.current.children, { opacity: 0, y: 18 }, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: contactGridRef.current, start: 'top 88%', once: true },
        });
      }
    }, sectionRef);
    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} id="cta" className="w-full border-b border-white/10 bg-[#0a0d12] py-24 text-white sm:py-32 lg:py-40">
      <div className="mx-auto w-full max-w-[1380px] px-5 sm:px-8 lg:px-12">
        <div ref={headlineRef} className="max-w-5xl">
          <h2 className="text-5xl font-semibold uppercase leading-[0.88] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
            <span className="block">LET'S CREATE SOMETHING</span>
            <span className="mt-2 block text-[#1497F5]">EXTRAORDINARY<span className="text-white">.</span></span>
          </h2>
        </div>

        <div className="mt-14 flex flex-col gap-10 border-t border-white/20 pt-8 sm:mt-20 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="max-w-md text-base leading-7 text-white/60">Start a conversation with the BrandShoots studio.</p>
            <Link to="/contact" className="mt-6 inline-flex items-center gap-3 border border-white/50 px-5 py-3 text-xs font-semibold tracking-[0.16em] text-white transition-colors hover:border-[#1497F5] hover:bg-[#1497F5] uppercase">
              START YOUR PROJECT <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div ref={contactGridRef} className="grid w-full max-w-2xl grid-cols-1 gap-5 sm:grid-cols-3">
            <a href={`https://wa.me/${whatsappPhone}`} target="_blank" rel="noopener noreferrer" className="border-t border-white/25 pt-3 transition-colors hover:border-[#1497F5]">
              <MessageCircle className="mb-4 h-4 w-4 text-[#1497F5]" />
              <span className="block text-[10px] tracking-[0.14em] text-white/45 uppercase">WhatsApp</span>
              <span className="mt-1 block text-sm text-white">Direct Studio Chat</span>
            </a>
            <a href={`tel:${displayPhone.replace(/[^\d+]/g, '')}`} className="border-t border-white/25 pt-3 transition-colors hover:border-[#1497F5]">
              <Phone className="mb-4 h-4 w-4 text-[#1497F5]" />
              <span className="block text-[10px] tracking-[0.14em] text-white/45 uppercase">Hotline</span>
              <span className="mt-1 block text-sm text-white">{displayPhone}</span>
            </a>
            <div className="border-t border-white/25 pt-3">
              <MapPin className="mb-4 h-4 w-4 text-[#1497F5]" />
              <span className="block text-[10px] tracking-[0.14em] text-white/45 uppercase">Location</span>
              <span className="mt-1 block truncate text-sm text-white" title={cityState}>{cityState}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
