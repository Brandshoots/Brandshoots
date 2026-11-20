import React, { useState, useEffect } from 'react';
import { ArrowUp, Instagram, Youtube, Send } from 'lucide-react';

export const LusionFooter: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="relative w-full pt-20 pb-12 px-6 md:px-14 z-10 bg-black/80 border-t border-white/10">
      <div className="max-w-[1500px] mx-auto">
        {/* Footer Top: Big Atmospheric Typography */}
        <div className="pb-16 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#139EF2] tracking-[0.25em] uppercase mb-4">
              <span>// DIRECTORY & CODES</span>
              <span>•</span>
              <span>EST. 2024 RAJAHMUNDRY</span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white uppercase leading-none">
              CREATE. SHOOT. GROW.
            </h2>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/30 text-white font-mono text-xs tracking-widest uppercase transition-all duration-300 self-start md:self-end"
          >
            <span>BACK TO ASCEND</span>
            <ArrowUp className="w-4 h-4 text-[#139EF2] group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Footer Middle: 4 Columns Editorial Directory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 py-16 border-b border-white/10">
          {/* Col 1: Studio Base */}
          <div>
            <h4 className="font-mono text-xs text-white/40 tracking-widest uppercase mb-4">
              STUDIO LOCATION
            </h4>
            <div className="text-sm text-white/80 leading-relaxed font-light mb-4">
              Opp. Little Buds School, Danavaipeta,
              <br />
              Rajahmundry, Andhra Pradesh,
              <br />
              India — 533103
            </div>
            <div className="font-mono text-xs text-[#139EF2]">
              TIME: {time || '12:00:00'} IST (UTC+5:30)
            </div>
          </div>

          {/* Col 2: Inquiries Direct */}
          <div>
            <h4 className="font-mono text-xs text-white/40 tracking-widest uppercase mb-4">
              DIRECT INQUIRIES
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-white/40 text-xs block">Commercial Shoots:</span>
                <a href="mailto:contact@brandshoots.com" className="text-white hover:text-[#139EF2] transition-colors">
                  contact@brandshoots.com
                </a>
              </div>
              <div>
                <span className="text-white/40 text-xs block">Direct WhatsApp:</span>
                <a href="https://wa.me/917075960672" target="_blank" rel="noreferrer" className="text-white hover:text-[#139EF2] transition-colors">
                  +91 70759 60672
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Social Cinema Streams */}
          <div>
            <h4 className="font-mono text-xs text-white/40 tracking-widest uppercase mb-4">
              SOCIAL MEDIA FEEDS
            </h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <a
                href="https://www.instagram.com/wearebrandshoots/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
              >
                <Instagram className="w-4 h-4 text-[#139EF2]" />
                <span>@wearebrandshoots</span>
              </a>
              <a
                href="https://www.youtube.com/@brandshoots"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span>BrandShoots Films</span>
              </a>
            </div>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="font-mono text-xs text-white/40 tracking-widest uppercase mb-4">
              THE CINEMA DISPATCH
            </h4>
            <p className="text-xs text-white/60 font-light mb-4 leading-relaxed">
              Receive private breakdowns on commercial lighting, color science, and camera systems.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Cinema Dispatch.'); }} className="flex items-center">
              <input
                type="email"
                placeholder="director@brand.com"
                required
                className="w-full px-3.5 py-2.5 rounded-l-xl bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-[#139EF2]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-r-xl bg-[#139EF2] hover:bg-[#0d82ca] text-white flex items-center justify-center transition-colors"
                aria-label="Subscribe"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom Metadata */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-white/40 tracking-wider">
          <div>
            © {new Date().getFullYear()} BRANDSHOOTS STUDIOS. ALL CINEMATOGRAPHIC ASSETS PROTECTED.
          </div>
          <div className="flex items-center gap-4">
            <span>CODE: REFERENCE LAB // LUSION</span>
            <span>•</span>
            <span className="text-[#139EF2]">4K HDR READY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
