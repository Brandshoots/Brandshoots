import { useState } from 'react';
import { BrandShootsPreloader } from './components/preloader/BrandShootsPreloader';
import { BrandShootsHero } from './components/hero/BrandShootsHero';

export function App() {
  const [preloaderActive, setPreloaderActive] = useState(true);
  const [sessionKey, setSessionKey] = useState(1);

  const handleReplay = () => {
    setPreloaderActive(true);
    setSessionKey((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#08090C] overflow-hidden">
      {/* The Hero Stage is ALWAYS mounted underneath for seamless handoff (Section 26) */}
      <BrandShootsHero onReplayPreloader={handleReplay} />

      {/* The Master Cinematic Preloader Overlay */}
      {preloaderActive && (
        <BrandShootsPreloader
          key={sessionKey}
          onComplete={() => setPreloaderActive(false)}
        />
      )}
    </div>
  );
}

export default App;
