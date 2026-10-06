import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CLIENT_PROJECTS, ClientProject } from '../../data/clientsData';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * PHASE 3 PORTFOLIO — THREE.JS 3D CINEMATIC CORRIDOR ENGINE
 *
 * Calibrated Optics & Spatial Geometry:
 * - Wide corridor: Panels mounted along left wall (X = -3.4) and right wall (X = +3.4).
 * - Spacing: 14.0 units along Z per project for deep perspective and zero visual collision.
 * - Dynamic camera travel: Camera advances down the tunnel (Z), subtly shifting X to frame the active reel.
 * - Near-pure black (#020305) with linear distance fog.
 * - Minimal editorial typography: Client Name, Category, One Short Sentence, View Project →.
 * - Zero AI badges, zero fake metrics, zero orbit rings, zero UI clutter.
 */

const Z_SPACING = 14.0;
const PANEL_WIDTH = 1.95;
const PANEL_HEIGHT = 3.46; // exact 9:16 vertical reel

export const PortfolioWormhole3D: React.FC = () => {
  const totalProjects = CLIENT_PROJECTS.length; // 10 projects
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fractional scroll progress across all chapters: 0.0 to 9.0
  const [scrollUnit, setScrollUnit] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const panelsRef = useRef<{
    group: THREE.Group;
    screenMesh: THREE.Mesh;
    baseX: number;
    baseZ: number;
    baseRotY: number;
    video: HTMLVideoElement;
    videoTexture: THREE.VideoTexture | null;
    posterTexture: THREE.Texture;
    isPlaying: boolean;
  }[]>([]);

  // Track responsive screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize Three.js Scene, Camera, Lights, and 3D Panels
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Scene with Pure Black Background and Distance Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020305);
    scene.fog = new THREE.FogExp2(0x020305, 0.022);
    sceneRef.current = scene;

    // 2. Perspective Camera looking down the -Z axis
    const width = window.innerWidth;
    const height = window.innerHeight;
    const mobile = width < 1024;
    const camera = new THREE.PerspectiveCamera(mobile ? 56 : 46, width / height, 0.1, 95);
    camera.position.set(mobile ? 0 : -1.4, 0.2, 6.8);
    cameraRef.current = camera;

    // 3. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x0e1626, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.4);
    dirLight.position.set(5, 12, 10);
    scene.add(dirLight);

    // Dynamic blue fill light attached to camera for specular edge glint
    const camPointLight = new THREE.PointLight(0x008cff, 2.5, 22);
    camPointLight.position.set(0, 0, 2);
    camera.add(camPointLight);
    scene.add(camera);

    // 5. Build the 10 3D Reel Panels along the corridor
    const textureLoader = new THREE.TextureLoader();
    const panels: typeof panelsRef.current = [];

    // Shared geometries
    const screenGeo = new THREE.PlaneGeometry(PANEL_WIDTH, PANEL_HEIGHT);
    const boxGeo = new THREE.BoxGeometry(PANEL_WIDTH + 0.04, PANEL_HEIGHT + 0.04, 0.04);
    const edgesGeo = new THREE.EdgesGeometry(boxGeo);

    // Shared chassis materials
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x060910,
      roughness: 0.25,
      metalness: 0.85,
    });
    const rimLineMat = new THREE.LineBasicMaterial({
      color: 0x008cff,
      transparent: true,
      opacity: 0.45,
    });

    CLIENT_PROJECTS.forEach((project, i) => {
      const panelGroup = new THREE.Group();

      // Alternating LEFT / RIGHT spatial placement
      // Even i (0, 2, 4, 6, 8): LEFT wall
      // Odd i (1, 3, 5, 7, 9): RIGHT wall
      const isLeft = i % 2 === 0;
      const baseX = isLeft ? (mobile ? -1.6 : -3.2) : (mobile ? 1.6 : 3.2);
      const baseZ = -i * Z_SPACING;
      // Inward rotation: left panels angle rightward (+Y), right panels angle leftward (-Y)
      const baseRotY = isLeft ? 0.32 : -0.32; // ~18° inward angle

      panelGroup.position.set(baseX, 0.2, baseZ);
      panelGroup.rotation.y = baseRotY;

      // Dark titanium backplate chassis
      const chassisMesh = new THREE.Mesh(boxGeo, chassisMat);
      panelGroup.add(chassisMesh);

      // Razor-thin electric blue edge line
      const rimLine = new THREE.LineSegments(edgesGeo, rimLineMat);
      panelGroup.add(rimLine);

      // Video element setup
      const video = document.createElement('video');
      video.src = project.videoUrl;
      video.poster = project.posterUrl;
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';

      // High-res fallback poster texture
      const posterTexture = textureLoader.load(project.posterUrl);
      posterTexture.colorSpace = THREE.SRGBColorSpace;

      // Screen plane mesh
      const screenMat = new THREE.MeshBasicMaterial({
        map: posterTexture,
        side: THREE.FrontSide,
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.z = 0.025; // sit flush on front of chassis
      panelGroup.add(screenMesh);

      scene.add(panelGroup);

      panels.push({
        group: panelGroup,
        screenMesh,
        baseX,
        baseZ,
        baseRotY,
        video,
        videoTexture: null,
        posterTexture,
        isPlaying: false,
      });
    });

    panelsRef.current = panels;

    // Handle Resize
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMob = w < 1024;
      if (cameraRef.current) {
        cameraRef.current.fov = isMob ? 56 : 46;
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
      }
      if (rendererRef.current) {
        rendererRef.current.setSize(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    // Continuous Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      panels.forEach((p) => {
        p.video.pause();
        p.video.src = '';
        p.videoTexture?.dispose();
        p.posterTexture.dispose();
      });
      renderer.dispose();
    };
  }, []);

  // Update Three.js Camera & Panels based on Scroll Unit
  const updateThreeScene = useCallback((u: number) => {
    const camera = cameraRef.current;
    const panels = panelsRef.current;
    if (!camera || panels.length === 0) return;

    const mobile = window.innerWidth < 1024;

    // 1. Camera Z travels smoothly down the tunnel
    const targetCamZ = 6.8 - u * Z_SPACING;

    // 2. Camera X shifts smoothly to frame the active reel
    const currentChapter = Math.min(panels.length - 1, Math.max(0, Math.floor(u)));
    const nextChapter = Math.min(panels.length - 1, currentChapter + 1);
    const frac = u - currentChapter;
    const easeFrac = frac * frac * (3 - 2 * frac);

    const isCurrentLeft = currentChapter % 2 === 0;
    const isNextLeft = nextChapter % 2 === 0;

    const camXCurrent = isCurrentLeft ? (mobile ? -0.4 : -1.2) : (mobile ? 0.4 : 1.2);
    const camXNext = isNextLeft ? (mobile ? -0.4 : -1.2) : (mobile ? 0.4 : 1.2);
    const targetCamX = camXCurrent + (camXNext - camXCurrent) * easeFrac;

    camera.position.z = targetCamZ;
    camera.position.x = targetCamX;
    camera.position.y = 0.2;

    // Camera looks slightly ahead down the dark corridor towards -Z
    camera.lookAt(targetCamX * 0.4, 0.2, targetCamZ - 12.0);

    // 3. Dynamic Panel Behaviour
    panels.forEach((p, idx) => {
      const delta = u - idx; // 0 = active hero, < 0 = ahead in depth, > 0 = passed behind
      const dist = Math.abs(delta);

      // Hero rotation: when approaching (dist near 0), panel turns slightly toward viewer
      if (dist < 1.0) {
        const alignFactor = 1.0 - dist;
        p.group.rotation.y = p.baseRotY * (1.0 - alignFactor * 0.65);
        p.group.scale.setScalar(1.0 + alignFactor * 0.06);
      } else {
        p.group.rotation.y = p.baseRotY;
        p.group.scale.setScalar(1.0);
      }

      // Video playback: play only active and immediately adjacent
      if (dist < 1.15) {
        if (!p.isPlaying) {
          p.isPlaying = true;
          p.video.play().catch(() => {});
          if (!p.videoTexture) {
            p.videoTexture = new THREE.VideoTexture(p.video);
            p.videoTexture.colorSpace = THREE.SRGBColorSpace;
          }
          (p.screenMesh.material as THREE.MeshBasicMaterial).map = p.videoTexture;
          (p.screenMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
        }
      } else {
        if (p.isPlaying) {
          p.isPlaying = false;
          p.video.pause();
          (p.screenMesh.material as THREE.MeshBasicMaterial).map = p.posterTexture;
          (p.screenMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
        }
      }
    });
  }, []);

  // GSAP ScrollTrigger with Precision Snap
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const snapPoints = 1 / (totalProjects - 1);

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.35,
      snap: {
        snapTo: snapPoints,
        duration: { min: 0.25, max: 0.55 },
        delay: 0.02,
        ease: 'power2.out',
      },
      onUpdate: (self) => {
        const u = self.progress * (totalProjects - 1);
        setScrollUnit(u);
        const currentActive = Math.round(u);
        setActiveIndex(currentActive);
        updateThreeScene(u);
      },
    });

    // Initial render
    updateThreeScene(0);

    return () => {
      st.kill();
    };
  }, [totalProjects, updateThreeScene]);

  // Jump to project chapter
  const scrollToProject = useCallback(
    (index: number) => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const totalScrollable = container.offsetHeight - window.innerHeight;
      const targetTop = container.offsetTop + (index / (totalProjects - 1)) * totalScrollable;
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    },
    [totalProjects]
  );

  // Active project data
  const currentProject: ClientProject = CLIENT_PROJECTS[activeIndex] || CLIENT_PROJECTS[0];
  const isLeft = activeIndex % 2 === 0;

  // Text reveal opacity based on snap precision (fades out while travelling between projects)
  const snapDistance = Math.abs(scrollUnit - activeIndex);
  const textOpacity = Math.max(0, 1 - snapDistance * 2.8);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#020305] text-white select-none"
      style={{
        // 100vh per project for generous scroll travel and exact snap settle
        height: `${totalProjects * 100}vh`,
      }}
    >
      {/* ================================================================== */}
      {/* FIXED 100vw × 100vh CINEMATIC VIEWPORT PINNED FOR SCROLL PROGRESS */}
      {/* ================================================================== */}
      <div className="fixed inset-0 w-full h-full overflow-hidden flex flex-col justify-between pointer-events-none">
        {/* ========================================================= */}
        {/* 1. THREE.JS 3D WEBGL CANVAS (REAL 3D CORRIDOR ENGINE)     */}
        {/* ========================================================= */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block z-0"
        />

        {/* ========================================================= */}
        {/* 2. MINIMAL TOP STATUS // PROJECT COUNTER (SUBTLE & CLEAN) */}
        {/* ========================================================= */}
        <div className="relative z-20 w-full px-6 sm:px-10 md:px-16 pt-24 md:pt-28 flex items-center justify-between pointer-events-none">
          {/* Subtle Category Kicker */}
          <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs tracking-[0.24em] uppercase text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
            <span className="text-white/60">BRANDSHOOTS ARCHIVE</span>
            <span className="hidden sm:inline text-white/20">//</span>
            <span className="hidden sm:inline text-white/40">3D CORRIDOR</span>
          </div>

          {/* Minimal Project Counter */}
          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm tracking-[0.2em] text-white/50">
            <span className="text-[#008CFF] font-semibold">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-white/20">/</span>
            <span>{String(totalProjects).padStart(2, '0')}</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. INTEGRATED MINIMAL PROJECT EDITORIAL INFORMATION       */}
        {/*    (Shown only for active reel without dashboard clutter) */}
        {/* ========================================================= */}
        <div className="relative z-10 w-full flex-1 flex items-center justify-center px-6 sm:px-12 md:px-20 pointer-events-none">
          <div
            className={`w-full max-w-7xl flex flex-col pointer-events-auto transition-all duration-200 ${
              isMobile
                ? 'items-center text-center mt-auto mb-16'
                : isLeft
                ? 'items-end text-left pr-6 md:pr-16'
                : 'items-start text-left pl-6 md:pl-16'
            }`}
            style={{
              opacity: textOpacity,
              transform: `translateY(${(1 - textOpacity) * 16}px)`,
            }}
          >
            <div className="max-w-md md:max-w-lg flex flex-col">
              {/* Category / Type Kicker */}
              <div className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.26em] text-[#008CFF] font-semibold mb-1 sm:mb-2">
                // {String(activeIndex + 1).padStart(2, '0')} • {currentProject.category}
              </div>

              {/* Big Client Display Title */}
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white uppercase drop-shadow-md leading-[1.05]">
                {currentProject.name}
              </h2>

              {/* One Short Sentence (Studio Copy) */}
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-white/70 leading-relaxed font-sans">
                {currentProject.headline}
              </p>

              {/* Discrete View Project Action Link */}
              <div className="mt-4 sm:mt-5">
                <Link
                  to={`/portfolio/${currentProject.slug}`}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-[0.22em] text-[#008CFF] hover:text-white transition-colors duration-200 group"
                >
                  <span className="border-b border-[#008CFF]/50 group-hover:border-white pb-0.5">
                    VIEW PROJECT
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. SUBTLE BOTTOM STATUS & NAVIGATION                      */}
        {/* ========================================================= */}
        <div className="relative z-20 w-full px-6 sm:px-10 md:px-16 pb-6 sm:pb-8 flex items-center justify-between text-[11px] font-mono text-white/35 uppercase tracking-[0.22em] pointer-events-auto">
          {/* Scroll Prompt */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
            <span>SCROLL TO TRAVEL CORRIDOR</span>
          </div>

          {/* Quick Stepper Index */}
          <div className="flex items-center gap-2">
            {CLIENT_PROJECTS.map((_, pIdx) => {
              const isActive = activeIndex === pIdx;
              return (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => scrollToProject(pIdx)}
                  aria-label={`Jump to project ${pIdx + 1}`}
                  className="py-1 px-0.5 focus:outline-none cursor-pointer"
                >
                  <span
                    className={`block transition-all duration-300 rounded-full ${
                      isActive
                        ? 'w-5 sm:w-7 h-1 bg-[#008CFF] shadow-[0_0_6px_#008CFF]'
                        : 'w-1 h-1 bg-white/20 hover:bg-white/50'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
