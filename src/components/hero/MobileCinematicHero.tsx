import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER_SRC = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision highp float;
 
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform sampler2D uReelTexture;
  uniform float uHasReel;
 
  #define PI 3.14159265359
  #define TAU 6.28318530718
  #define MAX_STEPS 80
  #define MAX_DIST 50.0
  #define SURF_DIST 0.001
 
  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }
 
  mat2 rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }
 
  float sdSphere(vec3 p, float r) {
    return length(p) - r;
  }
  float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
  }
 
  float sdOctahedron(vec3 p, float s) {
    p = abs(p);
    float m = p.x + p.y + p.z - s;
    vec3 q;
    if (3.0 * p.x < m) q = p.xyz;
    else if (3.0 * p.y < m) q = p.yzx;
    else if (3.0 * p.z < m) q = p.zxy;
    else return m * 0.57735027;
   
    float k = clamp(0.5 * (q.z - q.y + s), 0.0, s);
    return length(vec3(q.x, q.y - s + k, q.z - k));
  }
  float sdTriPrism(vec3 p, vec2 h) {
    vec3 q = abs(p);
    return max(q.z - h.y, max(q.x * 0.866025 + p.y * 0.5, -p.y) - h.x * 0.5);
  }
 
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }
  float smax(float a, float b, float k) {
    return -smin(-a, -b, k);
  }
 
  float map(vec3 p) {
    vec2 m = (uMouse - 0.5) * 2.5;
    p.xy += m * 0.4;
   
    p.xz *= rot(uTime * 0.12);
    p.xy *= rot(uTime * 0.08);
   
    float d = 100.0;
   
    vec3 p1 = p;
    p1.yz *= rot(uTime * 0.15);
   
    float core_distort = sin(p1.x * 3.0 + uTime) * sin(p1.y * 3.0 + uTime) * sin(p1.z * 3.0 + uTime) * 0.1;
    // Blend sphere and octahedron to form a faceted crystal 3D reel sphere
    float sphereCore = sdSphere(p1, 1.6) + core_distort;
    float core = smin(sdOctahedron(p1, 1.6), sphereCore, 0.4) + core_distort;
   
    vec3 p2 = p1;
    p2.xy *= rot(PI * 0.25 + uTime * 0.2);
    float prism = sdTriPrism(p2, vec2(1.4, 2.0));
    core = smax(core, -prism, 0.2);
   
    d = core;
   
    float k_blend = 0.2 + 0.15 * (0.5 + 0.5 * sin(uTime * 1.5));
   
    for (int i = 0; i < 4; i++) {
      float fi = float(i);
      float angle = fi * TAU / 4.0 + uTime * 0.3;
     
      float radius = 3.0 + 0.3 * sin(uTime * 0.4 + fi);
     
      vec3 pos = vec3(
        cos(angle) * radius,
        sin(angle * 0.7) * 1.0,
        sin(angle) * radius
      );
     
      vec3 po = p - pos;
      po.xy *= rot(uTime * 0.5 + fi);
     
      float sat_distort = sin(po.x * 5.0 + fi) * sin(po.y * 5.0 + fi) * sin(po.z * 5.0 + fi) * 0.05;
      float satellite = sdSphere(po, 0.38) + sat_distort;
     
      d = smin(d, satellite, k_blend);
    }
   
    return d;
  }
 
  vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
      map(p + e.xyy) - map(p - e.xyy),
      map(p + e.yxy) - map(p - e.yxy),
      map(p + e.yyx) - map(p - e.yyx)
    ));
  }
 
  float raymarch(vec3 ro, vec3 rd) {
    float t = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
      vec3 p = ro + rd * t;
      float d = map(p);
      if (abs(d) < SURF_DIST || t > MAX_DIST) break;
      t += d * 0.7;
    }
    return t;
  }
 
  vec3 getBackground(vec3 rd) {
    float stars = 0.0;
    vec3 p = rd * 100.0;
    float h = hash(dot(p, vec3(12.9898, 78.233, 54.53)));
    if (h > 0.98) stars = pow(h - 0.98, 10.0) * 20.0;
    vec3 nebula = vec3(0.0);
    // Signature BrandShoots deep blue & cyan cosmic atmospheric illumination
    nebula += vec3(0.0, 0.45, 0.95) * pow(max(0.0, sin(rd.x * 2.0 + uTime * 0.1)), 3.0) * 0.30;
    nebula += vec3(0.12, 0.3, 0.75) * pow(max(0.0, sin(rd.y * 2.5 + uTime * 0.05)), 3.0) * 0.25;
   
    // Sample real BrandShoots reel inside the sphere refraction
    vec3 reelVisual = vec3(0.0);
    if (uHasReel > 0.5) {
      vec2 uv = vec2(atan(rd.z, rd.x) / TAU + 0.5, rd.y * 0.5 + 0.5);
      vec4 sampled = texture2D(uReelTexture, uv);
      reelVisual = sampled.rgb * 0.4;
    }

    return stars + nebula + reelVisual;
  }
 
  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
   
    vec2 m = (uMouse - 0.5) * 0.5;
    vec3 ro = vec3(m.x * 2.0, m.y * 2.0, 5.5);
    vec3 rd = normalize(vec3(uv, -1.0));
   
    rd.xy *= rot(m.x * 0.2);
    rd.yz *= rot(m.y * 0.2);
   
    float t = raymarch(ro, rd);
   
    vec3 color = vec3(0.0);
   
    if (t < MAX_DIST) {
      vec3 p = ro + rd * t;
      vec3 normal = getNormal(p);
     
      vec3 viewDir = normalize(ro - p);
     
      float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
     
      float ior = 1.5;
      vec3 refractDir = refract(rd, normal, 1.0 / ior);
     
      if (length(refractDir) > 0.0) {
        float t2 = raymarch(p - normal * 0.01, refractDir);
       
        if (t2 < MAX_DIST) {
          vec3 p2 = p - normal * 0.01 + refractDir * t2;
          vec3 normal2 = getNormal(p2);
         
          vec3 r = refract(refractDir, -normal2, ior - 0.2);
          vec3 g = refract(refractDir, -normal2, ior);
          vec3 b = refract(refractDir, -normal2, ior + 0.2);
         
          vec3 bgR = getBackground(r) * vec3(0.7, 1.1, 1.4);
          vec3 bgG = getBackground(g) * vec3(0.5, 1.2, 1.5);
          vec3 bgB = getBackground(b) * vec3(0.3, 0.9, 1.6);
         
          color = vec3(bgR.x, bgG.y, bgB.z);
          color = pow(color, vec3(0.7)) * 5.0;
         
        } else {
          color = getBackground(refractDir) * 2.0;
        }
      }
     
      vec3 lightDir = normalize(vec3(1.0, 1.0, -1.0));
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 150.0);
      color += spec * vec3(1.0, 1.0, 1.0) * 3.5;
     
      vec3 fresnelColor = vec3(
        0.5 + 0.5 * sin(fresnel * TAU + uTime),
        0.5 + 0.5 * sin(fresnel * TAU + uTime + TAU / 3.0),
        0.5 + 0.5 * sin(fresnel * TAU + uTime + TAU * 2.0 / 3.0)
      );
      color += fresnel * fresnelColor * 1.2;
     
      float edge = pow(1.0 - abs(dot(viewDir, normal)), 4.0);
      color += edge * vec3(0.2, 0.7, 1.0) * 0.9;
     
      float sss = pow(max(dot(-normal, lightDir), 0.0), 2.0);
      color += sss * vec3(0.0, 0.55, 1.0) * 0.6;
     
    } else {
      color = getBackground(rd);
    }
   
    float vignette = 1.0 - length(uv) * 0.4;
    vignette = smoothstep(0.3, 1.0, vignette);
    color *= vignette;
   
    color *= vec3(0.96, 0.99, 1.06);
   
    color = pow(color, vec3(0.88));
    color *= 1.12;
   
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const MobileCinematicHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl', { alpha: false, antialias: true }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext);
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    const uTime = gl.getUniformLocation(program, 'uTime');
    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uMouse = gl.getUniformLocation(program, 'uMouse');
    const uReelTexture = gl.getUniformLocation(program, 'uReelTexture');
    const uHasReel = gl.getUniformLocation(program, 'uHasReel');

    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Create 3D Reel Texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // Initial 1x1 black pixel
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 140, 255, 255])
    );

    const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      mouse.targetX = clientX / window.innerWidth;
      mouse.targetY = 1.0 - clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Glass button specular tracker
    const handleBtnMove = (e: MouseEvent | TouchEvent) => {
      const target = (e.currentTarget as HTMLElement) || (e.target as HTMLElement);
      if (!target || !target.classList.contains('glass-button')) return;
      const rect = target.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      target.style.setProperty('--x', `${x}%`);
      target.style.setProperty('--y', `${y}%`);
    };

    const buttons = document.querySelectorAll('.glass-button');
    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', handleBtnMove as any);
      btn.addEventListener('touchmove', handleBtnMove as any, { passive: true } as any);
    });

    const startTime = Date.now();
    let animId: number;

    const render = () => {
      const currentTime = (Date.now() - startTime) * 0.001;

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      gl.uniform1f(uTime, currentTime);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);

      // Upload video frame to texture for 3D sphere of reel reflection
      const vid = videoRef.current;
      if (vid && vid.readyState >= 2) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, vid);
        gl.uniform1i(uReelTexture, 0);
        gl.uniform1f(uHasReel, 1.0);
      } else {
        gl.uniform1f(uHasReel, 0.0);
      }

      const positionLocation = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      buttons.forEach((btn) => {
        btn.removeEventListener('mousemove', handleBtnMove as any);
        btn.removeEventListener('touchmove', handleBtnMove as any);
      });
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteTexture(texture);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(`#${id}`, { duration: 0.85 });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-[100svh] min-h-[100svh] max-h-[100svh] bg-[#000] text-white overflow-hidden select-none">
      {/* Hidden reel video source mapped directly onto 3D sphere */}
      <video
        ref={videoRef}
        src="/reels/wearebrandshoots_1777444216_3885805244420742638_77785749886.mp4"
        poster="/reels/posters/wearebrandshoots_1777444216_3885805244420742638_77785749886.jpg"
        autoPlay
        loop
        muted
        playsInline
        className="hidden pointer-events-none"
      />

      {/* 3D WebGL Sphere Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Centered Minimal Content per User Directive */}
      <div className="content">
        <h1>
          <span>BRAND</span>
          <span className="text-[#008CFF]">SHOOTS</span>
        </h1>
        <p className="tagline">CREATE. SHOOT. GROW.</p>
        <div className="buttons">
          <button
            type="button"
            className="glass-button"
            onClick={() => scrollToSection('what-we-do')}
          >
            <span className="shimmer" />
            <span>Discover</span>
          </button>
          <button
            type="button"
            className="glass-button"
            onClick={() => scrollToSection('cta')}
          >
            <span className="shimmer" />
            <span>Join Now</span>
          </button>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div
        onClick={() => scrollToSection('what-we-do')}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors cursor-pointer"
      >
        <svg
          className="w-3.5 h-3.5 text-[#008CFF] animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        <span className="font-mono text-[9px] tracking-[0.28em] uppercase font-semibold text-white/60">
          SCROLL DOWN
        </span>
      </div>

      <style>{`
        .content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          text-align: center;
          color: white;
          pointer-events: none;
          width: 100%;
          padding: 0 16px;
        }
        .content h1 {
          font-size: clamp(2.6rem, 11.5vw, 4.4rem);
          font-weight: 900;
          margin-bottom: 0.5rem;
          letter-spacing: -0.05em;
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 80px rgba(0, 140, 255, 0.35));
          animation: glowPulse 3s ease-in-out infinite alternate;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
        }
        @keyframes glowPulse {
          from {
            filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 80px rgba(0, 140, 255, 0.35));
          }
          to {
            filter: drop-shadow(0 0 60px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 120px rgba(0, 191, 255, 0.5));
          }
        }
        .tagline {
          font-size: clamp(0.75rem, 3.2vw, 1.05rem);
          font-weight: 400;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.32em;
          text-transform: uppercase;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(0, 140, 255, 0.4);
        }
        .buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 32px;
          pointer-events: auto;
        }
        .glass-button {
          position: relative;
          padding: 13px 28px;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #fff;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
          border: 1.5px solid transparent;
          border-radius: 40px;
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(255, 255, 255, 0.05);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .glass-button::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 40px;
          padding: 1.5px;
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(0, 140, 255, 0.6) 25%,
            rgba(0, 191, 255, 0.5) 50%,
            rgba(255, 255, 255, 0.3) 75%,
            rgba(0, 140, 255, 0.6) 100%);
          background-size: 200% 200%;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: borderFlow 3s linear infinite;
          opacity: 0.7;
          transition: opacity 0.5s ease;
        }
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .glass-button::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 40px;
          background: radial-gradient(circle at var(--x, 50%) var(--y, 50%),
            rgba(255, 255, 255, 0.25) 0%,
            transparent 50%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .glass-button:hover, .glass-button:active {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.06) 100%);
          box-shadow:
            0 12px 48px rgba(0, 140, 255, 0.35),
            0 0 80px rgba(0, 191, 255, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -1px 0 rgba(255, 255, 255, 0.1);
          transform: translateY(-2px) scale(1.02);
        }
        .glass-button:hover::before, .glass-button:active::before {
          opacity: 1;
          animation-duration: 2s;
        }
        .glass-button:hover::after, .glass-button:active::after {
          opacity: 1;
        }
        .glass-button .shimmer {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 45%,
            rgba(255, 255, 255, 0.35) 50%,
            rgba(255, 255, 255, 0.1) 55%,
            transparent 100%
          );
          transform: rotate(30deg);
          animation: shimmer 3s infinite;
          pointer-events: none;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(30deg); }
          100% { transform: translateX(100%) rotate(30deg); }
        }
        .glass-button span {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

export default MobileCinematicHero;
