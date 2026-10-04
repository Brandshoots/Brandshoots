import { forwardRef } from 'react';
import { MemorySequence } from './MemorySequence';
import { FocusReveal } from './FocusReveal';
import { LogoSnap } from './LogoSnap';
import { CameraFlash } from './CameraFlash';
import { PRELOADER_REELS } from '../../config/preloaderReels';

interface DeviceScreenProps {
  activeReelIndex: number;
  logoStage: 'hidden' | 'focus' | 'shutter' | 'snap' | 'locked' | 'expand';
  isColorRevealed: boolean;
  isFocusing: boolean;
  isFocusLocked: boolean;
  flashRef: React.RefObject<HTMLDivElement>;
  screenInnerRef?: React.RefObject<HTMLDivElement>;
  className?: string;
}

/**
 * DeviceScreen:
 * The primary stage hosting the memory footage inside the device's recessed glass monitor.
 * Displays minimal director monitor metadata, reflections, and handles the screen-to-viewport handoff.
 */
export const DeviceScreen = forwardRef<HTMLDivElement, DeviceScreenProps>(({
  activeReelIndex,
  logoStage,
  isColorRevealed,
  isFocusing,
  isFocusLocked,
  flashRef,
  screenInnerRef,
  className = ''
}, ref) => {
  const currentReel = PRELOADER_REELS[activeReelIndex] || PRELOADER_REELS[0];

  return (
    <div
      ref={ref}
      className={`relative w-full h-full rounded-2xl overflow-hidden bg-black shadow-inner select-none ${className}`}
      style={{
        boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* Inner Screen Container (scaled during exit transition) */}
      <div
        ref={screenInnerRef}
        className="relative w-full h-full overflow-hidden"
      >
        {/* Core Memory Footage Sequence */}
        <MemorySequence activeIndex={activeReelIndex} />

        {/* Viewfinder Overlay / Production Metadata */}
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-6 text-[10px] md:text-xs font-mono tracking-wider text-white/70">
          {/* Top Metadata Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Blinking REC indicator */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm border border-white/10">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-semibold text-white tracking-widest text-[9px] uppercase">REC</span>
              </div>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/40 text-white/60 text-[9px]">
                {currentReel.metadata.timecode}
              </span>
            </div>

            {/* Format & Lens Spec */}
            <div className="flex items-center gap-2 text-white/70">
              <span className="px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm border border-white/10 text-[9px]">
                RAW 4K
              </span>
              <span className="px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm border border-white/10 text-[9px] text-brand-blue">
                {currentReel.metadata.fps}
              </span>
            </div>
          </div>

          {/* Viewfinder Rule-of-Thirds Grid Guide (Subtle Hairlines) */}
          <div className="absolute inset-8 pointer-events-none opacity-15">
            <div className="w-full h-full border border-dashed border-white/40 grid grid-cols-3 grid-rows-3">
              <div /><div /><div />
              <div /><div /><div />
              <div /><div /><div />
            </div>
          </div>

          {/* Bottom Metadata Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm border border-white/10 text-[9px] text-white/80">
                {currentReel.metadata.lens}
              </span>
              <span className="px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm border border-white/10 text-[9px] text-white/60">
                ISO {currentReel.metadata.iso}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm border border-white/10 text-[9px] text-white/60">
                {currentReel.metadata.shutter}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[9px] text-white/60 bg-black/50 px-2 py-0.5 rounded border border-white/10">
              <span>BAT 98%</span>
              <span className="text-emerald-400">●</span>
            </div>
          </div>
        </div>

        {/* Autofocus Bracket Indicator */}
        <FocusReveal isFocusing={isFocusing} isLocked={isFocusLocked} />

        {/* Official BrandShoots Logo Reveal */}
        <LogoSnap
          stage={logoStage}
          isColorRevealed={isColorRevealed}
        />

        {/* Camera Flash Overlay */}
        <CameraFlash ref={flashRef} />

        {/* Realistic Screen Glass Specular Reflection */}
        <div className="pointer-events-none absolute inset-0 z-30 glass-specular mix-blend-screen opacity-35" />

        {/* Inner Glass Chamfer Glow */}
        <div className="pointer-events-none absolute inset-0 z-30 rounded-2xl ring-1 ring-inset ring-white/10" />
      </div>
    </div>
  );
});

DeviceScreen.displayName = 'DeviceScreen';
