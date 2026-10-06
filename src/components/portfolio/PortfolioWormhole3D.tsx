import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CLIENT_PROJECTS, ClientProject } from '../../data/clientsData';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * PHASE 3 PORTFOLIO — CINEMATIC ENVIRONMENT REFRESH
 *
 * Core Enhancements (Preserving all approved geometry, typography & layout):
 * 1. Physical Studio Environment:
 *    - Studio Cyclorama Back Wall (Z = -6.5) receiving dynamic 3D light falloff.
 *    - Polished Dark Concrete/Epoxy Floor (Y = -1.62) with subtle perspective seams & specular sheen.
 *    - Grounding Contact Shadow (Ambient Occlusion) right under each reel footprint.
 *    - Soft Inverted Glossy Floor Reflection beneath the reel, visually grounding it in space.
 * 2. Cinematic Light Tunnel / Traveling Pocket Light:
 *    - Soft volumetric blue atmospheric haze pocket behind the active project (Z = -2.2).
 *    - As user scrolls, the pocket light dynamically travels through depth and laterally (Left ↔ Right).
 *    - Back wall and floor catch the shifting studio illumination.
 * 3. Scroll-Driven Lighting & Active Emphasis:
 *    - When settled in snap focus, light intensity and rim glint subtly peak.
 * 4. Subtle Cinematic Camera Motion:
 *    - Restrained forward push (0.28 units), organic vertical drift (0.035 units), and lateral dolly lean (0.12 units).
 * 5. Mobile Optimized:
 *    - Floor and light pocket adapt to mobile bounds (Y = -0.82) with 60fps performance.
 */

const PANEL_WIDTH = 1.76;
const PANEL_HEIGHT = 3.12; // exact 9:16 vertical reel proportion
const CAM_Z = 7.0; // camera distance from active plane at Z = 0

// In-memory procedural soft radial gradient for volumetric back pocket
function createSoftLightTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  grad.addColorStop(0, 'rgba(0, 140, 255, 0.32)');
  grad.addColorStop(0.35, 'rgba(0, 90, 210, 0.16)');
  grad.addColorStop(0.65, 'rgba(2, 14, 45, 0.05)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// In-memory procedural contact shadow (ambient occlusion under base of reel)
function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 64, 0, 128, 64, 120);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.45)');
  grad.addColorStop(0.85, 'rgba(0, 10, 25, 0.15)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// In-memory procedural dark studio floor with subtle perspective depth seams
function createStudioFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Dark studio base
  ctx.fillStyle = '#03050a';
  ctx.fillRect(0, 0, 1024, 1024);

  // Very subtle studio concrete grain / noise
  ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Faint studio floor panel seams (spaced every 128px)
  ctx.strokeStyle = 'rgba(0, 140, 255, 0.035)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 1024; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
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

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Environmental lighting & meshes refs
  const floorMeshRef = useRef<THREE.Mesh | null>(null);
  const backWallMeshRef = useRef<THREE.Mesh | null>(null);
  const lightPocketMeshRef = useRef<THREE.Mesh | null>(null);
  const lightPocketMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const pocketPointLightRef = useRef<THREE.PointLight | null>(null);

  const panelsRef = useRef<{
    group: THREE.Group;
    screenMesh: THREE.Mesh;
    chassisMesh: THREE.Mesh;
    rimLine: THREE.LineSegments;
    contactShadowMesh: THREE.Mesh;
    floorReflectionMesh: THREE.Mesh;
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

  // Initialize Three.js Scene, Camera, Physical Environment, Lights, and 3D Panels
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Scene with Pure Black Background and Calibrated Distance Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020305);
    scene.fog = new THREE.FogExp2(0x020305, 0.022);
    sceneRef.current = scene;

    // 2. Perspective Camera
    const width = window.innerWidth;
    const height = window.innerHeight;
    const mobile = width < 1024;
    const camera = new THREE.PerspectiveCamera(mobile ? 52 : 44, width / height, 0.1, 80);
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

    // 4. Physical Studio Environment: Dark Polished Studio Floor
    const floorTexture = createStudioFloorTexture();
    const floorGeo = new THREE.PlaneGeometry(44, 44);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.38,
      metalness: 0.65,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, mobile ? -0.82 : -1.62, -4.0);
    scene.add(floorMesh);
    floorMeshRef.current = floorMesh;

    // 5. Studio Cyclorama Back Wall (Catches soft environmental studio light)
    const backWallGeo = new THREE.PlaneGeometry(54, 30);
    const backWallMat = new THREE.MeshStandardMaterial({
      color: 0x03050a,
      roughness: 0.85,
      metalness: 0.15,
    });
    const backWallMesh = new THREE.Mesh(backWallGeo, backWallMat);
    backWallMesh.position.set(0, 0, -6.8);
    scene.add(backWallMesh);
    backWallMeshRef.current = backWallMesh;

    // 6. Studio Lighting System
    const ambientLight = new THREE.AmbientLight(0x0c1424, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(4, 12, 8);
    scene.add(dirLight);

    // Subtle blue accent specular point light attached to camera
    const camPointLight = new THREE.PointLight(0x008cff, 1.8, 22);
    camPointLight.position.set(0, 0, 1.5);
    camera.add(camPointLight);
    scene.add(camera);

    // 7. Traveling Volumetric Light Corridor Pocket behind Active Project
    const lightPocketTexture = createSoftLightTexture();
    const lightPocketGeo = new THREE.PlaneGeometry(12, 12);
    const lightPocketMat = new THREE.MeshBasicMaterial({
      map: lightPocketTexture,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const lightPocketMesh = new THREE.Mesh(lightPocketGeo, lightPocketMat);
    lightPocketMesh.position.set(mobile ? 0 : -2.35, mobile ? 0.65 : 0.0, -2.4);
    scene.add(lightPocketMesh);
    lightPocketMeshRef.current = lightPocketMesh;
    lightPocketMatRef.current = lightPocketMat;

    // Soft traveling studio PointLight behind the active project pocket
    const pocketPointLight = new THREE.PointLight(0x0077ee, 2.4, 16, 1.6);
    pocketPointLight.position.set(mobile ? 0 : -2.35, mobile ? 0.8 : 0.3, -1.5);
    scene.add(pocketPointLight);
    pocketPointLightRef.current = pocketPointLight;

    // 8. Construct 10 Physical 3D Reel Panels with Grounding & Reflection
    const textureLoader = new THREE.TextureLoader();
    const contactShadowTexture = createContactShadowTexture();
    const panels: typeof panelsRef.current = [];

    // Shared geometries
    const screenGeo = new THREE.PlaneGeometry(PANEL_WIDTH, PANEL_HEIGHT);
    const boxGeo = new THREE.BoxGeometry(PANEL_WIDTH + 0.04, PANEL_HEIGHT + 0.04, 0.04);
    const edgesGeo = new THREE.EdgesGeometry(boxGeo);

    // Grounding contact shadow geometry
    const shadowGeo = new THREE.PlaneGeometry(PANEL_WIDTH * 1.25, 0.45);

    // Subtle floor reflection geometry (lower half of reel mirrored down into floor)
    const reflGeo = new THREE.PlaneGeometry(PANEL_WIDTH, PANEL_HEIGHT * 0.4);

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

      // Dark titanium backplate chassis
      const chassisMat = new THREE.MeshStandardMaterial({
        color: 0x060910,
        roughness: 0.25,
        metalness: 0.85,
        transparent: true,
        opacity: i === 0 ? 1.0 : 0.0,
      });
      const chassisMesh = new THREE.Mesh(boxGeo, chassisMat);
      panelGroup.add(chassisMesh);

      // Razor-thin electric blue edge line
      const rimLineMat = new THREE.LineBasicMaterial({
        color: 0x008cff,
        transparent: true,
        opacity: i === 0 ? 0.45 : 0.0,
      });
      const rimLine = new THREE.LineSegments(edgesGeo, rimLineMat);
      panelGroup.add(rimLine);

      // Contact Shadow directly beneath reel base (Ambient Occlusion on floor)
      const contactShadowMat = new THREE.MeshBasicMaterial({
        map: contactShadowTexture,
        transparent: true,
        opacity: i === 0 ? 0.75 : 0.0,
        depthWrite: false,
      });
      const contactShadowMesh = new THREE.Mesh(shadowGeo, contactShadowMat);
      contactShadowMesh.rotation.x = -Math.PI / 2;
      contactShadowMesh.position.set(0, mobile ? -1.46 : -1.61, 0.05);
      panelGroup.add(contactShadowMesh);

      // High-res fallback poster texture
      const posterTexture = textureLoader.load(project.posterUrl);
      posterTexture.colorSpace = THREE.SRGBColorSpace;

      // Soft Inverted Floor Reflection (Visually grounds reel into glossy floor)
      const floorReflectionMat = new THREE.MeshBasicMaterial({
        map: posterTexture,
        transparent: true,
        opacity: i === 0 ? 0.12 : 0.0,
        depthWrite: false,
      });
      const floorReflectionMesh = new THREE.Mesh(reflGeo, floorReflectionMat);
      floorReflectionMesh.scale.y = -1; // inverted reflection
      floorReflectionMesh.position.set(0, mobile ? -1.88 : -2.05, 0.02);
      panelGroup.add(floorReflectionMesh);

      // Video element setup
      const video = document.createElement('video');
      video.src = project.videoUrl;
      video.poster = project.posterUrl;
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';

      // Screen plane mesh
      const screenMat = new THREE.MeshBasicMaterial({
        map: posterTexture,
        side: THREE.FrontSide,
        transparent: true,
        opacity: i === 0 ? 1.0 : 0.0,
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.z = 0.025; // sit flush on front of chassis
      panelGroup.add(screenMesh);

      // Initially show only Chapter 0
      panelGroup.visible = i === 0;

      scene.add(panelGroup);

      panels.push({
        group: panelGroup,
        screenMesh,
        chassisMesh,
        rimLine,
        contactShadowMesh,
        floorReflectionMesh,
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
      if (floorMeshRef.current) {
        floorMeshRef.current.position.y = isMob ? -0.82 : -1.62;
      }
      // Update responsive coordinates
      panels.forEach((p, idx) => {
        const isLeft = idx % 2 === 0;
        p.baseX = isMob ? 0 : (isLeft ? -2.35 : 2.35);
        p.baseY = isMob ? 0.65 : 0.0;
        p.baseRotY = isMob ? (isLeft ? 0.14 : -0.14) : (isLeft ? 0.38 : -0.38);
        p.contactShadowMesh.position.y = isMob ? -1.46 : -1.61;
        p.floorReflectionMesh.position.y = isMob ? -1.88 : -2.05;
      });
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
      floorTexture.dispose();
      contactShadowTexture.dispose();
      lightPocketTexture.dispose();
      renderer.dispose();
    };
  }, []);

  // Update Dynamic Three.js Wormhole Motion & Physical Environment based on Scroll Unit
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

    // 2. Cinematic Traveling Light Corridor
    const midTravelDip = Math.sin(Math.PI * frac); // 0 at settle, 1 at mid-scroll
    if (lightPocketMeshRef.current && lightPocketMatRef.current) {
      lightPocketMeshRef.current.position.x = targetLightX;
      lightPocketMeshRef.current.position.y = mobile ? 0.65 : 0.0;
      lightPocketMeshRef.current.position.z = -2.4 - 1.8 * midTravelDip;
      lightPocketMatRef.current.opacity = 0.22 + snapFocus * 0.10;
    }

    if (pocketPointLightRef.current) {
      pocketPointLightRef.current.position.x = targetLightX;
      pocketPointLightRef.current.position.y = mobile ? 0.8 : 0.3;
      pocketPointLightRef.current.position.z = -1.4 - 1.2 * midTravelDip;
      pocketPointLightRef.current.intensity = 1.8 + snapFocus * 0.8;
    }

    // 3. Subtle Restrained Cinematic Camera Motion
    // Forward push during scroll travel: max 0.28 units
    const camPushZ = midTravelDip * 0.28;
    // Tiny vertical organic drift: max 0.035 units
    const camDriftY = Math.sin(u * Math.PI) * 0.035;
    // Delicate lateral dolly lean toward the active project: max 0.12 units
    const activeIsLeft = Math.round(u) % 2 === 0;
    const activeTargetX = mobile ? 0 : (activeIsLeft ? -2.35 : 2.35);
    const camLeanX = activeTargetX * 0.05 * (1.0 - midTravelDip * 0.5);

    camera.position.z = CAM_Z - camPushZ;
    camera.position.y = (mobile ? 0.35 : 0.0) + camDriftY;
    camera.position.x = camLeanX;
    camera.lookAt(camLeanX * 0.3, camera.position.y, 0);

    // 4. Panel Transitions & Grounding Dynamics
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
        // "like reel going 3D from side"
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
      (p.rimLine.material as THREE.LineBasicMaterial).opacity = (0.40 + activeEmphasis * 0.16) * opacity;

      // Grounding contact shadow & floor reflection
      (p.contactShadowMesh.material as THREE.MeshBasicMaterial).opacity =
        (0.65 + activeEmphasis * 0.15) * opacity;
      (p.floorReflectionMesh.material as THREE.MeshBasicMaterial).opacity =
        (0.10 + activeEmphasis * 0.05) * opacity;

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
          // Sync floor reflection texture
          (p.floorReflectionMesh.material as THREE.MeshBasicMaterial).map = p.videoTexture;
          (p.floorReflectionMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
        }
      } else {
        if (p.isPlaying) {
          p.isPlaying = false;
          p.video.pause();
          (p.screenMesh.material as THREE.MeshBasicMaterial).map = p.posterTexture;
          (p.screenMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
          (p.floorReflectionMesh.material as THREE.MeshBasicMaterial).map = p.posterTexture;
          (p.floorReflectionMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
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

              {/* Discrete View Project Action Link */}
              <div className="mt-4 sm:mt-6">
                <Link
                  to={`/portfolio/${currentProject.slug}`}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-[0.22em] text-[#008CFF] hover:text-white transition-colors duration-200 group"
                >
                  <span className="border-b border-[#008CFF]/50 group-hover:border-white pb-0.5">
                    VIEW FULL PROJECT
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
