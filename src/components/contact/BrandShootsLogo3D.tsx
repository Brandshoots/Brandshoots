import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { BRAND_PATHS, SHOOTS_PATHS, BRANDSHOOTS_LOGO_VIEWBOX } from '../footer/brandshootsLogoPaths';

export const BrandShootsLogo3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 2000);
    camera.position.set(0, 0, 480);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. LIGHTING (Cinematic Studio Rig)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Key Light (Crisp White Directional)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(200, 250, 300);
    scene.add(keyLight);

    // Rim / Accent Light (Electric Brand Blue)
    const rimLight = new THREE.DirectionalLight(0x008cff, 3.5);
    rimLight.position.set(-250, -150, 150);
    scene.add(rimLight);

    // Cursor Follower Point Light (Dynamic Specular Gleam)
    const cursorLight = new THREE.PointLight(0x40afff, 4.0, 600);
    cursorLight.position.set(0, 0, 200);
    scene.add(cursorLight);

    // Backstage Counter-Rim Light
    const backRim = new THREE.PointLight(0x0055aa, 2.0, 500);
    backRim.position.set(0, -100, -150);
    scene.add(backRim);

    // 3. MASTER WRAPPER & LOGO GEOMETRY GENERATION
    const masterGroup = new THREE.Group();
    const logoGroup = new THREE.Group();
    masterGroup.add(logoGroup);
    scene.add(masterGroup);

    const loader = new SVGLoader();

    // High-End Metallic Physical Materials
    const brandMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x008cff,
      emissive: 0x002244,
      emissiveIntensity: 0.25,
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
    });

    const shootsMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0x111122,
      emissiveIntensity: 0.15,
      metalness: 0.8,
      roughness: 0.16,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
    });

    // Extrusion parameters: bevel creates razor-sharp 3D chamfers
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 18,
      bevelEnabled: true,
      bevelThickness: 3.5,
      bevelSize: 1.8,
      bevelSegments: 3,
    };

    const parseAndExtrude = (
      paths: readonly string[],
      material: THREE.Material
    ) => {
      const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BRANDSHOOTS_LOGO_VIEWBOX}">${paths
        .map((d) => `<path d="${d}" />`)
        .join('')}</svg>`;

      const svgData = loader.parse(xml);
      svgData.paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);
        shapes.forEach((shape) => {
          const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          const mesh = new THREE.Mesh(geom, material);
          logoGroup.add(mesh);
        });
      });
    };

    // Extrude BRAND (Blue) & SHOOTS (White)
    parseAndExtrude(BRAND_PATHS, brandMaterial);
    parseAndExtrude(SHOOTS_PATHS, shootsMaterial);

    // Flip Y because SVG coordinates point downwards
    logoGroup.scale.set(1, -1, 1);

    // Center geometry exactly at origin
    const box = new THREE.Box3().setFromObject(logoGroup);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);

    logoGroup.position.x = -center.x;
    logoGroup.position.y = -center.y;
    logoGroup.position.z = -center.z;

    // Scale to fill the viewport comfortably
    const maxDim = Math.max(size.x, size.y);
    const scaleFactor = 360 / maxDim;
    masterGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Initial heroic 3D orientation
    masterGroup.rotation.y = -0.22;
    masterGroup.rotation.x = 0.08;

    // 4. FLOATING AMBIENT GLOW DUST PARTICLES
    const particleCount = 45;
    const particleGeom = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 500;
      posArray[i + 1] = (Math.random() - 0.5) * 400;
      posArray[i + 2] = (Math.random() - 0.5) * 300;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x008cff,
      size: 3.5,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 5. INTERACTIVITY & ANIMATION STATE
    let targetRotX = 0.08;
    let targetRotY = -0.22;
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let idleTime = 0;

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      // Update cursor specular point light
      cursorLight.position.x = normX * 220;
      cursorLight.position.y = normY * 180;
      cursorLight.position.z = 220;

      if (isDragging) {
        const deltaX = clientX - prevPointerX;
        const deltaY = clientY - prevPointerY;
        velocityY = deltaX * 0.007;
        velocityX = deltaY * 0.007;

        targetRotY += velocityY;
        targetRotX += velocityX;

        prevPointerX = clientX;
        prevPointerY = clientY;
        idleTime = 0;
      } else {
        // Subtle perspective tracking when hovering
        targetRotY = -0.22 + normX * 0.35;
        targetRotX = 0.08 - normY * 0.25;
      }
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      setHasInteracted(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevPointerX = clientX;
      prevPointerY = clientY;
      velocityX = 0;
      velocityY = 0;
      idleTime = 0;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // Double click to reset orientation
    const onDoubleClick = () => {
      targetRotX = 0.08;
      targetRotY = -0.22;
      velocityX = 0;
      velocityY = 0;
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('dblclick', onDoubleClick);

    // Touch support
    container.addEventListener('touchmove', onPointerMove, { passive: true });
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 6. RENDER LOOP WITH BUTTERY INERTIAL DAMPING
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Inertial decay when released after drag
      if (!isDragging) {
        if (Math.abs(velocityX) > 0.0001 || Math.abs(velocityY) > 0.0001) {
          targetRotX += velocityX;
          targetRotY += velocityY;
          velocityX *= 0.92;
          velocityY *= 0.92;
        } else {
          // Slow cinematic breathing when idle
          idleTime += 0.01;
          const subtleFloatY = Math.sin(elapsedTime * 1.4) * 0.04;
          const subtleFloatX = Math.cos(elapsedTime * 1.1) * 0.03;
          masterGroup.position.y = Math.sin(elapsedTime * 1.5) * 5;

          masterGroup.rotation.y +=
            (targetRotY + subtleFloatY - masterGroup.rotation.y) * 0.06;
          masterGroup.rotation.x +=
            (targetRotX + subtleFloatX - masterGroup.rotation.x) * 0.06;
        }
      } else {
        masterGroup.rotation.y += (targetRotY - masterGroup.rotation.y) * 0.15;
        masterGroup.rotation.x += (targetRotX - masterGroup.rotation.x) * 0.15;
      }

      // Constrain vertical pitch
      masterGroup.rotation.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, masterGroup.rotation.x)
      );

      // Slow drift of background particles
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // 7. RESPONSIVE RESIZE OBSERVER
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 8. CLEANUP ON UNMOUNT
    return () => {
      cancelAnimationFrame(reqId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('dblclick', onDoubleClick);
      container.removeEventListener('touchmove', onPointerMove);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchend', onPointerUp);

      // Dispose Three.js objects
      logoGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      particleGeom.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center select-none group">
      {/* Background Volumetric Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0, 140, 255, 0.16) 0%, rgba(4, 6, 10, 0.4) 60%, transparent 100%)',
          filter: 'blur(30px)',
        }}
      />

      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing"
        title="Click and drag to rotate 3D BrandShoots logo in physical space"
      />

      {/* Interactive Helper Pill */}
      <div
        className={`absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-500 ${
          hasInteracted ? 'opacity-0 group-hover:opacity-60' : 'opacity-70 group-hover:opacity-100'
        }`}
      >
        <span className="px-3 py-1 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/12 text-[10px] font-mono tracking-widest uppercase text-white/60 flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] animate-pulse" />
          <span>DRAG TO ROTATE 3D LOGO</span>
        </span>
      </div>
    </div>
  );
};

export default BrandShootsLogo3D;
