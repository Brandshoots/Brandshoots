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

    const width = pinContainer.clientWidth || window.innerWidth;
    const height = pinContainer.clientHeight || window.innerHeight;
    const isMobile = window.innerWidth < 768;

    // 1. WebGL Renderer with High-Precision Tone Mapping
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

    // 2. Camera Setup (Positioned for depth and spherical clarity)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const initialCameraZ = isMobile ? 9.5 : 8.2;
    camera.position.set(0, 0, initialCameraZ);

    // 3. Cinematic Studio Lighting (Sharp specular highlights, high contrast, zero milky blur)
    const ambientLight = new THREE.AmbientLight(0x080f1e, 0.65);
    scene.add(ambientLight);

    const blueRimLight = new THREE.PointLight(0x008cff, 4.2, 28);
    blueRimLight.position.set(-3.6, -1.8, -2.4);
    scene.add(blueRimLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(4.2, 4.5, 5.5);
    scene.add(keyLight);

    const softFillLight = new THREE.PointLight(0x38bdf8, 1.2, 18);
    softFillLight.position.set(0, -2.5, 3.5);
    scene.add(softFillLight);

    // ========================================================================
    // 4. CENTRAL 3D SPHERE CORE (Sharp, Detailed, Dimensional & Readably Premium)
    // ========================================================================
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    const sphereRadius = isMobile ? 1.05 : 1.35;

    // A. Obsidian Core Sphere with high clearcoat reflection and razor-sharp contrast
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, isMobile ? 48 : 64, isMobile ? 48 : 64);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x05070e,
      emissive: 0x001024,
      emissiveIntensity: 0.12, // controlled low emissive: crisp object, no foggy blur blob
      roughness: 0.14,
      metalness: 0.94,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
    });
    const coreSphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereGroup.add(coreSphereMesh);

    // B. Geometric Geodesic Outer Lattice (Dimensional Studio Precision)
    const wireGeo = new THREE.IcosahedronGeometry(sphereRadius * 1.025, 2);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x008cff,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
      roughness: 0.25,
      metalness: 0.85,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    sphereGroup.add(wireMesh);

    // C. Razor-Sharp Precision Orbital Gimbal Rings
    const ringGeo1 = new THREE.TorusGeometry(sphereRadius * 1.22, 0.012, 16, 120);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x008cff,
      emissive: 0x008cff,
      emissiveIntensity: 0.35, // crisp specular ring, not blooming
      roughness: 0.18,
      metalness: 0.95,
    });
    const gimbalRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    gimbalRing1.rotation.x = Math.PI / 3.8;
    gimbalRing1.rotation.z = Math.PI / 8;
    sphereGroup.add(gimbalRing1);

    const ringGeo2 = new THREE.TorusGeometry(sphereRadius * 1.35, 0.009, 16, 120);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x008cff,
      emissiveIntensity: 0.28,
      roughness: 0.2,
      metalness: 0.95,
    });
    const gimbalRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    gimbalRing2.rotation.y = Math.PI / 2.8;
    gimbalRing2.rotation.z = -Math.PI / 5;
    sphereGroup.add(gimbalRing2);

    // D. Equatorial Meridian Halo Line
    const meridianGeo = new THREE.TorusGeometry(sphereRadius * 1.015, 0.006, 16, 120);
    const meridianMat = new THREE.MeshBasicMaterial({
      color: 0x008cff,
      transparent: true,
      opacity: 0.5,
    });
    const meridianMesh = new THREE.Mesh(meridianGeo, meridianMat);
    meridianMesh.rotation.x = Math.PI / 2;
    sphereGroup.add(meridianMesh);

    // ========================================================================
    // 5. PHYSICAL 3D 9:16 VIDEO REEL TILES (Orbiting the Core Sphere)
    // ========================================================================
    const framesGroup = new THREE.Group();
    scene.add(framesGroup);

    const textureLoader = new THREE.TextureLoader();
    const activeReels = isMobile ? BRAND_REELS.slice(0, 4) : BRAND_REELS;
    const frames: FrameData[] = [];
    const videoElements: HTMLVideoElement[] = [];
    const videoTextures: THREE.VideoTexture[] = [];

    // Precise 9:16 Aspect Ratio
    const frameW = isMobile ? 1.25 : 1.5;
    const frameH = (frameW * 16) / 9;
    const casingDepth = 0.035;

    const boxCasingGeo = new THREE.BoxGeometry(frameW + 0.05, frameH + 0.05, casingDepth);
    const screenGeo = new THREE.PlaneGeometry(frameW, frameH);
    const rimEdgeGeo = new THREE.EdgesGeometry(screenGeo);

    const casingMat = new THREE.MeshStandardMaterial({
      color: 0x0a0d14,
      roughness: 0.35,
      metalness: 0.85,
    });

    const rimLineMat = new THREE.LineBasicMaterial({
      color: 0x008cff,
      transparent: true,
      opacity: 0.45,
    });

    activeReels.forEach((reel, i) => {
      const frameContainer = new THREE.Group();

      const casingMesh = new THREE.Mesh(boxCasingGeo, casingMat);
      frameContainer.add(casingMesh);

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
        roughness: 0.35,
        metalness: 0.1,
      });

      filmMat.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <map_fragment>',
          `
          #include <map_fragment>
          float gray = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
          gray = pow(gray, 1.15);
          diffuseColor.rgb = vec3(gray * 0.88, gray * 0.90, gray * 0.95);
          `
        );
      };

      video.addEventListener('playing', () => {
        filmMat.map = videoTex;
        filmMat.needsUpdate = true;
      });

      const screenMesh = new THREE.Mesh(screenGeo, filmMat);
      screenMesh.position.z = casingDepth / 2 + 0.002;
      frameContainer.add(screenMesh);

      const rimLine = new THREE.LineSegments(rimEdgeGeo, rimLineMat);
      rimLine.position.z = casingDepth / 2 + 0.003;
      frameContainer.add(rimLine);

      // 3D Spatial Placement surrounding the core sphere
      const count = activeReels.length;
      const angle = (i / count) * Math.PI * 2;
      const radius = isMobile ? 3.4 : 5.0;
      const zOffset = ((i % 3) - 1) * (isMobile ? 0.85 : 1.4);

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

    // Touch/scroll kick to guarantee autoplay
    const wakeVideos = () => {
      videoElements.forEach((v) => {
        if (v.paused) v.play().catch(() => {});
      });
    };
    window.addEventListener('scroll', wakeVideos, { passive: true, once: true });
    window.addEventListener('touchstart', wakeVideos, { passive: true, once: true });
    window.addEventListener('click', wakeVideos, { passive: true, once: true });

    // ========================================================================
    // 6. SCROLL STATE TRACKING & GSAP SCROLLTRIGGER BINDING
    // ========================================================================
    const scrollState = {
      progress: 0,
      cameraZ: initialCameraZ,
      cameraY: 0,
      cameraX: 0,
      orbitRotation: 0,
      sphereRotY: 0,
      sphereRotX: 0,
      sphereScale: 1.0,
      lightIntensity: 1.0,
      lightPosX: 3.5,
      lightPosY: 4.5,
    };

    // Velocity tracking for scroll-reactive physics
    let scrollVelocity = 0;
    let velocityMomentum = 0;

    // Pointer & Touch Micro-Interaction Physics
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
    // 7. GSAP SCROLLTRIGGER PINNED TIMELINE (Scroll is Primary Driver)
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
            const v = self.getVelocity ? self.getVelocity() : 0;
            scrollVelocity = Math.max(-2500, Math.min(2500, v));
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      // Continuous 3D Core Sphere & Reels Rotation driven strictly by scroll
      tl.to(
        scrollState,
        {
          orbitRotation: Math.PI * 1.8,
          sphereRotY: Math.PI * 2.2,
          sphereRotX: 0.45,
          lightIntensity: 1.6,
          lightPosX: 5.5,
          lightPosY: 3.5,
          duration: 4.0,
          ease: 'none',
        },
        0
      );

      // Intro Hint fades away on initial scroll
      tl.to(
        introHintRef.current,
        { opacity: 0, y: -20, duration: 0.2, ease: 'power2.in' },
        0.05
      );

      // Subtle vignette (NO 28px blur! Sphere remains razor-sharp)
      tl.to(
        bgVignetteRef.current,
        { opacity: 0.6, duration: 0.35, ease: 'power2.out' },
        0.15
      );

      // Logo floats to top header anchor (fades out on mobile during chapters 1-3 for unobstructed reading)
      tl.to(
        logoWrapperRef.current,
        {
          y: isMobile ? -230 : -210,
          scale: isMobile ? 0.45 : 0.56,
          opacity: isMobile ? 0 : 0.85,
          duration: 0.35,
          ease: 'power2.out',
        },
        0.15
      );

      // -------------------------------------------------------------
      // CHAPTER 01: ABOUT BRANDSHOOTS // WHO WE ARE
      // -------------------------------------------------------------
      // 3D environment responds: Camera shifts right, giving space to text
      tl.to(
        scrollState,
        {
          cameraZ: isMobile ? 9.2 : 7.6,
          cameraY: 0.12,
          cameraX: isMobile ? 0 : -0.28,
          sphereScale: 0.9,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        0.15
      );

      tl.fromTo(
        chapter1Ref.current,
        { autoAlpha: 0, y: 35, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1.0, duration: 0.35, ease: 'power2.out' },
        0.18
      );

      // Staggered line reveal for Chapter 1
      tl.fromTo(
        '.ch1-line',
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.35, stagger: 0.08, ease: 'power3.out' },
        0.2
      );

      tl.to(pill1Ref.current, { color: '#008CFF', scale: 1.25, duration: 0.15 }, 0.18);
      if (activeChapterLabelRef.current) {
        tl.call(() => {
          if (activeChapterLabelRef.current) activeChapterLabelRef.current.innerText = '1';
        }, [], 0.18);
      }

      // Exit Chapter 1
      tl.to(
        chapter1Ref.current,
        { autoAlpha: 0, y: -30, scale: 1.02, duration: 0.25, ease: 'power2.in' },
        1.0
      );
      tl.to(pill1Ref.current, { color: 'rgba(255,255,255,0.35)', scale: 1.0, duration: 0.15 }, 1.0);

      // -------------------------------------------------------------
      // CHAPTER 02: PRODUCTION CRAFT // 9:16 SOCIAL VELOCITY
      // -------------------------------------------------------------
      // 3D environment responds: Camera shifts left, giving space to text on right
      tl.to(
        scrollState,
        {
          cameraZ: isMobile ? 9.4 : 7.8,
          cameraY: -0.15,
          cameraX: isMobile ? 0 : 0.28,
          sphereScale: 0.95,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        1.15
      );

      tl.fromTo(
        chapter2Ref.current,
        { autoAlpha: 0, y: 35, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1.0, duration: 0.35, ease: 'power2.out' },
        1.15
      );

      tl.fromTo(
        '.ch2-line',
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.35, stagger: 0.08, ease: 'power3.out' },
        1.18
      );

      tl.to(pill2Ref.current, { color: '#008CFF', scale: 1.25, duration: 0.15 }, 1.15);
      if (activeChapterLabelRef.current) {
        tl.call(() => {
          if (activeChapterLabelRef.current) activeChapterLabelRef.current.innerText = '2';
        }, [], 1.15);
      }

      // Exit Chapter 2
      tl.to(
        chapter2Ref.current,
        { autoAlpha: 0, y: -30, scale: 1.02, duration: 0.25, ease: 'power2.in' },
        2.0
      );
      tl.to(pill2Ref.current, { color: 'rgba(255,255,255,0.35)', scale: 1.0, duration: 0.15 }, 2.0);

      // -------------------------------------------------------------
      // CHAPTER 03: ENTERPRISE IMPACT // PROVEN SCALE
      // -------------------------------------------------------------
      // 3D environment responds: Camera glides right and elevates
      tl.to(
        scrollState,
        {
          cameraZ: isMobile ? 9.1 : 7.6,
          cameraY: 0.14,
          cameraX: isMobile ? 0 : -0.22,
          sphereScale: 0.92,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        2.15
      );

      tl.fromTo(
        chapter3Ref.current,
        { autoAlpha: 0, y: 35, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1.0, duration: 0.35, ease: 'power2.out' },
        2.15
      );

      tl.fromTo(
        '.ch3-line',
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.35, stagger: 0.08, ease: 'power3.out' },
        2.18
      );

      tl.to(pill3Ref.current, { color: '#008CFF', scale: 1.25, duration: 0.15 }, 2.15);
      if (activeChapterLabelRef.current) {
        tl.call(() => {
          if (activeChapterLabelRef.current) activeChapterLabelRef.current.innerText = '3';
        }, [], 2.15);
      }

      // Exit Chapter 3
      tl.to(
        chapter3Ref.current,
        { autoAlpha: 0, y: -30, scale: 1.02, duration: 0.25, ease: 'power2.in' },
        3.0
      );
      tl.to(pill3Ref.current, { color: 'rgba(255,255,255,0.35)', scale: 1.0, duration: 0.15 }, 3.0);

      // -------------------------------------------------------------
      // CHAPTER 04: THE CORE // LOGO & MANIFESTO CLIMAX
      // -------------------------------------------------------------
      // 3D Sphere scales up radiantly as the climactic brand anchor
      tl.to(
        scrollState,
        {
          cameraZ: initialCameraZ,
          cameraY: 0,
          cameraX: 0,
          sphereScale: 1.16,
          duration: 0.6,
          ease: 'power2.out',
        },
        3.15
      );

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
          scale: 1.35,
          opacity: 0.9,
          duration: 0.45,
          ease: 'power2.out',
        },
        3.15
      );

      tl.fromTo(
        chapter4Ref.current,
        { autoAlpha: 0, y: 35, scale: 0.96 },
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

    // ========================================================================
    // 8. 60FPS SMOOTH THREE.JS RENDER LOOP (Physical Damping & Micro-Parallax)
    // ========================================================================
    let animId: number;
    let currentOrbit = 0;
    let currentSphereRotY = 0;
    let currentSphereRotX = 0;
    let currentCameraZ = initialCameraZ;
    let currentCameraY = 0;
    let currentCameraX = 0;
    let currentSphereScale = 1.0;

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const time = performance.now() * 0.001;

      // Scroll velocity momentum decay & interpolation
      velocityMomentum += (scrollVelocity * 0.00018 - velocityMomentum) * 0.12;
      scrollVelocity *= 0.88;

      // Smooth interpolation of scroll-driven parameters
      currentOrbit += (scrollState.orbitRotation - currentOrbit) * 0.08;
      currentSphereRotY += (scrollState.sphereRotY - currentSphereRotY) * 0.08;
      currentSphereRotX += (scrollState.sphereRotX - currentSphereRotX) * 0.08;
      currentCameraZ += (scrollState.cameraZ - currentCameraZ) * 0.06;
      currentCameraY += (scrollState.cameraY - currentCameraY) * 0.06;
      currentCameraX += (scrollState.cameraX - currentCameraX) * 0.06;
      currentSphereScale += (scrollState.sphereScale - currentSphereScale) * 0.08;

      // Pointer / touch micro-parallax interpolation
      currentPointerX += (pointerX - currentPointerX) * 0.05;
      currentPointerY += (pointerY - currentPointerY) * 0.05;

      // A. Sphere rotation & physical orientation (Driven primarily by scroll + velocity + subtle mouse follow)
      sphereGroup.rotation.y = currentSphereRotY + currentPointerX * 0.32 + velocityMomentum;
      sphereGroup.rotation.x = currentSphereRotX - currentPointerY * 0.22;
      sphereGroup.position.x = currentPointerX * 0.16;
      sphereGroup.position.y = -currentPointerY * 0.12;
      sphereGroup.scale.setScalar(currentSphereScale);

      // Gimbal rings counter-rotate subtly for dimensional mechanical life
      gimbalRing1.rotation.z = currentSphereRotY * 0.45;
      gimbalRing2.rotation.x = -currentSphereRotY * 0.35;

      // B. Camera positioning (Scroll + micro-parallax)
      camera.position.z = currentCameraZ;
      camera.position.y = currentCameraY - currentPointerY * 0.15;
      camera.position.x = currentCameraX + currentPointerX * 0.2;
      camera.lookAt(0, 0, 0);

      // C. Lighting shifts dynamically
      keyLight.position.set(
        scrollState.lightPosX + currentPointerX * 1.2,
        scrollState.lightPosY - currentPointerY * 1.2,
        6.0
      );
      blueRimLight.intensity = scrollState.lightIntensity * (1 + Math.abs(currentPointerX) * 0.2);

      // D. Surrounding 9:16 Video Reels orbit group
      framesGroup.rotation.y = currentOrbit + currentPointerX * 0.12;
      framesGroup.rotation.x = Math.sin(time * 0.35) * 0.015 - currentPointerY * 0.08;

      frames.forEach((f, idx) => {
        const floatY = Math.sin(time * 1.1 + idx * 1.4) * 0.05;
        f.mesh.position.y = f.initialY + floatY;
      });

      // Video textures frame upload
      videoTextures.forEach((vt) => {
        if (vt.image && (vt.image as HTMLVideoElement).readyState >= 2) {
          vt.needsUpdate = true;
        }
      });

      renderer.render(scene, camera);
    };

    tick();

    // 9. Resize Handler
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

      sphereGeo.dispose();
      wireGeo.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      meridianGeo.dispose();
      sphereMat.dispose();
      wireMat.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      meridianMat.dispose();

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
          className="absolute top-20 sm:top-10 inset-x-0 flex items-center justify-between px-5 sm:px-12 pointer-events-none"
          style={{ zIndex: 60 }}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_10px_#008CFF] animate-pulse" />
            <span
              ref={activeChapterLabelRef}
              className="font-mono text-[10px] sm:text-xs tracking-[0.32em] uppercase text-[#008CFF] font-semibold"
            >
              <span className="hidden sm:inline">THE BRANDSHOOTS CORE // 3D REEL UNIVERSE</span>
              <span className="sm:hidden">3D CORE // ARCHIVE</span>
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
        {/* THREE.JS WEBGL CANVAS (Sharp 3D Sphere & 9:16 Reels) (Z: 10) */}
        {/* ======================================================== */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none"
          style={{ zIndex: 10 }}
        />

        {/* ======================================================== */}
        {/* SUBTLE VIGNETTE (Zero 28px Blur -> Sphere stays sharp) (Z: 20) */}
        {/* ======================================================== */}
        <div
          ref={bgVignetteRef}
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 will-change-opacity"
          style={{
            zIndex: 20,
            background: 'radial-gradient(circle at 50% 50%, rgba(5,7,11,0.12) 0%, rgba(5,7,11,0.6) 88%)',
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
          {/* Volumetric Electric Blue Back-Aura (clean subtle ambient falloff, no heavy blur) */}
          <div
            ref={logoAuraRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[460px] lg:w-[540px] h-[160px] sm:h-[220px] rounded-full pointer-events-none opacity-50"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.22) 0%, rgba(11, 16, 78, 0.1) 50%, transparent 75%)',
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
        {/* CHAPTER DOSSIER CARDS (Z-INDEX: 50 -> CRISP & LEGIBLE)   */}
        {/* ======================================================== */}
        <div
          className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 lg:px-16 pointer-events-none"
          style={{ zIndex: 50 }}
        >
          <div className="relative w-full max-w-5xl min-h-[340px] sm:min-h-[400px] flex items-center justify-center">

            {/* CHAPTER 01: ABOUT BRANDSHOOTS */}
            <div
              ref={chapter1Ref}
              className="absolute inset-x-0 mx-auto flex flex-col items-center lg:items-start text-center lg:text-left will-change-transform opacity-0 pointer-events-none"
              style={{ zIndex: 50 }}
            >
              <div className="relative max-w-xl px-6 py-6 sm:px-8 sm:py-8 rounded-2xl bg-[#05070B]/85 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] mx-3 lg:mr-auto">
                <div className="inline-flex items-center gap-2.5 font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
                  <span>CHAPTER 01 // WHO WE ARE</span>
                </div>
                <h2 className="font-display font-black uppercase tracking-[-0.035em] text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl leading-[0.95] text-white mb-3 sm:mb-4">
                  <span className="overflow-hidden block py-0.5">
                    <span className="ch1-line inline-block will-change-transform">WE CREATE STORIES.</span>
                  </span>
                  <span className="overflow-hidden block py-0.5">
                    <span className="ch1-line inline-block will-change-transform text-[#008CFF]">WE MAKE THEM MOVE.</span>
                  </span>
                </h2>
                <p className="font-sans text-sm sm:text-base md:text-[17px] text-white/80 leading-[1.65] font-normal">
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
              className="absolute inset-x-0 mx-auto flex flex-col items-center lg:items-end text-center lg:text-right will-change-transform opacity-0 pointer-events-none"
              style={{ zIndex: 50 }}
            >
              <div className="relative max-w-xl px-6 py-6 sm:px-8 sm:py-8 rounded-2xl bg-[#05070B]/85 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] mx-3 lg:ml-auto">
                <div className="inline-flex items-center gap-2.5 font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
                  <span>CHAPTER 02 // PRODUCTION CRAFT</span>
                </div>
                <h2 className="font-display font-black uppercase tracking-[-0.035em] text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl leading-[0.95] text-white mb-3 sm:mb-4">
                  <span className="overflow-hidden block py-0.5">
                    <span className="ch2-line inline-block will-change-transform">FROM FIRST FRAME TO</span>
                  </span>
                  <span className="overflow-hidden block py-0.5">
                    <span className="ch2-line inline-block will-change-transform text-[#008CFF]">FINAL CUT.</span>
                  </span>
                </h2>
                <p className="font-sans text-sm sm:text-base md:text-[17px] text-white/80 leading-[1.65] font-normal">
                  From concept and pre-production to filming, editing and final delivery,
                  BRANDSHOOTS brings every stage of production together to create films,
                  campaigns and visual content built around the story.
                </p>
              </div>
            </div>

            {/* CHAPTER 03: BRAND IMPACT */}
            <div
              ref={chapter3Ref}
              className="absolute inset-x-0 mx-auto flex flex-col items-center lg:items-start text-center lg:text-left will-change-transform opacity-0 pointer-events-none"
              style={{ zIndex: 50 }}
            >
              <div className="relative max-w-xl px-6 py-6 sm:px-8 sm:py-8 rounded-2xl bg-[#05070B]/85 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] mx-3 lg:mr-auto">
                <div className="inline-flex items-center gap-2.5 font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
                  <span>CHAPTER 03 // ENTERPRISE IMPACT</span>
                </div>
                <h2 className="font-display font-black uppercase tracking-[-0.035em] text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl leading-[0.95] text-white mb-3 sm:mb-4">
                  <span className="overflow-hidden block py-0.5">
                    <span className="ch3-line inline-block will-change-transform">DIFFERENT BRANDS.</span>
                  </span>
                  <span className="overflow-hidden block py-0.5">
                    <span className="ch3-line inline-block will-change-transform text-[#008CFF]">ONE CREATIVE VISION.</span>
                  </span>
                </h2>
                <p className="font-sans text-sm sm:text-base md:text-[17px] text-white/80 leading-[1.65] font-normal">
                  From industrial and corporate brands to retail, hospitality and lifestyle,
                  BRANDSHOOTS creates visual work shaped around each brand, its audience and
                  its story. Every project begins with understanding what makes the brand
                  worth watching.
                </p>
              </div>
            </div>

            {/* CHAPTER 04: THE BRANDSHOOTS CREED */}
            <div
              ref={chapter4Ref}
              className="absolute inset-x-0 mx-auto flex flex-col items-center text-center will-change-transform opacity-0 pointer-events-none mt-20 sm:mt-28"
              style={{ zIndex: 50 }}
            >
              <div className="relative max-w-2xl px-6 py-6 sm:px-8 sm:py-8 rounded-2xl bg-[#05070B]/85 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] mx-3">
                <div className="inline-flex items-center gap-2.5 font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
                  <span>CHAPTER 04 // THE CORE</span>
                </div>
                <h3 className="font-display font-black uppercase tracking-[-0.035em] text-2xl xs:text-3xl sm:text-4xl md:text-5xl leading-[0.95] text-white mb-3">
                  WE CREATE STORIES THAT{' '}
                  <span className="text-[#008CFF]">MOVE PEOPLE.</span>
                </h3>

                <div className="flex items-center justify-center gap-3 font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#008CFF] font-bold mt-3">
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

      </div>
    </section>
  );
};

export default BrandShootsCore3D;
