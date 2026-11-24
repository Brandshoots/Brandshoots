import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export const LusionContactSection: React.FC = () => {
  const [service, setService] = useState('Commercial Video Production');
  const [budget, setBudget] = useState('₹1.5L - ₹3L');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Format WhatsApp message with structured brief
    const text = `*New BrandShoots Production Inquiry*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Brand:* ${encodeURIComponent(brand)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Service:* ${encodeURIComponent(service)}%0A*Budget:* ${encodeURIComponent(budget)}%0A*Notes:* ${encodeURIComponent(notes)}`;
    window.open(`https://wa.me/917075960672?text=${text}`, '_blank');
    setIsSubmitted(true);
  };

  return (
    <section id="contact" className="relative w-full py-28 px-6 md:px-14 z-10 border-t border-white/5">
      <div className="max-w-[1500px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#139EF2] tracking-[0.25em] uppercase mb-3">
              <span>// 06</span>
              <span>•</span>
              <span>START AN INQUIRY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase">
              LET’S CREATE SOMETHING
              <br />
              <span className="text-[#139EF2]">UNFORGETTABLE.</span>
            </h2>
          </div>

          <p className="max-w-md text-white/60 font-light text-base leading-relaxed">
            Ready to elevate your brand above the generic digital clutter? Share your vision 
            below and our production team will prepare a structured proposal.
          </p>
        </div>

        {/* 2-Column Form & Direct Contacts Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Interactive Inquiry Form */}
          <div className="lg:col-span-8 p-8 md:p-12 rounded-2xl bg-[#0a0d14]/80 border border-white/10">
            {isSubmitted ? (
              <div className="py-16 text-center flex flex-col items-center">
                <CheckCircle2 className="w-16 h-16 text-[#139EF2] mb-6" />
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-2">
                  Inquiry Dispatched to WhatsApp
                </h3>
                <p className="text-white/60 max-w-md leading-relaxed mb-8">
                  Our director has received your production parameters and will connect 
                  with you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Select Service */}
                <div>
                  <label className="block font-mono text-xs text-white/50 tracking-widest uppercase mb-3">
                    01 // SELECT SERVICE
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Commercial Video Production', 'Social-First Reel Engine', 'Ad Campaign Creative Direction'].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setService(s)}
                        className={`p-3.5 rounded-xl border text-xs font-mono tracking-wider uppercase text-left transition-all ${
                          service === s
                            ? 'bg-[#139EF2]/20 border-[#139EF2] text-white font-semibold'
                            : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Select Budget */}
                <div>
                  <label className="block font-mono text-xs text-white/50 tracking-widest uppercase mb-3">
                    02 // ESTIMATED PRODUCTION BUDGET
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['₹50K - ₹1.5L', '₹1.5L - ₹3L', '₹3L - ₹5L', '₹5L+ Enterprise'].map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setBudget(b)}
                        className={`p-3 rounded-xl border text-xs font-mono tracking-wider uppercase text-center transition-all ${
                          budget === b
                            ? 'bg-[#139EF2]/20 border-[#139EF2] text-white font-semibold'
                            : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Text Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[11px] text-white/40 tracking-wider uppercase mb-2">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Varma"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#139EF2] text-white text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-white/40 tracking-wider uppercase mb-2">
                      COMPANY / BRAND *
                    </label>
                    <input
                      type="text"
                      required
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. Varma Industries"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#139EF2] text-white text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-white/40 tracking-wider uppercase mb-2">
                      WHATSAPP NUMBER *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#139EF2] text-white text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-white/40 tracking-wider uppercase mb-2">
                    PROJECT VISION & TARGET DELIVERABLES
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe your manufacturing plant, retail store, target timeline, or creative references..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#139EF2] text-white text-sm outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#139EF2] hover:bg-[#0d82ca] text-white font-mono text-xs tracking-widest uppercase font-semibold transition-all shadow-[0_0_30px_rgba(19,158,242,0.4)] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT BRIEF VIA WHATSAPP</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Studio Direct Channels */}
          <div className="lg:col-span-4 flex flex-col justify-between p-8 md:p-10 rounded-2xl bg-[#0a0d14]/70 border border-white/10">
            <div>
              <div className="font-mono text-xs text-[#139EF2] tracking-widest uppercase mb-6">
                HEADQUARTERS & PRODUCTION BASE
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#139EF2] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold text-sm">BrandShoots Studios</div>
                    <div className="text-white/60 text-xs leading-relaxed">
                      Opp. Little Buds School, Danavaipeta,
                      <br />
                      Rajahmundry, Andhra Pradesh — 533103
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#139EF2] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold text-sm">Direct Phone & WhatsApp</div>
                    <a
                      href="tel:+917075960672"
                      className="text-white/60 text-xs hover:text-[#139EF2] transition-colors"
                    >
                      +91 70759 60672
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#139EF2] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold text-sm">Client Inquiries</div>
                    <a
                      href="mailto:brandshoots.in@gmail.com"
                      className="text-white/60 text-xs hover:text-[#139EF2] transition-colors"
                    >
                      brandshoots.in@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <div className="font-mono text-[10px] text-white/40 tracking-wider uppercase mb-2">
                STUDIO PRODUCTION CALENDAR
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs text-white/80">
                  SLOTS AVAILABLE FOR NEXT PRODUCTION WINDOW
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
