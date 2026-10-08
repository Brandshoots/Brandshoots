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
  rimLine: THREE.LineSegments;
  filmMat: THREE.MeshStandardMaterial;
  rimMat: THREE.LineBasicMaterial;
  video: HTMLVideoElement;
  videoTex: THREE.VideoTexture;
  index: number;
}

export const BrandShootsCore3D: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const logoAuraRef = useRef<HTMLDivElement>(null);
  const bgVignetteRef = useRef<HTMLDivElement>(null);
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
    renderer.toneMappingExposure = 1.15;

    // ========================================================================
    // 2. CAMERA SETUP (Elevated viewport framed above the lower text dock)
    // ========================================================================
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const baseCameraZ = isMobile ? 8.6 : isTablet ? 7.8 : 7.2;
    camera.position.set(0, 0.25, baseCameraZ);

    // ========================================================================
    // 3. CINEMATIC STUDIO LIGHTING
    // ========================================================================
    const ambientLight = new THREE.AmbientLight(0x0c1322, 2.4);
    scene.add(ambientLight);

    const blueRimLight = new THREE.PointLight(0x008cff, 4.5, 30);
    blueRimLight.position.set(0, 0.5, -2.5);
    scene.add(blueRimLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(3.5, 4.5, 6.0);
    scene.add(keyLight);

    const travelingSpot = new THREE.PointLight(0x38bdf8, 2.0, 18);
    travelingSpot.position.set(0, 0.6, 3.0);
    scene.add(travelingSpot);

    // ========================================================================
    // 4. SPATIAL 3D CARD INSTALLATION (Hero Visual Experience)
    // ========================================================================
    const cardsRootGroup = new THREE.Group();
    scene.add(cardsRootGroup);

    const textureLoader = new THREE.TextureLoader();
    const cardItems: CardMeshItem[] = [];
    const videoElements: HTMLVideoElement[] = [];
    const videoTextures: THREE.VideoTexture[] = [];

    // Precise 9:16 Aspect Ratio (Smartphone / Vertical Cinema Reel)
    const frameW = isMobile ? 1.35 : isTablet ? 1.48 : 1.58;
    const frameH = (frameW * 16) / 9;
    const casingDepth = 0.04;

    // Shared Geometries
    const boxCasingGeo = new THREE.BoxGeometry(frameW + 0.05, frameH + 0.05, casingDepth);
    const screenGeo = new THREE.PlaneGeometry(frameW, frameH);
    const rimEdgeGeo = new THREE.EdgesGeometry(screenGeo);

    // Shared obsidian brushed titanium casing material
    const casingMat = new THREE.MeshStandardMaterial({
      color: 0x080c14,
      roughness: 0.32,
      metalness: 0.88,
    });

    BRAND_REELS.forEach((reel, i) => {
      const cardGroup = new THREE.Group();

      // Physical 3D chassis
      const casingMesh = new THREE.Mesh(boxCasingGeo, casingMat);
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
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 1.0,
      });

      video.addEventListener('playing', () => {
        filmMat.map = videoTex;
        filmMat.needsUpdate = true;
      });

      const screenMesh = new THREE.Mesh(screenGeo, filmMat);
      screenMesh.position.z = casingDepth / 2 + 0.002;
      cardGroup.add(screenMesh);

      // Signature razor-sharp 1px electric blue rim line
      const rimMat = new THREE.LineBasicMaterial({
        color: 0x008cff,
        transparent: true,
        opacity: 0.6,
      });
      const rimLine = new THREE.LineSegments(rimEdgeGeo, rimMat);
      rimLine.position.z = casingDepth / 2 + 0.003;
      cardGroup.add(rimLine);

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
          },
        },
      });

      // ----------------------------------------------------------------------
      // PHASE 0 (0.00 -> 0.20): INITIAL ENTRANCE FROM DEEP Z-SPACE
      // ----------------------------------------------------------------------
      // Cards glide forward from the deep background toward camera
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

      // Logo fades out so it NEVER collides with cards during Chapters 1, 2, 3
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

      // Subtle atmospheric vignette
      tl.to(
        bgVignetteRef.current,
        { opacity: 0.65, duration: 0.4, ease: 'power2.out' },
        0.1
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
      // Cards part symmetrically to the wings, opening the center stage
      tl.to(
        scrollState,
        {
          climaxSpread: 1.0,
          cameraZ: baseCameraZ + (isMobile ? 0.3 : 0.5),
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
          y: isMobile ? -85 : -105,
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
    // 7. 60FPS THREE.JS RENDER LOOP (Buttery Inertial Damping & 3D Spatial Arc)
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
      // CAMERA POSITION (Framed above the lower editorial dock)
      // ----------------------------------------------------------------------
      camera.position.z = currentCameraZ;
      camera.position.x = currentCameraX + currentPointerX * (isMobile ? 0.08 : 0.22);
      camera.position.y = currentCameraY - currentPointerY * (isMobile ? 0.06 : 0.16);
      camera.lookAt(0, scrollState.cardsElevationY * 0.85, 0);

      // Lighting tracking
      travelingSpot.position.x = currentPointerX * 1.5;
      travelingSpot.position.y = scrollState.cardsElevationY + 0.4;

      // ----------------------------------------------------------------------
      // 3D SPATIAL CURVED CARDS POSITIONING
      // ----------------------------------------------------------------------
      const curveRx = isMobile ? 3.0 : isTablet ? 4.5 : 5.4;
      const curveRz = isMobile ? 4.0 : isTablet ? 5.4 : 6.2;
      const angleStep = isMobile ? 0.52 : 0.46;

      cardItems.forEach((card) => {
        const i = card.index;
        const delta = i - currentCardProgress;

        // A. Carousel State (Curved Spatial Arc)
        const theta = delta * angleStep;
        const carouselX = Math.sin(theta) * curveRx;
        const carouselZ = -(1 - Math.cos(theta)) * curveRz + currentEntranceZ;
        const carouselY = scrollState.cardsElevationY - Math.min(0.9, delta * delta * 0.035);
        const carouselRotY = -theta * 0.85;
        const carouselRotX = currentPointerY * 0.04;
        const carouselRotZ = -delta * 0.02;
        const carouselScale = Math.max(0.44, 1.0 - 0.15 * Math.min(3.5, Math.abs(delta)));
        const carouselOpacity = Math.max(0.18, 1.0 - 0.26 * Math.min(3.5, Math.abs(delta)));

        // B. Wings Formation State (Chapter 04 Climax)
        const isLeftWing = i < 3;
        const wingRank = isLeftWing ? 2 - i : i - 3; // 0, 1, 2 from inner to outer
        const wingDir = isLeftWing ? -1 : 1;
        const wingX = wingDir * (isMobile ? 1.8 + wingRank * 1.0 : 2.5 + wingRank * 1.35);
        const wingZ = -0.6 - wingRank * 1.1;
        const wingY = scrollState.cardsElevationY + 0.05 - wingRank * 0.12;
        const wingRotY = -wingDir * (0.35 + wingRank * 0.12);
        const wingScale = 0.88 - wingRank * 0.14;
        const wingOpacity = 0.85 - wingRank * 0.2;

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
        card.rimMat.opacity = Math.max(0.15, targetOpacity * 0.7);

        // Active video optimization: Play video for cards in focal spotlight
        const isFocal = Math.abs(delta) < 1.1 || blend > 0.4;
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

      boxCasingGeo.dispose();
      screenGeo.dispose();
      rimEdgeGeo.dispose();
      casingMat.dispose();

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
        {/* THREE.JS WEBGL CANVAS (Hero 3D Cards Installation) (Z: 10) */}
        {/* ======================================================== */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none"
          style={{ zIndex: 10 }}
        />

        {/* ======================================================== */}
        {/* SUBTLE VIGNETTE (Atmospheric Studio Depth) (Z: 20)       */}
        {/* ======================================================== */}
        <div
          ref={bgVignetteRef}
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 will-change-opacity"
          style={{
            zIndex: 20,
            background: 'radial-gradient(circle at 50% 50%, rgba(5,7,11,0.08) 0%, rgba(5,7,11,0.68) 88%)',
          }}
        />

        {/* ======================================================== */}
        {/* HERO ANCHOR: OFFICIAL BRANDSHOOTS LOGO (Z-INDEX: 30)     */}
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
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[460px] lg:w-[560px] h-[160px] sm:h-[220px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.28) 0%, rgba(11, 16, 78, 0.12) 55%, transparent 75%)',
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
        {/* CHAPTER 04 CLIMAX CREED (Z-INDEX: 40)                    */}
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
        {/* LOWER EDITORIAL DOCK: CHAPTERS 01, 02, 03 (Z-INDEX: 50)   */}
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
    </section>
  );
};

export default BrandShootsCore3D;
