import React, { useState, useEffect } from 'react';
import { Instagram, Youtube, Facebook, X, Send, Mail, CheckCircle2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    contact: '',
    message: '',
  });

  // Close on ESC key & prevent body scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Frosted Translucent Backdrop */}
      <div
        className="absolute inset-0 bg-[#05070A]/75 backdrop-blur-xl transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-[#090D14]/95 border border-white/15 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_20px_70px_rgba(0,140,255,0.25)] text-white z-10 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#008CFF] to-transparent" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#008CFF]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Contact Modal"
          className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 sm:mb-8 text-left">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#008CFF] font-semibold block mb-2">
            Let's Collaborate
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white uppercase">
            Start A Cinematic Shoot
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Connect directly with the BrandShoots studio team to create, shoot, and scale your brand story.
          </p>
        </div>

        {/* Social Media & Direct Channels */}
        <div className="mb-6 pb-6 border-b border-white/10">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/45 block mb-3 text-left">
            Official Channels • /wearebrandshoots
          </span>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <a
              href="https://www.instagram.com/wearebrandshoots"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-[#008CFF]/20 border border-white/10 hover:border-[#008CFF]/60 text-white/90 hover:text-white transition-all duration-200 text-xs font-medium"
            >
              <Instagram className="w-4 h-4 text-[#008CFF]" />
              <span>Instagram</span>
            </a>
            <a
              href="https://www.youtube.com/@wearebrandshoots"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-[#008CFF]/20 border border-white/10 hover:border-[#008CFF]/60 text-white/90 hover:text-white transition-all duration-200 text-xs font-medium"
            >
              <Youtube className="w-4 h-4 text-[#FF0000]" />
              <span>YouTube</span>
            </a>
            <a
              href="https://www.facebook.com/wearebrandshoots"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-[#008CFF]/20 border border-white/10 hover:border-[#008CFF]/60 text-white/90 hover:text-white transition-all duration-200 text-xs font-medium"
            >
              <Facebook className="w-4 h-4 text-[#1877F2]" />
              <span>Facebook</span>
            </a>
            <a
              href="mailto:contact@brandshoots.com"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-[#008CFF]/20 border border-white/10 hover:border-[#008CFF]/60 text-white/90 hover:text-white transition-all duration-200 text-xs font-medium"
            >
              <Mail className="w-4 h-4 text-[#008CFF]" />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Form or Success State */}
        {submitted ? (
          <div className="py-8 flex flex-col items-center text-center animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-[#008CFF] mb-3 drop-shadow-[0_0_12px_#008CFF]" />
            <h3 className="text-xl font-bold font-display uppercase text-white mb-1">
              Message Received!
            </h3>
            <p className="text-white/70 text-sm max-w-sm mb-6">
              Thank you for reaching out. A BrandShoots producer will be in touch shortly.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white text-xs font-bold tracking-wider uppercase transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-mono tracking-wider uppercase text-white/60 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono tracking-wider uppercase text-white/60 mb-1">
                  Brand / Company
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-white/60 mb-1">
                Phone Number / Email
              </label>
              <input
                type="text"
                required
                placeholder="+91 ... or email@domain.com"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-white/60 mb-1">
                Project Scope / Message
              </label>
              <textarea
                rows={3}
                required
                placeholder="Tell us about your brand story, reels or production requirement..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white text-xs tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,140,255,0.4)] transition-all duration-200 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Project Inquiry</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
