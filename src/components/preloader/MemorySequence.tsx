import { PRELOADER_REELS } from '../../config/preloaderReels';
import { MemoryReel } from './MemoryReel';

interface MemorySequenceProps {
  activeIndex: number;
  className?: string;
}

/**
 * MemorySequence:
 * Manages the memory sequence reel pool.
 * Enforces the CURRENT REEL + NEXT REEL performance rule:
 * only mounts and decodes the active clip and the immediately subsequent clip.
 */
export const MemorySequence: React.FC<MemorySequenceProps> = ({
  activeIndex,
  className = ''
}) => {
  const reels = PRELOADER_REELS;

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      {reels.map((reel, index) => {
        const isActive = index === activeIndex;
        // Mount only if active or immediately next
        const isPreloading = index === activeIndex + 1;
        const shouldMount = isActive || isPreloading;

        if (!shouldMount) return null;

        return (
          <MemoryReel
            key={reel.id}
            reel={reel}
            isActive={isActive}
            isPreloading={isPreloading}
          />
        );
      })}
    </div>
  );
};
