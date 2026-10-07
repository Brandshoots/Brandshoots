import React, { useRef, useEffect } from 'react';

interface SpaceMeshCanvasProps {
  className?: string;
  theme?: 'light' | 'dark';
  scrollProgress?: number;
}

export const SpaceMeshCanvas: React.FC<SpaceMeshCanvasProps> = ({
  className = '',
  theme = 'light',
  scrollProgress = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<number>(scrollProgress);

  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let time = 0;

    const resize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handlePointerMove);

    // Grid configuration: spans 100% full screen with margin bleed
    const cols = 32;
    const rows = 28;
    const margin = 70;

    const render = () => {
      time += 0.015;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const isLight = theme === 'light';
      const baseLineColor = isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.07)';
      const accentLineColor = isLight ? 'rgba(20, 151, 245, 0.28)' : 'rgba(20, 151, 245, 0.40)';
      const nodeColor = isLight ? 'rgba(20, 151, 245, 0.45)' : 'rgba(20, 151, 245, 0.75)';

      // Calculate points across FULL canvas height and width
      const points: { x: number; y: number; scale: number; alpha: number }[][] = [];
      const currentProg = progressRef.current;

      for (let r = 0; r < rows; r++) {
        points[r] = [];
        const normR = (r / (rows - 1)) * 2 - 1; // -1 to 1 (top to bottom)
        const baseY = -margin + (r / (rows - 1)) * (height + margin * 2);

        for (let c = 0; c < cols; c++) {
          const normC = (c / (cols - 1)) * 2 - 1; // -1 to 1 (left to right)
          const baseX = -margin + (c / (cols - 1)) * (width + margin * 2);

          // Undulating wave heights modulated by GSAP scroll progress and time
          const waveX =
            Math.sin(time * 0.8 + normR * 2.5 + currentProg * 4.0) * 14 +
            Math.cos(time * 0.5 - normC * 1.8) * 8 +
            mouseX * 30;

          const waveY =
            Math.cos(time * 0.7 + normC * 2.5 + currentProg * 4.0) * 14 +
            Math.sin(time * 0.5 - normR * 1.8) * 8 +
            mouseY * 30;

          // 3D depth wave (z) that modulates point scale
          const waveZ =
            Math.sin(time + normC * 3.0 + normR * 2.4 + currentProg * 5.0) * 26 +
            Math.cos(time * 0.8 - normC * 2.0 + normR * 3.0 + currentProg * 3.0) * 16;

          const px = baseX + waveX;
          const py = baseY + waveY;
          const scale = 1 + (waveZ / 350);

          points[r][c] = { x: px, y: py, scale, alpha: 1 };
        }
      }

      // Draw horizontal grid lines across the FULL height
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const pt = points[r][c];
          if (c === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = r % 4 === 0 ? accentLineColor : baseLineColor;
        ctx.lineWidth = r % 4 === 0 ? 1.2 : 0.8;
        ctx.stroke();
      }

      // Draw vertical grid lines across the FULL width
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const pt = points[r][c];
          if (r === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = c % 4 === 0 ? accentLineColor : baseLineColor;
        ctx.lineWidth = c % 4 === 0 ? 1.2 : 0.8;
        ctx.stroke();
      }

      // Draw glowing intersection nodes across the FULL canvas
      for (let r = 0; r < rows; r += 2) {
        for (let c = 0; c < cols; c += 2) {
          const pt = points[r][c];
          ctx.fillStyle = nodeColor;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.8 * pt.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none ${className}`} />;
};

export default SpaceMeshCanvas;
