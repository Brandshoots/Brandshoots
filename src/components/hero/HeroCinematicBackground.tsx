import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface HeroCinematicBackgroundProps {
  className?: string;
}

export const HeroCinematicBackground: React.FC<HeroCinematicBackgroundProps> = ({
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parallaxGroupRef = useRef<HTMLDivElement>(null);
  const lightSweepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // -------------------------------------------------------------------------
    // 1. THREE.JS SCENE SETUP
    // -------------------------------------------------------------------------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // -------------------------------------------------------------------------
    // 2. PROCEDURAL PROCEDURAL COSMIC GLOW TEXTURES
    // -------------------------------------------------------------------------
    // A. Cosmic Glowing Mote Texture (Electric Cyan / Royal Blue Halo)
    const createCosmicGlowTexture = () => {
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 128;
      texCanvas.height = 128;
      const ctx = texCanvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');       // Pure brilliant star core
        grad.addColorStop(0.12, 'rgba(180, 240, 255, 0.95)');   // Intense electric cyan
        grad.addColorStop(0.32, 'rgba(0, 160, 255, 0.65)');     // Brand electric blue
        grad.addColorStop(0.65, 'rgba(0, 70, 220, 0.22)');      // Deep cosmic sapphire
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
      }
      return new THREE.CanvasTexture(texCanvas);
    };

    // B. Large Soft Cinematic Bokeh Orb Texture
    const createBokehOrbTexture = () => {
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 128;
      texCanvas.height = 128;
      const ctx = texCanvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, 'rgba(140, 220, 255, 0.55)');
        grad.addColorStop(0.4, 'rgba(0, 140, 255, 0.28)');
        grad.addColorStop(0.75, 'rgba(0, 50, 180, 0.08)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
      }
      return new THREE.CanvasTexture(texCanvas);
    };

    const cosmicGlowTexture = createCosmicGlowTexture();
    const bokehOrbTexture = createBokehOrbTexture();

    // -------------------------------------------------------------------------
    // 3. LAYER 1: VIBRANT COSMIC GLOWING DUST MOTES (Refined balanced density)
    // -------------------------------------------------------------------------
    const countMotes = 140;
    const geomMotes = new THREE.BufferGeometry();
    const posMotes = new Float32Array(countMotes * 3);
    const speedMotes = new Float32Array(countMotes * 3);

    for (let i = 0; i < countMotes; i++) {
      posMotes[i * 3] = (Math.random() - 0.5) * 52;
      posMotes[i * 3 + 1] = (Math.random() - 0.5) * 32;
      posMotes[i * 3 + 2] = (Math.random() - 0.5) * 36 - 1;

      speedMotes[i * 3] = (Math.random() - 0.5) * 0.0022;
      speedMotes[i * 3 + 1] = Math.random() * 0.0035 + 0.0015;
      speedMotes[i * 3 + 2] = (Math.random() - 0.5) * 0.0018;
    }
    geomMotes.setAttribute('position', new THREE.BufferAttribute(posMotes, 3));

    const matMotes = new THREE.PointsMaterial({
      size: 0.42,
      map: cosmicGlowTexture,
      transparent: true,
      opacity: 0.58,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const systemMotes = new THREE.Points(geomMotes, matMotes);
    scene.add(systemMotes);

    // -------------------------------------------------------------------------
    // 4. LAYER 2: SHIMMERING COSMIC STAR-DUST CONSTELLATION (Subtle cosmic dusting)
    // -------------------------------------------------------------------------
    const countStars = 220;
    const geomStars = new THREE.BufferGeometry();
    const posStars = new Float32Array(countStars * 3);
    const speedStars = new Float32Array(countStars * 3);

    for (let i = 0; i < countStars; i++) {
      posStars[i * 3] = (Math.random() - 0.5) * 60;
      posStars[i * 3 + 1] = (Math.random() - 0.5) * 38;
      posStars[i * 3 + 2] = (Math.random() - 0.5) * 44 - 5;

      speedStars[i * 3] = (Math.random() - 0.5) * 0.0012;
      speedStars[i * 3 + 1] = Math.random() * 0.002 + 0.0008;
      speedStars[i * 3 + 2] = (Math.random() - 0.5) * 0.0012;
    }
    geomStars.setAttribute('position', new THREE.BufferAttribute(posStars, 3));

    const matStars = new THREE.PointsMaterial({
      size: 0.22,
      map: cosmicGlowTexture,
      transparent: true,
      opacity: 0.60,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const systemStars = new THREE.Points(geomStars, matStars);
    scene.add(systemStars);

    // -------------------------------------------------------------------------
    // 5. LAYER 3: FOREGROUND FLOATING CINEMATIC BOKEH ORBS (Gentle accents)
    // -------------------------------------------------------------------------
    const countBokeh = 22;
    const geomBokeh = new THREE.BufferGeometry();
    const posBokeh = new Float32Array(countBokeh * 3);
    const speedBokeh = new Float32Array(countBokeh * 3);

    for (let i = 0; i < countBokeh; i++) {
      posBokeh[i * 3] = (Math.random() - 0.5) * 44;
      posBokeh[i * 3 + 1] = (Math.random() - 0.5) * 28;
      posBokeh[i * 3 + 2] = Math.random() * 12 + 4; // close to camera for dreamy bokeh blur

      speedBokeh[i * 3] = (Math.random() - 0.5) * 0.0015;
      speedBokeh[i * 3 + 1] = Math.random() * 0.002 + 0.0008;
      speedBokeh[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    geomBokeh.setAttribute('position', new THREE.BufferAttribute(posBokeh, 3));

    const matBokeh = new THREE.PointsMaterial({
      size: 1.15,
      map: bokehOrbTexture,
      transparent: true,
      opacity: 0.30,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const systemBokeh = new THREE.Points(geomBokeh, matBokeh);
    scene.add(systemBokeh);

    // -------------------------------------------------------------------------
    // 6. MOUSE PARALLAX & ANIMATION LOOP
    // -------------------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let clock = new THREE.Clock();
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (e.clientX - halfW) / halfW;
      mouseY = (e.clientY - halfH) / halfH;
    };

    const handleResize = () => {
      if (!canvas) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    let isVisible = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasVisible = isVisible;
          isVisible = entry.isIntersecting;
          if (isVisible && !wasVisible) {
            clock.start();
            cancelAnimationFrame(animId);
            animId = requestAnimationFrame(animate);
          } else if (!isVisible && wasVisible) {
            cancelAnimationFrame(animId);
          }
        });
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else if (isVisible) {
        clock.start();
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      if (!isVisible) return;
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      targetX += (mouseX * 0.45 - targetX) * 0.045;
      targetY += (-mouseY * 0.3 - targetY) * 0.045;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      // DOM Parallax
      if (parallaxGroupRef.current) {
        const domPxX = targetX * 22;
        const domPxY = -targetY * 22;
        parallaxGroupRef.current.style.transform = `translate3d(${domPxX}px, ${domPxY}px, 0)`;
      }

      // 1. Drift Motes
      const arrMotes = (geomMotes.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < countMotes; i++) {
        arrMotes[i * 3 + 1] += Math.sin(elapsedTime * 0.45 + i * 0.25) * 0.0028 + speedMotes[i * 3 + 1];
        arrMotes[i * 3] += Math.cos(elapsedTime * 0.35 + i * 0.4) * 0.0022 + speedMotes[i * 3];

        if (arrMotes[i * 3 + 1] > 13) arrMotes[i * 3 + 1] = -13;
        if (arrMotes[i * 3] > 20) arrMotes[i * 3] = -20;
        if (arrMotes[i * 3] < -20) arrMotes[i * 3] = 20;
      }
      geomMotes.attributes.position.needsUpdate = true;

      // 2. Drift Stars
      const arrStars = (geomStars.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < countStars; i++) {
        arrStars[i * 3 + 1] += Math.sin(elapsedTime * 0.3 + i * 0.15) * 0.0016 + speedStars[i * 3 + 1];
        arrStars[i * 3] += Math.cos(elapsedTime * 0.25 + i * 0.2) * 0.0014 + speedStars[i * 3];

        if (arrStars[i * 3 + 1] > 15) arrStars[i * 3 + 1] = -15;
      }
      geomStars.attributes.position.needsUpdate = true;

      // 3. Drift Bokeh Orbs
      const arrBokeh = (geomBokeh.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < countBokeh; i++) {
        arrBokeh[i * 3 + 1] += Math.sin(elapsedTime * 0.2 + i * 0.5) * 0.003 + speedBokeh[i * 3 + 1];
        arrBokeh[i * 3] += Math.cos(elapsedTime * 0.2 + i * 0.3) * 0.0025 + speedBokeh[i * 3];

        if (arrBokeh[i * 3 + 1] > 12) arrBokeh[i * 3 + 1] = -12;
      }
      geomBokeh.attributes.position.needsUpdate = true;

      // Subtle twinkling oscillation on motes opacity
      matMotes.opacity = 0.50 + Math.sin(elapsedTime * 1.5) * 0.08;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // -------------------------------------------------------------------------
    // 7. GSAP AMBIENT COSMIC LIGHT SWEEP ACROSS REEL WALL
    // -------------------------------------------------------------------------
    let sweepCtx: gsap.Context | undefined;
    if (lightSweepRef.current) {
      sweepCtx = gsap.context(() => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 6.5, delay: 1.5 });
        tl.set(lightSweepRef.current, { x: '-60vw', opacity: 0 })
          .to(lightSweepRef.current, { opacity: 0.18, duration: 1.0, ease: 'sine.in' })
          .to(
            lightSweepRef.current,
            { x: '120vw', duration: 3.8, ease: 'power1.inOut' },
            '-=0.4'
          )
          .to(lightSweepRef.current, { opacity: 0, duration: 0.8, ease: 'sine.out' }, '-=0.8');
      }, containerRef);
    }

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      sweepCtx?.revert();
      cosmicGlowTexture.dispose();
      bokehOrbTexture.dispose();
      geomMotes.dispose();
      matMotes.dispose();
      geomStars.dispose();
      matStars.dispose();
      geomBokeh.dispose();
      matBokeh.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
    >
      {/* 1. THREE.JS 3D COSMIC GLOWING DUST MOTE PARTICLES CANVAS */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* 2. PARALLAX-RESPONSIVE VOLUMETRIC COSMIC NEBULA LAYERS */}
      <div ref={parallaxGroupRef} className="absolute inset-0 will-change-transform">
        {/* Core Volumetric Cosmic Electric-Blue & Cyan Nebula Aura (Grand, Expansive Atmosphere) */}
        <div
          className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[125vw] max-w-[1700px] h-[80vh] max-h-[850px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0, 195, 255, 0.28) 0%, rgba(0, 120, 255, 0.18) 35%, rgba(10, 30, 140, 0.06) 65%, transparent 85%)',
            filter: 'blur(75px)',
          }}
        />

        {/* Secondary Radiant Cosmic Cyan Starburst Aura (Behind Center of BRANDSHOOTS Logo and Navbar) */}
        <div
          className="absolute top-[18vh] sm:top-[20vh] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1300px] h-[42vh] max-h-[400px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 75% 55% at 50% 45%, rgba(120, 225, 255, 0.24) 0%, rgba(0, 150, 255, 0.12) 42%, transparent 75%)',
            filter: 'blur(55px)',
          }}
        />

        {/* Grand Curved Celestial Arc Behind Title and Extending Up Behind Navbar */}
        <svg
          className="absolute top-[1vh] sm:top-[1.5vh] left-1/2 -translate-x-1/2 w-[98vw] max-w-[1550px] h-[28vh] max-h-[280px] pointer-events-none overflow-visible opacity-90"
          viewBox="0 0 1100 200"
          fill="none"
        >
          <path
            d="M 20 185 C 320 40, 780 40, 1080 185"
            stroke="url(#cinematicTitleArc)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="cinematicTitleArc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#008CFF" stopOpacity="0" />
              <stop offset="20%" stopColor="#008CFF" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#A0E5FF" stopOpacity="1" />
              <stop offset="80%" stopColor="#008CFF" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#008CFF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Luminous Cosmic Floor Reflection Beneath Reel Wall */}
        <div
          className="absolute bottom-[2vh] sm:bottom-[3vh] left-1/2 -translate-x-1/2 w-[98vw] max-w-[1600px] h-[250px] sm:h-[320px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0, 175, 255, 0.18) 0%, rgba(0, 95, 230, 0.07) 45%, transparent 80%)',
            filter: 'blur(45px)',
            transform: 'rotateX(68deg)',
            transformOrigin: 'bottom center',
          }}
        />
      </div>

      {/* 3. CINEMATIC AMBIENT LIGHT SWEEP ACROSS REEL WALL */}
      <div
        ref={lightSweepRef}
        className="absolute top-[30%] bottom-[25%] w-[42vw] max-w-[550px] pointer-events-none z-10 opacity-0"
        style={{
          background:
            'linear-gradient(105deg, transparent 0%, rgba(0, 160, 255, 0.05) 25%, rgba(160, 230, 255, 0.15) 50%, rgba(0, 160, 255, 0.05) 75%, transparent 100%)',
          transform: 'skewX(-22deg)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
};

export default HeroCinematicBackground;
