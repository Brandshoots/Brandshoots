import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { CLIENT_PROJECTS } from '../../data/clientsData';

export const ClientProjectView: React.FC = () => {
  const { clientSlug } = useParams<{ clientSlug: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Find project by slug
  const projectIndex = CLIENT_PROJECTS.findIndex((p) => p.slug === clientSlug);
  const project = projectIndex !== -1 ? CLIENT_PROJECTS[projectIndex] : CLIENT_PROJECTS[0];

  const prevProject = CLIENT_PROJECTS[(projectIndex - 1 + CLIENT_PROJECTS.length) % CLIENT_PROJECTS.length];
  const nextProject = CLIENT_PROJECTS[(projectIndex + 1) % CLIENT_PROJECTS.length];

  // GSAP entrance animation
  useEffect(() => {
    window.scrollTo(0, 0);
    if (containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
        );
      });
      return () => ctx.revert();
    }
  }, [clientSlug]);

  // Guaranteed autoplay on project view mount & slug transition
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = isMuted;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [clientSlug, isMuted]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleBackToClients = () => {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('clients');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-[#05070A] text-white selection:bg-[#008CFF] selection:text-white pb-24"
    >
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 w-full px-6 sm:px-12 py-5 bg-[#05070A]/85 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/Logo Official.svg"
            alt="BrandShoots"
            className="h-7 sm:h-8 w-auto object-contain transition-opacity group-hover:opacity-80"
          />
        </Link>

        {/* Back to Clients Button */}
        <button
          type="button"
          onClick={handleBackToClients}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-[#008CFF] text-xs sm:text-sm font-mono tracking-wider uppercase font-semibold text-white transition-all duration-300 group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Clients</span>
        </button>
      </header>

      {/* Main Project Content */}
      <main className="max-w-[1500px] mx-auto px-6 sm:px-12 pt-10 sm:pt-16">
        
        {/* Project Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#008CFF] shadow-[0_0_10px_#008CFF]" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.28em] uppercase text-[#008CFF] font-bold">
              {project.category}
            </span>
            <span className="text-white/20">•</span>
            <span className="font-mono text-xs sm:text-sm tracking-widest text-white/50">
              {project.year}
            </span>
          </div>

          {/* Quick Prev / Next Navigator */}
          <div className="flex items-center gap-3 font-mono text-xs tracking-wider uppercase">
            <Link
              to={`/portfolio/${prevProject.slug}`}
              className="text-white/60 hover:text-[#008CFF] transition-colors"
            >
              ← Prev
            </Link>
            <span className="text-white/20">/</span>
            <Link
              to={`/portfolio/${nextProject.slug}`}
              className="text-white/60 hover:text-[#008CFF] transition-colors"
            >
              Next →
            </Link>
          </div>
        </div>

        {/* Project Headline & Client Name */}
        <div className="mb-10 sm:mb-14">
          <h1 className="font-editorial font-black uppercase text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[0.95] text-white mb-4">
            {project.name}
          </h1>
          <p className="font-editorial text-lg sm:text-2xl text-[#008CFF] font-bold tracking-wide">
            {project.headline}
          </p>
        </div>

        {/* Two-Column Cinema Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left: Master 9:16 Video Player Container */}
          <div className="lg:col-span-6 xl:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)] group">
              <video
                ref={videoRef}
                src={project.videoUrl}
                poster={project.posterUrl}
                autoPlay
                playsInline
                loop
                muted={isMuted}
                className="w-full h-full object-cover"
                onClick={togglePlay}
              />

              {/* Floating Player Controls */}
              <div className="absolute bottom-5 inset-x-5 flex items-center justify-between p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 z-20">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-white/80 hover:text-white transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <span className="w-2.5 h-2.5 bg-[#008CFF] rounded-sm" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <span className="w-0 h-0 border-y-4 border-y-transparent border-l-6 border-l-[#008CFF]" />
                      <span>Play</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-white/80 hover:text-[#008CFF] transition-colors"
                >
                  {isMuted ? 'Muted' : 'Sound On'}
                </button>
              </div>

              {/* Subtle Blue Rim Light */}
              <div className="absolute inset-0 rounded-2xl border border-[#008CFF]/30 pointer-events-none group-hover:border-[#008CFF]/80 transition-colors duration-300" />
            </div>
          </div>

          {/* Right: Narrative Breakdown, Deliverables & Results */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-10">
            
            {/* Client Logo if available */}
            {project.logoUrl && (
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 w-fit max-w-[200px]">
                <img
                  src={project.logoUrl}
                  alt={project.name}
                  className="h-12 w-auto object-contain filter brightness-110"
                />
              </div>
            )}

            {/* Project Narrative Story */}
            <div className="space-y-4">
              <h2 className="font-mono text-xs tracking-[0.26em] uppercase text-[#008CFF] font-bold">
                PROJECT OVERVIEW
              </h2>
              <p className="font-editorial text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed font-medium">
                {project.story}
              </p>
            </div>

            {/* Deliverables Tags */}
            <div className="space-y-4">
              <h2 className="font-mono text-xs tracking-[0.26em] uppercase text-[#64748B] font-bold">
                KEY DELIVERABLES & FORMATS
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {project.deliverables.map((d) => (
                  <span
                    key={d}
                    className="px-3.5 py-1.5 rounded-none bg-white/10 border border-white/15 text-xs font-mono tracking-wider uppercase text-white font-semibold"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Campaign Performance Metrics if available */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                {project.metrics.map((m) => (
                  <div key={m.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="block font-editorial font-black text-3xl sm:text-4xl text-[#008CFF]">
                      {m.value}
                    </span>
                    <span className="block font-mono text-[11px] tracking-widest uppercase text-white/50 mt-1">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Call to Action Button */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleBackToClients}
                className="px-6 py-3.5 rounded-full bg-[#008CFF] hover:bg-[#28A0FF] text-white font-mono text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 shadow-[0_0_25px_rgba(0,140,255,0.4)]"
              >
                Browse All Clients
              </button>
              <a
                href="#contact"
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300"
              >
                Start A Project Like This
              </a>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default ClientProjectView;
