import React, { useEffect, useRef } from 'react';

const PixelBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId = 0;
    let mouseX = -1000;
    let mouseY = -1000;
    let isDark = document.documentElement.classList.contains('dark');

    // Configuration
    const gridSize = 45;
    const baseRadius = 1.0;
    const hoverRadius = 200;

    const palette = () => {
      if (isDark) {
        return {
          normal: 'rgba(255, 255, 255, 0.08)',
          mid: 'rgba(200, 200, 210, 0.45)',
          near: 'rgba(255, 255, 255, 0.35)',
          active: 'rgba(255, 255, 255, 0.95)',
        };
      }
      return {
        normal: 'rgba(0, 0, 0, 0.06)',
        mid: 'rgba(100, 100, 100, 0.5)',
        near: 'rgba(0, 0, 0, 0.2)',
        active: 'rgba(0, 0, 0, 0.9)',
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const animate = () => {
      const c = palette();
      ctx.clearRect(0, 0, width, height);

      for (let x = 0; x <= width; x += gridSize) {
        for (let y = 0; y <= height; y += gridSize) {
          const dx = x - mouseX;
          const dy = y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let radius = baseRadius;
          let color = c.normal;
          let offsetX = 0;
          let offsetY = 0;

          if (distance < hoverRadius) {
            const force = (hoverRadius - distance) / hoverRadius;
            const angle = Math.atan2(dy, dx);
            const moveDistance = force * 10;
            offsetX = Math.cos(angle) * moveDistance;
            offsetY = Math.sin(angle) * moveDistance;

            radius = baseRadius + force * 1.5;

            if (force > 0.6) color = c.active;
            else if (force > 0.3) color = c.mid;
            else color = c.near;
          }

          ctx.beginPath();
          ctx.arc(x + offsetX, y + offsetY, radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Watch theme changes
    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark');
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      themeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};

export default PixelBackground;
