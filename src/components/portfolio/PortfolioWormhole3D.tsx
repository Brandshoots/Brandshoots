import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CLIENT_PROJECTS, ClientProject } from '../../data/clientsData';
import { useCMSContent } from '../../lib/cms/useCMSContent';
import { ProjectDetailModal } from './ProjectDetailModal';
import { PortfolioMobileShowcase } from './PortfolioMobileShowcase';
import { ArrowUpRight, X, ChevronRight, Volume2, Volume1, VolumeX, Play, Pause } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * BRANDSHOOTS PORTFOLIO — 3D LUXURY CINEMATIC SHOWCASE
 *
 * Art-directed for pure, neat, high-end aesthetics:
 * - Simple, sleek 9:16 reel frames with rounded corners
 * - Deep, immaculate obsidian studio atmosphere (no clutter, no radar grids)
 * - Subtle, minimal floating cosmic dust motes
 * - Real client reels with instant fluid playback
 * - Monumental editorial typography & glowing BrandShoots electric blue accents
 */

const PANEL_WIDTH = 1.92;
const PANEL_HEIGHT = (1.92 * 16) / 9; // ~3.413 (exact 9:16 vertical ratio)
const CORNER_RADIUS = 0.125; // smooth, minimal border radius
const CHASSIS_PADDING = 0.024;
const CHASSIS_DEPTH = 0.018;
const CAM_Z = 6.8;
const DUST_COUNT = 55; // minimal and unobtrusive

// Helper: Create rounded rectangle shape in Three.js with smooth circular arcs
function createRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  const radius = Math.min(r, w / 2, h / 2);

  shape.moveTo(x + radius, y);
  shape.lineTo(x + w - radius, y);
  shape.absarc(x + w - radius, y + radius, radius, -Math.PI / 2, 0, false);
  shape.lineTo(x + w, y + h - radius);
  shape.absarc(x + w - radius, y + h - radius, radius, 0, Math.PI / 2, false);
  shape.lineTo(x + radius, y + h);
  shape.absarc(x + radius, y + h - radius, radius, Math.PI / 2, Math.PI, false);
  shape.lineTo(x, y + radius);
  shape.absarc(x + radius, y + radius, radius, Math.PI, (3 * Math.PI) / 2, false);

  return shape;
}

// Helper: Create rounded screen geometry with normalized UV coordinates
function createRoundedScreenGeometry(w: number, h: number, r: number): THREE.BufferGeometry {
  const shape = createRoundedRectShape(w, h, r);
  const geo = new THREE.ShapeGeometry(shape, 20);
  const posAttr = geo.getAttribute('position');
  const uvs = new Float32Array(posAttr.count * 2);
  for (let i = 0; i < posAttr.count; i++) {
    const px = posAttr.getX(i);
    const py = posAttr.getY(i);
    uvs[i * 2 + 0] = (px + w / 2) / w;
    uvs[i * 2 + 1] = (py + h / 2) / h;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  return geo;
}

// Helper: Create delicate perimeter line for the electric blue rim contour
function createRoundedRimLineGeometry(w: number, h: number, r: number, z: number = 0.010): THREE.BufferGeometry {
  const shape = createRoundedRectShape(w, h, r);
  const points = shape.getPoints(44);
  const pts3D = points.map((p) => new THREE.Vector3(p.x, p.y, z));
  pts3D.push(pts3D[0].clone()); // close loop
  return new THREE.BufferGeometry().setFromPoints(pts3D);
}

// Procedural clean, deep studio backdrop texture (pure, neat, silky)
function createDarkCinematicBackdropTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Pure obsidian base
  ctx.fillStyle = '#030509';
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. Subtle central studio volumetric radial aura (soft luxury vignette)
  const centerGlow = ctx.createRadialGradient(512, 512, 40, 512, 512, 520);
  centerGlow.addColorStop(0, 'rgba(0, 140, 255, 0.08)');
  centerGlow.addColorStop(0.35, 'rgba(8, 20, 50, 0.16)');
  centerGlow.addColorStop(0.70, 'rgba(4, 8, 18, 0.06)');
  centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, 1024, 1024);

  // 3. Gentle bottom floor sheen
  const floorGrad = ctx.createLinearGradient(0, 800, 0, 1024);
  floorGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  floorGrad.addColorStop(1, 'rgba(0, 140, 255, 0.04)');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, 800, 1024, 224);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Procedural soft volumetric contact drop-shadow texture
function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 245);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
  grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.42)');
  grad.addColorStop(0.70, 'rgba(0, 0, 0, 0.12)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Procedural soft stardust circle sprite (cosmic dust)
function createDustParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(0.25, 'rgba(147, 197, 253, 0.6)');
  grad.addColorStop(0.65, 'rgba(0, 140, 255, 0.15)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);

  return new THREE.CanvasTexture(canvas);
}

interface PanelData {
  group: THREE.Group;
  screenMesh: THREE.Mesh;
  chassisMesh: THREE.Mesh;
  shadowMesh: THREE.Mesh;
  rimLine: THREE.LineLoop;
  baseX: number;
  baseY: number;
  baseRotY: number;
  video: HTMLVideoElement;
  videoTexture: THREE.VideoTexture | null;
  posterTexture: THREE.Texture;
  videoUrl: string;
  hasAttachedSource: boolean;
  isPlaying: boolean;
  targetVolume: number;
  currentVolume: number;
}

export const PortfolioWormhole3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorialContentRef = useRef<HTMLDivElement>(null);
  const videoMountContainerRef = useRef<HTMLDivElement>(null);

  const [scrollUnit, setScrollUnit] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isIndexDrawerOpen, setIsIndexDrawerOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true); // Start muted for instant autoplay across all mobile/desktop browsers
  const [volumeLevel, setVolumeLevel] = useState<number>(1.0); // User-adjustable volume (0.0 to 1.0)
  const [isUserPaused, setIsUserPaused] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 1024);
  const [isVolumeHovered, setIsVolumeHovered] = useState<boolean>(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState<boolean>(false);
  const [selectedMobileProject, setSelectedMobileProject] = useState<ClientProject | null>(null);

  const activeIndexRef = useRef<number>(0);
  activeIndexRef.current = activeIndex;

  const isMutedRef = useRef<boolean>(true);
  isMutedRef.current = isMuted;

  const volumeLevelRef = useRef<number>(1.0);
  volumeLevelRef.current = volumeLevel;

  const volumeTrackRef = useRef<HTMLDivElement>(null);

  const isUserPausedRef = useRef<boolean>(false);
  isUserPausedRef.current = isUserPaused;

  const isDetailModalOpenRef = useRef<boolean>(false);
  isDetailModalOpenRef.current = isDetailModalOpen;

  const isIndexDrawerOpenRef = useRef<boolean>(false);
  isIndexDrawerOpenRef.current = isIndexDrawerOpen;

  const isTransitioningRef = useRef<boolean>(false);
  const targetProjectIndexRef = useRef<number>(0);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const debouncedSnapRef = useRef<NodeJS.Timeout | null>(null);

  // Source of truth from CMS with instant fallback to default CLIENT_PROJECTS
  const { projects: cmsProjects } = useCMSContent();
  const activeProjects: ClientProject[] = (cmsProjects && cmsProjects.length > 0
    ? (cmsProjects as unknown as ClientProject[])
    : CLIENT_PROJECTS);
  const totalProjects = activeProjects.length;
  const projects3DKey = activeProjects.map((p) => `${p.id}:${p.videoUrl}:${p.posterUrl}`).join('|');

  // Interactive Cursor Parallax Refs
  const targetMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Three.js Scene References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const panelsRef = useRef<PanelData[]>([]);
  const backdropMeshRef = useRef<THREE.Mesh | null>(null);
  const pocketPointLightRef = useRef<THREE.PointLight | null>(null);
  const dustGeoRef = useRef<THREE.BufferGeometry | null>(null);
  const dustBaseYRef = useRef<Float32Array | null>(null);
  const dustSpeedsRef = useRef<Float32Array | null>(null);

  // Resize handler
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Play / Pause Toggle Handler
  const togglePlayPause = useCallback(() => {
    setIsUserPaused((prev) => {
      const next = !prev;
      isUserPausedRef.current = next;
      const activePanel = panelsRef.current[activeIndexRef.current];
      if (activePanel) {
        if (next) {
          activePanel.isPlaying = false;
          activePanel.targetVolume = 0;
          activePanel.video.pause();
        } else {
          if (!activePanel.hasAttachedSource) {
            activePanel.video.src = activePanel.videoUrl;
            activePanel.video.preload = 'auto';
            activePanel.video.load();
            activePanel.hasAttachedSource = true;
            if (!activePanel.videoTexture) {
              const vt = new THREE.VideoTexture(activePanel.video);
              vt.colorSpace = THREE.SRGBColorSpace;
              vt.minFilter = THREE.LinearFilter;
              vt.magFilter = THREE.LinearFilter;
              vt.generateMipmaps = false;
              activePanel.videoTexture = vt;
            }
          }
          activePanel.isPlaying = true;
          activePanel.targetVolume = isMutedRef.current ? 0 : volumeLevelRef.current;
          activePanel.video.play().catch(() => {});
          if (activePanel.videoTexture) {
            (activePanel.screenMesh.material as THREE.MeshBasicMaterial).map = activePanel.videoTexture;
            (activePanel.screenMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
          }
        }
      }
      return next;
    });
  }, []);

  const togglePlayPauseRef = useRef(togglePlayPause);
  togglePlayPauseRef.current = togglePlayPause;

  // Audio Mute / Unmute Toggle Handler with smooth volume transition
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      panelsRef.current.forEach((p, idx) => {
        if (next) {
          p.targetVolume = 0;
          p.currentVolume = 0;
          p.video.muted = true;
          p.video.volume = 0;
        } else {
          if (idx === activeIndexRef.current) {
            p.video.muted = false;
            const restoreVol = volumeLevelRef.current > 0.05 ? volumeLevelRef.current : 1.0;
            if (volumeLevelRef.current <= 0.05) {
              setVolumeLevel(1.0);
              volumeLevelRef.current = 1.0;
            }
            p.targetVolume = restoreVol;
            p.currentVolume = restoreVol;
            p.video.volume = restoreVol;
            if (!isUserPausedRef.current) {
              p.isPlaying = true;
              p.video.play().catch(() => {});
            }
          } else {
            p.targetVolume = 0;
            p.currentVolume = 0;
            p.video.muted = true;
            p.video.volume = 0;
          }
        }
      });
      return next;
    });
  }, []);

  // Direct volume adjustment handler (0.0 to 1.0)
  const handleVolumeChange = useCallback((newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, Math.round(newVolume * 100) / 100));
    setVolumeLevel(clamped);
    volumeLevelRef.current = clamped;

    if (clamped <= 0.01) {
      setIsMuted(true);
      isMutedRef.current = true;
      panelsRef.current.forEach((p) => {
        p.targetVolume = 0;
      });
    } else {
      setIsMuted(false);
      isMutedRef.current = false;
      const activePanel = panelsRef.current[activeIndexRef.current];
      if (activePanel) {
        activePanel.video.muted = false;
        activePanel.targetVolume = clamped;
        activePanel.video.volume = clamped;
        if (!isUserPausedRef.current && activePanel.video.paused) {
          activePanel.video.play().catch(() => {});
        }
      }
    }
  }, []);

  const calculateVolumeFromY = useCallback((clientY: number) => {
    if (!volumeTrackRef.current) return;
    const rect = volumeTrackRef.current.getBoundingClientRect();
    const offsetY = rect.bottom - clientY;
    const pct = offsetY / rect.height;
    handleVolumeChange(pct);
  }, [handleVolumeChange]);

  const handleVolumeTrackPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingVolume(true);
    calculateVolumeFromY(e.clientY);

    const onPointerMove = (moveEvent: PointerEvent) => {
      calculateVolumeFromY(moveEvent.clientY);
    };

    const onPointerUp = () => {
      setIsDraggingVolume(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }, [calculateVolumeFromY]);

  // Browser Autoplay Policy: Unlock unmuted audio on first user gesture anywhere
  useEffect(() => {
    const unlockAudio = () => {
      if (!isMutedRef.current) {
        const activePanel = panelsRef.current[activeIndexRef.current];
        if (activePanel && activePanel.video) {
          activePanel.video.muted = false;
          activePanel.targetVolume = volumeLevelRef.current;
          activePanel.video.play().catch(() => {});
        }
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('wheel', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('wheel', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('wheel', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  // Pause 3D background reel when detail modal is active; resume on close
  useEffect(() => {
    isDetailModalOpenRef.current = isDetailModalOpen;
    if (isDetailModalOpen) {
      panelsRef.current.forEach((p) => {
        p.isPlaying = false;
        p.targetVolume = 0;
        p.video.pause();
        p.video.muted = true;
      });
    } else {
      if (!isUserPausedRef.current) {
        const activePanel = panelsRef.current[activeIndexRef.current];
        if (activePanel) {
          activePanel.video.muted = isMutedRef.current;
          activePanel.targetVolume = isMutedRef.current ? 0 : volumeLevelRef.current;
          activePanel.isPlaying = true;
          activePanel.video.play().catch(() => {});
        }
      }
    }
  }, [isDetailModalOpen]);

  // Keyboard navigation & ESC handler for drawer and modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isDetailModalOpen) setIsDetailModalOpen(false);
        if (isIndexDrawerOpen) setIsIndexDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isIndexDrawerOpen, isDetailModalOpen]);

  // GSAP Editorial Stagger Reveal on Project Change
  useEffect(() => {
    if (isMobile) return;
    const el = editorialContentRef.current;
    if (el) {
      gsap.killTweensOf(el.children);
      gsap.fromTo(
        el.children,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.38, stagger: 0.04, ease: 'power2.out' }
      );
    }
  }, [activeIndex, isMobile]);

  // Setup Three.js Wormhole Corridor Engine
  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const mob = width < 1024;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030509');
    scene.fog = new THREE.FogExp2('#030509', 0.035);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(mob ? 46 : 42, width / height, 0.1, 100);
    camera.position.set(0, 0.0, CAM_Z);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mob ? 1.25 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const keyDirectionalLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyDirectionalLight.position.set(4, 6, 8);
    scene.add(keyDirectionalLight);

    const studioFillLight = new THREE.DirectionalLight(0x008cff, 0.9);
    studioFillLight.position.set(-6, -2, 4);
    scene.add(studioFillLight);

    const pocketPointLight = new THREE.PointLight(0x008cff, 1.6, 16, 1.4);
    pocketPointLight.position.set(mob ? 0 : -2.42, mob ? 1.45 : 0.2, -1.6);
    scene.add(pocketPointLight);
    pocketPointLightRef.current = pocketPointLight;

    // 5. Clean Studio Backdrop (Smooth luxury vignette, NO grid lines)
    const backdropTexture = createDarkCinematicBackdropTexture();
    const backdropGeo = new THREE.PlaneGeometry(36, 24);
    const backdropMat = new THREE.MeshBasicMaterial({
      map: backdropTexture,
      depthWrite: false,
    });
    const backdropMesh = new THREE.Mesh(backdropGeo, backdropMat);
    backdropMesh.position.set(0, 0, -18);
    scene.add(backdropMesh);
    backdropMeshRef.current = backdropMesh;

    // 6. Ambient Minimal Cosmic Dust
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    const dustBaseY = new Float32Array(DUST_COUNT);
    const dustSpeeds = new Float32Array(DUST_COUNT);

    for (let i = 0; i < DUST_COUNT; i++) {
      dustPositions[i * 3 + 0] = (Math.random() - 0.5) * 18;
      const y = (Math.random() - 0.5) * 12;
      dustPositions[i * 3 + 1] = y;
      dustBaseY[i] = y;
      dustPositions[i * 3 + 2] = -1.8 - Math.random() * 8.0;
      dustSpeeds[i] = 0.4 + Math.random() * 0.8;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustParticleTexture = createDustParticleTexture();
    const dustMat = new THREE.PointsMaterial({
      size: 0.10,
      map: dustParticleTexture,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);
    dustGeoRef.current = dustGeo;
    dustBaseYRef.current = dustBaseY;
    dustSpeedsRef.current = dustSpeeds;

    // 7. Geometries for Clean Rounded Reel Frames
    const CHASSIS_OUTER_W = PANEL_WIDTH + CHASSIS_PADDING * 2;
    const CHASSIS_OUTER_H = PANEL_HEIGHT + CHASSIS_PADDING * 2;
    const CHASSIS_RADIUS = CORNER_RADIUS + CHASSIS_PADDING * 0.5;
    const chassisShape = createRoundedRectShape(CHASSIS_OUTER_W, CHASSIS_OUTER_H, CHASSIS_RADIUS);
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, {
      depth: CHASSIS_DEPTH,
      bevelEnabled: false,
      steps: 1,
    });
    chassisGeo.center();

    // Active Screen Rounded Screen Geometry
    const screenGeo = createRoundedScreenGeometry(PANEL_WIDTH, PANEL_HEIGHT, CORNER_RADIUS);

    // Continuous Chamfer Rim Line Loop
    const rimLineGeo = createRoundedRimLineGeometry(PANEL_WIDTH, PANEL_HEIGHT, CORNER_RADIUS, CHASSIS_DEPTH / 2 + 0.002);

    // Volumetric Soft Floating Contact Drop-Shadow
    const shadowTexture = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(PANEL_WIDTH * 1.35, PANEL_HEIGHT * 1.25);

    const textureLoader = new THREE.TextureLoader();
    const panels: PanelData[] = [];

    activeProjects.forEach((project, i) => {
      const panelGroup = new THREE.Group();

      const isLeft = i % 2 === 0;
      const baseX = mob ? 0 : (isLeft ? -2.42 : 2.42);
      const baseY = mob ? 1.35 : 0.0;
      const baseRotY = mob ? (isLeft ? 0.08 : -0.08) : (isLeft ? 0.35 : -0.35);

      panelGroup.position.set(baseX, baseY, 0);
      panelGroup.rotation.y = baseRotY;

      // 1. Soft Volumetric Contact Drop Shadow
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.position.set(0, -0.04, -0.06);
      panelGroup.add(shadowMesh);

      // 2. Chassis Body: Minimal Obsidian Unibody matching rounded corner radius
      const chassisMat = new THREE.MeshStandardMaterial({
        color: 0x070b14,
        metalness: 0.65,
        roughness: 0.35,
      });
      const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
      panelGroup.add(chassisMesh);

      // 3. Poster Texture (Initial display)
      const posterTexture = textureLoader.load(project.posterUrl);
      posterTexture.colorSpace = THREE.SRGBColorSpace;

      // 4. Video Element for reel footage (Lazy attached for zero hardware decoder exhaustion)
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.preload = i === 0 ? 'auto' : 'none';

      // Attach video element to real DOM container for mobile WebKit & Chrome audio routing
      if (videoMountContainerRef.current) {
        videoMountContainerRef.current.appendChild(video);
      }

      let hasAttachedSource = false;
      let videoTexture: THREE.VideoTexture | null = null;

      if (i === 0) {
        video.src = project.videoUrl;
        hasAttachedSource = true;
        video.muted = isMutedRef.current;
        video.volume = isMutedRef.current ? 0.0 : volumeLevelRef.current;

        videoTexture = new THREE.VideoTexture(video);
        videoTexture.colorSpace = THREE.SRGBColorSpace;
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.generateMipmaps = false;
      } else {
        video.muted = true;
        video.volume = 0.0;
      }

      // 5. Active Screen Mesh with Rounded Corners
      const screenMat = new THREE.MeshBasicMaterial({
        map: posterTexture,
        transparent: true,
        opacity: 1.0,
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(0, 0, CHASSIS_DEPTH / 2 + 0.001);
      panelGroup.add(screenMesh);

      // Auto-start playback on initial hero reel
      if (i === 0 && videoTexture) {
        const activeTex = videoTexture;
        const startPromise = video.play();
        if (startPromise !== undefined) {
          startPromise.then(() => {
            screenMat.map = activeTex;
            screenMat.needsUpdate = true;
          }).catch(() => {
            // If browser autoplay policy blocks unmuted audio before user interaction, fallback to muted
            video.muted = true;
            setIsMuted(true);
            isMutedRef.current = true;
            video.play().then(() => {
              screenMat.map = activeTex;
              screenMat.needsUpdate = true;
            }).catch(() => {});
          });
        }
      }

      // 6. Delicate Curved Rim Line Loop (Subtle electric blue glow)
      const rimMat = new THREE.LineBasicMaterial({
        color: 0x008cff,
        transparent: true,
        opacity: 0.45,
      });
      const rimLine = new THREE.LineLoop(rimLineGeo, rimMat);
      panelGroup.add(rimLine);

      // Initially show ONLY Project 0 (Active hero)
      panelGroup.visible = i === 0;

      scene.add(panelGroup);

      panels.push({
        group: panelGroup,
        screenMesh,
        chassisMesh,
        shadowMesh,
        rimLine,
        baseX,
        baseY,
        baseRotY,
        video,
        videoTexture,
        posterTexture,
        videoUrl: project.videoUrl,
        hasAttachedSource,
        isPlaying: i === 0,
        targetVolume: i === 0 && !isMutedRef.current ? volumeLevelRef.current : 0.0,
        currentVolume: 0.0,
      });
    });

    panelsRef.current = panels;

    const handlePointerMove = (e: MouseEvent) => {
      targetMouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Update cursor when hovering over the active 3D reel
      const camera = cameraRef.current;
      const canvas = canvasRef.current;
      if (camera && canvas && !isDetailModalOpenRef.current && !isIndexDrawerOpenRef.current) {
        const rect = canvas.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          const mouse = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
          );
          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(mouse, camera);

          const activePanel = panelsRef.current[activeIndexRef.current];
          if (activePanel && activePanel.group && activePanel.group.visible) {
            const targets = [
              activePanel.screenMesh,
              activePanel.chassisMesh,
              ...activePanel.group.children,
            ];
            const hits = raycaster.intersectObjects(targets, true);
            canvas.style.cursor = hits.length > 0 ? 'pointer' : 'default';
          } else {
            canvas.style.cursor = 'default';
          }
        } else {
          canvas.style.cursor = 'default';
        }
      }
    };

    // Track click vs drag on the 3D reel to toggle play/pause
    let pointerDownPos = { x: 0, y: 0, time: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY, time: Date.now() };
    };

    const handlePointerUp = (e: PointerEvent) => {
      // Don't toggle if client detail modal or index drawer is open
      if (isDetailModalOpenRef.current || isIndexDrawerOpenRef.current) return;

      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      const dt = Date.now() - pointerDownPos.time;

      // Must be a clean tap/click (less than 12px drag and under 500ms)
      if (Math.hypot(dx, dy) > 12 || dt > 500) return;

      // Ignore if user tapped directly on an interactive HTML element (button, link, drawer toggle, etc.)
      const target = e.target as HTMLElement | null;
      if (target && target.closest('button, a, input, select, textarea, [role="button"]')) {
        return;
      }

      const camera = cameraRef.current;
      const canvas = canvasRef.current;
      if (!camera || !canvas) return;

      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }

      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const activePanel = panelsRef.current[activeIndexRef.current];
      if (!activePanel || !activePanel.group || !activePanel.group.visible) return;

      const targets = [
        activePanel.screenMesh,
        activePanel.chassisMesh,
        ...activePanel.group.children,
      ];

      const hits = raycaster.intersectObjects(targets, true);
      if (hits.length > 0) {
        // Toggle play/pause - fully synchronized with bottom controls button
        togglePlayPauseRef.current();
      }
    };

    // Auto-resume video playback on initial user gesture (unless user paused)
    const handleUserInteraction = () => {
      if (isUserPausedRef.current) return;
      const active = panelsRef.current[activeIndexRef.current];
      if (active) {
        if (!active.hasAttachedSource) {
          active.video.src = active.videoUrl;
          active.video.preload = 'auto';
          active.video.load();
          active.hasAttachedSource = true;
          if (!active.videoTexture) {
            const vt = new THREE.VideoTexture(active.video);
            vt.colorSpace = THREE.SRGBColorSpace;
            vt.minFilter = THREE.LinearFilter;
            vt.magFilter = THREE.LinearFilter;
            vt.generateMipmaps = false;
            active.videoTexture = vt;
          }
        }
        if (active.video.paused) {
          active.video.play().then(() => {
            active.isPlaying = true;
            if (active.videoTexture) {
              (active.screenMesh.material as THREE.MeshBasicMaterial).map = active.videoTexture;
              (active.screenMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
            }
          }).catch(() => {});
        }
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('wheel', handleUserInteraction, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMob = w < 1024;
      setIsMobile(isMob);
      if (cameraRef.current) {
        cameraRef.current.fov = isMob ? 46 : 42;
        cameraRef.current.aspect = w / h;
        cameraRef.current.position.set(0, 0.0, CAM_Z);
        cameraRef.current.updateProjectionMatrix();
      }
      if (rendererRef.current) {
        rendererRef.current.setSize(w, h);
      }
      panels.forEach((p, idx) => {
        const isLeft = idx % 2 === 0;
        p.baseX = isMob ? 0 : (isLeft ? -2.42 : 2.42);
        p.baseY = isMob ? 1.35 : 0.0;
        p.baseRotY = isMob ? (isLeft ? 0.08 : -0.08) : (isLeft ? 0.35 : -0.35);
      });
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with Organic Dust Drift, Interactive Cursor Parallax, and Audio Fade Engine
    let animId: number;
    let lastTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      // Audio Fade Engine: Exponential volume lerping (0.5s - 1.0s smooth fade)
      // Exponential rate 3.6 gives 95% completion at ~0.8s
      const volumeStep = 1.0 - Math.exp(-3.6 * dt);

      panelsRef.current.forEach((p) => {
        // Smoothly lerp current volume towards target volume
        if (Math.abs(p.currentVolume - p.targetVolume) > 0.001) {
          p.currentVolume += (p.targetVolume - p.currentVolume) * volumeStep;
          if (p.currentVolume < 0.001) p.currentVolume = 0;
          if (p.currentVolume > 0.999) p.currentVolume = 1;
        } else {
          p.currentVolume = p.targetVolume;
        }

        // Apply volume safely to video element
        if (p.video) {
          p.video.volume = Math.max(0, Math.min(1, p.currentVolume));

          // Mute when volume is zero; unmute when volume rises above zero if user hasn't muted
          if (p.currentVolume <= 0.002 && p.targetVolume === 0) {
            p.video.muted = true;
          } else if (p.currentVolume > 0.005 && !isMutedRef.current) {
            p.video.muted = false;
          }
        }

        // Update video textures for all active playing videos during transitions
        if (p.videoTexture && p.isPlaying && !p.video.paused) {
          p.videoTexture.needsUpdate = true;
        }
      });

      // Smooth cursor parallax lerp
      currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * 0.04;
      currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * 0.04;

      if (cameraRef.current) {
        cameraRef.current.rotation.y = -currentMouseRef.current.x * 0.02;
        cameraRef.current.rotation.x = currentMouseRef.current.y * 0.015;
      }

      const activePanel = panelsRef.current[activeIndexRef.current];
      if (activePanel && activePanel.group.visible) {
        activePanel.group.rotation.x = currentMouseRef.current.y * 0.035;
      }

      // Organic slow floating motion for cosmic dust motes
      if (dustGeoRef.current && dustBaseYRef.current && dustSpeedsRef.current) {
        const posAttr = dustGeoRef.current.getAttribute('position') as THREE.BufferAttribute;
        const time = Date.now() * 0.0005;
        for (let i = 0; i < DUST_COUNT; i++) {
          const y = dustBaseYRef.current[i] + Math.sin(time * dustSpeedsRef.current[i] + i) * 0.18;
          posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('resize', handleResize);
      panels.forEach((p) => {
        p.video.pause();
        p.video.src = '';
        p.video.remove();
        p.videoTexture?.dispose();
        p.posterTexture.dispose();
      });
      chassisGeo.dispose();
      screenGeo.dispose();
      rimLineGeo.dispose();
      shadowGeo.dispose();
      shadowTexture.dispose();
      backdropTexture.dispose();
      dustParticleTexture.dispose();
      renderer.dispose();
    };
  }, [projects3DKey, isMobile]);

  // Update Three.js Wormhole Motion & Dark Space based on Scroll Unit
  const updateThreeScene = useCallback((u: number) => {
    const panels = panelsRef.current;
    const camera = cameraRef.current;
    if (panels.length === 0 || !camera) return;

    const mobile = window.innerWidth < 1024;
    const baseScale = mobile ? 0.52 : 1.0;

    const currentChapter = Math.min(panels.length - 1, Math.max(0, Math.floor(u)));
    const nextChapter = Math.min(panels.length - 1, currentChapter + 1);
    const frac = u - currentChapter; // 0.0 to 1.0
    const smoothFrac = frac * frac * (3 - 2 * frac);

    const isCurrentLeft = currentChapter % 2 === 0;
    const isNextLeft = nextChapter % 2 === 0;

    const curLightX = mobile ? 0 : (isCurrentLeft ? -2.42 : 2.42);
    const nextLightX = mobile ? 0 : (isNextLeft ? -2.42 : 2.42);
    const targetLightX = curLightX + (nextLightX - curLightX) * smoothFrac;

    const snapDist = Math.abs(u - Math.round(u));
    const snapFocus = Math.max(0, 1.0 - snapDist * 2.8);

    const midTravelDip = Math.sin(Math.PI * frac);

    if (pocketPointLightRef.current) {
      pocketPointLightRef.current.position.x = targetLightX;
      pocketPointLightRef.current.position.y = mobile ? 1.2 : 0.3;
      pocketPointLightRef.current.position.z = -1.4 - 1.2 * midTravelDip;
      pocketPointLightRef.current.intensity = 1.2 + snapFocus * 0.6;
    }

    if (backdropMeshRef.current) {
      backdropMeshRef.current.position.x = targetLightX * 0.06;
    }

    // Camera Motion: continuous, fluid tracking without axis discontinuity
    const camPushZ = midTravelDip * 0.25;
    const camDriftY = Math.sin(u * Math.PI) * 0.03;
    const camLeanX = targetLightX * 0.045 * (1.0 - midTravelDip * 0.5);

    camera.position.z = CAM_Z - camPushZ;
    camera.position.y = camDriftY;
    camera.position.x = mobile ? 0 : camLeanX;
    camera.lookAt(mobile ? 0 : camLeanX * 0.3, mobile ? 1.08 * 0.15 : camera.position.y, 0);

    // Panel Transitions Dynamics:
    // Strictly isolate visibility to within transition bounds!
    panels.forEach((p, idx) => {
      const delta = u - idx; // 0 = active hero, < 0 = upcoming (entering), > 0 = exiting
      const dist = Math.abs(delta);

      // Outside immediate active range: Completely hide, mute, and pause video!
      if (delta <= -0.90 || delta >= 0.90) {
        p.group.visible = false;
        p.targetVolume = 0;
        p.currentVolume = 0;
        if (p.video) {
          p.video.volume = 0;
          p.video.muted = true;
        }
        if (p.isPlaying) {
          p.isPlaying = false;
          p.video.pause();
        }
        // Free hardware decoder contexts when distant (more than 2.2 units away)
        if (dist >= 2.2 && p.hasAttachedSource) {
          p.video.pause();
          p.video.removeAttribute('src');
          p.video.load();
          p.hasAttachedSource = false;
          if (p.videoTexture) {
            p.videoTexture.dispose();
            p.videoTexture = null;
          }
          (p.screenMesh.material as THREE.MeshBasicMaterial).map = p.posterTexture;
          (p.screenMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
        }
        return;
      }

      // Pre-attach video source when entering proximity so it's ready for instant play
      if (dist < 1.05 && !p.hasAttachedSource) {
        p.video.src = p.videoUrl;
        p.video.preload = 'auto';
        p.video.load();
        p.hasAttachedSource = true;
        if (!p.videoTexture) {
          const vt = new THREE.VideoTexture(p.video);
          vt.colorSpace = THREE.SRGBColorSpace;
          vt.minFilter = THREE.LinearFilter;
          vt.magFilter = THREE.LinearFilter;
          vt.generateMipmaps = false;
          p.videoTexture = vt;
        }
      }

      // If jumping across multiple projects via drawer: keep intermediate reels quiet
      if (
        isTransitioningRef.current &&
        Math.abs(u - targetProjectIndexRef.current) > 0.85 &&
        idx !== targetProjectIndexRef.current &&
        idx !== activeIndexRef.current
      ) {
        p.targetVolume = 0;
        return;
      }

      // Actively transitioning or active hero: visible
      p.group.visible = true;

      let posX = p.baseX;
      let posY = p.baseY;
      let posZ = 0;
      let rotY = p.baseRotY;
      let scale = baseScale;
      let opacity = 1.0;

      if (delta < 0) {
        // Entering smoothly from 3D space depth (delta: -0.90 -> 0.0)
        const t = (0.90 + delta) / 0.90; // 0.0 to 1.0
        const ease = t * t * (3 - 2 * t);

        posZ = -8.5 * (1.0 - ease);
        posX = mobile ? 0 : p.baseX * (0.35 + 0.65 * ease);
        rotY = p.baseRotY * (0.6 + 0.4 * ease);
        scale = baseScale * (0.65 + 0.35 * ease);
        opacity = ease;
      } else if (delta > 0) {
        // Exiting smoothly past camera (delta: 0.0 -> 0.90)
        const t = delta / 0.90; // 0.0 to 1.0
        const ease = t * t * (3 - 2 * t);

        posZ = 4.8 * (t * t);
        posX = mobile
          ? p.baseX + (idx % 2 === 0 ? -1.5 : 1.5) * ease
          : p.baseX * (1.0 + 1.15 * ease);
        rotY = p.baseRotY * (1.0 + 0.6 * ease);
        scale = baseScale * (1.0 + 0.22 * ease);
        opacity = Math.max(0.0, 1.0 - ease);
      }

      p.group.position.set(posX, posY, posZ);
      p.group.rotation.y = rotY;
      p.group.scale.setScalar(scale);

      // Apply smooth opacity
      (p.screenMesh.material as THREE.MeshBasicMaterial).opacity = opacity;
      (p.chassisMesh.material as THREE.MeshStandardMaterial).opacity = opacity;
      (p.shadowMesh.material as THREE.MeshBasicMaterial).opacity = opacity * 0.55;
      const activeEmphasis = dist < 0.3 ? (1.0 - dist * 3.3) : 0;
      (p.rimLine.material as THREE.LineBasicMaterial).opacity = (0.35 + activeEmphasis * 0.35) * opacity;

      // =======================================================================
      // AUDIO FADE & VIDEO PLAYBACK ORCHESTRATION (0.5s - 1.0s Smooth Crossfade)
      // =======================================================================
      // If client detail modal is open or user explicitly paused:
      if (isDetailModalOpenRef.current || isUserPausedRef.current) {
        p.targetVolume = 0;
        if (p.isPlaying) {
          p.isPlaying = false;
          p.video.pause();
        }
        return;
      }

      // Video playback: keep playing while in visibility corridor (dist < 0.70)
      if (dist < 0.70) {
        if (!p.isPlaying) {
          p.isPlaying = true;
          p.video.muted = isMutedRef.current;
          p.video.volume = Math.max(0, Math.min(1, p.currentVolume));
          const playPromise = p.video.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              if (p.videoTexture) {
                (p.screenMesh.material as THREE.MeshBasicMaterial).map = p.videoTexture;
                (p.screenMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
              }
            }).catch(() => {
              // Gracefully fall back to muted if unmuted autoplay is rejected by browser
              p.video.muted = true;
              p.video.play().catch(() => {});
            });
          }
        }

        // Acoustic target volume:
        // When unmuted:
        // - dist <= 0.15: 1.0 full volume
        // - 0.15 < dist < 0.45: smooth Hermite fade curve down to 0
        // - dist >= 0.45: 0.0 (silent at midpoint u=0.50 to avoid clash)
        if (isMutedRef.current) {
          p.targetVolume = 0;
        } else {
          if (dist <= 0.15) {
            p.targetVolume = volumeLevelRef.current;
          } else if (dist < 0.45) {
            const vT = (0.45 - dist) / (0.45 - 0.15); // 1.0 at 0.15 -> 0.0 at 0.45
            p.targetVolume = vT * vT * (3 - 2 * vT) * volumeLevelRef.current;
          } else {
            p.targetVolume = 0.0;
          }
        }
      } else {
        // Outside playback focus: target volume 0
        p.targetVolume = 0;
        if (dist >= 0.85 && p.isPlaying) {
          p.isPlaying = false;
          p.video.pause();
        }
      }
    });
  }, []);

  // Jump smoothly to project chapter with exact sub-pixel positioning
  const scrollToProject = useCallback(
    (index: number, customDuration: number = 0.72) => {
      const clamped = Math.min(totalProjects - 1, Math.max(0, index));
      let targetTop = 0;

      const st = stRef.current;
      if (st && st.end > st.start) {
        targetTop = st.start + (clamped / (totalProjects - 1)) * (st.end - st.start);
      } else if (containerRef.current) {
        const container = containerRef.current;
        const totalScrollable = container.offsetHeight - window.innerHeight;
        targetTop = container.offsetTop + (clamped / (totalProjects - 1)) * totalScrollable;
      } else {
        return;
      }

      targetProjectIndexRef.current = clamped;
      isTransitioningRef.current = true;

      // Pre-attach video source for destination project immediately
      const targetPanel = panelsRef.current[clamped];
      if (targetPanel && !targetPanel.hasAttachedSource) {
        targetPanel.video.src = targetPanel.videoUrl;
        targetPanel.video.preload = 'auto';
        targetPanel.video.load();
        targetPanel.hasAttachedSource = true;
        if (!targetPanel.videoTexture) {
          const vt = new THREE.VideoTexture(targetPanel.video);
          vt.colorSpace = THREE.SRGBColorSpace;
          vt.minFilter = THREE.LinearFilter;
          vt.magFilter = THREE.LinearFilter;
          vt.generateMipmaps = false;
          targetPanel.videoTexture = vt;
        }
      }

      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => {
        isTransitioningRef.current = false;
      }, customDuration * 1000 + 100);

      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(targetTop, {
          duration: customDuration,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => {
            isTransitioningRef.current = false;
          },
        });
      } else {
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 500);
      }
    },
    [totalProjects]
  );

  // GSAP ScrollTrigger: High-Performance 1:1 Scrub with Lenis (No jitter, no competing snap tweens)
  useEffect(() => {
    if (isMobile) return;
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const st = ScrollTrigger.create({
      trigger: container,
      pin: stage,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const u = self.progress * (totalProjects - 1);
        setScrollUnit(u);
        const currentActive = Math.min(totalProjects - 1, Math.max(0, Math.round(u)));
        if (currentActive !== activeIndexRef.current) {
          activeIndexRef.current = currentActive;
          isUserPausedRef.current = false;
          setIsUserPaused(false);
          setActiveIndex(currentActive);
        }
        updateThreeScene(u);

        // Magnetic debounced alignment for when continuous scroll ceases (e.g. dragging scrollbar)
        if (debouncedSnapRef.current) clearTimeout(debouncedSnapRef.current);
        if (!isTransitioningRef.current && self.isActive) {
          debouncedSnapRef.current = setTimeout(() => {
            const nearest = Math.min(totalProjects - 1, Math.max(0, Math.round(u)));
            if (Math.abs(u - nearest) > 0.035) {
              scrollToProject(nearest, 0.5);
            }
          }, 180);
        }
      },
    });

    stRef.current = st;
    updateThreeScene(0);

    return () => {
      st.kill();
      stRef.current = null;
      if (debouncedSnapRef.current) clearTimeout(debouncedSnapRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, [totalProjects, updateThreeScene, scrollToProject, isMobile]);

  // Controlled Wheel Navigation: Decisive, instantaneous reel advancement (no dead space)
  useEffect(() => {
    if (isMobile) return;
    let wheelAccumulator = 0;
    let wheelResetTimer: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      const st = stRef.current;
      if (!st || !st.isActive) return;
      if (isDetailModalOpenRef.current || isIndexDrawerOpenRef.current) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 5) return;

      wheelAccumulator += delta;
      if (wheelResetTimer) clearTimeout(wheelResetTimer);
      wheelResetTimer = setTimeout(() => {
        wheelAccumulator = 0;
      }, 160);

      // Decisive threshold: a single wheel notch or light trackpad swipe
      if (Math.abs(wheelAccumulator) < 16) return;

      if (wheelAccumulator > 0) {
        // Scrolling DOWN
        if (activeIndexRef.current < totalProjects - 1) {
          e.preventDefault();
          wheelAccumulator = 0;
          if (isTransitioningRef.current) return;
          scrollToProject(activeIndexRef.current + 1);
        } else {
          // At last project (11): let normal scroll take user smoothly down to clientele section
          wheelAccumulator = 0;
        }
      } else {
        // Scrolling UP
        if (activeIndexRef.current > 0) {
          e.preventDefault();
          wheelAccumulator = 0;
          if (isTransitioningRef.current) return;
          scrollToProject(activeIndexRef.current - 1);
        } else {
          // At first project (0): let normal scroll take user up
          wheelAccumulator = 0;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (wheelResetTimer) clearTimeout(wheelResetTimer);
    };
  }, [scrollToProject, totalProjects, isMobile]);

  // Mobile Touch Swipe Navigation: Fast, native feel reel-by-reel swipe
  useEffect(() => {
    if (isMobile) return;
    let touchStartY = 0;
    let touchStartX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (isDetailModalOpenRef.current || isIndexDrawerOpenRef.current) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const st = stRef.current;
      if (!st || !st.isActive) return;
      if (isDetailModalOpenRef.current || isIndexDrawerOpenRef.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const diffY = touchStartY - touchEndY; // > 0 means swiped UP (advance forward)
      const diffX = touchStartX - touchEndX;

      if (Math.abs(diffX) > Math.abs(diffY)) return; // ignore horizontal gestures
      if (Math.abs(diffY) < 32) return; // ignore tap

      if (diffY > 0) {
        if (activeIndexRef.current < totalProjects - 1) {
          if (!isTransitioningRef.current) {
            scrollToProject(activeIndexRef.current + 1);
          }
        }
      } else {
        if (activeIndexRef.current > 0) {
          if (!isTransitioningRef.current) {
            scrollToProject(activeIndexRef.current - 1);
          }
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollToProject, totalProjects, isMobile]);

  // Keyboard Arrow Up / Arrow Down Reel Stepping
  useEffect(() => {
    if (isMobile) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const st = stRef.current;
      if (!st || !st.isActive) return;
      if (isDetailModalOpenRef.current || isIndexDrawerOpenRef.current) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (activeIndexRef.current < totalProjects - 1) {
          e.preventDefault();
          scrollToProject(activeIndexRef.current + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (activeIndexRef.current > 0) {
          e.preventDefault();
          scrollToProject(activeIndexRef.current - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToProject, totalProjects, isMobile]);

  const currentProject: ClientProject = activeProjects[activeIndex] || activeProjects[0];
  const isLeft = activeIndex % 2 === 0;

  // Editorial directional drift & smooth opacity during scroll
  const scrollDelta = scrollUnit - activeIndex;
  const editorialDriftY = isMobile ? 0 : scrollDelta * -20;
  const editorialOpacity = Math.max(0.15, 1 - Math.abs(scrollDelta) * 1.6);

  // Center Client Logo Reveal: continuous 3D depth and rotational transition synced with scroll
  const centerLogoProjectIndex = Math.min(
    totalProjects - 1,
    Math.max(0, Math.round(scrollUnit))
  );
  const centerLogoProject = activeProjects[centerLogoProjectIndex] || currentProject;
  const logoDelta = scrollUnit - centerLogoProjectIndex; // -0.5 to +0.5
  const logoAbsDelta = Math.abs(logoDelta);
  const logoOpacity = Math.max(0, (1 - logoAbsDelta * 2.0) * 0.95);
  const logoScale = Math.max(0.75, 1 - logoAbsDelta * 0.16);
  const logoRotateY = logoDelta * 24; // subtle 3D rotational tilt
  const logoTranslateZ = -logoAbsDelta * 50; // 3D depth retreat away from camera
  const logoTranslateY = logoDelta * -20; // organic parallax float

  // Dedicated Mobile Responsive Portfolio Showcase (Native vertical scroll, dominant 9:16 reel)
  if (isMobile) {
    return (
      <>
        <PortfolioMobileShowcase
          activeProjects={activeProjects}
          onSelectProject={(project) => {
            setSelectedMobileProject(project);
            setIsDetailModalOpen(true);
          }}
        />

        <ProjectDetailModal
          isOpen={isDetailModalOpen}
          project={selectedMobileProject || activeProjects[0]}
          onClose={() => {
            setIsDetailModalOpen(false);
          }}
        />
      </>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full bg-[#030509] text-white select-none"
        style={{
          height: `${totalProjects * 100}vh`,
        }}
      >
        {/* ================================================================== */}
        {/* PINNED 100vw × 100vh CINEMATIC VIEWPORT PINNED FOR SCROLL PROGRESS */}
        {/* ================================================================== */}
        <div
          ref={stageRef}
          className="relative w-full h-screen overflow-hidden flex flex-col justify-between pointer-events-none"
        >
          {/* ========================================================= */}
          {/* 1. LUXURY STUDIO ATMOSPHERE BACKDROP                      */}
          {/* ========================================================= */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            {/* Subtle Central Studio Radial Aura */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1200px] h-[70vh] max-h-[700px] rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.09) 0%, rgba(8, 20, 60, 0.22) 50%, transparent 75%)',
                filter: 'blur(90px)',
              }}
            />

            {/* Gentle Floor Sheen at Bottom */}
            <div
              className="absolute bottom-0 inset-x-0 h-[30vh] pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, rgba(0, 140, 255, 0.04) 0%, rgba(3, 5, 9, 0.6) 60%, transparent 100%)',
              }}
            />
          </div>

          {/* ========================================================= */}
          {/* 2. THREE.JS 3D WEBGL CANVAS (Hero 3D Reels Engine)        */}
          {/* ========================================================= */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block pointer-events-auto"
            style={{ zIndex: 5 }}
          />

          {/* ========================================================= */}
          {/* AUDIO DOM CONTAINER: Attached for iOS/WebKit media audio */}
          {/* ========================================================= */}
          <div
            ref={videoMountContainerRef}
            className="absolute inset-0 pointer-events-none opacity-0 overflow-hidden w-0 h-0"
            aria-hidden="true"
            style={{ zIndex: -1, visibility: 'hidden' }}
          />

          {/* ========================================================= */}
          {/* 2.5 CENTER CLIENT LOGO REVEAL (SUBTLE 3D DEPTH/ROTATION) */}
          {/* ========================================================= */}
          {centerLogoProject.logoUrl && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none hidden md:flex items-center justify-center"
              style={{
                zIndex: 11,
                perspective: '800px',
              }}
            >
              <div
                style={{
                  opacity: logoOpacity,
                  transform: `translate3d(0, ${logoTranslateY}px, ${logoTranslateZ}px) rotateY(${logoRotateY}deg) scale(${logoScale})`,
                  transformStyle: 'preserve-3d',
                  transition: 'opacity 0.08s ease-out, transform 0.08s ease-out',
                }}
                className="flex items-center justify-center p-2"
              >
                <img
                  src={centerLogoProject.logoUrl}
                  alt={`${centerLogoProject.name} logo`}
                  className="max-w-[150px] sm:max-w-[175px] md:max-w-[195px] lg:max-w-[215px] xl:max-w-[235px] max-h-[56px] sm:max-h-[64px] md:max-h-[72px] lg:max-h-[78px] xl:max-h-[84px] w-auto h-auto object-contain filter drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
                  loading="eager"
                />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. INTEGRATED EDITORIAL LAYOUT (OPPOSITE OF ACTIVE REEL)  */}
          {/* ========================================================= */}
          <div
            className={`w-full pointer-events-none ${
              isMobile
                ? 'absolute top-[46%] inset-x-0 bottom-[64px] flex flex-col justify-center items-center px-4 text-center'
                : 'relative flex-1 flex items-center px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 pt-20 sm:pt-24 pb-20 sm:pb-24'
            }`}
            style={{ zIndex: 20 }}
          >
            <div
              className={`relative w-full flex pointer-events-none ${
                isMobile
                  ? 'justify-center items-center text-center'
                  : isLeft
                  ? 'justify-end items-center text-left'
                  : 'justify-start items-center text-left'
              }`}
              style={{
                opacity: editorialOpacity,
                transform: `translate3d(0, ${editorialDriftY}px, 0)`,
                transition: 'opacity 0.12s ease-out, transform 0.12s ease-out',
              }}
            >
              <div
                className={`relative flex flex-col pointer-events-auto ${
                  isMobile
                    ? 'w-full max-w-sm mx-auto'
                    : isLeft
                    ? 'w-full md:w-[46%] lg:w-[40%] xl:w-[38%] max-w-[460px] ml-auto'
                    : 'w-full md:w-[46%] lg:w-[40%] xl:w-[38%] max-w-[460px] mr-auto'
                }`}
              >
                {/* Soft Back Aura for Editorial Depth */}
                <div
                  className="absolute -inset-10 rounded-full pointer-events-none opacity-40"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.15) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                  }}
                />

                {/* Animated Editorial Content Block */}
                <div ref={editorialContentRef} className="relative z-10 flex flex-col items-center md:items-start pointer-events-auto">
                  {/* Subtle Client Logo on Mobile */}
                  {isMobile && currentProject.logoUrl && (
                    <div className="flex items-center justify-center mb-1 max-h-5">
                      <img
                        src={currentProject.logoUrl}
                        alt={`${currentProject.name} logo`}
                        className="max-h-5 max-w-[100px] object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
                        loading="eager"
                      />
                    </div>
                  )}

                  {/* Monumental Brand Title */}
                  <h2 className="text-xl sm:text-2xl md:text-5xl lg:text-[44px] xl:text-[54px] font-sans font-black tracking-[-0.025em] text-white uppercase leading-[1.0] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                    {currentProject.name}
                  </h2>

                  {/* Refined Matter / Story Below */}
                  <p className="mt-1 sm:mt-2 md:mt-3.5 text-[11px] sm:text-xs md:text-base font-sans font-light text-white/75 leading-tight sm:leading-relaxed max-w-[280px] sm:max-w-xs md:max-w-md line-clamp-1 md:line-clamp-none">
                    {currentProject.headline}
                  </p>

                  {/* Middle: Client Stat Badges (Views, Followers, Likes) */}
                  {(() => {
                    const fallbackMetrics = [
                      { label: 'Views', value: '250K+' },
                      { label: 'Followers', value: '18K+' },
                      { label: 'Likes', value: '34K+' },
                    ];
                    const stats =
                      currentProject.metrics && currentProject.metrics.length > 0
                        ? currentProject.metrics
                        : fallbackMetrics;

                    return (
                      <div
                        className={`mt-2 sm:mt-3 md:mt-5 grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-2.5 max-w-[250px] sm:max-w-[280px] md:max-w-[330px] ${
                          isMobile ? 'mx-auto' : ''
                        }`}
                      >
                        {stats.map((metric, idx) => (
                          <div
                            key={idx}
                            className="animate-glow-blink-slow px-1.5 py-1 sm:px-2.5 sm:py-2 md:px-3 md:py-2.5 rounded-lg sm:rounded-xl bg-[#008CFF]/[0.05] border border-[#008CFF]/25 hover:border-[#008CFF]/45 backdrop-blur-md flex flex-col items-center justify-center text-center transition-all duration-300 shadow-[0_0_12px_rgba(0,140,255,0.08)]"
                            style={{ animationDelay: `${idx * 0.28}s` }}
                          >
                            <span className="text-[11px] sm:text-sm md:text-base font-sans font-semibold text-white tracking-tight leading-none drop-shadow-[0_0_8px_rgba(0,140,255,0.45)]">
                              {metric.value}
                            </span>
                            <span className="mt-0.5 sm:mt-1 text-[7px] sm:text-[8px] md:text-[9px] font-sans font-medium uppercase tracking-[0.12em] text-white/55 leading-none">
                              {metric.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Single Clean Action Button: MORE INFO */}
                  <div className={`mt-2 sm:mt-3 md:mt-6 flex items-center ${isMobile ? 'justify-center' : 'justify-start'} pointer-events-auto relative z-30`}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        isDetailModalOpenRef.current = true;
                        panelsRef.current.forEach((p) => {
                          p.isPlaying = false;
                          p.targetVolume = 0;
                          p.video.pause();
                          p.video.muted = true;
                        });
                        setIsDetailModalOpen(true);
                      }}
                      className="pointer-events-auto relative z-30 group inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-7 py-1.5 sm:py-2.5 md:py-3 rounded-full bg-[#008CFF] hover:bg-[#1a97ff] text-white font-mono text-[9px] sm:text-xs font-bold tracking-[0.18em] uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,140,255,0.4)] hover:shadow-[0_0_35px_rgba(0,140,255,0.65)] active:scale-95 cursor-pointer"
                    >
                      <span>MORE INFO</span>
                      <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ========================================================= */}
          {/* 4. BOTTOM MIDDLE DOCK: PLAY/PAUSE, AUDIO & REEL COUNTER   */}
          {/* ========================================================= */}
          <div
            className="absolute bottom-3 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 pointer-events-none select-none z-30"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 pointer-events-auto">
              {/* Play / Pause Toggle Button (Borderless) */}
              <button
                type="button"
                onClick={togglePlayPause}
                aria-label={isUserPaused ? 'Play Reel' : 'Pause Reel'}
                title={isUserPaused ? 'Play Reel' : 'Pause Reel'}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#070B14]/85 hover:bg-[#131b2e] backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-95 cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
              >
                {isUserPaused ? (
                  <Play className="w-4 h-4 text-[#008CFF] fill-current translate-x-0.5" />
                ) : (
                  <Pause className="w-4 h-4 text-white/80 hover:text-white" />
                )}
              </button>

              {/* Audio Mute / Unmute & Vertical Volume Slider (Hover to Adjust) */}
              <div
                className="relative group flex items-center justify-center pointer-events-auto"
                onMouseEnter={() => setIsVolumeHovered(true)}
                onMouseLeave={() => {
                  if (!isDraggingVolume) setIsVolumeHovered(false);
                }}
                onWheel={(e) => {
                  e.preventDefault();
                  const delta = e.deltaY < 0 ? 0.05 : -0.05;
                  handleVolumeChange(volumeLevel + delta);
                }}
              >
                {/* Vertical Volume Bar Popup (Shows on Hover or Drag) */}
                <div
                  className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 flex flex-col items-center p-2.5 rounded-2xl bg-[#070B14]/95 backdrop-blur-xl border border-white/12 shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_20px_rgba(0,140,255,0.18)] transition-all duration-200 ease-out z-50 ${
                    isVolumeHovered || isDraggingVolume
                      ? 'opacity-100 pointer-events-auto translate-y-0'
                      : 'opacity-0 pointer-events-none translate-y-2'
                  }`}
                >
                  {/* Invisible hover bridge to prevent cursor gap drop */}
                  <div className="absolute -bottom-3 inset-x-0 h-3 pointer-events-auto" />

                  {/* Percentage Label */}
                  <span className="font-mono text-[10px] font-bold text-white/85 tracking-wider mb-2 select-none">
                    {Math.round(isMuted ? 0 : volumeLevel * 100)}%
                  </span>

                  {/* Vertical Draggable Track */}
                  <div
                    ref={volumeTrackRef}
                    onPointerDown={handleVolumeTrackPointerDown}
                    aria-label="Adjust Volume"
                    role="slider"
                    aria-valuenow={Math.round(isMuted ? 0 : volumeLevel * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="w-6 h-28 flex items-center justify-center cursor-pointer relative py-1 touch-none select-none group/track"
                  >
                    {/* Rail */}
                    <div className="w-1.5 h-full rounded-full bg-white/15 relative overflow-hidden group-hover/track:bg-white/20 transition-colors">
                      {/* Filled Volume Level */}
                      <div
                        className="absolute bottom-0 inset-x-0 bg-[#008CFF] rounded-full shadow-[0_0_8px_#008CFF] transition-all duration-75"
                        style={{ height: `${isMuted ? 0 : volumeLevel * 100}%` }}
                      />
                    </div>

                    {/* Draggable Knob / Thumb */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_rgba(0,140,255,0.9)] border border-[#008CFF] transition-all duration-75 pointer-events-none"
                      style={{
                        bottom: `calc(${isMuted ? 0 : volumeLevel * 100}% - 7px)`,
                      }}
                    />
                  </div>
                </div>

                {/* Main Volume Button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  title={isMuted ? 'Unmute Audio' : `Mute Audio (${Math.round(volumeLevel * 100)}%)`}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#070B14]/85 hover:bg-[#131b2e] backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-95 cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
                >
                  {isMuted || volumeLevel <= 0.01 ? (
                    <VolumeX className="w-4 h-4 text-white/45 hover:text-white" />
                  ) : volumeLevel < 0.5 ? (
                    <Volume1 className="w-4 h-4 text-[#008CFF]" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#008CFF]" />
                  )}
                </button>
              </div>

              {/* Clean Counter / Index Pill (Borderless) */}
              <button
                type="button"
                onClick={() => setIsIndexDrawerOpen(true)}
                title="View All Reels"
                aria-label="View All Reels"
                className="h-10 sm:h-11 flex items-center gap-2 px-4 rounded-full bg-[#070B14]/85 hover:bg-[#131b2e] backdrop-blur-md font-mono text-xs tracking-[0.22em] text-white transition-all cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.6)] active:scale-95"
              >
                <span className="text-[#008CFF] font-bold">{String(activeIndex + 1).padStart(2, '0')}</span>
                <span className="text-white/25">/</span>
                <span className="text-white/60">{String(totalProjects).padStart(2, '0')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 5. ALL PROJECTS QUICK INDEX DRAWER                                 */}
      {/* ================================================================== */}
      {isIndexDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-8 bg-[#020306]/85 backdrop-blur-3xl animate-in fade-in duration-200 select-none"
          onClick={() => setIsIndexDrawerOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[85vh] bg-[#05070B] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Electric Blue Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#008CFF]/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2.5 font-sans text-xs uppercase tracking-[0.22em] text-white/60 font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
                <span className="text-white font-bold">ALL REELS ARCHIVE</span>
                <span className="text-white/30">•</span>
                <span className="text-white/50">{totalProjects} PROJECTS</span>
              </div>

              <button
                type="button"
                aria-label="Close project list"
                onClick={() => setIsIndexDrawerOpen(false)}
                className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Project List with Sleek Obsidian Scrollbar */}
            <div className="flex-1 overflow-y-auto custom-scrollbar mt-4 divide-y divide-white/[0.06] pr-2.5 relative z-10">
              {activeProjects.map((proj, pIdx) => {
                const isSelected = activeIndex === pIdx;
                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      setIsIndexDrawerOpen(false);
                      scrollToProject(pIdx);
                    }}
                    className={`group flex items-center justify-between py-4 sm:py-5 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-white/[0.06] pl-4'
                        : 'hover:bg-white/[0.04] hover:pl-4'
                    }`}
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      <span
                        className={`font-mono text-xs sm:text-sm tracking-widest ${
                          isSelected ? 'text-[#008CFF] font-bold' : 'text-white/40 group-hover:text-white/80'
                        }`}
                      >
                        {String(pIdx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3
                          className={`font-sans text-lg sm:text-2xl font-black uppercase tracking-tight transition-colors ${
                            isSelected ? 'text-[#008CFF]' : 'text-white group-hover:text-[#008CFF]'
                          }`}
                        >
                          {proj.name}
                        </h3>
                        <p className="text-xs font-mono uppercase tracking-wider text-white/40 sm:hidden mt-0.5">
                          {proj.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8 font-mono text-xs uppercase tracking-wider text-right">
                      <span className="hidden sm:inline text-white/45">{proj.category}</span>
                      <span className="text-white/30">{proj.year}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-[#008CFF] translate-x-1' : 'text-white/30 group-hover:text-[#008CFF] group-hover:translate-x-1'
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer Cue */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40 uppercase tracking-widest relative z-10">
              <span>SELECT TO GLIDE THROUGH CORRIDOR</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. FULL SCREEN PROJECT DETAIL MODAL */}
      <ProjectDetailModal
        isOpen={isDetailModalOpen}
        project={currentProject}
        onClose={() => {
          isDetailModalOpenRef.current = false;
          setIsDetailModalOpen(false);
          if (!isUserPausedRef.current) {
            const activePanel = panelsRef.current[activeIndexRef.current];
            if (activePanel) {
              activePanel.video.muted = isMutedRef.current;
              activePanel.targetVolume = isMutedRef.current ? 0 : volumeLevelRef.current;
              activePanel.isPlaying = true;
              activePanel.video.play().catch(() => {});
            }
          }
        }}
      />
    </>
  );
};

export default PortfolioWormhole3D;
