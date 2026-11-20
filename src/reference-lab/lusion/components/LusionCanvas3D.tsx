import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LusionCanvas3DProps {
  scrollProgress: number; // 0.0 to 1.0 normalized page scroll
  activeSection: string;
}

export const LusionCanvas3D: React.FC<LusionCanvas3DProps> = ({ scrollProgress, activeSection: _activeSection }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070b, 0.035);

    const isMobile = window.innerWidth <= 768;
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 65 : 50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: !isMobile,
      alpha: true,
      depth: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig — Cinema Studio Key & Fill
    const ambientLight = new THREE.AmbientLight(0x0e1420, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x139ef2, 2.5); // BrandShoots Cyan
    rimLight.position.set(-6, -4, -2);
    scene.add(rimLight);

    // 3. Cinematic Viewfinder Matte Frames & Film Corridor
    // Strict Filmmaking 3D: High-precision camera frame guides & cinema aspect ratio cards
    const corridorGroup = new THREE.Group();
    scene.add(corridorGroup);

    // Texture loader with fallback procedural cinema textures
    const textureLoader = new THREE.TextureLoader();
    const posterUrls = [
      '/reels/thumbnails-webp/santhi.pipes_rjy_2026-05-31_18-02-19_3909180466433077679_48644092133.webp',
      '/reels/thumbnails-webp/viswatuff.glass_rjy_2026-05-28_18-00-28_3907005057329571857_78432309239.webp',
      '/reels/thumbnails-webp/aabharan_womens_accessories_2026-05-30_10-01-21_3908213461611903133_45301478774.webp',
      '/reels/thumbnails-webp/dayanidhi.interiors_rjy_2025-10-07_12-00-25_3737951699329041277_72884206961.webp',
      '/reels/thumbnails-webp/jain_beauty_concepts_2025-10-16_09-55-09_3744410345428741931_48808965364.webp',
      '/reels/thumbnails-webp/kc_overseas_rjy_2025-10-28_11-56-25_3753167479003838060_46988266664.webp'
    ];

    const planes: THREE.Mesh[] = [];
    const wireframes: THREE.LineSegments[] = [];

    // Aspect ratio 16:9 vertical reel dimension in 3D: width 2.2, height 3.9
    const planeGeo = new THREE.PlaneGeometry(2.1, 3.74);
    const frameEdges = new THREE.EdgesGeometry(planeGeo);
    const frameLineMat = new THREE.LineBasicMaterial({
      color: 0x139ef2,
      transparent: true,
      opacity: 0.45,
    });

    posterUrls.forEach((url, i) => {
      const tex = textureLoader.load(
        url,
        undefined,
        undefined,
        () => {
          // If texture fails to load, fallback to deep cinema slate
        }
      );
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;

      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.35,
        metalness: 0.1,
        transparent: true,
        opacity: 0.88,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(planeGeo, mat);
      const wire = new THREE.LineSegments(frameEdges, frameLineMat.clone());
      mesh.add(wire);

      // Arrange alternating in depth corridor (Z from 0 to -24)
      const zOffset = -i * 4.5;
      const xOffset = (i % 2 === 0 ? -1 : 1) * (isMobile ? 1.1 : 2.5);
      const yOffset = (i % 3 - 1) * 0.4;
      mesh.position.set(xOffset, yOffset, zOffset);
      mesh.rotation.y = (i % 2 === 0 ? 1 : -1) * 0.18;
      mesh.rotation.x = 0.05;

      corridorGroup.add(mesh);
      planes.push(mesh);
      wireframes.push(wire);
    });

    // 4. Cinema Viewfinder Corner Crosshairs in 3D (Authentic Lusion Style)
    const crossGroup = new THREE.Group();
    scene.add(crossGroup);

    const crossMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.28,
    });

    for (let c = 0; c < 12; c++) {
      const crossSize = 0.15;
      const points = [
        new THREE.Vector3(-crossSize, 0, 0),
        new THREE.Vector3(crossSize, 0, 0),
        new THREE.Vector3(0, -crossSize, 0),
        new THREE.Vector3(0, crossSize, 0),
      ];
      const crossGeo = new THREE.BufferGeometry().setFromPoints(points);
      const crossLine = new THREE.LineSegments(crossGeo, crossMat);
      crossLine.position.set(
        (Math.sin(c * 1.5) * (isMobile ? 2 : 4)),
        (Math.cos(c * 2.1) * 3),
        -(c * 2.8)
      );
      crossGroup.add(crossLine);
    }

    // 5. Procedural Vignette & Film Noise Shader Screen Pass (Eliminates banding)
    const vignetteVert = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;
    const vignetteFrag = `
      uniform float uTime;
      uniform vec2 uResolution;
      varying vec2 vUv;

      float random(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = vUv;
        vec2 center = vec2(0.5);
        float dist = distance(uv, center);
        
        // Deep cinema vignette
        float vignette = smoothstep(0.85, 0.2, dist);
        
        // Subtle 35mm film grain
        float grain = (random(uv * 1000.0 + uTime * 15.0) - 0.5) * 0.035;
        
        vec3 col = vec3(0.005, 0.008, 0.015) * (1.0 - vignette);
        col += grain;
        
        gl_FragColor = vec4(col, 0.45 * (1.0 - vignette));
      }
    `;

    const vignetteMat = new THREE.ShaderMaterial({
      vertexShader: vignetteVert,
      fragmentShader: vignetteFrag,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const vignetteGeo = new THREE.PlaneGeometry(2, 2);
    const vignetteMesh = new THREE.Mesh(vignetteGeo, vignetteMat);
    const vignetteScene = new THREE.Scene();
    const vignetteCamera = new THREE.Camera();
    vignetteScene.add(vignetteMesh);

    // 6. Camera Rig with Organic Brownian Motion (Lusion Signature)
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let targetCameraZ = 7;
    let clock = new THREE.Clock();

    // Brownian Motion state variables (organic handheld cinema float)
    let brownianX = 0;
    let brownianY = 0;
    let brownianVX = 0;
    let brownianVY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX = normX * 0.4;
      mouseY = normY * 0.3;
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const mobileNow = width <= 768;
      camera.fov = mobileNow ? 65 : 50;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      vignetteMat.uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // 7. Continuous Render Loop
    let animId: number;
    renderer.autoClear = false;

    const render = () => {
      const time = clock.getElapsedTime();

      vignetteMat.uniforms.uTime.value = time;

      // Update Brownian Motion (simulates handheld camera breathing/drift)
      brownianVX += (Math.random() - 0.5) * 0.008;
      brownianVY += (Math.random() - 0.5) * 0.008;
      brownianVX *= 0.94; // damping
      brownianVY *= 0.94;
      brownianX += brownianVX;
      brownianY += brownianVY;
      brownianX = THREE.MathUtils.clamp(brownianX, -0.08, 0.08);
      brownianY = THREE.MathUtils.clamp(brownianY, -0.06, 0.06);

      // Scroll-driven camera trajectory: Z travels from 7 down to -18 through the corridor
      const scroll = scrollRef.current;
      targetCameraZ = THREE.MathUtils.lerp(7, -18, scroll);
      targetCameraX = mouseX + brownianX + Math.sin(scroll * Math.PI * 2) * 0.6;
      targetCameraY = mouseY + brownianY - scroll * 1.5;

      // Smooth camera interpolation
      camera.position.x += (targetCameraX - camera.position.x) * 0.06;
      camera.position.y += (targetCameraY - camera.position.y) * 0.06;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.08;

      // Camera lookAt focal tracking
      const lookZ = camera.position.z - 8;
      camera.lookAt(targetCameraX * 0.3, targetCameraY * 0.3, lookZ);

      // Subtle reactive tilt on corridor video planes
      planes.forEach((plane, idx) => {
        const distToCam = Math.abs(plane.position.z - camera.position.z);
        // Plane scale & opacity breathe as camera passes them
        const focusFactor = THREE.MathUtils.clamp(1.0 - distToCam / 7.0, 0.2, 1.0);
        (plane.material as THREE.MeshStandardMaterial).opacity = 0.3 + focusFactor * 0.65;
        wireframes[idx].scale.setScalar(1.0 + (1.0 - focusFactor) * 0.05);
      });

      // Render 3D scene + screen space vignette pass
      renderer.clear();
      renderer.render(scene, camera);
      renderer.render(vignetteScene, vignetteCamera);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      planeGeo.dispose();
      frameEdges.dispose();
      frameLineMat.dispose();
      vignetteGeo.dispose();
      vignetteMat.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #080d17 0%, #05070b 70%, #020306 100%)',
      }}
    />
  );
};
