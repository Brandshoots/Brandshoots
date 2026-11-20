import React, { useState } from 'react';

interface WithMediaContactProps {
  initialService?: string;
}

export const WithMediaContact: React.FC<WithMediaContactProps> = ({ initialService }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    service: initialService || 'Commercial Video Production',
    city: 'Rajamahendravaram',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappText = encodeURIComponent(
    `Hello BrandShoots Team, I would like to inquire about: ${formData.service} for ${formData.company || formData.name}. City: ${formData.city}.`
  );

  return (
    <section id="contact" className="relative w-full py-24 sm:py-32 bg-[#05070B] overflow-hidden border-t border-white/[0.06]">
      {/* Background Watermark Typography */}
      <div className="absolute top-12 right-6 sm:right-12 select-none pointer-events-none text-[120px] sm:text-[200px] font-black text-white/[0.015] font-mono leading-none">
        CT
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest mb-4">
            <span>Direct Commercial Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-200">Conversation.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Ready to commission commercial filmmaking that commands respect? Send an inquiry below or reach our directors directly via WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form Container */}
          <div className="lg:col-span-7 p-6 sm:p-10 rounded-2xl bg-[#090D16] border border-white/[0.08] shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-bold uppercase text-white">Inquiry Received</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Thank you, {formData.name}. Our creative director will review your project details and contact you within 24 hours.
                </p>
                <div className="pt-4">
                  <a
                    href={`https://wa.me/917075960672?text=${whatsappText}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                  >
                    <span>Instant WhatsApp Connect →</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Reddy"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                      Company / Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Viswatuff Glass"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                      Phone Number / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                      Primary Service Required
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="Commercial Video Production">Commercial Video Production</option>
                      <option value="Social Velocity 9:16 Retainer">Social Velocity 9:16 Retainer</option>
                      <option value="On-Location Technical Recce (₹2,000)">On-Location Technical Recce (₹2,000)</option>
                      <option value="DaVinci Color & Post-Production">DaVinci Color & Post-Production</option>
                      <option value="Creative Strategy & Direction">Creative Strategy & Direction</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                      Facility / Shoot Location
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="Rajamahendravaram">Rajamahendravaram & Godavari Region</option>
                      <option value="Hyderabad">Hyderabad & Telangana Hub</option>
                      <option value="Vijayawada">Vijayawada / Guntur</option>
                      <option value="Visakhapatnam">Visakhapatnam</option>
                      <option value="Other">Other Location in South India</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    Project Vision & Timelines
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your facility, products, target audience, and desired production timeframe..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all"
                  >
                    Transmit Commercial Inquiry →
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Contact Details & Direct Hubs */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Studio Coordinates */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400 block mb-1">
                  Primary Studio Hub
                </span>
                <h4 className="text-xl font-bold uppercase text-white">Rajamahendravaram</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Serving industrial corridors, manufacturing plants, luxury retail, and temple jewelry heritage across Coastal Andhra.
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400 block mb-1">
                  Metropolitan Creative Hub
                </span>
                <h4 className="text-xl font-bold uppercase text-white">Hyderabad</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Studio presence handling corporate commercial films, healthcare networks, tech enterprises, and creator productions.
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Phone / Call:</span>
                  <a href="tel:+917075960672" className="text-blue-400 hover:underline">+91 70759 60672</a>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>WhatsApp:</span>
                  <a href="https://wa.me/917075960672" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">+91 70759 60672</a>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Email:</span>
                  <span className="text-slate-200">contact@brandshoots.com</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Instagram:</span>
                  <a href="https://instagram.com/wearebrandshoots" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">@wearebrandshoots</a>
                </div>
              </div>
            </div>

            {/* Specialized Recce Quick Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/40 to-[#05070B] border border-blue-500/30">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400 block mb-1">
                Technical Service
              </span>
              <h4 className="text-lg font-bold uppercase text-white mb-2">
                Need a Facility Recce First?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                We provide a comprehensive on-site technical inspection for ₹2,000, including electrical load measurement, acoustic test, and shot list mapping. Fully credited back against your final production retainer.
              </p>
              <a
                href={`https://wa.me/917075960672?text=${encodeURIComponent('Hello BrandShoots, I would like to book an On-Location Technical Recce (₹2,000) for our facility.')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-full bg-blue-600/30 border border-blue-500/50 text-blue-300 hover:text-white hover:bg-blue-600 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>Book Recce via WhatsApp (₹2k)</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
