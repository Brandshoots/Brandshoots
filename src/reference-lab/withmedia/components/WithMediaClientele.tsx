import React from 'react';

interface WithMediaClienteleProps {
  onSelectClient?: (clientName: string) => void;
  onStartInquiry: () => void;
}

export const WithMediaClientele: React.FC<WithMediaClienteleProps> = ({
  onStartInquiry,
}) => {
  const verifiedClients = [
    { name: 'Santhi Pipes', industry: 'Industrial Manufacturing', logo: '/clients/optimized/Shanti Pipes.webp', metrics: '250K+ Views' },
    { name: 'Viswatuff Glass', industry: 'Architectural Glazing', logo: '/clients/optimized/Viswatuff Glass Logo.webp', metrics: '380K+ Views' },
    { name: 'Bags World', industry: 'Luxury Travel Retail', logo: '/clients/optimized/Bags World Logo.webp', metrics: '18K+ Followers' },
    { name: 'Aabharan Jewellers', industry: 'Heritage Temple Goldsmithing', logo: '/clients/optimized/Aabharan Logo.webp', metrics: '450K+ Reach' },
    { name: 'Sahana Dry Fruits', industry: 'Artisanal Gourmet & FMCG', logo: '/clients/optimized/Sahana Logo.webp', metrics: '320K+ Views' },
    { name: 'Tea3 Café', industry: 'Contemporary Beverage Culture', logo: '/clients/optimized/T3 Logo.webp', metrics: '120K+ Reach' },
    { name: 'Dayanidhi Interiors', industry: 'Spatial Interior Architecture', logo: '/clients/optimized/Dayanidhi Logo.webp', metrics: '190K+ Views' },
    { name: 'Jain Beauty Concepts', industry: 'Editorial Salon & Bridal', logo: '/clients/optimized/Jain Beauty Logo.webp', metrics: '280K+ Views' },
    { name: 'SB Ventures', industry: 'Commercial Real Estate', logo: '/clients/optimized/SB Ventures Logo.webp', metrics: '140K+ Reach' },
    { name: 'KC Overseas', industry: 'Global Education & Visas', logo: '/clients/optimized/KC Overseas Logo.webp', metrics: '210K+ Views' },
    { name: 'Fresh & Fresh', industry: 'Organic Food & Retail', logo: '/clients/optimized/Fresh and Fresh Logo.webp', metrics: '95K+ Views' },
    { name: 'SRK Doors World', industry: 'Architectural Hardware', logo: '/clients/optimized/SRK Doors World Logo.webp', metrics: '110K+ Reach' },
  ];

  return (
    <section id="clientele" className="relative w-full py-24 sm:py-32 bg-[#05070B] overflow-hidden border-t border-white/[0.06]">
      {/* Background Watermark Typography */}
      <div className="absolute top-12 right-6 sm:right-12 select-none pointer-events-none text-[120px] sm:text-[200px] font-black text-white/[0.015] font-mono leading-none">
        CL
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest mb-4">
            <span>Verified Commercial Partners</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-200">Clientele.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            From heavy industrial extrusion plants to luxury temple jewellers and high-growth retail brands. We build enduring visual authority for leaders across Andhra Pradesh and Telangana.
          </p>
        </div>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {verifiedClients.map((client, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/40 hover:bg-blue-950/[0.08] transition-all duration-300 flex flex-col justify-between items-center text-center group min-h-[160px]"
            >
              <div className="w-full h-16 flex items-center justify-center p-2">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-h-full max-w-[130px] object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="pt-3 border-t border-white/[0.04] w-full">
                <span className="text-xs font-bold uppercase tracking-wider text-white block group-hover:text-blue-400 transition-colors">
                  {client.name}
                </span>
                <span className="text-[10px] font-mono uppercase text-slate-500 block mt-0.5">
                  {client.industry}
                </span>
                <span className="text-[10px] font-mono text-blue-400 block mt-1">
                  {client.metrics}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Metric Strip */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#090D16] border border-white/[0.08] flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold uppercase text-white">
              Ready to Join the Roster?
            </span>
            <span className="text-xs sm:text-sm text-slate-400">
              We onboard only 2 new commercial clients per production month to preserve cinematic quality.
            </span>
          </div>

          <button
            onClick={onStartInquiry}
            className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
          >
            Inquire for Availability →
          </button>
        </div>
      </div>
    </section>
  );
};
