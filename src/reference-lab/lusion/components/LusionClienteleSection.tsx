import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CLIENT_PROJECTS, ClientProject } from '../../../data/clientsData';

interface LusionClienteleSectionProps {
  onSelectProject: (project: ClientProject) => void;
}

export const LusionClienteleSection: React.FC<LusionClienteleSectionProps> = ({ onSelectProject }) => {
  return (
    <section id="clientele" className="relative w-full py-28 px-6 md:px-14 z-10 border-t border-white/5">
      <div className="max-w-[1500px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#139EF2] tracking-[0.25em] uppercase mb-3">
              <span>// 05</span>
              <span>•</span>
              <span>PARTNERSHIP NETWORK</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase">
              VERIFIED CLIENTS.
              <br />
              <span className="text-white/40">PROVEN MARKET LEADERSHIP.</span>
            </h2>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-white/50 tracking-wider">
            <div>
              <div className="text-xl font-bold text-white">100%</div>
              <div className="text-[10px] text-white/40 uppercase">RETENTION RATE</div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <div className="text-xl font-bold text-white">12+</div>
              <div className="text-[10px] text-white/40 uppercase">CORE PARTNERS</div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <div className="text-xl font-bold text-white">2.5M+</div>
              <div className="text-[10px] text-white/40 uppercase">TOTAL AUDIENCE</div>
            </div>
          </div>
        </div>

        {/* Client Partner Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CLIENT_PROJECTS.map((client) => (
            <div
              key={client.id}
              onClick={() => onSelectProject(client)}
              className="group relative p-6 rounded-2xl bg-[#0a0d14]/70 border border-white/10 hover:border-[#139EF2]/60 hover:bg-[#0f1422] transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Corner mark */}
              <div className="absolute top-2 right-2 text-white/20 group-hover:text-[#139EF2] font-mono text-xs transition-colors">
                +
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] text-[#139EF2] tracking-widest uppercase">
                    {client.category}
                  </span>
                  <span className="font-mono text-[10px] text-white/30">
                    {client.year}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#139EF2] transition-colors uppercase tracking-tight mb-2">
                  {client.name}
                </h3>

                <p className="text-xs text-white/50 font-light line-clamp-2 leading-relaxed mb-6">
                  {client.headline}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[11px] text-white/70">
                  {client.metrics?.[0]?.label}: <strong className="text-white">{client.metrics?.[0]?.value}</strong>
                </span>

                <span className="w-6 h-6 rounded-full bg-white/[0.04] group-hover:bg-[#139EF2] group-hover:text-white flex items-center justify-center text-white/40 transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
