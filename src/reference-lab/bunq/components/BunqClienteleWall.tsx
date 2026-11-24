import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CLIENT_PROJECTS, ClientProject } from '../../../data/clientsData';
import { soundSynth } from './BunqSoundSynth';

interface BunqClienteleWallProps {
  onSelectProject: (p: ClientProject) => void;
}

export const BunqClienteleWall: React.FC<BunqClienteleWallProps> = ({ onSelectProject }) => {
  const [filter, setFilter] = useState<'All' | 'Industrial' | 'Retail' | 'Corporate'>('All');

  const filteredProjects = CLIENT_PROJECTS.filter((p) => {
    if (filter === 'All') return true;
    if (filter === 'Industrial') {
      return p.slug.includes('santhi') || p.slug.includes('viswatuff') || p.category.toLowerCase().includes('industrial');
    }
    if (filter === 'Retail') {
      return (
        p.slug.includes('bags') ||
        p.slug.includes('aabharan') ||
        p.slug.includes('sahana') ||
        p.slug.includes('tea3') ||
        p.slug.includes('jain')
      );
    }
    if (filter === 'Corporate') {
      return (
        p.slug.includes('dayanidhi') ||
        p.slug.includes('sb-ventures') ||
        p.slug.includes('kc-overseas') ||
        p.slug.includes('playzone') ||
        p.slug.includes('leela')
      );
    }
    return true;
  });

  return (
    <section id="clientele" className="relative w-full py-28 bg-[#030508] text-white overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10 space-y-12">
        {/* Header & Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#139EF2] mb-3">
              <span>[ VERIFIED PARTNERS ]</span>
              <span className="w-8 h-[1px] bg-[#139EF2]/40" />
              <span>CATEGORY LEADERSHIP</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-sans leading-[0.95]">
              Clientele
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {(['All', 'Industrial', 'Retail', 'Corporate'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundSynth.playCardTick();
                  setFilter(cat);
                }}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                  filter === cat
                    ? 'bg-[#139EF2] text-white font-semibold shadow-[0_0_15px_rgba(19,158,242,0.3)]'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 12-Client Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                soundSynth.playWhoosh(350, 120, 0.25);
                onSelectProject(project);
              }}
              className="group relative rounded-xl p-6 bg-white/[0.02] border border-white/10 hover:border-[#139EF2]/60 hover:bg-white/[0.05] transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-4 min-h-[160px]"
            >
              {/* Client Logo Image */}
              <div className="h-12 w-full flex items-center justify-center">
                {project.logoUrl ? (
                  <img
                    src={project.logoUrl}
                    alt={project.name}
                    className="max-h-10 max-w-[130px] object-contain filter brightness-110 opacity-70 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-base font-bold text-white font-sans">
                    {project.name}
                  </span>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold text-white/90 font-sans group-hover:text-[#139EF2] transition-colors">
                  {project.name}
                </div>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-0.5">
                  {project.category}
                </div>
              </div>

              {/* View Case Study Pill on Hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono uppercase tracking-wider text-[#139EF2] flex items-center gap-1">
                <span>View Case Study</span>
                <ArrowRight size={10} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
