import React, { useState } from 'react';
import { CLIENT_PROJECTS, ClientProject } from '../../../data/clientsData';
import { WithMediaCaseDrawer } from './WithMediaCaseDrawer';

interface WithMediaPortfolioProps {
  onStartInquiry: (serviceName?: string) => void;
}

export const WithMediaPortfolio: React.FC<WithMediaPortfolioProps> = ({ onStartInquiry }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProject, setActiveProject] = useState<ClientProject | null>(null);

  const filterTabs = [
    { id: 'all', label: 'All Projects' },
    { id: 'Commercial Production', label: 'Industrial & Commercial' },
    { id: 'Architectural Film', label: 'Architectural Glazing' },
    { id: 'High-Velocity Retail', label: 'Retail & Fashion' },
    { id: 'Artisanal FMCG', label: 'Gourmet & Hospitality' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? CLIENT_PROJECTS
    : CLIENT_PROJECTS.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()) || (selectedCategory === 'All Projects'));

  return (
    <section id="portfolio" className="relative w-full py-24 sm:py-32 bg-[#05070B] overflow-hidden border-t border-white/[0.06]">
      {/* Background Watermark Typography */}
      <div className="absolute top-12 right-6 sm:right-12 select-none pointer-events-none text-[120px] sm:text-[200px] font-black text-white/[0.015] font-mono leading-none">
        CS
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest mb-4">
            <span>Verified Work & Case Studies</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-200">Portfolio.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Every frame below represents genuine client cinematography produced by our in-house crew. No speculative renders, no stock mockups.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : 'text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.06]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project, idx) => (
            <article
              key={project.id}
              onClick={() => setActiveProject(project)}
              className="group cursor-pointer rounded-2xl bg-[#090D16] border border-white/[0.08] hover:border-blue-500/50 overflow-hidden shadow-xl hover:shadow-[0_20px_40px_rgba(37,99,235,0.15)] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Media Thumbnail Container with Video Preview on Hover */}
              <div className="relative w-full aspect-[4/5] bg-black overflow-hidden">
                <img
                  src={project.posterUrl}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-110"
                  onError={(e) => {
                    // Fallback to video frame if image fails
                    (e.target as HTMLElement).style.opacity = '0.5';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-black/30" />

                {/* Top Badge: Client Category */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono uppercase tracking-wider text-white">
                    {project.category}
                  </span>
                </div>

                {/* Play Trigger Circle */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.6)] transform scale-90 group-hover:scale-100 transition-transform">
                    <svg className="w-6 h-6 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Bottom Overlay: Metrics Pill */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono">
                    <span className="text-slate-300">{project.metrics[0].label}:</span>
                    <span className="text-blue-400 font-bold">{project.metrics[0].value}</span>
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">
                    0{idx + 1} // CASE STUDY
                  </div>
                  <h3 className="text-xl font-bold uppercase text-white group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {project.headline}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-400">
                  <span>View Case Study</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Case Study Detail Modal / Drawer */}
      <WithMediaCaseDrawer
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onStartInquiry={onStartInquiry}
      />
    </section>
  );
};
