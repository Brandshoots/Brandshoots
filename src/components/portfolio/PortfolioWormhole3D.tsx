import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { CLIENT_PROJECTS, ClientProject } from '../../data/clientsData';

gsap.registerPlugin(ScrollTrigger);

// 3D Spatial Layout Matrix along the forward Wormhole Corridor (10 Projects)
// Alternating: CENTER -> RIGHT -> LEFT -> DEEP RIGHT -> DEEP LEFT -> CENTER -> LEFT -> RIGHT -> DEEP LEFT -> CENTER
interface SpatialSlot {
  x: number;
  y: number;
  z: number;
  rotY: number;
  rotX: number;
}

const DESKTOP_SLOTS: SpatialSlot[] = [
  { x: 0, y: 0, z: 0, rotY: 0, rotX: 0 }, // 0. Santhi Pipes (Center)
  { x: 3.3, y: 0.2, z: -9.0, rotY: -0.32, rotX: 0.04 }, // 1. Viswatuff Glass (Right)
  { x: -3.3, y: -0.2, z: -18.0, rotY: 0.32, rotX: -0.04 }, // 2. Bags World (Left)
  { x: 3.6, y: 0.25, z: -27.0, rotY: -0.36, rotX: 0.05 }, // 3. Aabharan Jewellers (Deep Right)
  { x: -3.6, y: -0.25, z: -36.0, rotY: 0.36, rotX: -0.05 }, // 4. Fresh & Fresh (Deep Left)
  { x: 0, y: 0, z: -45.0, rotY: 0, rotX: 0 }, // 5. Dayanidhi Creations (Center)
  { x: -3.3, y: 0.2, z: -54.0, rotY: 0.32, rotX: 0.04 }, // 6. Jain Beauty Studio (Left)
  { x: 3.3, y: -0.2, z: -63.0, rotY: -0.32, rotX: -0.04 }, // 7. RK Home Living (Right)
  { x: -3.5, y: 0.2, z: -72.0, rotY: 0.35, rotX: 0.04 }, // 8. SB Ventures (Deep Left)
  { x: 0, y: 0, z: -81.0, rotY: 0, rotX: 0 }, // 9. KC Overseas (Center)
];

const MOBILE_SLOTS: SpatialSlot[] = [
  { x: 0, y: 0, z: 0, rotY: 0, rotX: 0 },
  { x: 1.7, y: 0.15, z: -8.5, rotY: -0.25, rotX: 0.02 },
  { x: -1.7, y: -0.15, z: -17.0, rotY: 0.25, rotX: -0.02 },
  { x: 1.8, y: 0.18, z: -25.5, rotY: -0.28, rotX: 0.03 },
  { x: -1.8, y: -0.18, z: -34.0, rotY: 0.28, rotX: -0.03 },
  { x: 0, y: 0, z: -42.5, rotY: 0, rotX: 0 },
  { x: -1.7, y: 0.15, z: -51.0, rotY: 0.25, rotX: 0.02 },
  { x: 1.7, y: -0.15, z: -59.5, rotY: -0.25, rotX: -0.02 },
  { x: -1.8, y: 0.15, z: -68.0, rotY: 0.28, rotX: 0.02 },
  { x: 0, y: 0, z: -76.5, rotY: 0, rotX: 0 },
];

export const PortfolioWormhole3D: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Active Project State
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);

  const activeProject = CLIENT_PROJECTS[activeIndex] || CLIENT_PROJECTS[0];

  useEffect(() => {
    const pinContainer = pinContainerRef.current;
    const canvas = canvasRef.current;
    if (!pinContainer || !canvas) return;

    const isMobile = window.innerWidth < 768;
    const width = pinContainer.clientWidth || window.innerWidth;
    const height = pinContainer.clientHeight || window.innerHeight;

    const slots = isMobile ? MOBILE_SLOTS : DESKTOP_SLOTS;
    const totalProjects = CLIENT_PROJECTS.length; // 10

    // 1. WebGL Three.js Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 2. Scene & Fog (Creates the Infinite Deep Corridor/Wormhole Mist)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070b, isMobile ? 0.038 : 0.028);

    // 3. Perspective Camera
    const camera = new THREE.PerspectiveCamera(isMobile ? 54 : 44, width / height, 0.1, 120);
    const startCamZ = isMobile ? 6.2 : 5.8;
    camera.position.set(0, 0, startCamZ);

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0x060912, 2.2);
    scene.add(ambientLight);

    // Moving Key Blue Light attached to camera focus
    const cameraLight = new THREE.PointLight(0x008cff, 4.2, 35);
    cameraLight.position.set(0, 1.5, startCamZ - 1.5);
    scene.add(cameraLight);

    const warmFillLight = new THREE.DirectionalLight(0xffffff, 1.6);
    warmFillLight.position.set(4, 6, 8);
    scene.add(warmFillLight);

    // 5. Subtle Spatial Runway / Corridor Grid Floor
    const gridGeo = new THREE.PlaneGeometry(16, 120, 16, 60);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x07152d,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.rotation.x = -Math.PI / 2;
    gridMesh.position.set(0, isMobile ? -2.4 : -2.8, -45);
    scene.add(gridMesh);

    // 6. Build Physical 3D 9:16 Video Reel Screens
    const screensGroup = new THREE.Group();
    scene.add(screensGroup);

    const textureLoader = new THREE.TextureLoader();
    const frameW = isMobile ? 1.45 : 2.05;
    const frameH = (frameW * 16) / 9; // 9:16 aspect ratio
    const chassisDepth = 0.055;

    const casingGeo = new THREE.BoxGeometry(frameW + 0.08, frameH + 0.08, chassisDepth);
    const screenGeo = new THREE.PlaneGeometry(frameW, frameH);
    const rimEdgeGeo = new THREE.EdgesGeometry(screenGeo);

    const casingMat = new THREE.MeshStandardMaterial({
      color: 0x080b12,
      roughness: 0.35,
      metalness: 0.88,
    });

    const rimLineMat = new THREE.LineBasicMaterial({
      color: 0x008cff,
      transparent: true,
      opacity: 0.5,
    });

    interface ReelMeshItem {
      group: THREE.Group;
      screenMesh: THREE.Mesh;
      video: HTMLVideoElement;
      videoTex: THREE.VideoTexture;
      posterTex: THREE.Texture;
      mat: THREE.MeshStandardMaterial;
      slot: SpatialSlot;
      index: number;
    }

    const reelItems: ReelMeshItem[] = [];

    CLIENT_PROJECTS.forEach((project, i) => {
      const slot = slots[i] || slots[0];
      const frameGroup = new THREE.Group();

      // Chassis body
      const casingMesh = new THREE.Mesh(casingGeo, casingMat);
      frameGroup.add(casingMesh);

      // HTML5 Video
      const video = document.createElement('video');
      video.src = project.videoUrl;
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.preload = i < 2 ? 'auto' : 'metadata';

      const videoTex = new THREE.VideoTexture(video);
      videoTex.colorSpace = THREE.SRGBColorSpace;
      videoTex.minFilter = THREE.LinearFilter;
      videoTex.magFilter = THREE.LinearFilter;

      // Poster Texture
      const posterTex = textureLoader.load(project.posterUrl);
      posterTex.colorSpace = THREE.SRGBColorSpace;

      // Screen Material
      const filmMat = new THREE.MeshStandardMaterial({
        map: posterTex,
        roughness: 0.28,
        metalness: 0.12,
        side: THREE.FrontSide,
      });

      video.addEventListener('playing', () => {
        filmMat.map = videoTex;
        filmMat.needsUpdate = true;
      });

      const screenMesh = new THREE.Mesh(screenGeo, filmMat);
      screenMesh.position.z = chassisDepth / 2 + 0.002;
      frameGroup.add(screenMesh);

      // Neon rim accent
      const rimLine = new THREE.LineSegments(rimEdgeGeo, rimLineMat);
      rimLine.position.z = chassisDepth / 2 + 0.003;
      frameGroup.add(rimLine);

      // Initial placement in 3D Corridor
      frameGroup.position.set(slot.x, slot.y, slot.z);
      frameGroup.rotation.set(slot.rotX, slot.rotY, 0);

      screensGroup.add(frameGroup);

      reelItems.push({
        group: frameGroup,
        screenMesh,
        video,
        videoTex,
        posterTex,
        mat: filmMat,
        slot,
        index: i,
      });
    });

    // Start video for initial reel
    if (reelItems[0]?.video) {
      reelItems[0].video.play().catch(() => {});
    }

    // Scroll/touch kick to guarantee video autoplay policies
    const kickVideos = () => {
      reelItems.forEach((item, idx) => {
        if (Math.abs(idx - activeIndex) <= 1 && item.video.paused) {
          item.video.play().catch(() => {});
        }
      });
    };
    window.addEventListener('scroll', kickVideos, { passive: true, once: true });
    window.addEventListener('touchstart', kickVideos, { passive: true, once: true });
    window.addEventListener('click', kickVideos, { passive: true, once: true });

    // 7. Scroll State Management
    const scrollState = {
      progress: 0,
      targetIndex: 0,
    };

    // 8. GSAP ScrollTrigger Pinned Timeline (900% scroll distance with 1/9 snap)
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=900%', // 9 viewports for 10 projects
        pin: pinContainerRef.current,
        scrub: 0.9,
        anticipatePin: 1,
        snap: {
          snapTo: 1 / (totalProjects - 1),
          duration: { min: 0.35, max: 0.75 },
          delay: 0.08,
          ease: 'power2.inOut',
        },
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollState.progress = self.progress;

          // Compute fractional project index (0.0 to 9.0)
          const virtualIndex = self.progress * (totalProjects - 1);
          scrollState.targetIndex = virtualIndex;

          const currentNearest = Math.round(virtualIndex);
          setActiveIndex((prev) => (prev !== currentNearest ? currentNearest : prev));

          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${self.progress})`;
          }

          // Smart Video Memory Optimization:
          // Only play active & adjacent reels, pause distant ones
          reelItems.forEach((item, idx) => {
            const dist = Math.abs(idx - virtualIndex);
            if (dist <= 1.25) {
              if (item.video.paused) {
                item.video.play().catch(() => {});
              }
            } else {
              if (!item.video.paused) {
                item.video.pause();
              }
            }
          });
        },
      });
    }, sectionRef);

    // 9. Render Loop: Camera Dolly & Perspective Interpolation
    let animId: number;
    let currentCamZ = startCamZ;
    let currentCamX = 0;
    let currentCamY = 0;

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const time = performance.now() * 0.001;

      const u = scrollState.targetIndex; // fractional index 0 to 9
      const baseIdx = Math.floor(u);
      const nextIdx = Math.min(totalProjects - 1, baseIdx + 1);
      const factor = u - baseIdx;

      const currentSlot = slots[baseIdx] || slots[0];
      const nextSlot = slots[nextIdx] || currentSlot;

      // Interpolated project Z & X in world coordinates
      const interpolatedTargetZ = currentSlot.z + (nextSlot.z - currentSlot.z) * factor;
      const interpolatedTargetX = currentSlot.x + (nextSlot.x - currentSlot.x) * factor;
      const interpolatedTargetY = currentSlot.y + (nextSlot.y - currentSlot.y) * factor;

      // Desired camera destination:
      // Camera stays in front of the active reel target
      const targetCamZPos = interpolatedTargetZ + (isMobile ? 6.2 : 5.8);
      // Camera subtly shifts toward the active reel's lateral side
      const targetCamXPos = interpolatedTargetX * (isMobile ? 0.35 : 0.42);
      const targetCamYPos = interpolatedTargetY * 0.3;

      // Smooth camera interpolation
      currentCamZ += (targetCamZPos - currentCamZ) * 0.09;
      currentCamX += (targetCamXPos - currentCamX) * 0.09;
      currentCamY += (targetCamYPos - currentCamY) * 0.09;

      camera.position.set(currentCamX, currentCamY, currentCamZ);

      // Light moves with camera
      cameraLight.position.set(currentCamX, currentCamY + 1.2, currentCamZ - 1.8);

      // Camera smoothly points toward the active target zone in front
      camera.lookAt(interpolatedTargetX * 0.7, interpolatedTargetY * 0.5, interpolatedTargetZ);

      // Micro floating depth on individual reel meshes
      reelItems.forEach((item, idx) => {
        const floatY = Math.sin(time * 1.1 + idx * 1.3) * 0.04;
        item.group.position.y = item.slot.y + floatY;

        // Active reel subtly turns toward viewer when camera is closest
        const distToCam = Math.abs(item.group.position.z - currentCamZ);
        if (distToCam < 8.0) {
          const focusT = Math.max(0, 1 - Math.abs(idx - u));
          item.group.rotation.y = item.slot.rotY * (1 - focusT * 0.65);
          item.group.scale.setScalar(1.0 + focusT * 0.06);
        } else {
          item.group.rotation.y = item.slot.rotY;
          item.group.scale.setScalar(1.0);
        }

        // Keep active video texture refreshing
        if (item.videoTex && item.video.readyState >= 2 && !item.video.paused) {
          item.videoTex.needsUpdate = true;
        }
      });

      renderer.render(scene, camera);
    };

    tick();

    // 10. Resize Listener
    const handleResize = () => {
      const w = pinContainer.clientWidth || window.innerWidth;
      const h = pinContainer.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', kickVideos);
      window.removeEventListener('touchstart', kickVideos);
      window.removeEventListener('click', kickVideos);
      ctx.revert();

      reelItems.forEach((item) => {
        item.video.pause();
        item.video.removeAttribute('src');
        item.video.load();
        item.videoTex.dispose();
        item.posterTex.dispose();
      });

      casingGeo.dispose();
      screenGeo.dispose();
      rimEdgeGeo.dispose();
      casingMat.dispose();
      rimLineMat.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Programmatic snap navigation (Next / Prev buttons)
  const jumpToProject = (index: number) => {
    const trigger = ScrollTrigger.getById('portfolio-wormhole-trigger') || ScrollTrigger.getAll()[0];
    if (trigger) {
      const total = CLIENT_PROJECTS.length - 1;
      const targetProgress = Math.max(0, Math.min(1, index / total));
      const targetScroll = trigger.start + targetProgress * (trigger.end - trigger.start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="portfolio-wormhole"
      ref={sectionRef}
      className="relative w-full bg-[#05070B] text-white overflow-hidden select-none"
    >
      {/* 100vw × 100vh Pinned Viewport Container */}
      <div
        ref={pinContainerRef}
        className="relative w-full h-[100dvh] min-h-[100dvh] flex items-center justify-center overflow-hidden"
      >
        {/* ======================================================== */}
        {/* TOP: DISCREET EDITORIAL CORRIDOR LABEL & TRACK BAR        */}
        {/* ======================================================== */}
        <div className="absolute top-7 sm:top-10 inset-x-0 z-40 flex items-center justify-between px-6 sm:px-12 pointer-events-none">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_10px_#008CFF] animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.32em] uppercase text-[#008CFF] font-semibold">
              PORTFOLIO // 3D CORRIDOR WORMHOLE
            </span>
          </div>

          {/* Active Project Counter: 01 / 10 */}
          <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs tracking-widest text-white/50">
            <span className="text-[#008CFF] font-bold">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-white/25">/</span>
            <span>{String(CLIENT_PROJECTS.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Top Progress Track Bar */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-white/10 z-40 pointer-events-none">
          <div
            ref={progressBarRef}
            className="w-full h-full bg-[#008CFF] origin-left shadow-[0_0_8px_#008CFF]"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* ======================================================== */}
        {/* THREE.JS WEBGL CANVAS (3D Wormhole Corridor Viewport)    */}
        {/* ======================================================== */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block z-10 pointer-events-none"
        />

        {/* Subtle Vignette Gradient Masks */}
        <div className="absolute inset-0 pointer-events-none z-15 bg-gradient-to-t from-[#05070B] via-transparent to-[#05070B]/70 opacity-90" />
        <div className="absolute inset-0 pointer-events-none z-15 bg-gradient-to-r from-[#05070B]/80 via-transparent to-[#05070B]/80 opacity-60" />

        {/* ======================================================== */}
        {/* MINIMAL ACTIVE PROJECT INFORMATION (CENTER-BOTTOM HERO)   */}
        {/* ======================================================== */}
        <div className="absolute bottom-9 sm:bottom-12 lg:bottom-14 inset-x-0 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <div className="max-w-2xl flex flex-col items-center">
            {/* Category / Discipline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/30 mb-2 sm:mb-3 shadow-[0_0_15px_rgba(0,140,255,0.25)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
              <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.3em] uppercase text-[#008CFF] font-semibold">
                {activeProject.category} • {activeProject.year}
              </span>
            </div>

            {/* Client Name (Dominates with cinematic grandeur) */}
            <h2 className="font-display font-black text-2xl xs:text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-3 sm:mb-4 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
              {activeProject.name}
            </h2>

            {/* Action CTA: VIEW PROJECT → (Interactive) */}
            <button
              type="button"
              onClick={() => setSelectedProject(activeProject)}
              className="group pointer-events-auto inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/10 hover:bg-[#008CFF] border border-white/20 hover:border-[#008CFF] text-white font-sans text-xs tracking-[0.24em] uppercase font-semibold transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(0,140,255,0.6)] cursor-pointer active:scale-95"
            >
              <span>VIEW PROJECT</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* LATERAL CORRIDOR NAVIGATION ARROWS (CLICK TO STEP)       */}
        {/* ======================================================== */}
        <div className="hidden sm:flex absolute inset-y-0 inset-x-8 z-35 items-center justify-between pointer-events-none">
          <button
            type="button"
            onClick={() => jumpToProject(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className={`pointer-events-auto w-11 h-11 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 cursor-pointer ${
              activeIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-80 hover:opacity-100 hover:scale-110'
            }`}
            aria-label="Previous Project"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => jumpToProject(Math.min(CLIENT_PROJECTS.length - 1, activeIndex + 1))}
            disabled={activeIndex === CLIENT_PROJECTS.length - 1}
            className={`pointer-events-auto w-11 h-11 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 cursor-pointer ${
              activeIndex === CLIENT_PROJECTS.length - 1 ? 'opacity-20 cursor-not-allowed' : 'opacity-80 hover:opacity-100 hover:scale-110'
            }`}
            aria-label="Next Project"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* BOTTOM: FOOTER NAVIGATION HINT                           */}
        {/* ======================================================== */}
        <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-40 flex items-center justify-between px-6 sm:px-12 text-white/30 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase pointer-events-none">
          <span>SCROLL TO ADVANCE WORMHOLE</span>
          <span>10 CINEMATIC CHAPTERS</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FULLSCREEN PROJECT DETAILS MODAL / DRAWER                */}
      {/* ======================================================== */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[#05070B]/90 backdrop-blur-2xl animate-fadeIn select-auto">
          {/* Outer Modal Container */}
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0A0D15] border border-white/15 rounded-3xl overflow-y-auto p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.95)]">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              aria-label="Close Project Details"
              className="absolute top-5 right-5 sm:top-7 sm:right-7 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white hover:text-[#008CFF] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#008CFF] font-semibold block mb-2">
                {selectedProject.category} • {selectedProject.year}
              </span>
              <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mb-3">
                {selectedProject.name}
              </h2>
              <p className="text-base sm:text-lg text-white/80 font-light max-w-2xl">
                {selectedProject.headline}
              </p>
            </div>

            {/* Large 16:9 / Video Showcase */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/80 border border-white/10 mb-8">
              <video
                src={selectedProject.videoUrl}
                poster={selectedProject.posterUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Narrative Story */}
            <div className="mb-8">
              <h3 className="font-mono text-xs tracking-[0.3em] uppercase text-white/50 mb-2">
                PROJECT NARRATIVE
              </h3>
              <p className="text-sm sm:text-base text-white/85 leading-relaxed font-light">
                {selectedProject.story}
              </p>
            </div>

            {/* Deliverables & Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
              {/* Deliverables */}
              <div>
                <h4 className="font-mono text-xs tracking-[0.3em] uppercase text-white/50 mb-3">
                  PRODUCTION DELIVERABLES
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.deliverables.map((item, dIdx) => (
                    <span
                      key={dIdx}
                      className="px-3 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-xs text-white/70"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              {selectedProject.metrics && selectedProject.metrics.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs tracking-[0.3em] uppercase text-white/50 mb-3">
                    MEASURABLE IMPACT
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedProject.metrics.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-3 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="font-display font-black text-xl text-[#008CFF]">
                          {m.value}
                        </div>
                        <div className="font-mono text-[10px] tracking-wider uppercase text-white/50">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioWormhole3D;
