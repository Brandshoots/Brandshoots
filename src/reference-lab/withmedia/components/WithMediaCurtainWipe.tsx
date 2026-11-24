import React from 'react';

interface WithMediaCurtainWipeProps {
  isWiping: boolean;
}

export const WithMediaCurtainWipe: React.FC<WithMediaCurtainWipeProps> = ({ isWiping }) => {
  return (
    <div
      className={`fixed inset-0 z-[100] pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        isWiping ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="relative w-full h-full bg-[#05070B] border-r-2 border-blue-500 shadow-[0_0_50px_rgba(37,99,235,0.4)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 p-2 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <img src="/logo.svg" alt="BrandShoots" className="w-full h-full object-contain" />
          </div>
          <span className="text-xs font-mono tracking-[0.3em] text-blue-400">
            <span>BrandShoots</span><span className="uppercase"> // CINEMATIC ENGINE</span>
          </span>
        </div>
      </div>
    </div>
  );
};
