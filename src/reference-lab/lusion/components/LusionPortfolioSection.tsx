import React, { useState } from 'react';
import { ArrowUpRight, Play, Eye } from 'lucide-react';
import { CLIENT_PROJECTS, ClientProject } from '../../../data/clientsData';

interface LusionPortfolioSectionProps {
  onSelectProject: (project: ClientProject) => void;
  onPlayReel: (reelUrl: string, title: string) => void;
}

export const LusionPortfolioSection: React.FC<LusionPortfolioSectionProps> = ({
  onSelectProject,
  onPlayReel,
}) => {
  const [filter, setFilter] = useState<string>('ALL');

  const categories = ['ALL', 'Commercial Production', 'Architectural Film', 'Fashion & Retail', 'Food & Beverage'];

  const filteredProjects = filter === 'ALL'
    ? CLIENT_PROJECTS
    : CLIENT_PROJECTS.filter((p) => {
        if (filter === 'Commercial Production') return p.category.includes('Commercial') || p.category.includes('Production');
        if (filter === 'Architectural Film') return p.category.includes('Architectural') || p.category.includes('Interior');
        if (filter === 'Fashion & Retail') return p.category.includes('Jewelry') || p.category.includes('Accessories') || p.category.includes('Beauty') || p.category.includes('Retail');
        if (filter === 'Food & Beverage') return p.category.includes('Food') || p.category.includes('F&B') || p.category.includes('Dry Fruits');
        return true;
      });

  return (
    <section id="portfolio" className="relative w-full py-28 px-6 md:px-14 z-10">
      <div className="max-w-[1500px] mx-auto">
        {/* Section Heading & Category Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#139EF2] tracking-[0.25em] uppercase mb-3">
              <span>// 02</span>
              <span>•</span>
              <span>PORTFOLIO & CASE STUDIES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase">
              SELECTED WORKS.
              <br />
              <span className="text-white/40">COMMERCIAL PRODUCTION.</span>
            </h2>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full font-mono text-xs tracking-wider uppercase transition-all duration-300 ${
                  filter === cat
                    ? 'bg-[#139EF2] text-white font-semibold shadow-[0_0_15px_rgba(19,158,242,0.4)]'
                    : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Spatial Project Matrix (Lusion Zero Tech Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              className="group relative rounded-2xl overflow-hidden bg-[#0a0d14]/80 border border-white/10 hover:border-[#139EF2]/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl flex flex-col justify-between"
            >
              {/* Corner Crosshairs on Hover */}
              <div className="absolute top-3 left-3 z-20 font-mono text-white/30 text-xs opacity-0 group-hover:opacity-100 transition-opacity">+</div>
              <div className="absolute top-3 right-3 z-20 font-mono text-white/30 text-xs opacity-0 group-hover:opacity-100 transition-opacity">+</div>

              {/* Media Container with Live Video Hover Scrub */}
              <div className="relative aspect-[9/13] w-full overflow-hidden bg-black cursor-pointer" onClick={() => onSelectProject(project)}>
                <img
                  src={project.posterUrl}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle Gradient Veil */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-black/40 group-hover:opacity-40 transition-opacity" />

                {/* Top Badge: Client Code & Category */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md font-mono text-[10px] text-white/80 tracking-widest uppercase border border-white/10">
                    {project.category}
                  </span>
                  <span className="font-mono text-[10px] text-white/40 tracking-widest">
                    #{String(idx + 1).padStart(2, '0')} // {project.year}
                  </span>
                </div>

                {/* Floating Quick Action Overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayReel(project.videoUrl, project.name);
                    }}
                    className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#139EF2] text-white font-mono text-xs tracking-wider uppercase font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>PLAY REEL</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(project);
                    }}
                    className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-black font-mono text-xs tracking-wider uppercase font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>INSPECT</span>
                  </button>
                </div>
              </div>

              {/* Card Footer Meta (Lusion project-item-line-1 & line-2) */}
              <div className="p-6 border-t border-white/5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#139EF2] transition-colors uppercase tracking-tight">
                    {project.name}
                  </h3>
                  <button
                    onClick={() => onSelectProject(project)}
                    className="w-8 h-8 rounded-full bg-white/[0.04] group-hover:bg-[#139EF2] group-hover:text-white flex items-center justify-center text-white/60 transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-white/60 font-light line-clamp-2 leading-relaxed">
                  {project.headline}
                </p>

                {/* Deliverable Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.deliverables.slice(0, 2).map((d, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 font-mono text-[10px] text-white/50 tracking-wide"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
