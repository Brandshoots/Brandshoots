import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CLIENT_PROJECTS, ClientProject } from '../../data/clientsData';
import { ArrowUpRight, Play, Maximize2 } from 'lucide-react';
import { FullScreenReelModal } from './FullScreenReelModal';

gsap.registerPlugin(ScrollTrigger);

/**
 * PHASE 3 PORTFOLIO — 3D TIME MACHINE WORMHOLE CORRIDOR
 *
 * Core Concept & User Approvals:
 * - Environment: Near-black (#020306) with subtle dark light graphics & BrandShoots signature Electric Blue (#008CFF).
 * - Light Graphics in Background: Faint architectural coordinate grid lines, subtle curved horizon arc, and soft stardust motes.
 * - Reel Frame: Premium titanium curved smartphone/cinema display chassis with smooth rounded corners, beveled chamfer,
 *   flush rounded video screen, razor-thin electric blue perimeter contour line, and subtle gorilla glass specular sheen.
 * - Interactive: Hovering over active reel shows pointer + "WATCH FULLSCREEN" badge.
 *   Clicking the reel or "WATCH FULLSCREEN REEL" button immediately launches the FullScreenReelModal with unmuted audio.
 * - Geometry & Spacing: Approved 9:16 vertical ratio (1.76 × 3.12), alternating Left (-2.35) and Right (+2.35) inward walls (±22°).
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

// Procedural dark cinematic backdrop texture with subtle light graphics (near-black with BrandShoots Electric Blue #008CFF)
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

  // 3. Light Graphics: Minimal architectural coordinate grid lines (very dark, not too bright)
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

  // 5. Light Graphics: Delicate coordinate crosshairs at key grid intersections
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
  texture.needsUpdate = true;
  return texture;
}

// Procedural soft circular particle texture for 3D dust
function createDustParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  grad.addColorStop(0.25, 'rgba(120, 195, 255, 0.50)');
  grad.addColorStop(0.65, 'rgba(0, 140, 255, 0.14)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Subtle gorilla glass specular sheen texture
function createGlassGlareTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 256, 512);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
  grad.addColorStop(0.20, 'rgba(0, 140, 255, 0.06)');
  grad.addColorStop(0.50, 'rgba(255, 255, 255, 0.015)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Soft traveling backlight pocket texture (strictly BrandShoots #008CFF)
function createSoftLightTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  grad.addColorStop(0, 'rgba(0, 140, 255, 0.22)');
  grad.addColorStop(0.35, 'rgba(0, 90, 200, 0.08)');
  grad.addColorStop(0.65, 'rgba(2, 6, 20, 0.01)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const PortfolioWormhole3D: React.FC = () => {
  const totalProjects = CLIENT_PROJECTS.length; // 10 projects
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fractional scroll progress across all chapters: 0.0 to 9.0
  const [scrollUnit, setScrollUnit] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Full screen reel player state
  const [fullScreenProject, setFullScreenProject] = useState<ClientProject | null>(null);
  const [isHoveringReel, setIsHoveringReel] = useState<boolean>(false);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Backdrop & dust refs
  const backdropMeshRef = useRef<THREE.Mesh | null>(null);
  const dustGeoRef = useRef<THREE.BufferGeometry | null>(null);
  const dustBaseYRef = useRef<Float32Array | null>(null);
  const dustSpeedsRef = useRef<Float32Array | null>(null);

  // Soft traveling light pocket refs
  const lightPocketMeshRef = useRef<THREE.Mesh | null>(null);
  const lightPocketMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const pocketPointLightRef = useRef<THREE.PointLight | null>(null);

  const activeIndexRef = useRef<number>(0);
  activeIndexRef.current = activeIndex;

  const panelsRef = useRef<{
    group: THREE.Group;
    screenMesh: THREE.Mesh;
    chassisMesh: THREE.Mesh;
    rimLine: THREE.LineSegments | THREE.LineLoop;
    baseX: number;
    baseY: number;
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

  // Initialize Three.js Scene, Camera, Light Dust, Dark Backdrop, and 3D Panels
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Scene with Pure Dark Cinematic Space
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020306);
    scene.fog = new THREE.FogExp2(0x020306, 0.024);
    sceneRef.current = scene;

    // 2. Perspective Camera looking straight down center (0, 0, 0)
    const width = window.innerWidth;
    const height = window.innerHeight;
    const mobile = width < 1024;
    const camera = new THREE.PerspectiveCamera(mobile ? 52 : 44, width / height, 0.1, 85);
    camera.position.set(0, mobile ? 0.35 : 0.0, CAM_Z);
    camera.lookAt(0, mobile ? 0.35 : 0.0, 0);
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

    // 4. Subtle Dark Cinematic Backdrop with Light Graphics
    const backdropTexture = createDarkCinematicBackdropTexture();
    const backdropGeo = new THREE.PlaneGeometry(54, 34);
    const backdropMat = new THREE.MeshBasicMaterial({
      map: backdropTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const backdropMesh = new THREE.Mesh(backdropGeo, backdropMat);
    backdropMesh.position.set(0, 0, -19.0);
    scene.add(backdropMesh);
    backdropMeshRef.current = backdropMesh;

    // 5. Floating Dust Particle System (Simple, delicate stardust motes)
    const dustParticleTexture = createDustParticleTexture();
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    const dustBaseY = new Float32Array(DUST_COUNT);
    const dustSpeeds = new Float32Array(DUST_COUNT);

    for (let i = 0; i < DUST_COUNT; i++) {
      dustPositions[i * 3 + 0] = (Math.random() - 0.5) * 24; // X: -12 to +12
      const y = (Math.random() - 0.5) * 15;
      dustPositions[i * 3 + 1] = y; // Y: -7.5 to +7.5
      dustBaseY[i] = y;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 28 - 2; // Z: -16 to +12
      dustSpeeds[i] = Math.random() * 0.7 + 0.3;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeoRef.current = dustGeo;
    dustBaseYRef.current = dustBaseY;
    dustSpeedsRef.current = dustSpeeds;

    const dustMat = new THREE.PointsMaterial({
      size: 0.08,
      map: dustParticleTexture,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // 6. Atmospheric Lighting
    const ambientLight = new THREE.AmbientLight(0x060c18, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(4, 12, 8);
    scene.add(dirLight);

    // Camera accent point light (BrandShoots Electric Blue #008CFF)
    const camPointLight = new THREE.PointLight(0x008cff, 1.5, 22);
    camPointLight.position.set(0, 0, 1.5);
    camera.add(camPointLight);
    scene.add(camera);

    // 7. Soft Traveling Volumetric Light Pocket behind Active Project
    const lightPocketTexture = createSoftLightTexture();
    const lightPocketGeo = new THREE.PlaneGeometry(12, 12);
    const lightPocketMat = new THREE.MeshBasicMaterial({
      map: lightPocketTexture,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const lightPocketMesh = new THREE.Mesh(lightPocketGeo, lightPocketMat);
    lightPocketMesh.position.set(mobile ? 0 : -2.35, mobile ? 0.65 : 0.0, -2.4);
    scene.add(lightPocketMesh);
    lightPocketMeshRef.current = lightPocketMesh;
    lightPocketMatRef.current = lightPocketMat;

    // Traveling studio PointLight behind active project
    const pocketPointLight = new THREE.PointLight(0x008cff, 1.4, 14, 1.8);
    pocketPointLight.position.set(mobile ? 0 : -2.35, mobile ? 0.8 : 0.3, -1.4);
    scene.add(pocketPointLight);
    pocketPointLightRef.current = pocketPointLight;

    // 8. Construct 10 Physical 3D Reel Panels (Masterpiece Curved Chassis & Rounded Screen)
    const textureLoader = new THREE.TextureLoader();
    const glareTexture = createGlassGlareTexture();
    const panels: typeof panelsRef.current = [];

    // Shared Geometries for Ultra-Sleek Curved Titanium Cinema Display
    // A. Extruded Obsidian Titanium Chassis with smooth rounded corners and beveled chamfer
    const chassisShape = createRoundedRectShape(PANEL_WIDTH + 0.05, PANEL_HEIGHT + 0.05, CORNER_RADIUS + 0.02);
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.022,
      bevelThickness: 0.022,
    });
    chassisGeo.center();

    // B. Inner Rounded Screen Geometry with normalized UVs
    const screenGeo = createRoundedScreenGeometry(PANEL_WIDTH, PANEL_HEIGHT, CORNER_RADIUS);

    // C. Razor-thin Electric Blue (#008CFF) Rounded Contour Rim Line
    const rimLineGeo = createRoundedRimLineGeometry(PANEL_WIDTH + 0.01, PANEL_HEIGHT + 0.01, CORNER_RADIUS + 0.005, 0.028);

    // D. Rounded Glass Reflection Glare Plane
    const glareGeo = createRoundedScreenGeometry(PANEL_WIDTH, PANEL_HEIGHT, CORNER_RADIUS);

    CLIENT_PROJECTS.forEach((project, i) => {
      const panelGroup = new THREE.Group();

      // Alternating LEFT / RIGHT spatial placement
      // Even i (0, 2, 4, 6, 8): LEFT wall (X = -2.35)
      // Odd i (1, 3, 5, 7, 9): RIGHT wall (X = +2.35)
      const isLeft = i % 2 === 0;
      const baseX = mobile ? 0 : (isLeft ? -2.35 : 2.35);
      const baseY = mobile ? 0.65 : 0.0;
      const baseRotY = mobile ? (isLeft ? 0.14 : -0.14) : (isLeft ? 0.38 : -0.38); // ~22° angle

      panelGroup.position.set(baseX, baseY, 0);
      panelGroup.rotation.y = baseRotY;
      if (mobile) {
        panelGroup.scale.setScalar(0.78);
      }

      // 1. Obsidian Titanium Backplate Chassis (Curved, metallic, luxury)
      const chassisMat = new THREE.MeshStandardMaterial({
        color: 0x090e18,
        roughness: 0.22,
        metalness: 0.92,
        transparent: true,
        opacity: i === 0 ? 1.0 : 0.0,
      });
      const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
      chassisMesh.position.set(0, 0, -0.015);
      panelGroup.add(chassisMesh);

      // 2. Razor-thin BrandShoots Electric Blue (#008CFF) Contour Edge Loop
      const rimLineMat = new THREE.LineBasicMaterial({
        color: 0x008cff,
        transparent: true,
        opacity: i === 0 ? 0.55 : 0.0,
      });
      const rimLine = new THREE.LineLoop(rimLineGeo, rimLineMat);
      panelGroup.add(rimLine);

      // 3. Video element setup
      const video = document.createElement('video');
      video.src = project.videoUrl;
      video.poster = project.posterUrl;
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';

      // 4. High-res poster fallback texture
      const posterTexture = textureLoader.load(project.posterUrl);
      posterTexture.colorSpace = THREE.SRGBColorSpace;

      // 5. Rounded Screen Plane Mesh
      const screenMat = new THREE.MeshBasicMaterial({
        map: posterTexture,
        side: THREE.FrontSide,
        transparent: true,
        opacity: i === 0 ? 1.0 : 0.0,
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(0, 0, 0.024); // sit flush in front of chassis
      panelGroup.add(screenMesh);

      // 6. Delicate Gorilla Glass Glare Sheen Overlay
      const glareMat = new THREE.MeshBasicMaterial({
        map: glareTexture,
        transparent: true,
        opacity: i === 0 ? 0.08 : 0.0,
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

    // Handle Raycaster Pointer Interaction (Click to Play Full Screen & Hover Pointer)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
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
      // Ignore if clicking on UI buttons or links
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
          // Launch Full Screen Reel Video!
          setFullScreenProject(CLIENT_PROJECTS[activeIndexRef.current]);
        }
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
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

    // Continuous Animation Loop with Organic Dust Drift
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Subtle organic floating motion for dust motes
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

  // Update Dynamic Three.js Wormhole Motion & Dark Space based on Scroll Unit
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

      // Far upcoming panels: hidden ("dont keep them before only")
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
      (p.rimLine.material as THREE.LineBasicMaterial).opacity = (0.45 + activeEmphasis * 0.25) * opacity;

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
        {/* FIXED 100vw × 100vh CINEMATIC VIEWPORT PINNED FOR SCROLL PROGRESS */}
        {/* ================================================================== */}
        <div className="fixed inset-0 w-full h-full overflow-hidden flex flex-col justify-between pointer-events-none">
          {/* ========================================================= */}
          {/* 1. THREE.JS 3D WEBGL CANVAS (REAL 3D CORRIDOR ENGINE)     */}
          {/* ========================================================= */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block z-0 pointer-events-auto"
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
          {/* 3. HOVER BADGE OVER ACTIVE REEL: CLICK TO PLAY FULLSCREEN */}
          {/* ========================================================= */}
          {isHoveringReel && textOpacity > 0.5 && (
            <div
              className={`fixed z-30 pointer-events-none transition-all duration-200 hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[#008CFF]/90 text-white font-mono text-xs tracking-wider uppercase font-bold shadow-[0_0_24px_rgba(0,140,255,0.7)] backdrop-blur-md animate-pulse ${
                isLeft ? 'left-[22%] top-[50%]' : 'right-[22%] top-[50%]'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>CLICK TO PLAY FULLSCREEN</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. INTEGRATED MINIMAL PROJECT EDITORIAL INFORMATION       */}
          {/*    (Positioned cleanly on opposite side of active reel)   */}
          {/* ========================================================= */}
          <div className="relative z-10 w-full flex-1 flex items-center px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 pointer-events-none">
            <div
              className={`w-full flex pointer-events-auto transition-all duration-200 ${
                isMobile
                  ? 'justify-center items-end text-center mt-auto mb-16'
                  : isLeft
                  ? 'justify-end items-center text-left'
                  : 'justify-start items-center text-left'
              }`}
              style={{
                opacity: textOpacity,
                transform: `translateY(${(1 - textOpacity) * 16}px)`,
              }}
            >
              <div className="max-w-md lg:max-w-lg xl:max-w-xl flex flex-col">
                {/* Category / Type Kicker */}
                <div className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.26em] text-[#008CFF] font-semibold mb-1.5 sm:mb-2.5">
                  // {String(activeIndex + 1).padStart(2, '0')} • {currentProject.category} • {currentProject.year}
                </div>

                {/* Big Client Display Title */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white uppercase drop-shadow-md leading-[1.05]">
                  {currentProject.name}
                </h2>

                {/* Headline Hook */}
                <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg font-medium text-white/90 tracking-wide">
                  {currentProject.headline}
                </p>

                {/* One Clean Editorial Story Sentence */}
                <p className="mt-2 text-xs sm:text-sm md:text-base text-white/60 leading-relaxed font-sans line-clamp-3">
                  {currentProject.story}
                </p>

                {/* Discrete Watch Fullscreen Reel Action Button */}
                <div className="mt-5 sm:mt-6 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFullScreenProject(currentProject)}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#008CFF]/15 hover:bg-[#008CFF] border border-[#008CFF]/60 hover:border-[#008CFF] text-[#008CFF] hover:text-white font-mono text-xs tracking-[0.20em] uppercase font-bold transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(0,140,255,0.2)] active:scale-95 group"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-[#008CFF] group-hover:text-white" />
                    <span>WATCH FULLSCREEN REEL</span>
                    <Maximize2 className="w-3 h-3 text-[#008CFF] group-hover:text-white ml-0.5" />
                  </button>

                  <Link
                    to={`/portfolio/${currentProject.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors duration-200 group"
                  >
                    <span className="border-b border-white/20 group-hover:border-white pb-0.5">
                      DETAILS
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 5. SUBTLE BOTTOM STATUS & NAVIGATION                      */}
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

      {/* ================================================================== */}
      {/* 6. FULLSCREEN CINEMATIC REEL MODAL PLAYER                          */}
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
