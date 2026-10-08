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

interface CardMeshItem {
  group: THREE.Group;
  screenMesh: THREE.Mesh;
  rimLine: THREE.LineLoop;
  filmMat: THREE.MeshStandardMaterial;
  rimMat: THREE.LineBasicMaterial;
  video: HTMLVideoElement;
  videoTex: THREE.VideoTexture;
  index: number;
}

// Helper to create rounded rectangle path for luxury device frames
function createRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

export const BrandShootsCore3D: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const logoAuraRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const introHintRef = useRef<HTMLDivElement>(null);

  // Kinetic typography train refs
  const trainTrack1Ref = useRef<HTMLDivElement>(null);
  const trainTrack2Ref = useRef<HTMLDivElement>(null);
  const ghostWatermarkRef = useRef<HTMLDivElement>(null);

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

    let width = pinContainer.clientWidth || window.innerWidth;
    let height = pinContainer.clientHeight || window.innerHeight;
    let isMobile = window.innerWidth < 768;
    let isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    // ========================================================================
    // 1. THREE.JS WEBGL RENDERER
    // ========================================================================
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.75 : 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // ========================================================================
    // 2. CAMERA SETUP (Expansive panoramic field of view)
    // ========================================================================
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const baseCameraZ = isMobile ? 8.8 : isTablet ? 8.0 : 7.4;
    camera.position.set(0, 0.25, baseCameraZ);

    // ========================================================================
    // 3. CINEMATIC STUDIO LIGHTING (Multi-Point Specular Sheen)
    // ========================================================================
    const ambientLight = new THREE.AmbientLight(0x0e1628, 2.6);
    scene.add(ambientLight);

    const blueRimLight = new THREE.PointLight(0x008cff, 5.0, 36);
    blueRimLight.position.set(0, 0.5, -2.8);
    scene.add(blueRimLight);

    const leftRimLight = new THREE.PointLight(0x008cff, 3.2, 24);
    leftRimLight.position.set(-5.5, 1.2, -1.0);
    scene.add(leftRimLight);

    const rightRimLight = new THREE.PointLight(0x008cff, 3.2, 24);
    rightRimLight.position.set(5.5, 1.2, -1.0);
    scene.add(rightRimLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(3.5, 5.0, 6.0);
    scene.add(keyLight);

    const travelingSpot = new THREE.PointLight(0x38bdf8, 2.2, 20);
    travelingSpot.position.set(0, 0.6, 3.0);
    scene.add(travelingSpot);

    // ========================================================================
    // 4. SPATIAL 3D CARD INSTALLATION (Luxury Rounded Titanium Devices)
    // ========================================================================
    const cardsRootGroup = new THREE.Group();
    scene.add(cardsRootGroup);

    const textureLoader = new THREE.TextureLoader();
    const cardItems: CardMeshItem[] = [];
    const videoElements: HTMLVideoElement[] = [];
    const videoTextures: THREE.VideoTexture[] = [];

    // Precise 9:16 Aspect Ratio with Rounded Corners
    const frameW = isMobile ? 1.4 : isTablet ? 1.55 : 1.68;
    const frameH = (frameW * 16) / 9;
    const cornerRadius = 0.16;
    const casingDepth = 0.04;

    // A. Rounded Titanium Chassis (Extruded Geometry with Bevel)
    const casingShape = createRoundedRectShape(frameW + 0.08, frameH + 0.08, cornerRadius + 0.02);
    const casingGeo = new THREE.ExtrudeGeometry(casingShape, {
      depth: casingDepth,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012,
    });
    casingGeo.center();

    // B. Rounded Screen Geometry with Normalized UVs
    const screenShape = createRoundedRectShape(frameW, frameH, cornerRadius);
    const screenGeo = new THREE.ShapeGeometry(screenShape, 24);
    screenGeo.center();

    // C. Rounded Neon-Blue Edge Border LineLoop
    const screenPoints = screenShape.getPoints(36);
    const rimPoints = screenPoints.map((p) => new THREE.Vector3(p.x, p.y, casingDepth / 2 + 0.003));
    const rimGeo = new THREE.BufferGeometry().setFromPoints(rimPoints);

    // D. Dynamic Island / Speaker Notch Shape
    const notchShape = createRoundedRectShape(0.36, 0.08, 0.04);
    const notchGeo = new THREE.ShapeGeometry(notchShape, 16);
    notchGeo.center();
    const notchMat = new THREE.MeshBasicMaterial({ color: 0x020408 });

    // Shared obsidian brushed titanium casing material with clearcoat
    const casingMat = new THREE.MeshStandardMaterial({
      color: 0x080c14,
      roughness: 0.25,
      metalness: 0.9,
    });

    BRAND_REELS.forEach((reel, i) => {
      const cardGroup = new THREE.Group();

      // Physical rounded titanium device chassis
      const casingMesh = new THREE.Mesh(casingGeo, casingMat);
      cardGroup.add(casingMesh);

      // HTML5 video element for reel footage
      const video = document.createElement('video');
      video.src = reel.video;
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.play().catch(() => {});
      videoElements.push(video);

      const videoTex = new THREE.VideoTexture(video);
      videoTex.colorSpace = THREE.SRGBColorSpace;
      videoTex.minFilter = THREE.LinearFilter;
      videoTex.magFilter = THREE.LinearFilter;
      videoTextures.push(videoTex);

      const posterTex = textureLoader.load(reel.poster);
      posterTex.colorSpace = THREE.SRGBColorSpace;

      const filmMat = new THREE.MeshStandardMaterial({
        map: posterTex,
        roughness: 0.25,
        metalness: 0.12,
        transparent: true,
        opacity: 1.0,
      });

      video.addEventListener('playing', () => {
        filmMat.map = videoTex;
        filmMat.needsUpdate = true;
      });

      // Rounded screen surface
      const screenMesh = new THREE.Mesh(screenGeo, filmMat);
      screenMesh.position.z = casingDepth / 2 + 0.002;
      cardGroup.add(screenMesh);

      // Signature razor-sharp curved electric blue neon border
      const rimMat = new THREE.LineBasicMaterial({
        color: 0x008cff,
        transparent: true,
        opacity: 0.75,
      });
      const rimLine = new THREE.LineLoop(rimGeo, rimMat);
      cardGroup.add(rimLine);

      // Dynamic Island notch pill at top of screen
      const notchMesh = new THREE.Mesh(notchGeo, notchMat);
      notchMesh.position.set(0, frameH / 2 - 0.09, casingDepth / 2 + 0.004);
      cardGroup.add(notchMesh);

      cardsRootGroup.add(cardGroup);

      cardItems.push({
        group: cardGroup,
        screenMesh,
        rimLine,
        filmMat,
        rimMat,
        video,
        videoTex,
        index: i,
      });
    });

    // Touch / scroll kick to guarantee autoplay on mobile browsers
    const wakeVideos = () => {
      videoElements.forEach((v) => {
        if (v.paused) v.play().catch(() => {});
      });
    };
    window.addEventListener('scroll', wakeVideos, { passive: true, once: true });
    window.addEventListener('touchstart', wakeVideos, { passive: true, once: true });
    window.addEventListener('click', wakeVideos, { passive: true, once: true });

    // ========================================================================
    // 5. SCROLL STATE TRACKING & GSAP SCROLLTRIGGER BINDING
    // ========================================================================
    const scrollState = {
      progress: 0,
      cardProgress: 0, // 0 to 5.2
      entranceZ: -3.8, // Initial entrance from deep space
      climaxSpread: 0, // 0 = curved carousel, 1 = wings formation
      cameraZ: baseCameraZ,
      cameraY: 0.25,
      cameraX: 0,
      cardsElevationY: isMobile ? 0.35 : 0.52,
      trainShift1: 0,
      trainShift2: 0,
    };

    // Pointer & Touch Micro-Parallax Physics
    let pointerX = 0;
    let pointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;

    const onPointerMove = (e: MouseEvent) => {
      pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        pointerX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        pointerY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
      }
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // ========================================================================
    // 6. GSAP SCROLLTRIGGER TIMELINE (Airtight Sequential Choreography)
    // ========================================================================
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

            // Sync kinetic typography train with scroll velocity scrub
            scrollState.trainShift1 = -self.progress * 480;
            scrollState.trainShift2 = self.progress * 420;

            if (ghostWatermarkRef.current) {
              ghostWatermarkRef.current.style.transform = `scale(${1 + self.progress * 0.12}) translateY(${self.progress * 40}px)`;
            }
          },
        },
      });

      // ----------------------------------------------------------------------
      // PHASE 0 (0.00 -> 0.20): INITIAL ENTRANCE FROM DEEP Z-SPACE
      // ----------------------------------------------------------------------
      tl.to(
        scrollState,
        {
          entranceZ: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        0
      );

      // Intro hint fades away
      tl.to(
        introHintRef.current,
        { autoAlpha: 0, duration: 0.15, ease: 'power2.in' },
        0.04
      );

      // Logo fades out gracefully so it NEVER collides with cards during Chapters 1, 2, 3
      tl.to(
        logoWrapperRef.current,
        {
          autoAlpha: 0,
          y: -40,
          scale: 0.92,
          duration: 0.22,
          ease: 'power2.in',
        },
        0.08
      );

      tl.to(
        logoAuraRef.current,
        {
          autoAlpha: 0,
          duration: 0.2,
        },
        0.08
      );

      // ----------------------------------------------------------------------
      // CHAPTER 01 (0.25 -> 1.15): WE CREATE STORIES. WE MAKE THEM MOVE.
      // ----------------------------------------------------------------------
      tl.to(
        scrollState,
        {
          cardProgress: 1.0,
          cameraZ: baseCameraZ - 0.15,
          cameraX: 0.08,
          duration: 1.0,
          ease: 'none',
        },
        0.2
      );

      tl.fromTo(
        chapter1Ref.current,
        { autoAlpha: 0, y: 25 },
        { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        0.25
      );

      tl.to(pill1Ref.current, { color: '#008CFF', scale: 1.25, duration: 0.15 }, 0.25);
      if (activeChapterLabelRef.current) {
        tl.call(() => {
          if (activeChapterLabelRef.current) activeChapterLabelRef.current.innerText = '1';
        }, [], 0.25);
      }

      // Exit Chapter 1 (completely faded out before Chapter 2 enters)
      tl.to(
        chapter1Ref.current,
        { autoAlpha: 0, y: -20, duration: 0.2, ease: 'power2.in' },
        0.95
      );
      tl.to(pill1Ref.current, { color: 'rgba(255,255,255,0.35)', scale: 1.0, duration: 0.15 }, 0.95);

      // ----------------------------------------------------------------------
      // CHAPTER 02 (1.25 -> 2.15): FROM FIRST FRAME TO FINAL CUT.
      // ----------------------------------------------------------------------
      tl.to(
        scrollState,
        {
          cardProgress: 2.8,
          cameraZ: baseCameraZ - 0.1,
          cameraX: -0.1,
          duration: 1.0,
          ease: 'none',
        },
        1.2
      );

      tl.fromTo(
        chapter2Ref.current,
        { autoAlpha: 0, y: 25 },
        { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        1.25
      );

      tl.to(pill2Ref.current, { color: '#008CFF', scale: 1.25, duration: 0.15 }, 1.25);
      if (activeChapterLabelRef.current) {
        tl.call(() => {
          if (activeChapterLabelRef.current) activeChapterLabelRef.current.innerText = '2';
        }, [], 1.25);
      }

      // Exit Chapter 2 (completely faded out before Chapter 3 enters)
      tl.to(
        chapter2Ref.current,
        { autoAlpha: 0, y: -20, duration: 0.2, ease: 'power2.in' },
        1.95
      );
      tl.to(pill2Ref.current, { color: 'rgba(255,255,255,0.35)', scale: 1.0, duration: 0.15 }, 1.95);

      // ----------------------------------------------------------------------
      // CHAPTER 03 (2.25 -> 3.15): DIFFERENT BRANDS. ONE CREATIVE VISION.
      // ----------------------------------------------------------------------
      tl.to(
        scrollState,
        {
          cardProgress: 4.5,
          cameraZ: baseCameraZ - 0.15,
          cameraX: 0.08,
          duration: 1.0,
          ease: 'none',
        },
        2.2
      );

      tl.fromTo(
        chapter3Ref.current,
        { autoAlpha: 0, y: 25 },
        { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        2.25
      );

      tl.to(pill3Ref.current, { color: '#008CFF', scale: 1.25, duration: 0.15 }, 2.25);
      if (activeChapterLabelRef.current) {
        tl.call(() => {
          if (activeChapterLabelRef.current) activeChapterLabelRef.current.innerText = '3';
        }, [], 2.25);
      }

      // Exit Chapter 3 (completely faded out before Chapter 4 enters)
      tl.to(
        chapter3Ref.current,
        { autoAlpha: 0, y: -20, duration: 0.2, ease: 'power2.in' },
        2.95
      );
      tl.to(pill3Ref.current, { color: 'rgba(255,255,255,0.35)', scale: 1.0, duration: 0.15 }, 2.95);

      // ----------------------------------------------------------------------
      // CHAPTER 04 CLIMAX (3.25 -> 4.00): WINGS FORMATION & LOGO ANTHEM
      // ----------------------------------------------------------------------
      // Cards part symmetrically to the far left and right wings, opening a wide center stage
      tl.to(
        scrollState,
        {
          climaxSpread: 1.0,
          cameraZ: baseCameraZ + (isMobile ? 0.35 : 0.6),
          cameraX: 0,
          cameraY: 0.2,
          duration: 0.75,
          ease: 'power2.inOut',
        },
        3.25
      );

      // BrandShoots Official Logo returns to center dominance with radiant aura
      tl.to(
        logoWrapperRef.current,
        {
          autoAlpha: 1,
          y: isMobile ? -85 : -110,
          scale: 1.0,
          duration: 0.45,
          ease: 'power2.out',
        },
        3.3
      );

      tl.to(
        logoAuraRef.current,
        {
          autoAlpha: 0.95,
          duration: 0.45,
          ease: 'power2.out',
        },
        3.3
      );

      tl.fromTo(
        chapter4Ref.current,
        { autoAlpha: 0, y: 25 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' },
        3.35
      );

      tl.to(pill4Ref.current, { color: '#008CFF', scale: 1.25, duration: 0.15 }, 3.35);
      if (activeChapterLabelRef.current) {
        tl.call(() => {
          if (activeChapterLabelRef.current) activeChapterLabelRef.current.innerText = '4';
        }, [], 3.35);
      }

      // Final gentle hold leading smoothly to Leadership section
      tl.to({}, { duration: 0.3 }, 3.9);
    }, sectionRef);

    // ========================================================================
    // 7. 60FPS THREE.JS RENDER LOOP (Panoramic Spacious Gallery Arc)
    // ========================================================================
    let animId: number;
    let currentCardProgress = 0;
    let currentEntranceZ = -3.8;
    let currentClimaxSpread = 0;
    let currentCameraZ = baseCameraZ;
    let currentCameraY = 0.25;
    let currentCameraX = 0;

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const time = performance.now() * 0.001;

      // Inertial damping on scroll parameters (Buttery smooth lerp)
      currentCardProgress += (scrollState.cardProgress - currentCardProgress) * 0.085;
      currentEntranceZ += (scrollState.entranceZ - currentEntranceZ) * 0.085;
      currentClimaxSpread += (scrollState.climaxSpread - currentClimaxSpread) * 0.08;
      currentCameraZ += (scrollState.cameraZ - currentCameraZ) * 0.07;
      currentCameraY += (scrollState.cameraY - currentCameraY) * 0.07;
      currentCameraX += (scrollState.cameraX - currentCameraX) * 0.07;

      // Inertial pointer micro-parallax
      currentPointerX += (pointerX - currentPointerX) * 0.05;
      currentPointerY += (pointerY - currentPointerY) * 0.05;

      // ----------------------------------------------------------------------
      // CAMERA POSITION (Elevated & Framed above lower editorial dock)
      // ----------------------------------------------------------------------
      camera.position.z = currentCameraZ;
      camera.position.x = currentCameraX + currentPointerX * (isMobile ? 0.08 : 0.22);
      camera.position.y = currentCameraY - currentPointerY * (isMobile ? 0.06 : 0.16);
      camera.lookAt(0, scrollState.cardsElevationY * 0.82, 0);

      // Lighting tracking
      travelingSpot.position.x = currentPointerX * 2.0;
      travelingSpot.position.y = scrollState.cardsElevationY + 0.4;

      // ----------------------------------------------------------------------
      // SPACIOUS 3D CURVED CARDS POSITIONING (Fills Wide Horizontal Span)
      // ----------------------------------------------------------------------
      // Generous curve radii to eliminate blank left/right voids
      const curveRx = isMobile ? 3.6 : isTablet ? 5.6 : 7.4;
      const curveRz = isMobile ? 4.2 : isTablet ? 5.8 : 7.2;
      const angleStep = isMobile ? 0.54 : 0.44;

      cardItems.forEach((card) => {
        const i = card.index;
        const delta = i - currentCardProgress;

        // A. Carousel State (Wide Curved Spatial Arc across screen)
        const theta = delta * angleStep;
        const carouselX = Math.sin(theta) * curveRx;
        const carouselZ = -(1 - Math.cos(theta)) * curveRz + currentEntranceZ;
        const carouselY = scrollState.cardsElevationY - Math.min(0.9, delta * delta * 0.035);
        const carouselRotY = -theta * 0.85;
        const carouselRotX = currentPointerY * 0.04;
        const carouselRotZ = -delta * 0.02;
        const carouselScale = Math.max(0.48, 1.0 - 0.14 * Math.min(3.5, Math.abs(delta)));
        const carouselOpacity = Math.max(0.24, 1.0 - 0.22 * Math.min(3.5, Math.abs(delta)));

        // B. Wings Formation State (Chapter 04 Climax - Expansive Wide Amphitheater)
        // Spread wide to edges of screen, leaving the center corridor completely open
        const isLeftWing = i < 3;
        const wingRank = isLeftWing ? 2 - i : i - 3; // 0, 1, 2 from inner to outer
        const wingDir = isLeftWing ? -1 : 1;
        const wingX = wingDir * (isMobile ? 2.2 + wingRank * 1.3 : 3.4 + wingRank * 2.1);
        const wingZ = -0.5 - wingRank * 1.2;
        const wingY = scrollState.cardsElevationY + 0.05 - wingRank * 0.12;
        const wingRotY = -wingDir * (0.36 + wingRank * 0.12);
        const wingScale = 0.9 - wingRank * 0.12;
        const wingOpacity = 0.88 - wingRank * 0.18;

        // Smoothly blend between Carousel and Wings formation
        const blend = currentClimaxSpread;
        const targetX = carouselX * (1 - blend) + wingX * blend;
        const targetY = carouselY * (1 - blend) + wingY * blend;
        const targetZ = carouselZ * (1 - blend) + wingZ * blend;
        const targetRotY = carouselRotY * (1 - blend) + wingRotY * blend + currentPointerX * 0.08;
        const targetRotX = carouselRotX + currentPointerY * 0.06;
        const targetRotZ = carouselRotZ * (1 - blend);
        const targetScale = carouselScale * (1 - blend) + wingScale * blend;
        const targetOpacity = carouselOpacity * (1 - blend) + wingOpacity * blend;

        // Subtle organic float animation per card
        const floatY = Math.sin(time * 1.2 + i * 1.3) * 0.03;

        card.group.position.set(targetX, targetY + floatY, targetZ);
        card.group.rotation.set(targetRotX, targetRotY, targetRotZ);
        card.group.scale.setScalar(targetScale);

        // Apply smooth opacity
        card.filmMat.opacity = targetOpacity;
        card.rimMat.opacity = Math.max(0.2, targetOpacity * 0.8);

        // Active video optimization: Play video for cards in focal spotlight
        const isFocal = Math.abs(delta) < 1.15 || blend > 0.4;
        if (isFocal && card.video.paused) {
          card.video.play().catch(() => {});
        } else if (!isFocal && !card.video.paused && Math.abs(delta) > 2.2) {
          card.video.pause();
        }

        // Texture upload
        if (card.videoTex.image && (card.videoTex.image as HTMLVideoElement).readyState >= 2) {
          card.videoTex.needsUpdate = true;
        }
      });

      renderer.render(scene, camera);
    };

    tick();

    // ========================================================================
    // 8. RESIZE HANDLER
    // ========================================================================
    const handleResize = () => {
      width = pinContainer.clientWidth || window.innerWidth;
      height = pinContainer.clientHeight || window.innerHeight;
      isMobile = window.innerWidth < 768;
      isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // ========================================================================
    // 9. CLEANUP
    // ========================================================================
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
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

      casingGeo.dispose();
      screenGeo.dispose();
      rimGeo.dispose();
      notchGeo.dispose();
      casingMat.dispose();
      notchMat.dispose();

      cardItems.forEach((c) => {
        c.filmMat.dispose();
        c.rimMat.dispose();
      });

      renderer.dispose();
    };
  }, []);

  return (
    <section
      id="brandshoots-core"
      ref={sectionRef}
      className="relative w-full bg-[#04060A] text-white overflow-hidden select-none"
    >
      {/* 100vw × 100vh Pinned Viewport Container */}
      <div
        ref={pinContainerRef}
        className="relative w-full h-[100dvh] min-h-[100dvh] flex items-center justify-center overflow-hidden"
      >
        {/* ======================================================== */}
        {/* 1. ATMOSPHERIC STUDIO LIGHTING & BACKGROUND MESH         */}
        {/* Eradicates "plain dark" with deep blue luminous pockets  */}
        {/* ======================================================== */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {/* Central Volumetric Studio Aura */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1200px] h-[75vh] max-h-[750px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.16) 0%, rgba(10, 25, 75, 0.32) 48%, transparent 75%)',
              filter: 'blur(75px)',
            }}
          />

          {/* Left Wing Ambient Light Pocket (Fills Blank Left Area) */}
          <div
            className="absolute top-1/2 left-[5%] -translate-y-1/2 w-[45vw] max-w-[650px] h-[60vh] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 30% 50%, rgba(0, 140, 255, 0.12) 0%, transparent 65%)',
              filter: 'blur(80px)',
            }}
          />

          {/* Right Wing Ambient Light Pocket (Fills Blank Right Area) */}
          <div
            className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[45vw] max-w-[650px] h-[60vh] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 70% 50%, rgba(0, 140, 255, 0.12) 0%, transparent 65%)',
              filter: 'blur(80px)',
            }}
          />

          {/* Polished Dark Concrete Studio Floor Reflection at Bottom */}
          <div
            className="absolute bottom-0 inset-x-0 h-[36vh] pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(0, 140, 255, 0.08) 0%, rgba(4, 6, 10, 0.6) 45%, transparent 100%)',
            }}
          />

          {/* Subtle Studio Geometry Grid */}
          <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:5rem_5rem]" />
        </div>

        {/* ======================================================== */}
        {/* 2. KINETIC "TRAIN OF LETTERS" BACKGROUND STREAMS         */}
        {/* Fills negative space with high-velocity editorial typography */}
        {/* ======================================================== */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none flex flex-col justify-between py-24 select-none opacity-85"
          style={{ zIndex: 2 }}
        >
          {/* Monumental Hollow Outline Ghost Watermark in Deep Center */}
          <div
            ref={ghostWatermarkRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none transition-transform duration-700 ease-out will-change-transform"
          >
            <span
              className="font-display text-[15vw] sm:text-[17vw] font-black uppercase tracking-[-0.04em] block select-none pointer-events-none opacity-[0.04] text-white"
              style={{
                WebkitTextStroke: '1.5px rgba(255,255,255,0.4)',
                color: 'transparent',
              }}
            >
              BRANDSHOOTS
            </span>
          </div>

          {/* Upper Kinetic Typographic Train (Flowing Leftward) */}
          <div
            ref={trainTrack1Ref}
            className="relative w-full overflow-hidden mt-6 pointer-events-none"
            style={{
              maskImage:
                'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            }}
          >
            <div className="inline-flex whitespace-nowrap animate-marquee font-mono text-[11px] sm:text-xs tracking-[0.45em] uppercase text-white/20 font-semibold will-change-transform">
              <span>BRANDSHOOTS STUDIO // CINEMATIC PRODUCTION // CRAFT WITH INTENT // VISUAL STORIES // 9:16 VERTICAL CINEMA // HIGH VELOCITY // ARCHIVE 01-06 //&nbsp;</span>
              <span>BRANDSHOOTS STUDIO // CINEMATIC PRODUCTION // CRAFT WITH INTENT // VISUAL STORIES // 9:16 VERTICAL CINEMA // HIGH VELOCITY // ARCHIVE 01-06 //&nbsp;</span>
              <span>BRANDSHOOTS STUDIO // CINEMATIC PRODUCTION // CRAFT WITH INTENT // VISUAL STORIES // 9:16 VERTICAL CINEMA // HIGH VELOCITY // ARCHIVE 01-06 //&nbsp;</span>
            </div>
          </div>

          {/* Lower Kinetic Typographic Train (Flowing Rightward) */}
          <div
            ref={trainTrack2Ref}
            className="relative w-full overflow-hidden mb-24 sm:mb-28 pointer-events-none"
            style={{
              maskImage:
                'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            }}
          >
            <div className="inline-flex whitespace-nowrap animate-marquee-reverse font-sans text-[11px] sm:text-xs tracking-[0.4em] uppercase text-[#008CFF]/25 font-bold will-change-transform">
              <span>CREATE WITH INTENT • SHOOT WITH PURPOSE • GROW DIGITAL PRESENCE • FROM CONCEPT TO FINAL CUT • DIRECTED FOR CULTURE • ENTERPRISE SCALE •&nbsp;</span>
              <span>CREATE WITH INTENT • SHOOT WITH PURPOSE • GROW DIGITAL PRESENCE • FROM CONCEPT TO FINAL CUT • DIRECTED FOR CULTURE • ENTERPRISE SCALE •&nbsp;</span>
              <span>CREATE WITH INTENT • SHOOT WITH PURPOSE • GROW DIGITAL PRESENCE • FROM CONCEPT TO FINAL CUT • DIRECTED FOR CULTURE • ENTERPRISE SCALE •&nbsp;</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. TOP: CHAPTER HUD & PROGRESSION BAR (Z-INDEX: 60)      */}
        {/* ======================================================== */}
        <div
          className="absolute top-20 sm:top-10 inset-x-0 flex items-center justify-between px-5 sm:px-12 pointer-events-none"
          style={{ zIndex: 60 }}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_10px_#008CFF] animate-pulse" />
            <span
              ref={activeChapterLabelRef}
              className="font-mono text-[10px] sm:text-xs tracking-[0.32em] uppercase text-[#008CFF] font-semibold"
            >
              <span className="hidden sm:inline">THE BRANDSHOOTS CORE // 3D REEL INSTALLATION</span>
              <span className="sm:hidden">3D REELS // ARCHIVE</span>
            </span>
          </div>

          {/* Chapter indicator pills */}
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-white/40">
            <span ref={pill1Ref} className="transition-all duration-300">01</span>
            <span>/</span>
            <span ref={pill2Ref} className="transition-all duration-300">02</span>
            <span>/</span>
            <span ref={pill3Ref} className="transition-all duration-300">03</span>
            <span>/</span>
            <span ref={pill4Ref} className="transition-all duration-300">04</span>
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
        {/* 4. THREE.JS WEBGL CANVAS (Hero 3D Cards Installation) (Z: 10) */}
        {/* ======================================================== */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none"
          style={{ zIndex: 10 }}
        />

        {/* ======================================================== */}
        {/* 5. HERO ANCHOR: OFFICIAL BRANDSHOOTS LOGO (Z-INDEX: 30)  */}
        {/* Visible in initial intro, hidden in Ch 1-3, climax in Ch 4 */}
        {/* ======================================================== */}
        <div
          ref={logoWrapperRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none px-6 text-center will-change-transform"
          style={{ zIndex: 30 }}
        >
          {/* Volumetric Electric Blue Back-Aura */}
          <div
            ref={logoAuraRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[480px] lg:w-[580px] h-[160px] sm:h-[220px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.32) 0%, rgba(11, 16, 78, 0.16) 55%, transparent 75%)',
              filter: 'blur(35px)',
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
        {/* 6. CHAPTER 04 CLIMAX CREED (Z-INDEX: 40)                 */}
        {/* Centered below the logo in open corridor between wings   */}
        {/* ======================================================== */}
        <div
          ref={chapter4Ref}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-10 sm:translate-y-14 flex flex-col items-center text-center will-change-transform opacity-0 pointer-events-none px-4 w-full max-w-xl"
          style={{ zIndex: 40 }}
        >
          <div className="relative w-full px-6 py-5 rounded-2xl bg-[#05070B]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight mb-2.5">
              WE CREATE STORIES THAT <span className="text-[#008CFF]">MOVE PEOPLE.</span>
            </h3>

            <div className="flex items-center justify-center gap-3 font-mono text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#008CFF] font-bold mt-1.5">
              <span>CREATE</span>
              <span className="text-white/40">•</span>
              <span>SHOOT</span>
              <span className="text-white/40">•</span>
              <span>GROW</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 7. LOWER EDITORIAL DOCK: CHAPTERS 01, 02, 03 (Z-INDEX: 50)*/}
        {/* Anchored at bottom of screen so 3D cards remain 100% visible */}
        {/* ======================================================== */}
        <div
          className="absolute bottom-5 sm:bottom-7 md:bottom-9 inset-x-0 flex items-center justify-center px-4 sm:px-6 pointer-events-none"
          style={{ zIndex: 50 }}
        >
          <div className="relative w-full max-w-xl min-h-[130px] sm:min-h-[140px] flex items-center justify-center">

            {/* CHAPTER 01: ABOUT BRANDSHOOTS */}
            <div
              ref={chapter1Ref}
              className="absolute inset-x-0 mx-auto flex flex-col items-center text-center will-change-transform opacity-0 pointer-events-none"
              style={{ zIndex: 50 }}
            >
              <div className="relative w-full px-5 py-4 sm:px-7 sm:py-5 rounded-2xl bg-[#05070B]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  <span>WE CREATE STORIES. </span>
                  <span className="text-[#008CFF]">WE MAKE THEM MOVE.</span>
                </h2>

                <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-light drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] max-w-lg mx-auto">
                  BRANDSHOOTS is a creative production studio turning ideas into films,
                  campaigns and visual experiences. We bring together storytelling,
                  cinematography and creative direction to create work that connects
                  brands with people.
                </p>
              </div>
            </div>

            {/* CHAPTER 02: PRODUCTION CRAFT */}
            <div
              ref={chapter2Ref}
              className="absolute inset-x-0 mx-auto flex flex-col items-center text-center will-change-transform opacity-0 pointer-events-none"
              style={{ zIndex: 50 }}
            >
              <div className="relative w-full px-5 py-4 sm:px-7 sm:py-5 rounded-2xl bg-[#05070B]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  <span>FROM FIRST FRAME TO </span>
                  <span className="text-[#008CFF]">FINAL CUT.</span>
                </h2>

                <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-light drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] max-w-lg mx-auto">
                  From concept and pre-production to filming, editing and final delivery,
                  BRANDSHOOTS brings every stage of production together to create films,
                  campaigns and visual content built around the story.
                </p>
              </div>
            </div>

            {/* CHAPTER 03: BRAND IMPACT */}
            <div
              ref={chapter3Ref}
              className="absolute inset-x-0 mx-auto flex flex-col items-center text-center will-change-transform opacity-0 pointer-events-none"
              style={{ zIndex: 50 }}
            >
              <div className="relative w-full px-5 py-4 sm:px-7 sm:py-5 rounded-2xl bg-[#05070B]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  <span>DIFFERENT BRANDS. </span>
                  <span className="text-[#008CFF]">ONE CREATIVE VISION.</span>
                </h2>

                <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-light drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] max-w-lg mx-auto">
                  From industrial and corporate brands to retail, hospitality and lifestyle,
                  BRANDSHOOTS creates visual work shaped around each brand, its audience and
                  its story. Every project begins with understanding what makes the brand
                  worth watching.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Embedded High-Performance Marquee Keyframes */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        @keyframes marqueeScrollRev {
          0% { transform: translate3d(-33.333%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-marquee {
          animation: marqueeScroll 28s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marqueeScrollRev 32s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default BrandShootsCore3D;
