import React, { useEffect, useState } from 'react';

interface LusionPreloaderProps {
  onComplete: () => void;
}

export const LusionPreloader: React.FC<LusionPreloaderProps> = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 4;
      if (current >= 100) {
        current = 100;
        setPercent(100);
        clearInterval(interval);
        setTimeout(onComplete, 400);
      } else {
        setPercent(current);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#05070b] flex flex-col items-center justify-center p-6 select-none animate-fadeIn">
      {/* 4 Corner Crosshairs */}
      <div className="absolute top-6 left-6 font-mono text-white/30 text-sm">+</div>
      <div className="absolute top-6 right-6 font-mono text-white/30 text-sm">+</div>
      <div className="absolute bottom-6 left-6 font-mono text-white/30 text-sm">+</div>
      <div className="absolute bottom-6 right-6 font-mono text-white/30 text-sm">+</div>

      {/* Brand Logo */}
      <div className="mb-10">
        <img
          src="/Logo Official.svg"
          alt="BrandShoots"
          className="h-10 w-auto brightness-200"
        />
      </div>

      {/* Digital Numeric Counter (Lusion Signature) */}
      <div className="font-mono text-7xl sm:text-9xl font-black text-white tracking-tighter tabular-nums mb-6">
        {String(percent).padStart(2, '0')}
        <span className="text-[#139EF2] text-4xl sm:text-5xl ml-1">%</span>
      </div>

      {/* Technical Calibration Status */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 font-mono text-xs text-white/50 tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-[#139EF2] animate-pulse" />
          <span>
            {percent < 40 && 'INITIALIZING THREE.JS WEBGL CONTEXT...'}
            {percent >= 40 && percent < 75 && 'COMPILING GLSL CAMERA SHADERS & CORRIDORS...'}
            {percent >= 75 && percent < 100 && 'CALIBRATING ANAMORPHIC VIEWPORT...'}
            {percent === 100 && 'COMMERCIAL CINEMA LAB READY.'}
          </span>
        </div>

        {/* Thin Progress Line */}
        <div className="w-48 sm:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-[#139EF2] transition-all duration-75 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
