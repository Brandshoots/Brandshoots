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
      100
    );
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // -------------------------------------------------------------------------
    // 2. DUST PARTICLES TEXTURE (CIRCULAR SOFT GAUSSIAN MOTE)
    // -------------------------------------------------------------------------
    const createDustTexture = () => {
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 64;
      texCanvas.height = 64;
      const ctx = texCanvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        grad.addColorStop(0.25, 'rgba(120, 195, 255, 0.45)');
        grad.addColorStop(0.6, 'rgba(0, 140, 255, 0.12)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(texCanvas);
    };

    const dustTexture = createDustTexture();

    // -------------------------------------------------------------------------
    // 3. 3D FLOATING DUST PARTICLES (DEPTH LAYERS)
    // -------------------------------------------------------------------------
    const particleCount = 130;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const driftSpeeds = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Spatial distribution across frustum width/height/depth
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 2; // depth layers from z: -17 to +13

      // Organic subtle drift speeds
      driftSpeeds[i * 3] = (Math.random() - 0.5) * 0.0015;
      driftSpeeds[i * 3 + 1] = Math.random() * 0.0025 + 0.001;
      driftSpeeds[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.18,
      map: dustTexture,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // -------------------------------------------------------------------------
    // 4. MOUSE PARALLAX & ANIMATION LOOP (GENTLE 5-10PX DAMPING)
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

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Gentle camera mouse lerp (5–10px equivalent movement in world space)
      targetX += (mouseX * 0.38 - targetX) * 0.045;
      targetY += (-mouseY * 0.24 - targetY) * 0.045;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      // DOM Parallax elements lerp (strict 5–10px bounds)
      if (parallaxGroupRef.current) {
        const domPxX = targetX * 18;
        const domPxY = -targetY * 18;
        parallaxGroupRef.current.style.transform = `translate3d(${domPxX}px, ${domPxY}px, 0)`;
      }

      // Organic dust motes drift
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] +=
          Math.sin(elapsedTime * 0.4 + i * 0.3) * 0.002 + driftSpeeds[i * 3 + 1];
        posArray[i * 3] +=
          Math.cos(elapsedTime * 0.3 + i * 0.5) * 0.0018 + driftSpeeds[i * 3];

        // Wrap around smoothly when ascending out of frustum
        if (posArray[i * 3 + 1] > 11) {
          posArray[i * 3 + 1] = -11;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // -------------------------------------------------------------------------
    // 5. GSAP LIGHT SWEEP ACROSS REEL WALL (SUBTLE STUDIO LIGHT SHEEN)
    // -------------------------------------------------------------------------
    let sweepCtx: gsap.Context | undefined;
    if (lightSweepRef.current) {
      sweepCtx = gsap.context(() => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 8.5, delay: 2.0 });
        tl.set(lightSweepRef.current, { x: '-60vw', opacity: 0 })
          .to(lightSweepRef.current, { opacity: 0.12, duration: 0.8, ease: 'sine.in' })
          .to(
            lightSweepRef.current,
            { x: '120vw', duration: 3.4, ease: 'power1.inOut' },
            '-=0.4'
          )
          .to(lightSweepRef.current, { opacity: 0, duration: 0.7, ease: 'sine.out' }, '-=0.7');
      }, containerRef);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      sweepCtx?.revert();
      dustTexture.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
    >
      {/* 1. THREE.JS FLOATING 3D DUST MOTE PARTICLES CANVAS */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* 2. PARALLAX-RESPONSIVE ATMOSPHERIC LAYERS */}
      <div ref={parallaxGroupRef} className="absolute inset-0 will-change-transform">
        {/* Soft Electric-Blue Atmospheric Glow Behind Center of Reel Wall */}
        <div
          className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] max-w-[850px] h-[45vh] max-h-[460px] pointer-events-none opacity-85"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0, 140, 255, 0.15) 0%, rgba(0, 100, 230, 0.06) 40%, rgba(0, 50, 160, 0.015) 65%, transparent 80%)',
            filter: 'blur(54px)',
          }}
        />

        {/* Very Thin, Elegant Blue Curved Arc Behind Title */}
        <svg
          className="absolute top-[2.5vh] sm:top-[3vh] left-1/2 -translate-x-1/2 w-[86vw] max-w-[1100px] h-[20vh] max-h-[180px] pointer-events-none overflow-visible opacity-55"
          viewBox="0 0 1100 200"
          fill="none"
        >
          <path
            d="M 60 170 C 350 70, 750 70, 1040 170"
            stroke="url(#cinematicTitleArc)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="cinematicTitleArc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#008CFF" stopOpacity="0" />
              <stop offset="25%" stopColor="#008CFF" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#80C8FF" stopOpacity="0.85" />
              <stop offset="75%" stopColor="#008CFF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#008CFF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Very Faint Blue Floor Plane / Reflection Beneath Reel Wall */}
        <div
          className="absolute bottom-[4vh] sm:bottom-[5vh] left-1/2 -translate-x-1/2 w-[85vw] max-w-[1250px] h-[160px] sm:h-[190px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(0, 140, 255, 0.08) 0%, rgba(0, 80, 200, 0.025) 45%, transparent 75%)',
            filter: 'blur(30px)',
            transform: 'rotateX(66deg)',
            transformOrigin: 'bottom center',
          }}
        />

        {/* Subtle Floor Ground Horizon Accent */}
        <div
          className="absolute bottom-[13vh] sm:bottom-[14vh] left-1/2 -translate-x-1/2 w-[60vw] max-w-[850px] h-[1px] pointer-events-none opacity-40"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(0, 140, 255, 0.35) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* 3. EXTREMELY SUBTLE GSAP BLUE LIGHT SWEEP ACROSS REEL WALL */}
      <div
        ref={lightSweepRef}
        className="absolute top-[35%] bottom-[30%] w-[38vw] max-w-[500px] pointer-events-none z-10 opacity-0"
        style={{
          background:
            'linear-gradient(105deg, transparent 0%, rgba(0, 140, 255, 0.03) 25%, rgba(140, 215, 255, 0.09) 50%, rgba(0, 140, 255, 0.03) 75%, transparent 100%)',
          transform: 'skewX(-22deg)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
};

export default HeroCinematicBackground;
