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
    let animationFrameId: number;
    let mouseX = -1000;
    let mouseY = -1000;

    // Configuration for Light Luxury Mode
    const gridSize = 45; // Distance between dots
    const baseRadius = 1.0;
    const hoverRadius = 200; // Radius of mouse influence
    const colorNormal = 'rgba(0, 0, 0, 0.06)'; // Very faint grey dots
    const colorActive = 'rgba(0, 0, 0, 0.9)'; // Sharp black on hover
    const colorSecondary = 'rgba(100, 100, 100, 0.5)'; // Mid-grey transition

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw Dot Matrix
      for (let x = 0; x <= width; x += gridSize) {
        for (let y = 0; y <= height; y += gridSize) {
          // Calculate distance to mouse
          const dx = x - mouseX;
          const dy = y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          let radius = baseRadius;
          let color = colorNormal;
          let offsetX = 0;
          let offsetY = 0;

          // Interactive effect
          if (distance < hoverRadius) {
            const force = (hoverRadius - distance) / hoverRadius;
            
            // Elegant fluid wave effect
            const angle = Math.atan2(dy, dx);
            const moveDistance = force * 10;
            offsetX = Math.cos(angle) * moveDistance;
            offsetY = Math.sin(angle) * moveDistance;

            // Subtle size increase
            radius = baseRadius + (force * 1.5);
            
            // Color gradient based on distance
            if (force > 0.6) color = colorActive;
            else if (force > 0.3) color = colorSecondary;
            else color = 'rgba(0, 0, 0, 0.2)';
          }

          ctx.beginPath();
          ctx.arc(x + offsetX, y + offsetY, radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-100"
    />
  );
};

export default PixelBackground;