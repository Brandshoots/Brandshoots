import React, { useState } from 'react';

interface WithMediaRecceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithMediaRecceModal: React.FC<WithMediaRecceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    facilityType: 'Industrial Plant / Warehouse',
    location: 'Rajamahendravaram & East/West Godavari',
    preferredDate: '',
  });

  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello BrandShoots Team, I would like to book an On-Location Technical Recce (₹2,000).
Name: ${formData.name}
Company: ${formData.company}
Phone: ${formData.phone}
Facility: ${formData.facilityType}
Location: ${formData.location}
Date: ${formData.preferredDate || 'Earliest available'}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-[#080C14] border border-blue-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(37,99,235,0.25)] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <h3 className="text-lg font-black uppercase text-white tracking-tight">
              On-Location Technical Recce // ₹2,000
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/[0.05] text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {confirmed ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 mx-auto flex items-center justify-center text-xl font-bold">
              ✓
            </div>
            <h4 className="text-xl font-bold uppercase text-white">Recce Request Registered</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our technical director will contact you within 2 hours to confirm your facility inspection date. The ₹2,000 recce fee is credited in full against your production retainer.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/917075960672?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
              >
                <span>Confirm Instantly via WhatsApp →</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Contact Person *
              </label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Company / Factory *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enterprise Name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Facility Type
                </label>
                <select
                  value={formData.facilityType}
                  onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0C121F] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="Industrial Plant / Warehouse">Industrial Extrusion / Warehouse</option>
                  <option value="Architectural Glass / Showroom">Architectural Showroom</option>
                  <option value="Luxury Jewelry / Retail Store">Luxury Jewelry / Retail</option>
                  <option value="Hospital / Healthcare Campus">Healthcare / Clinic</option>
                  <option value="Corporate Office Hub">Corporate Office</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Location Zone
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0C121F] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="Rajamahendravaram">Rajamahendravaram / Godavari</option>
                  <option value="Hyderabad">Hyderabad Metropolitan Hub</option>
                  <option value="Vijayawada">Vijayawada / Guntur</option>
                  <option value="Visakhapatnam">Visakhapatnam</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-blue-400 block">// Recce Guarantee:</span>
              <span>1. Three-phase electrical load measurement</span>
              <br />
              <span>2. Acoustic reverberation & ambient sound test</span>
              <br />
              <span>3. 100% credited against your final commercial shoot fee</span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all"
              >
                Schedule Facility Inspection (₹2,000) →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
