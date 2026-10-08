import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CLIENT_PROJECTS, ClientProject } from '../../data/clientsData';
import { ArrowUpRight, Play, X, List, ChevronRight } from 'lucide-react';
import { FullScreenReelModal } from './FullScreenReelModal';

gsap.registerPlugin(ScrollTrigger);

/**
 * BRANDSHOOTS PORTFOLIO — 3D TIME MACHINE CORRIDOR & EDITORIAL ARCHIVE
 *
 * Art-direction & interaction inspired by Joseph Berry:
 * - Direct numbered progression (01-08) & dynamic project tracking
 * - Smooth scroll-driven directional text transitions with inertia drift
 * - Giant typographic watermark numbers behind editorial copy
 * - Interactive cursor-driven 3D parallax depth on cinema chassis
 * - "ALL PROJECTS [08]" Quick Index Drawer for immediate project jumping
 * - Consistent BrandShoots Homepage visual identity:
 *   Electric blue (#008CFF), deep obsidian (#020306), Figtree & Display typography,
 *   refined deliverable tags, metallic buttons, and buttery Lenis scroll sync.
 */

const PANEL_WIDTH = 1.76;
const PANEL_HEIGHT = 3.12; // exact 9:16 vertical reel proportion
const CORNER_RADIUS = 0.15; // smooth luxurious rounded corners
const CAM_Z = 7.0; // camera distance from active plane at Z = 0
const DUST_COUNT = 140;

// Helper: Create rounded rectangle shape in Three.js
function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const w = width;
  const h = height;
  const r = radius;

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

// Helper: Create rounded screen geometry with normalized UV coordinates
function createRoundedScreenGeometry(w: number, h: number, r: number): THREE.BufferGeometry {
  const shape = createRoundedRectShape(w, h, r);
  const geo = new THREE.ShapeGeometry(shape, 28);
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

// Helper: Create continuous perimeter line for the electric blue rim contour
function createRoundedRimLineGeometry(w: number, h: number, r: number, z: number = 0.028): THREE.BufferGeometry {
  const shape = createRoundedRectShape(w, h, r);
  const points = shape.getPoints(54);
  const pts3D = points.map((p) => new THREE.Vector3(p.x, p.y, z));
  pts3D.push(pts3D[0].clone()); // close loop
  return new THREE.BufferGeometry().setFromPoints(pts3D);
}

// Procedural dark cinematic backdrop texture with subtle light graphics
function createDarkCinematicBackdropTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Rich near-black studio base
  ctx.fillStyle = '#020306';
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. Faint BrandShoots Electric Blue (#008CFF) volumetric ambient glow in deep center
  const centerGlow = ctx.createRadialGradient(512, 512, 50, 512, 512, 520);
  centerGlow.addColorStop(0, 'rgba(0, 140, 255, 0.09)');
  centerGlow.addColorStop(0.35, 'rgba(0, 95, 210, 0.04)');
  centerGlow.addColorStop(0.70, 'rgba(0, 40, 120, 0.01)');
  centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, 1024, 1024);

  // 3. Light Graphics: Minimal architectural coordinate grid lines
  ctx.strokeStyle = 'rgba(0, 140, 255, 0.035)';
  ctx.lineWidth = 1;
  const gridSize = 72;
  for (let x = 0; x <= 1024; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // 4. Light Graphics: Subtle curved horizon arc
  ctx.strokeStyle = 'rgba(0, 140, 255, 0.08)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(512, 980, 680, Math.PI * 1.18, Math.PI * 1.82);
  ctx.stroke();

  // 5. Light Graphics: Delicate coordinate crosshairs
  ctx.strokeStyle = 'rgba(0, 140, 255, 0.12)';
  ctx.lineWidth = 1.5;
  const crosshairPoints = [
    { x: 216, y: 288 },
    { x: 808, y: 288 },
    { x: 512, y: 504 },
    { x: 216, y: 720 },
    { x: 808, y: 720 },
  ];
  crosshairPoints.forEach((pt) => {
    ctx.beginPath();
    ctx.moveTo(pt.x - 7, pt.y);
    ctx.lineTo(pt.x + 7, pt.y);
    ctx.moveTo(pt.x, pt.y - 7);
    ctx.lineTo(pt.x, pt.y + 7);
    ctx.stroke();
  });

  // 6. Subtle micro stardust motes in deep space
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const radius = Math.random() * 0.9 + 0.3;
    const alpha = Math.random() * 0.22 + 0.05;
    ctx.fillStyle = `rgba(180, 220, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Procedural volumetric glow texture for the traveling light pocket
function createLightPocketTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 250);
  grad.addColorStop(0, 'rgba(0, 140, 255, 0.40)');
  grad.addColorStop(0.25, 'rgba(0, 120, 240, 0.22)');
  grad.addColorStop(0.55, 'rgba(0, 70, 180, 0.08)');
  grad.addColorStop(0.85, 'rgba(0, 30, 90, 0.02)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Procedural soft stardust circle sprite
function createDustParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  grad.addColorStop(0.3, 'rgba(0, 140, 255, 0.6)');
  grad.addColorStop(0.7, 'rgba(0, 100, 220, 0.2)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}

// Procedural subtle diagonal gorilla glass reflection sheen
function createGlassGlareTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 256, 512);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
  grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.035)');
  grad.addColorStop(0.48, 'rgba(255, 255, 255, 0.12)');
  grad.addColorStop(0.52, 'rgba(255, 255, 255, 0.14)');
  grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.035)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);

  return new THREE.CanvasTexture(canvas);
}

interface PanelData {
  group: THREE.Group;
  screenMesh: THREE.Mesh;
  chassisMesh: THREE.Mesh;
  rimLine: THREE.LineSegments;
  baseX: number;
  baseY: number;
  baseRotY: number;
  video: HTMLVideoElement;
  videoTexture: THREE.VideoTexture | null;
  posterTexture: THREE.Texture;
  isPlaying: boolean;
}

export const PortfolioWormhole3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorialContentRef = useRef<HTMLDivElement>(null);

  const [scrollUnit, setScrollUnit] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [fullScreenProject, setFullScreenProject] = useState<ClientProject | null>(null);
  const [isHoveringReel, setIsHoveringReel] = useState<boolean>(false);
  const [isIndexDrawerOpen, setIsIndexDrawerOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 1024);

  const activeIndexRef = useRef<number>(0);
  activeIndexRef.current = activeIndex;

  const totalProjects = CLIENT_PROJECTS.length;

  // Interactive Cursor Parallax Refs
  const targetMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Three.js Scene References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const panelsRef = useRef<PanelData[]>([]);
  const backdropMeshRef = useRef<THREE.Mesh | null>(null);
  const lightPocketMeshRef = useRef<THREE.Mesh | null>(null);
  const lightPocketMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
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

  // Keyboard navigation & ESC handler for drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isIndexDrawerOpen) setIsIndexDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isIndexDrawerOpen]);

  // GSAP Editorial Stagger Reveal on Project Change
  useEffect(() => {
    const el = editorialContentRef.current;
    if (el) {
      gsap.killTweensOf(el.children);
      gsap.fromTo(
        el.children,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.42, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [activeIndex]);

  // Setup Three.js Wormhole Corridor Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const mob = width < 1024;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020306');
    scene.fog = new THREE.FogExp2('#020306', 0.04);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(mob ? 52 : 44, width / height, 0.1, 100);
    camera.position.set(0, mob ? 0.35 : 0.0, CAM_Z);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const keyDirectionalLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyDirectionalLight.position.set(4, 6, 8);
    scene.add(keyDirectionalLight);

    const studioFillLight = new THREE.DirectionalLight(0x008cff, 0.85);
    studioFillLight.position.set(-6, -2, 4);
    scene.add(studioFillLight);

    const pocketPointLight = new THREE.PointLight(0x008cff, 1.8, 14, 1.4);
    pocketPointLight.position.set(mob ? 0 : -2.35, 0.2, -1.6);
    scene.add(pocketPointLight);
    pocketPointLightRef.current = pocketPointLight;

    // 5. Cinematic Backdrop with subtle Light Graphics
    const backdropTexture = createDarkCinematicBackdropTexture();
    const backdropGeo = new THREE.PlaneGeometry(38, 26);
    const backdropMat = new THREE.MeshBasicMaterial({
      map: backdropTexture,
      depthWrite: false,
    });
    const backdropMesh = new THREE.Mesh(backdropGeo, backdropMat);
    backdropMesh.position.set(0, 0, -18);
    scene.add(backdropMesh);
    backdropMeshRef.current = backdropMesh;

    // 6. Traveling Volumetric Light Pocket Plane
    const lightPocketTexture = createLightPocketTexture();
    const lightPocketGeo = new THREE.PlaneGeometry(9.5, 9.5);
    const lightPocketMat = new THREE.MeshBasicMaterial({
      map: lightPocketTexture,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lightPocketMesh = new THREE.Mesh(lightPocketGeo, lightPocketMat);
    lightPocketMesh.position.set(mob ? 0 : -2.35, 0.0, -2.5);
    scene.add(lightPocketMesh);
    lightPocketMeshRef.current = lightPocketMesh;
    lightPocketMatRef.current = lightPocketMat;

    // 7. Ambient Stardust Motes
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    const dustBaseY = new Float32Array(DUST_COUNT);
    const dustSpeeds = new Float32Array(DUST_COUNT);

    for (let i = 0; i < DUST_COUNT; i++) {
      dustPositions[i * 3 + 0] = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 12;
      dustPositions[i * 3 + 1] = y;
      dustBaseY[i] = y;
      dustPositions[i * 3 + 2] = -Math.random() * 20;
      dustSpeeds[i] = 0.5 + Math.random() * 0.9;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustParticleTexture = createDustParticleTexture();
    const dustMat = new THREE.PointsMaterial({
      size: 0.18,
      map: dustParticleTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);
    dustGeoRef.current = dustGeo;
    dustBaseYRef.current = dustBaseY;
    dustSpeedsRef.current = dustSpeeds;

    // 8. Construct Titanium Curved Chassis & Rounded Video Screens
    const chassisThickness = 0.055;
    const chassisGeo = new THREE.BoxGeometry(
      PANEL_WIDTH + 0.08,
      PANEL_HEIGHT + 0.08,
      chassisThickness
    );
    const screenGeo = createRoundedScreenGeometry(PANEL_WIDTH, PANEL_HEIGHT, CORNER_RADIUS);
    const rimLineGeo = createRoundedRimLineGeometry(PANEL_WIDTH + 0.005, PANEL_HEIGHT + 0.005, CORNER_RADIUS, 0.029);

    const glareTexture = createGlassGlareTexture();
    const glareGeo = new THREE.PlaneGeometry(PANEL_WIDTH, PANEL_HEIGHT);

    const textureLoader = new THREE.TextureLoader();
    const panels: PanelData[] = [];

    CLIENT_PROJECTS.forEach((project, i) => {
      const panelGroup = new THREE.Group();

      const isLeft = i % 2 === 0;
      const baseX = mob ? 0 : (isLeft ? -2.35 : 2.35);
      const baseY = mob ? 0.65 : 0.0;
      const baseRotY = mob ? (isLeft ? 0.14 : -0.14) : (isLeft ? 0.38 : -0.38);

      panelGroup.position.set(baseX, baseY, 0);
      panelGroup.rotation.y = baseRotY;

      // Chassis Body: Brushed Titanium Bezel
      const chassisMat = new THREE.MeshStandardMaterial({
        color: 0x181a20,
        metalness: 0.92,
        roughness: 0.32,
        envMapIntensity: 1.2,
      });
      const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
      chassisMesh.position.set(0, 0, 0);
      panelGroup.add(chassisMesh);

      // Poster Texture (Initial crisp display)
      const posterTexture = textureLoader.load(project.posterUrl);
      posterTexture.colorSpace = THREE.SRGBColorSpace;

      // Hidden Video Element for active playback
      const video = document.createElement('video');
      video.src = project.videoUrl;
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';

      // Screen Mesh: Rounded corners with flush titanium seating
      const screenMat = new THREE.MeshBasicMaterial({
        map: posterTexture,
        transparent: true,
        opacity: 1.0,
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(0, 0, 0.028);
      panelGroup.add(screenMesh);

      // Razor-thin Electric Blue Rim Contour Line
      const rimMat = new THREE.LineBasicMaterial({
        color: 0x008cff,
        transparent: true,
        opacity: 0.55,
        linewidth: 1.5,
      });
      const rimLine = new THREE.LineSegments(rimLineGeo, rimMat);
      panelGroup.add(rimLine);

      // Gorilla Glass Reflection Glare
      const glareMat = new THREE.MeshBasicMaterial({
        map: glareTexture,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const glareMesh = new THREE.Mesh(glareGeo, glareMat);
      glareMesh.position.set(0, 0, 0.029);
      panelGroup.add(glareMesh);

      // Initially show only Chapter 0
      panelGroup.visible = i === 0;

      scene.add(panelGroup);

      panels.push({
        group: panelGroup,
        screenMesh,
        chassisMesh,
        rimLine,
        baseX,
        baseY,
        baseRotY,
        video,
        videoTexture: null,
        posterTexture,
        isPlaying: false,
      });
    });

    panelsRef.current = panels;

    // Raycaster Pointer Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      // Track normalized mouse for 3D cursor parallax
      targetMouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!cameraRef.current) return;
      raycaster.setFromCamera(mouse, cameraRef.current);

      const activePanel = panelsRef.current[activeIndexRef.current];
      if (activePanel && activePanel.group.visible) {
        const intersects = raycaster.intersectObjects([activePanel.screenMesh, activePanel.chassisMesh], true);
        if (intersects.length > 0) {
          canvas.style.cursor = 'pointer';
          setIsHoveringReel(true);
          return;
        }
      }
      canvas.style.cursor = 'default';
      setIsHoveringReel(false);
    };

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!cameraRef.current) return;
      raycaster.setFromCamera(mouse, cameraRef.current);

      const activePanel = panelsRef.current[activeIndexRef.current];
      if (activePanel && activePanel.group.visible) {
        const intersects = raycaster.intersectObjects([activePanel.screenMesh, activePanel.chassisMesh], true);
        if (intersects.length > 0) {
          setFullScreenProject(CLIENT_PROJECTS[activeIndexRef.current]);
        }
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('click', handlePointerDown);

    // Handle Window Resize
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMob = w < 1024;
      if (cameraRef.current) {
        cameraRef.current.fov = isMob ? 52 : 44;
        cameraRef.current.aspect = w / h;
        cameraRef.current.position.y = isMob ? 0.35 : 0.0;
        cameraRef.current.updateProjectionMatrix();
      }
      if (rendererRef.current) {
        rendererRef.current.setSize(w, h);
      }
      // Update responsive coordinates
      panels.forEach((p, idx) => {
        const isLeft = idx % 2 === 0;
        p.baseX = isMob ? 0 : (isLeft ? -2.35 : 2.35);
        p.baseY = isMob ? 0.65 : 0.0;
        p.baseRotY = isMob ? (isLeft ? 0.14 : -0.14) : (isLeft ? 0.38 : -0.38);
      });
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with Organic Dust Drift and Interactive Cursor Parallax
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth cursor parallax lerp
      currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * 0.04;
      currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * 0.04;

      // Gentle interactive tilt on camera & active panel
      if (cameraRef.current) {
        cameraRef.current.rotation.y = -currentMouseRef.current.x * 0.022;
        cameraRef.current.rotation.x = currentMouseRef.current.y * 0.018;
      }

      const activePanel = panelsRef.current[activeIndexRef.current];
      if (activePanel && activePanel.group.visible) {
        activePanel.group.rotation.x = currentMouseRef.current.y * 0.04;
      }

      // Organic floating motion for dust motes
      if (dustGeoRef.current && dustBaseYRef.current && dustSpeedsRef.current) {
        const posAttr = dustGeoRef.current.getAttribute('position') as THREE.BufferAttribute;
        const time = Date.now() * 0.0006;
        for (let i = 0; i < DUST_COUNT; i++) {
          const y = dustBaseYRef.current[i] + Math.sin(time * dustSpeedsRef.current[i] + i) * 0.22;
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
      window.removeEventListener('click', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      panels.forEach((p) => {
        p.video.pause();
        p.video.src = '';
        p.videoTexture?.dispose();
        p.posterTexture.dispose();
      });
      chassisGeo.dispose();
      screenGeo.dispose();
      rimLineGeo.dispose();
      glareGeo.dispose();
      backdropTexture.dispose();
      dustParticleTexture.dispose();
      lightPocketTexture.dispose();
      glareTexture.dispose();
      renderer.dispose();
    };
  }, []);

  // Update Three.js Wormhole Motion & Dark Space based on Scroll Unit
  const updateThreeScene = useCallback((u: number) => {
    const panels = panelsRef.current;
    const camera = cameraRef.current;
    if (panels.length === 0 || !camera) return;

    const mobile = window.innerWidth < 1024;
    const baseScale = mobile ? 0.78 : 1.0;

    // 1. Calculate Active Chapters & Transition Interpolation
    const currentChapter = Math.min(panels.length - 1, Math.max(0, Math.floor(u)));
    const nextChapter = Math.min(panels.length - 1, currentChapter + 1);
    const frac = u - currentChapter; // 0.0 to 1.0
    const smoothFrac = frac * frac * (3 - 2 * frac);

    const isCurrentLeft = currentChapter % 2 === 0;
    const isNextLeft = nextChapter % 2 === 0;

    const curLightX = mobile ? 0 : (isCurrentLeft ? -2.35 : 2.35);
    const nextLightX = mobile ? 0 : (isNextLeft ? -2.35 : 2.35);
    const targetLightX = curLightX + (nextLightX - curLightX) * smoothFrac;

    // Snap focus emphasis factor: 1.0 at rest, dims down during travel
    const snapDist = Math.abs(u - Math.round(u));
    const snapFocus = Math.max(0, 1.0 - snapDist * 2.8);

    // 2. Cinematic Traveling Light Pocket in Dark Space
    const midTravelDip = Math.sin(Math.PI * frac); // 0 at settle, 1 at mid-scroll
    if (lightPocketMeshRef.current && lightPocketMatRef.current) {
      lightPocketMeshRef.current.position.x = targetLightX;
      lightPocketMeshRef.current.position.y = mobile ? 0.65 : 0.0;
      lightPocketMeshRef.current.position.z = -2.4 - 1.8 * midTravelDip;
      lightPocketMatRef.current.opacity = 0.12 + snapFocus * 0.06;
    }

    if (pocketPointLightRef.current) {
      pocketPointLightRef.current.position.x = targetLightX;
      pocketPointLightRef.current.position.y = mobile ? 0.8 : 0.3;
      pocketPointLightRef.current.position.z = -1.4 - 1.2 * midTravelDip;
      pocketPointLightRef.current.intensity = 1.2 + snapFocus * 0.6;
    }

    // 3. Subtle Parallax for Backdrop
    if (backdropMeshRef.current) {
      backdropMeshRef.current.position.x = targetLightX * 0.08;
    }

    // 4. Subtle Restrained Cinematic Camera Motion
    const camPushZ = midTravelDip * 0.28;
    const camDriftY = Math.sin(u * Math.PI) * 0.035;
    const activeIsLeft = Math.round(u) % 2 === 0;
    const activeTargetX = mobile ? 0 : (activeIsLeft ? -2.35 : 2.35);
    const camLeanX = activeTargetX * 0.05 * (1.0 - midTravelDip * 0.5);

    camera.position.z = CAM_Z - camPushZ;
    camera.position.y = (mobile ? 0.35 : 0.0) + camDriftY;
    camera.position.x = camLeanX;
    camera.lookAt(camLeanX * 0.3, camera.position.y, 0);

    // 5. Panel Transitions Dynamics
    panels.forEach((p, idx) => {
      const delta = u - idx; // 0 = active hero, < 0 = upcoming (entering), > 0 = exiting

      // Far upcoming panels: hidden
      if (delta <= -1.0) {
        p.group.visible = false;
        if (p.isPlaying) {
          p.isPlaying = false;
          p.video.pause();
          (p.screenMesh.material as THREE.MeshBasicMaterial).map = p.posterTexture;
          (p.screenMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
        }
        return;
      }

      // Far exited panels: hidden
      if (delta >= 1.0) {
        p.group.visible = false;
        if (p.isPlaying) {
          p.isPlaying = false;
          p.video.pause();
          (p.screenMesh.material as THREE.MeshBasicMaterial).map = p.posterTexture;
          (p.screenMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
        }
        return;
      }

      // Actively transitioning or hero: visible
      p.group.visible = true;

      let posX = p.baseX;
      let posY = p.baseY;
      let posZ = 0;
      let rotY = p.baseRotY;
      let scale = baseScale;
      let opacity = 1.0;

      if (delta < 0) {
        // Entering from 3D wormhole depth (delta: -1.0 -> 0.0)
        const t = 1.0 + delta;
        const ease = t * t * (3 - 2 * t);

        posZ = -14.0 * (1.0 - ease);
        posX = mobile ? 0 : p.baseX * (0.35 + 0.65 * ease);
        rotY = p.baseRotY * (0.6 + 0.4 * ease);
        scale = baseScale * (0.45 + 0.55 * ease);
        opacity = Math.min(1.0, ease * 1.5);
      } else if (delta > 0) {
        // Exiting off to the side past camera (delta: 0.0 -> 1.0)
        const t = delta;
        const ease = t * t;

        posZ = 5.5 * ease;
        posX = mobile
          ? p.baseX + (idx % 2 === 0 ? -1.8 : 1.8) * ease
          : p.baseX * (1.0 + 1.25 * ease);
        rotY = p.baseRotY * (1.0 + 0.85 * ease);
        scale = baseScale * (1.0 + 0.3 * ease);
        opacity = Math.max(0.0, 1.0 - ease * 1.2);
      }

      p.group.position.set(posX, posY, posZ);
      p.group.rotation.y = rotY;
      p.group.scale.setScalar(scale);

      // Material opacities & subtle rim-light emphasis
      (p.screenMesh.material as THREE.MeshBasicMaterial).opacity = opacity;
      (p.chassisMesh.material as THREE.MeshStandardMaterial).opacity = opacity;

      // Rim light glint peaks slightly when snapped in focus
      const dist = Math.abs(delta);
      const activeEmphasis = dist < 0.35 ? (1.0 - dist * 2.8) : 0;
      (p.rimLine.material as THREE.LineBasicMaterial).opacity = (0.45 + activeEmphasis * 0.35) * opacity;

      // Video playback: play only when in close hero focus
      if (dist < 0.65 && opacity > 0.6) {
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

  // Jump smoothly to project chapter (supports Lenis smooth glide)
  const scrollToProject = useCallback(
    (index: number) => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const totalScrollable = container.offsetHeight - window.innerHeight;
      const targetTop = container.offsetTop + (index / (totalProjects - 1)) * totalScrollable;

      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(targetTop, { duration: 1.15 });
      } else {
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });
      }
    },
    [totalProjects]
  );

  // Active project data
  const currentProject: ClientProject = CLIENT_PROJECTS[activeIndex] || CLIENT_PROJECTS[0];
  const isLeft = activeIndex % 2 === 0;

  // Editorial directional drift & smooth opacity during scroll
  const scrollDelta = scrollUnit - activeIndex;
  const editorialDriftY = scrollDelta * -24; // gentle inertia glide in direction of scroll
  const editorialOpacity = Math.max(0.18, 1 - Math.abs(scrollDelta) * 1.5);

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full bg-[#020306] text-white select-none"
        style={{
          // 100vh per project for generous scroll travel and exact snap settle
          height: `${totalProjects * 100}vh`,
        }}
      >
        {/* ================================================================== */}
        {/* STICKY 100vw × 100vh CINEMATIC VIEWPORT PINNED FOR SCROLL PROGRESS */}
        {/* ================================================================== */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pointer-events-none">
          {/* ========================================================= */}
          {/* 1. THREE.JS 3D WEBGL CANVAS (REAL 3D CORRIDOR ENGINE)     */}
          {/* ========================================================= */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block z-0 pointer-events-auto"
          />

          {/* ========================================================= */}
          {/* 2. TOP HUD: MINIMAL ARCHIVE & PROJECT COUNTER             */}
          {/* ========================================================= */}
          <div className="relative z-20 w-full px-5 sm:px-10 md:px-14 pt-20 sm:pt-24 md:pt-28 flex items-center justify-between pointer-events-none">
            {/* Minimal Editorial Kicker */}
            <div className="flex items-center gap-2.5 font-sans text-xs tracking-[0.24em] uppercase text-white/60 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
              <span>SELECTED ARCHIVE</span>
            </div>

            {/* Clean Project Counter */}
            <div className="font-mono text-xs sm:text-sm tracking-[0.22em] text-white/50">
              <span className="text-white font-bold">{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className="text-white/30 mx-1.5">/</span>
              <span>{String(totalProjects).padStart(2, '0')}</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. HOVER BADGE OVER ACTIVE REEL: CLICK TO WATCH FULLSCREEN */}
          {/* ========================================================= */}
          {isHoveringReel && (
            <div
              className={`fixed z-30 pointer-events-none transition-all duration-300 hidden md:flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-[#04060A]/85 text-white border border-white/20 font-sans text-xs tracking-[0.16em] uppercase font-semibold shadow-[0_8px_32px_rgba(0,0,0,0.85)] backdrop-blur-xl ${
                isLeft ? 'left-[22%] top-[50%]' : 'right-[22%] top-[50%]'
              } -translate-y-1/2`}
            >
              <Play className="w-3.5 h-3.5 fill-[#008CFF] text-[#008CFF]" />
              <span className="text-white/90">WATCH REEL</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. INTEGRATED EDITORIAL LAYOUT (JOSEPH BERRY INSPIRED)     */}
          {/*    (Positioned cleanly on opposite side of active reel)   */}
          {/* ========================================================= */}
          <div className="relative z-10 w-full flex-1 flex items-center px-5 sm:px-10 md:px-14 lg:px-20 xl:px-28 pointer-events-none">
            <div
              className={`relative w-full flex pointer-events-auto ${
                isMobile
                  ? 'justify-center items-end text-center mt-auto mb-20 pb-4'
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
              <div className="relative max-w-md lg:max-w-lg xl:max-w-xl flex flex-col">
                {/* Large Background Watermark Number (Faint & Editorial) */}
                <div
                  className={`absolute z-0 font-display font-black tracking-tighter text-white/[0.025] select-none pointer-events-none leading-none ${
                    isMobile
                      ? 'top-[-2.5rem] left-1/2 -translate-x-1/2 text-[32vw]'
                      : '-top-14 sm:-top-20 -left-6 sm:-left-10 text-[18vw] lg:text-[19vw]'
                  }`}
                  aria-hidden="true"
                >
                  {String(activeIndex + 1).padStart(2, '0')}
                </div>

                {/* Animated Editorial Content Block — Minimal, Focused, Clean */}
                <div ref={editorialContentRef} className="relative z-10 flex flex-col">
                  {/* PROJECT NUMBER */}
                  <div className={`font-mono text-xs sm:text-[13px] tracking-[0.3em] uppercase text-[#008CFF] font-semibold mb-3 ${isMobile ? 'text-center' : ''}`}>
                    PROJECT — {String(activeIndex + 1).padStart(2, '0')}
                  </div>

                  {/* PROJECT NAME (Dominant & Monumental) */}
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-[-0.035em] text-white uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] leading-[0.95]">
                    {currentProject.name}
                  </h2>

                  {/* SHORT ONE-LINE DESCRIPTION */}
                  <p className="mt-3.5 sm:mt-4 text-sm sm:text-base md:text-lg font-sans font-normal text-white/70 leading-relaxed line-clamp-2">
                    {currentProject.headline}
                  </p>

                  {/* ACTION BUTTONS (WATCH REEL / VIEW PROJECT) */}
                  <div className={`mt-6 sm:mt-7 flex items-center gap-3.5 ${isMobile ? 'justify-center' : ''}`}>
                    <button
                      type="button"
                      onClick={() => setFullScreenProject(currentProject)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#008CFF] hover:bg-[#007fe6] text-white font-sans text-xs tracking-[0.16em] uppercase font-semibold transition-all duration-200 cursor-pointer shadow-[0_4px_16px_rgba(0,140,255,0.35)] active:scale-95 group"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-white" />
                      <span>WATCH REEL</span>
                    </button>

                    <Link
                      to={`/portfolio/${currentProject.slug}`}
                      className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-white/20 hover:border-white/50 text-white/80 hover:text-white font-sans text-xs tracking-[0.16em] uppercase font-medium transition-all duration-200 active:scale-95 group"
                    >
                      <span>VIEW PROJECT</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-white/60 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 5. BOTTOM NAVIGATION HUD (NUMBERED STEPPER & INDEX DRAWER) */}
          {/* ========================================================= */}
          <div className="relative z-20 w-full px-5 sm:px-10 md:px-14 pb-5 sm:pb-7 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.22em] pointer-events-auto">
            {/* Scroll Cue */}
            <div className="flex items-center gap-2 text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
              <span className="hidden sm:inline">SCROLL TO NAVIGATE</span>
              <span className="sm:hidden">SCROLL</span>
            </div>

            {/* Center: Numbered Stepper Pills (Joseph Berry Numbered Progression) */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-[#04060A]/80 backdrop-blur-2xl border border-white/10 px-2 sm:px-3 py-1 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              {CLIENT_PROJECTS.map((_, pIdx) => {
                const isActive = activeIndex === pIdx;
                return (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => scrollToProject(pIdx)}
                    aria-label={`Jump to project ${pIdx + 1}`}
                    className={`px-1.5 sm:px-2.5 py-0.5 rounded-full font-mono text-[10px] sm:text-xs tracking-wider transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#008CFF] text-white font-bold shadow-[0_0_12px_rgba(0,140,255,0.7)]'
                        : 'text-white/40 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    {String(pIdx + 1).padStart(2, '0')}
                  </button>
                );
              })}
            </div>

            {/* Right: Quick "ALL PROJECTS [08]" Index Trigger */}
            <button
              type="button"
              onClick={() => setIsIndexDrawerOpen(true)}
              className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/30 px-3 sm:px-4 py-1.5 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
            >
              <List className="w-3.5 h-3.5 text-[#008CFF]" />
              <span>INDEX [{String(totalProjects).padStart(2, '0')}]</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 6. ALL PROJECTS QUICK INDEX DRAWER (JOSEPH BERRY INSPIRED)         */}
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
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.26em] text-white/50">
                <span className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
                <span className="text-white font-bold">PROJECT INDEX</span>
                <span className="text-white/25">//</span>
                <span>[{String(totalProjects).padStart(2, '0')} ARCHIVED REELS]</span>
              </div>

              <button
                type="button"
                aria-label="Close project index"
                onClick={() => setIsIndexDrawerOpen(false)}
                className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Project List */}
            <div className="flex-1 overflow-y-auto mt-4 divide-y divide-white/[0.06] pr-1 relative z-10">
              {CLIENT_PROJECTS.map((proj, pIdx) => {
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
                          className={`font-display text-lg sm:text-2xl font-black uppercase tracking-tight transition-colors ${
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
              <span className="text-[#008CFF]">[ESC TO EXIT]</span>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 7. FULLSCREEN CINEMATIC REEL MODAL PLAYER                          */}
      {/* ================================================================== */}
      <FullScreenReelModal
        isOpen={Boolean(fullScreenProject)}
        project={fullScreenProject}
        onClose={() => setFullScreenProject(null)}
      />
    </>
  );
};

export default PortfolioWormhole3D;
