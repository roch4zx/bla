import { useEffect, useRef } from 'react';

export default function Confetti({ onDone }: { onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // Confetti particles
    const confettiColors = ['#00A651', '#FFD700', '#FF69B4', '#00BFFF', '#FF6347', '#8A2BE2'];
    const particles = Array.from({ length: 80 }, () => ({
      x: W / 2,
      y: H / 2,
      r: Math.random() * 6 + 4,
      d: Math.random() * 80 + 20,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      angle: Math.random() * 2 * Math.PI,
      speed: Math.random() * 1.5 + 1,
    }));

    let frame = 0;
    const maxFrames = 120;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed + 1.2;
        p.tiltAngle += p.tiltAngleIncremental;
        p.tilt = Math.sin(p.tiltAngle) * 15;
        ctx.beginPath();
        ctx.ellipse(p.x + p.tilt, p.y, p.r, p.r * 0.6, 0, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      frame++;
      if (frame < maxFrames) {
        requestAnimationFrame(draw);
      } else if (onDone) {
        onDone();
      }
    }
    draw();
    // Clean up
    return () => { if (ctx) ctx.clearRect(0, 0, W, H); };
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    />
  );
} 