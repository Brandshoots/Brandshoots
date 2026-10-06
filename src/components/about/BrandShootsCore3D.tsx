import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// REAL BRANDSHOOTS 9:16 REELS & POSTERS
// ============================================================================
interface ReelData {
  video: string;
  poster: string;
  label: string;
}

const BRAND_REELS: ReelData[] = [
  {
    video: '/reels/wearebrandshoots_1777444216_3885805244420742638_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1777444216_3885805244420742638_77785749886.jpg',
    label: 'STUDIO ARCHIVE 01',
  },
  {
    video: '/reels/wearebrandshoots_1787252706_3968084628303865353_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1787252706_3968084628303865353_77785749886.jpg',
    label: 'BRAND FILM 02',
  },
  {
    video: '/reels/wearebrandshoots_1786854627_3964745654666992928_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1786854627_3964745654666992928_77785749886.jpg',
    label: 'COMMERCIAL 03',
  },
  {
    video: '/reels/wearebrandshoots_1786454245_3961387117295433628_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1786454245_3961387117295433628_77785749886.jpg',
    label: '9:16 SOCIAL REEL 04',
  },
  {
    video: '/reels/wearebrandshoots_1788094941_3975150238988110104_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1788094941_3975150238988110104_77785749886.jpg',
    label: 'VISUAL CAMPAIGN 05',
  },
  {
    video: '/reels/wearebrandshoots_1789541302_3987282906831722378_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1789541302_3987282906831722378_77785749886.jpg',
    label: 'CREATIVE PRODUCTION 06',
  },
];

interface FrameData {
  mesh: THREE.Group;
  initialX: number;
  initialY: number;
  initialZ: number;
  orbitRadius: number;
  orbitAngle: number;
  speed: number;
  rotX: number;
  rotY: number;
}

export const BrandShootsCore3D: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const logoAuraRef = useRef<HTMLDivElement>(null);
  const bgBlurLayerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const introHintRef = useRef<HTMLDivElement>(null);

  // Chapter dossier cards
  const chapter1Ref = useRef<HTMLDivElement>(null);
  const chapter2Ref = useRef<HTMLDivElement>(null);
  const chapter3Ref = useRef<HTMLDivElement>(null);
  const chapter4Ref = useRef<HTMLDivElement>(null);

  // HUD indicators
  const pill1Ref = useRef<HTMLSpanElement>(null);
  const pill2Ref = useRef<HTMLSpanElement>(null);
  const pill3Ref = useRef<HTMLSpanElement>(null);
  const pill4Ref = useRef<HTMLSpanElement>(null);
  const activeChapterLabelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const pinContainer = pinContainerRef.current;
    const canvas = canvasRef.current;
    if (!pinContainer || !canvas) return;

    const width = pinContainer.clientWidth || window.innerWidth;
    const height = pinContainer.clientHeight || window.innerHeight;
    const isMobile = window.innerWidth < 768;

    // 1. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // 2. Camera Setup (Comfortable distance so reels orbit gracefully)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 9.6 : 8.2);

    // 3. Cinematic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x060911, 2.0);
    scene.add(ambientLight);

    const blueRimLight = new THREE.PointLight(0x008cff, 4.0, 28);
    blueRimLight.position.set(0, 0, -2.5);
    scene.add(blueRimLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(3, 4, 6);
    scene.add(keyLight);

    // 4. Create Physical 3D 9:16 Video Reel Tiles
    const framesGroup = new THREE.Group();
    scene.add(framesGroup);

    const textureLoader = new THREE.TextureLoader();
    const activeReels = isMobile ? BRAND_REELS.slice(0, 4) : BRAND_REELS;
    const frames: FrameData[] = [];
    const videoElements: HTMLVideoElement[] = [];
    const videoTextures: THREE.VideoTexture[] = [];

    // Precise 9:16 Aspect Ratio (Smartphone / Vertical Cinema Reel)
    const frameW = isMobile ? 1.25 : 1.5;
    const frameH = (frameW * 16) / 9; // e.g. 1.5 * 1.777 = 2.666
    const casingDepth = 0.035;

    // Shared geometries
    const boxCasingGeo = new THREE.BoxGeometry(frameW + 0.05, frameH + 0.05, casingDepth);
    const screenGeo = new THREE.PlaneGeometry(frameW, frameH);
    const rimEdgeGeo = new THREE.EdgesGeometry(screenGeo);

    // Dark obsidian titanium casing material
    const casingMat = new THREE.MeshStandardMaterial({
      color: 0x0a0d14,
      roughness: 0.35,
      metalness: 0.85,
    });

    // Subtle razor-sharp 1px electric blue rim line (NOT a flat blue polygon)
    const rimLineMat = new THREE.LineBasicMaterial({
      color: 0x008cff,
      transparent: true,
      opacity: 0.45,
    });

    activeReels.forEach((reel, i) => {
      const frameContainer = new THREE.Group();

      // Physical 3D chassis
      const casingMesh = new THREE.Mesh(boxCasingGeo, casingMat);
      frameContainer.add(casingMesh);

      // HTML5 video element for reel footage
      const video = document.createElement('video');
      video.src = reel.video;
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.play().catch(() => {});
      videoElements.push(video);

      const videoTex = new THREE.VideoTexture(video);
      videoTex.colorSpace = THREE.SRGBColorSpace;
      videoTex.minFilter = THREE.LinearFilter;
      videoTex.magFilter = THREE.LinearFilter;
      videoTextures.push(videoTex);

      // Fallback poster texture
      const posterTex = textureLoader.load(reel.poster);
      posterTex.colorSpace = THREE.SRGBColorSpace;

      // Black & White Editorial Shader Material
      const filmMat = new THREE.MeshStandardMaterial({
        map: posterTex,
        roughness: 0.35,
        metalness: 0.1,
      });

      // Monochromatic GLSL Grading
      filmMat.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <map_fragment>',
          `
          #include <map_fragment>
          // High-End Black & White Reel Grade
          float gray = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
          // Contrast curve for film richness
          gray = pow(gray, 1.15);
          // Subtle monochromatic tone
          diffuseColor.rgb = vec3(gray * 0.88, gray * 0.90, gray * 0.95);
          `
        );
      };

      // Swap to video texture once frames are ready
      video.addEventListener('playing', () => {
        filmMat.map = videoTex;
        filmMat.needsUpdate = true;
      });

      const screenMesh = new THREE.Mesh(screenGeo, filmMat);
      screenMesh.position.z = casingDepth / 2 + 0.002;
      frameContainer.add(screenMesh);

      // Razor-thin edge accent
      const rimLine = new THREE.LineSegments(rimEdgeGeo, rimLineMat);
      rimLine.position.z = casingDepth / 2 + 0.003;
      frameContainer.add(rimLine);

      // 3D Spatial Placement
      const count = activeReels.length;
      const angle = (i / count) * Math.PI * 2;
      const radius = isMobile ? 3.6 : 5.2;
      const zOffset = ((i % 3) - 1) * (isMobile ? 0.9 : 1.5);

      const posX = Math.cos(angle) * radius;
      const posY = Math.sin(angle) * (radius * 0.42);
      const posZ = zOffset;

      frameContainer.position.set(posX, posY, posZ);

      const rotY = -angle + Math.PI / 2 + 0.15;
      const rotX = (posY / radius) * 0.22;
      frameContainer.rotation.set(rotX, rotY, 0);

      framesGroup.add(frameContainer);

      frames.push({
        mesh: frameContainer,
        initialX: posX,
        initialY: posY,
        initialZ: posZ,
        orbitRadius: radius,
        orbitAngle: angle,
        speed: 0.8 + (i % 3) * 0.2,
        rotX,
        rotY,
      });
    });

    // Touch/Scroll kick to ensure autoplay on restrictive devices
    const wakeVideos = () => {
      videoElements.forEach((v) => {
        if (v.paused) v.play().catch(() => {});
      });
    };
    window.addEventListener('scroll', wakeVideos, { passive: true, once: true });
    window.addEventListener('touchstart', wakeVideos, { passive: true, once: true });
    window.addEventListener('click', wakeVideos, { passive: true, once: true });

    // 5. Scroll State Tracking
    const scrollState = {
      progress: 0,
      cameraZ: isMobile ? 9.6 : 8.2,
      orbitRotation: 0,
      lightIntensity: 1.0,
    };

    // 6. GSAP ScrollTrigger Pinned Timeline (4 Cinematic Chapters)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=450%',
          pin: pinContainerRef.current,
          scrub: 1.0,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            scrollState.progress = self.progress;
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      // Orbit turns smoothly across the entire scroll
      tl.to(
        scrollState,
        {
          orbitRotation: Math.PI * 2.2,
          lightIntensity: 1.6,
          duration: 4.0,
          ease: 'none',
        },
        0
      );

      // Intro Hint fades away on scroll
      tl.to(
        introHintRef.current,
        { opacity: 0, y: -20, duration: 0.2, ease: 'power2.in' },
        0.05
      );

      // -------------------------------------------------------------
      // INTRO -> CHAPTER 01 TRANSITION (Seamless, Zero Black Gap):
      // Blur layer activates (z-20), Logo floats to header anchor (z-30),
      // and Chapter 01 (z-50) enters simultaneously!
      // -------------------------------------------------------------
      tl.to(
        bgBlurLayerRef.current,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        0.15
      );

      tl.to(
        logoWrapperRef.current,
        {
          y: isMobile ? -180 : -210,
          scale: 0.56,
          opacity: 0.85,
          duration: 0.35,
          ease: 'power2.out',
        },
        0.15
      );

      // -------------------------------------------------------------
      // CHAPTER 01: THE MANIFESTO // WHO WE ARE
      // -------------------------------------------------------------
      tl.fromTo(
        chapter1Ref.current,
        { autoAlpha: 0, y: 40, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1.0, duration: 0.35, ease: 'power2.out' },
        0.18
      );
      tl.to(pill1Ref.current, { color: '#008CFF', scale: 1.25, duration: 0.15 }, 0.18);
      if (activeChapterLabelRef.current) {
        tl.call(() => {
          if (activeChapterLabelRef.current) activeChapterLabelRef.current.innerText = '1';
        }, [], 0.18);
      }
      // Hold Chapter 1 (0.53 -> 0.95)
      // Exit Chapter 1
      tl.to(
        chapter1Ref.current,
        { autoAlpha: 0, y: -35, scale: 1.02, duration: 0.25, ease: 'power2.in' },
        1.0
      );
      tl.to(pill1Ref.current, { color: 'rgba(255,255,255,0.35)', scale: 1.0, duration: 0.15 }, 1.0);

      // -------------------------------------------------------------
      // CHAPTER 02: PRODUCTION CRAFT // 9:16 SOCIAL VELOCITY
      // -------------------------------------------------------------
      tl.fromTo(
        chapter2Ref.current,
        { autoAlpha: 0, y: 40, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1.0, duration: 0.35, ease: 'power2.out' },
        1.15
      );
      tl.to(pill2Ref.current, { color: '#008CFF', scale: 1.25, duration: 0.15 }, 1.15);
      if (activeChapterLabelRef.current) {
        tl.call(() => {
          if (activeChapterLabelRef.current) activeChapterLabelRef.current.innerText = '2';
        }, [], 1.15);
      }
      // Hold Chapter 2 (1.5 -> 1.95)
      // Exit Chapter 2
      tl.to(
        chapter2Ref.current,
        { autoAlpha: 0, y: -35, scale: 1.02, duration: 0.25, ease: 'power2.in' },
        2.0
      );
      tl.to(pill2Ref.current, { color: 'rgba(255,255,255,0.35)', scale: 1.0, duration: 0.15 }, 2.0);

      // -------------------------------------------------------------
      // CHAPTER 03: ENTERPRISE IMPACT // PROVEN SCALE
      // -------------------------------------------------------------
      tl.fromTo(
        chapter3Ref.current,
        { autoAlpha: 0, y: 40, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1.0, duration: 0.35, ease: 'power2.out' },
        2.15
      );
      tl.to(pill3Ref.current, { color: '#008CFF', scale: 1.25, duration: 0.15 }, 2.15);
      if (activeChapterLabelRef.current) {
        tl.call(() => {
          if (activeChapterLabelRef.current) activeChapterLabelRef.current.innerText = '3';
        }, [], 2.15);
      }
      // Hold Chapter 3 (2.5 -> 2.95)
      // Exit Chapter 3
      tl.to(
        chapter3Ref.current,
        { autoAlpha: 0, y: -35, scale: 1.02, duration: 0.25, ease: 'power2.in' },
        3.0
      );
      tl.to(pill3Ref.current, { color: 'rgba(255,255,255,0.35)', scale: 1.0, duration: 0.15 }, 3.0);

      // -------------------------------------------------------------
      // CHAPTER 04: THE CORE // LOGO & MANIFESTO CLIMAX
      // -------------------------------------------------------------
      // Return logo to center stage with peak radiance
      tl.to(
        logoWrapperRef.current,
        {
          y: isMobile ? -60 : -70,
          scale: 1.0,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
        },
        3.15
      );
      tl.to(
        logoAuraRef.current,
        {
          scale: 1.45,
          opacity: 1.0,
          duration: 0.45,
          ease: 'power2.out',
        },
        3.15
      );

      tl.fromTo(
        chapter4Ref.current,
        { autoAlpha: 0, y: 40, scale: 0.95 },
        { autoAlpha: 1, y: 0, scale: 1.0, duration: 0.45, ease: 'power2.out' },
        3.2
      );
      tl.to(pill4Ref.current, { color: '#008CFF', scale: 1.25, duration: 0.15 }, 3.2);
      if (activeChapterLabelRef.current) {
        tl.call(() => {
          if (activeChapterLabelRef.current) activeChapterLabelRef.current.innerText = '4';
        }, [], 3.2);
      }
    }, sectionRef);

    // 7. 60fps Render Loop with Smooth Interpolation
    let animId: number;
    let currentOrbit = 0;

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const time = performance.now() * 0.001;

      currentOrbit += (scrollState.orbitRotation - currentOrbit) * 0.08;

      framesGroup.rotation.y = currentOrbit + Math.sin(time * 0.35) * 0.03;
      framesGroup.rotation.x = Math.sin(time * 0.4) * 0.015;

      frames.forEach((f, idx) => {
        const floatY = Math.sin(time * 1.1 + idx * 1.4) * 0.06;
        f.mesh.position.y = f.initialY + floatY;
      });

      videoTextures.forEach((vt) => {
        if (vt.image && (vt.image as HTMLVideoElement).readyState >= 2) {
          vt.needsUpdate = true;
        }
      });

      renderer.render(scene, camera);
    };

    tick();

    // 8. Resize Handler
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
      window.removeEventListener('scroll', wakeVideos);
      window.removeEventListener('touchstart', wakeVideos);
      window.removeEventListener('click', wakeVideos);
      ctx.revert();

      videoElements.forEach((v) => {
        v.pause();
        v.removeAttribute('src');
        v.load();
      });
      videoTextures.forEach((vt) => vt.dispose());

      boxCasingGeo.dispose();
      screenGeo.dispose();
      rimEdgeGeo.dispose();
      casingMat.dispose();
      rimLineMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      id="brandshoots-core"
      ref={sectionRef}
      className="relative w-full bg-[#05070B] text-white overflow-hidden select-none"
    >
      {/* 100vw × 100vh Pinned Viewport Container */}
      <div
        ref={pinContainerRef}
        className="relative w-full h-[100dvh] min-h-[100dvh] flex items-center justify-center overflow-hidden"
      >
        {/* ======================================================== */}
        {/* TOP: CHAPTER HUD & PROGRESSION BAR (Z-INDEX: 60)         */}
        {/* ======================================================== */}
        <div
          className="absolute top-7 sm:top-10 inset-x-0 flex items-center justify-between px-6 sm:px-12 pointer-events-none"
          style={{ zIndex: 60 }}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_10px_#008CFF] animate-pulse" />
            <span
              ref={activeChapterLabelRef}
              className="font-mono text-[10px] sm:text-xs tracking-[0.32em] uppercase text-[#008CFF] font-semibold"
            >
              THE BRANDSHOOTS CORE // 3D REEL UNIVERSE
            </span>
          </div>


        </div>

        {/* Top Progress Track Bar */}
        <div
          className="absolute top-0 inset-x-0 h-[2px] bg-white/10 pointer-events-none"
          style={{ zIndex: 60 }}
        >
          <div
            ref={progressBarRef}
            className="w-full h-full bg-[#008CFF] origin-left shadow-[0_0_8px_#008CFF]"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* ======================================================== */}
        {/* THREE.JS WEBGL CANVAS (Orbiting 9:16 B&W Reels) (Z: 10)  */}
        {/* ======================================================== */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none"
          style={{ zIndex: 10 }}
        />

        {/* ======================================================== */}
        {/* CINEMATIC BACKDROP BLUR LAYER (Blurs Canvas) (Z: 20)     */}
        {/* ======================================================== */}
        <div
          ref={bgBlurLayerRef}
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity will-change-[opacity,backdrop-filter]"
          style={{
            zIndex: 20,
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            backgroundColor: 'rgba(5, 7, 11, 0.82)',
          }}
        />

        {/* ======================================================== */}
        {/* HERO ANCHOR: OFFICIAL BRANDSHOOTS LOGO (Z-INDEX: 30)     */}
        {/* ======================================================== */}
        <div
          ref={logoWrapperRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none px-6 text-center will-change-transform"
          style={{ zIndex: 30 }}
        >
          {/* Volumetric Soft Electric Blue Back-Aura */}
          <div
            ref={logoAuraRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] lg:w-[640px] h-[180px] sm:h-[260px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.35) 0%, rgba(11, 16, 78, 0.18) 55%, transparent 75%)',
              filter: 'blur(75px)',
            }}
          />

          {/* Official Vector Logo */}
          <img
            src="/Logo Official.svg"
            alt="BRANDSHOOTS"
            className="w-[68vw] max-w-[360px] sm:max-w-[460px] lg:max-w-[540px] h-auto object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)] drop-shadow-[0_0_24px_rgba(0,140,255,0.4)]"
          />

          {/* Intro Subtitle Pill */}
          <div
            ref={introHintRef}
            className="mt-4 sm:mt-5 flex items-center gap-3 transition-opacity"
          >
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.32em] uppercase text-white/70 font-semibold">
              SCROLL TO EXPLORE
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SUBSTANTIAL ABOUT MATTER DOSSIER (Z-INDEX: 50 -> ABOVE BLUR) */}
        {/* ======================================================== */}
        <div
          className="absolute inset-0 flex items-center justify-center px-5 sm:px-10 lg:px-16 pointer-events-none"
          style={{ zIndex: 50 }}
        >
          <div className="relative w-full max-w-3xl min-h-[360px] sm:min-h-[400px] flex items-center justify-center">
{/* ---------------------------------------------------- */}
{/* CHAPTER 01: ABOUT BRANDSHOOTS                       */}
{/* ---------------------------------------------------- */}
<div
  ref={chapter1Ref}
  className="absolute inset-x-0 mx-auto flex flex-col items-center text-center will-change-transform opacity-0 pointer-events-none"
  style={{ zIndex: 50 }}
>


  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[1.15] mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] max-w-2xl">
    WE CREATE STORIES.
    <br />
    <span className="text-[#008CFF]">WE MAKE THEM MOVE.</span>
  </h2>

  <p className="text-xs sm:text-sm lg:text-base text-white/90 leading-relaxed max-w-2xl font-light mb-5 sm:mb-6 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
    BRANDSHOOTS is a creative production studio turning ideas into films,
    campaigns and visual experiences. We bring together storytelling,
    cinematography and creative direction to create work that connects
    brands with people.
  </p>


</div>

{/* ---------------------------------------------------- */}
{/* CHAPTER 02: PRODUCTION CRAFT                         */}
{/* ---------------------------------------------------- */}
<div
  ref={chapter2Ref}
  className="absolute inset-x-0 mx-auto flex flex-col items-center text-center will-change-transform opacity-0 pointer-events-none"
  style={{ zIndex: 50 }}
>

  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[1.15] mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] max-w-2xl">
    FROM FIRST FRAME TO{' '}    <br />
    <span className="text-[#008CFF]">FINAL CUT.</span>
  </h2>

  <p className="text-xs sm:text-sm lg:text-base text-white/90 leading-relaxed max-w-2xl font-light mb-5 sm:mb-6 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
    From concept and pre-production to filming, editing and final delivery,
    BRANDSHOOTS brings every stage of production together to create films,
    campaigns and visual content built around the story.
  </p>

</div>

{/* ---------------------------------------------------- */}
{/* CHAPTER 03: BRAND IMPACT                             */}
{/* ---------------------------------------------------- */}
<div
  ref={chapter3Ref}
  className="absolute inset-x-0 mx-auto flex flex-col items-center text-center will-change-transform opacity-0 pointer-events-none"
  style={{ zIndex: 50 }}
>

  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[1.15] mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] max-w-2xl">
    DIFFERENT BRANDS.{' '}
    <span className="text-[#008CFF]">ONE CREATIVE VISION.</span>
  </h2>

  <p className="text-xs sm:text-sm lg:text-base text-white/90 leading-relaxed max-w-2xl font-light mb-5 sm:mb-6 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
    From industrial and corporate brands to retail, hospitality and lifestyle,
    BRANDSHOOTS creates visual work shaped around each brand, its audience and
    its story. Every project begins with understanding what makes the brand
    worth watching.
  </p>

</div>

{/* ---------------------------------------------------- */}
{/* CHAPTER 04: THE BRANDSHOOTS CREED                   */}
{/* ---------------------------------------------------- */}
<div
  ref={chapter4Ref}
  className="absolute inset-x-0 mx-auto flex flex-col items-center text-center will-change-transform opacity-0 pointer-events-none mt-28 sm:mt-32"
  style={{ zIndex: 50 }}
>
  <br />

  <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight mb-3 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] max-w-2xl">
    WE CREATE STORIES THAT{' '}
    <span className="text-[#008CFF]">MOVE PEOPLE.</span>
  </h3>


  <div className="flex items-center gap-3 font-mono text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#008CFF] font-bold">
    <span>CREATE</span>
    <span className="text-white/40">•</span>
    <span>SHOOT</span>
    <span className="text-white/40">•</span>
    <span>GROW</span>
  </div>
</div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default BrandShootsCore3D;
