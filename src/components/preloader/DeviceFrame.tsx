import { forwardRef } from 'react';
import { DeviceScreen } from './DeviceScreen';

interface DeviceFrameProps {
  activeReelIndex: number;
  logoStage: 'hidden' | 'focus' | 'shutter' | 'snap' | 'locked' | 'expand';
  isColorRevealed: boolean;
  isFocusing: boolean;
  isFocusLocked: boolean;
  flashRef: React.RefObject<HTMLDivElement>;
  screenInnerRef?: React.RefObject<HTMLDivElement>;
  deviceOuterRef?: React.RefObject<HTMLDivElement>;
  className?: string;
}

/**
 * DeviceFrame:
 * Art-directed tactile cinema monitor mounted within a professional minimalist stabilizer clamp.
 * Features chamfered matte-black aluminium chassis, titanium accent pins, carbon grip texture,
 * and gimbal mounting nodes.
 */
export const DeviceFrame = forwardRef<HTMLDivElement, DeviceFrameProps>(({
  activeReelIndex,
  logoStage,
  isColorRevealed,
  isFocusing,
  isFocusLocked,
  flashRef,
  screenInnerRef,
  deviceOuterRef,
  className = ''
}, ref) => {
  return (
    <div
      ref={ref}
      className={`relative flex items-center justify-center will-change-transform preserve-3d ${className}`}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Outer Gimbal / Stabilizer Supporting Hardware Accents (Subtle Context) */}
      <div
        ref={deviceOuterRef}
        className="relative flex items-center justify-center p-3 md:p-5 rounded-[2.5rem] bg-gradient-to-b from-[#181B22] via-[#101217] to-[#0A0B0E] border border-white/10 shadow-device-glass"
        style={{
          boxShadow: '0 30px 80px -20px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Top Accessory Mount / Cold-Shoe Detent */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#1C2028] border-t border-x border-white/15 rounded-t-md flex items-center justify-center">
          <div className="w-8 h-1 bg-black/60 rounded-full" />
        </div>

        {/* Left Mechanical Clamp Axis Node */}
        <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-16 bg-[#161920] border-l border-y border-white/10 rounded-l-md flex flex-col justify-between py-1 items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="w-1 h-6 bg-[#0E1015] rounded-full" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* Right Tension Thumbscrew Knob */}
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-12 bg-gradient-to-r from-[#1E232E] to-[#141720] border-r border-y border-white/15 rounded-r-md flex items-center justify-center shadow-lg">
          <div className="w-1 h-8 bg-black/70 rounded-full flex flex-col justify-around py-0.5">
            <span className="w-full h-0.5 bg-white/10" />
            <span className="w-full h-0.5 bg-white/10" />
            <span className="w-full h-0.5 bg-white/10" />
          </div>
        </div>

        {/* Bottom Stabilizer Gimbal Arm Connector */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-6 flex flex-col items-center">
          <div className="w-12 h-3.5 bg-[#171A21] border-x border-b border-white/15 rounded-b-lg flex items-center justify-center">
            <div className="w-4 h-1 bg-brand-blue/60 rounded-full" />
          </div>
          <div className="w-4 h-3 bg-[#121419] border-x border-white/10" />
        </div>

        {/* Main Cinema Monitor Bezel */}
        <div className="relative w-[88vw] max-w-[340px] h-[200px] sm:w-[480px] sm:h-[300px] md:w-[680px] md:h-[420px] lg:w-[820px] lg:h-[500px] rounded-[1.75rem] p-1.5 md:p-2 bg-[#090A0D] border border-white/10 shadow-2xl flex items-center justify-center">
          {/* Subtle Chamfer Highlight Line */}
          <div className="absolute inset-1 rounded-[1.5rem] border border-white/5 pointer-events-none" />

          {/* The Screen Component */}
          <DeviceScreen
            activeReelIndex={activeReelIndex}
            logoStage={logoStage}
            isColorRevealed={isColorRevealed}
            isFocusing={isFocusing}
            isFocusLocked={isFocusLocked}
            flashRef={flashRef}
            screenInnerRef={screenInnerRef}
          />
        </div>
      </div>
    </div>
  );
});

DeviceFrame.displayName = 'DeviceFrame';
