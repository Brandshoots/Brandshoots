import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, Mail, Phone, Sparkles } from 'lucide-react';
import { soundSynth } from './BunqSoundSynth';

interface BunqInquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export const BunqInquiryDrawer: React.FC<BunqInquiryDrawerProps> = ({
  isOpen,
  onClose,
  initialService,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    email: '',
    service: initialService || 'Commercial Video Production',
    timeline: 'Within a month',
    budget: 'Standard Commercial Package',
    notes: '',
  });

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        soundSynth.playWhoosh(220, 80, 0.2);
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const serviceOptions = [
    'Commercial Video Production',
    '9:16 Social Velocity / Reels',
    'Monthly Content Retainer',
    'Brand & Creative Strategy',
    'DaVinci Resolve Color & Post',
    'On-Location Technical Recce (₹2,000)',
  ];

  const timelineOptions = [
    'Immediate (Next 7-14 Days)',
    'Within 1 Month',
    'Next Quarter',
    'Exploring Options',
  ];

  const budgetOptions = [
    '₹2,000 (Technical Recce Only)',
    '₹50K - ₹1.5 Lakh (Short-Form Velocity)',
    '₹1.5 Lakh - ₹4 Lakh (Commercial Film)',
    '₹75K+ / Month (Full Retainer Trinity)',
  ];

  const handleNext = () => {
    soundSynth.playCardTick();
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmitWhatsApp();
    }
  };

  const handleSubmitWhatsApp = () => {
    const text = `*NEW BrandShoots PROJECT INQUIRY*
━━━━━━━━━━━━━━━━━━━━
*Client / Brand:* ${formData.name || 'Not specified'} (${formData.company || 'Direct'})
*Phone / Contact:* ${formData.phone || 'Not specified'}
*Email:* ${formData.email || 'N/A'}

*Required Capability:*
${formData.service}

*Production Timeline:*
${formData.timeline}

*Estimated Investment:*
${formData.budget}

*Project Vision / Notes:*
${formData.notes || 'Looking forward to reviewing creative direction.'}
━━━━━━━━━━━━━━━━━━━━
Sent from BrandShoots Reference Lab`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/917075960672?text=${encoded}`, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={() => {
          soundSynth.playWhoosh(220, 80, 0.2);
          onClose();
        }}
      />

      {/* Drawer Surface */}
      <div className="relative w-full max-w-xl h-full bg-[#07090E] border-l border-white/10 text-white shadow-2xl z-10 flex flex-col justify-between overflow-y-auto">
        {/* Header Bar */}
        <div className="sticky top-0 bg-[#07090E]/95 backdrop-blur-md border-b border-white/10 px-6 py-5 flex items-center justify-between z-20">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#139EF2] uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-[#139EF2] animate-pulse" />
              DIRECT STUDIO INQUIRY
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white font-sans">
              Let's Start With Your Idea
            </h2>
          </div>
          <button
            onClick={() => {
              soundSynth.playWhoosh(220, 80, 0.2);
              onClose();
            }}
            aria-label="Close dialog"
            className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Multi-Step Progress Tracker */}
        <div className="px-6 pt-6 pb-2">
          <div className="grid grid-cols-3 gap-2">
            {[
              { idx: 0, label: '01. Details' },
              { idx: 1, label: '02. Project Scope' },
              { idx: 2, label: '03. Timeline & Vision' },
            ].map((step) => {
              const isPast = currentStep > step.idx;
              const isCurr = currentStep === step.idx;
              return (
                <button
                  key={step.idx}
                  onClick={() => {
                    soundSynth.playCardTick();
                    setCurrentStep(step.idx);
                  }}
                  className={`text-left pb-2 border-b-2 transition-all ${
                    isCurr
                      ? 'border-[#139EF2] text-white'
                      : isPast
                      ? 'border-white/40 text-white/80'
                      : 'border-white/10 text-white/40'
                  }`}
                >
                  <div className="text-[10px] font-mono tracking-wider uppercase flex items-center gap-1.5">
                    {isPast ? <Check size={12} className="text-[#139EF2]" /> : null}
                    {step.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Forms */}
        <div className="p-6 space-y-6 flex-1">
          {/* STEP 0: DETAILS */}
          {currentStep === 0 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <p className="text-sm text-white/60 font-sans leading-relaxed">
                Tell us who you are and where we can reach you. We reply within 4 business hours.
              </p>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/25 focus:border-[#139EF2] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-1.5">
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/25 focus:border-[#139EF2] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-1.5">
                  Brand or Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Santhi Enterprises / Luxe Studio"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/25 focus:border-[#139EF2] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-1.5">
                  Official Email Address
                </label>
                <input
                  type="email"
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/25 focus:border-[#139EF2] focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* STEP 1: SERVICE SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <p className="text-sm text-white/60 font-sans leading-relaxed">
                What creative capability does your brand need to produce next?
              </p>
              <div className="space-y-2.5">
                {serviceOptions.map((opt) => {
                  const isSelected = formData.service === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        soundSynth.playCardTick();
                        setFormData({ ...formData, service: opt });
                      }}
                      className={`w-full text-left p-3.5 rounded-lg border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#139EF2] bg-[#139EF2]/10 text-white font-medium'
                          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      <span className="text-sm font-sans">{opt}</span>
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-[#139EF2] flex items-center justify-center text-white">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-white/20" />
                      )}
                    </button>
                  );
                })}
              </div>

              {formData.service.includes('Recce') && (
                <div className="p-3.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-2.5">
                  <Sparkles size={16} className="text-[#139EF2] shrink-0 mt-0.5" />
                  <span>
                    <strong>On-Location Technical Recce (₹2,000 Flat):</strong> Direct on-site factory or facility camera feasibility mapping, angle evaluation, and lighting recce by senior cinematographers.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: TIMELINE, BUDGET & NOTES */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                  Target Production Timeline
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timelineOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        soundSynth.playCardTick();
                        setFormData({ ...formData, timeline: opt });
                      }}
                      className={`text-xs p-2.5 rounded-md border text-left transition-all ${
                        formData.timeline === opt
                          ? 'border-[#139EF2] bg-[#139EF2]/15 text-white'
                          : 'border-white/10 bg-white/5 text-white/60 hover:border-white/25'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                  Estimated Investment Scope
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {budgetOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        soundSynth.playCardTick();
                        setFormData({ ...formData, budget: opt });
                      }}
                      className={`text-xs p-2.5 rounded-md border text-left transition-all ${
                        formData.budget === opt
                          ? 'border-[#139EF2] bg-[#139EF2]/15 text-white'
                          : 'border-white/10 bg-white/5 text-white/60 hover:border-white/25'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-1.5">
                  Project Vision & Specific Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details on products, factory setup, references, or specific deliverables..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/25 focus:border-[#139EF2] focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-[#07090E]/95 backdrop-blur-md border-t border-white/10 p-6 space-y-3 z-20">
          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => {
                  soundSynth.playCardTick();
                  setCurrentStep(currentStep - 1);
                }}
                className="px-4 py-3 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-xs font-mono uppercase tracking-wider transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3.5 px-6 rounded-lg bg-[#139EF2] hover:bg-[#008CFF] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(19,158,242,0.35)]"
            >
              <span>{currentStep === 2 ? 'Send Via WhatsApp Direct' : 'Continue'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/5">
            <span className="flex items-center gap-1.5">
              <Phone size={12} className="text-[#139EF2]" />
              +91 70759 60672
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={12} className="text-[#139EF2]" />
              brandshoots.in@gmail.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
