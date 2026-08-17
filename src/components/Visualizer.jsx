import React, { useRef, useEffect, useState } from 'react';
import './Visualizer.css';

const Visualizer = ({ analyser, isPlaying, artwork, alt }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const particlesRef = useRef([]);
  const burstParticlesRef = useRef([]);
  const timeRef = useRef(0);
  const prevBassRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize orbital particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 120; i++) {
        particlesRef.current.push({
          orbit: Math.random() * 3,           // which orbit ring (0, 1, 2)
          angle: Math.random() * Math.PI * 2, // position on orbit
          speed: 0.003 + Math.random() * 0.008,
          size: 1 + Math.random() * 3,
          brightness: 0.3 + Math.random() * 0.7,
          z: -1 + Math.random() * 2,          // depth (-1 to 1)
          hue: Math.random() * 360,
        });
      }
    }

    const bufferLength = analyser ? analyser.frequencyBinCount : 0;
    const dataArray = new Uint8Array(bufferLength || 1);
    if (analyser) analyser.smoothingTimeConstant = 0.8;

    const draw = () => {
      requestRef.current = requestAnimationFrame(draw);

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cx = w / 2;
      const cy = h / 2;

      // Fade trail effect — creates smooth motion blur
      ctx.fillStyle = 'rgba(5, 5, 12, 0.15)';
      ctx.fillRect(0, 0, w, h);

      let bass = 0, mid = 0, high = 0;

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
        let bassSum = 0, midSum = 0, highSum = 0;
        for (let i = 0; i < 8; i++) bassSum += dataArray[i];
        for (let i = 8; i < 40; i++) midSum += dataArray[i];
        for (let i = 40; i < 80; i++) highSum += dataArray[i];
        bass = bassSum / (8 * 255);
        mid = midSum / (32 * 255);
        high = highSum / (40 * 255);
      }

      timeRef.current += isPlaying ? (0.01 + bass * 0.03) : 0.003;
      const t = timeRef.current;

      // Detect bass hit for burst effect
      if (bass - prevBassRef.current > 0.15 && isPlaying) {
        // Spawn burst particles
        for (let i = 0; i < 15; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 4;
          burstParticlesRef.current.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            decay: 0.015 + Math.random() * 0.02,
            size: 2 + Math.random() * 4,
            hue: Math.random() * 360,
          });
        }
      }
      prevBassRef.current = bass;

      // The artwork sits at center, orbits go around it
      const artSize = Math.min(w, h) * 0.42;
      const orbitRadii = [
        artSize * 0.75 + bass * 30,
        artSize * 0.95 + mid * 25,
        artSize * 1.15 + high * 20,
      ];

      // Orbit tilt angles (different for each ring — creates 3D atom look)
      const orbitTilts = [
        { rx: 0.6 + Math.sin(t * 0.5) * 0.1, ry: t * 0.3 },
        { rx: 1.2 + Math.cos(t * 0.4) * 0.15, ry: t * 0.2 + 2 },
        { rx: 0.3 + Math.sin(t * 0.3) * 0.1, ry: t * 0.15 + 4 },
      ];

      // === Draw faint orbit ring paths ===
      for (let o = 0; o < 3; o++) {
        const r = orbitRadii[o];
        const tilt = orbitTilts[o];
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 + bass * 0.04})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.05) {
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r * Math.cos(tilt.rx);
          const rotX = px * Math.cos(tilt.ry) - py * Math.sin(tilt.ry);
          const rotY = px * Math.sin(tilt.ry) + py * Math.cos(tilt.ry);
          if (a === 0) ctx.moveTo(cx + rotX, cy + rotY);
          else ctx.lineTo(cx + rotX, cy + rotY);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // === Draw orbital particles ===
      // Sort by z for depth effect (back particles drawn first)
      const sorted = [...particlesRef.current].sort((a, b) => a.z - b.z);

      for (const p of particlesRef.current) {
        const speedMul = isPlaying ? (1 + bass * 3) : 0.3;
        p.angle += p.speed * speedMul;
        if (p.angle > Math.PI * 2) p.angle -= Math.PI * 2;

        // Slowly shift hue
        p.hue += 0.2;
        if (p.hue > 360) p.hue -= 360;

        const o = Math.floor(p.orbit);
        const r = orbitRadii[Math.min(o, 2)];
        const tilt = orbitTilts[Math.min(o, 2)];

        // 3D position on the orbit
        const px3d = Math.cos(p.angle) * r;
        const py3d = Math.sin(p.angle) * r * Math.cos(tilt.rx);
        const pz3d = Math.sin(p.angle) * r * Math.sin(tilt.rx);

        // Rotate around Y
        const rotX = px3d * Math.cos(tilt.ry) - py3d * Math.sin(tilt.ry);
        const rotY = px3d * Math.sin(tilt.ry) + py3d * Math.cos(tilt.ry);

        // Perspective projection
        const perspective = 800;
        const scale = perspective / (perspective + pz3d);
        const screenX = cx + rotX * scale;
        const screenY = cy + rotY * scale;

        // Depth-based size and opacity
        const depthOpacity = 0.3 + scale * 0.7;
        const sizeMultiplier = isPlaying ? (1 + bass * 2) : 1;
        const drawSize = p.size * scale * sizeMultiplier;

        // Glow
        const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, drawSize * 3);
        gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${depthOpacity * p.brightness})`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 90%, 50%, ${depthOpacity * 0.3})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 40%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, drawSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core bright dot
        ctx.fillStyle = `hsla(${p.hue}, 60%, 90%, ${depthOpacity * p.brightness})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, drawSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // === Draw burst particles ===
      for (let i = burstParticlesRef.current.length - 1; i >= 0; i--) {
        const bp = burstParticlesRef.current[i];
        bp.x += bp.vx;
        bp.y += bp.vy;
        bp.vx *= 0.98;
        bp.vy *= 0.98;
        bp.life -= bp.decay;

        if (bp.life <= 0) {
          burstParticlesRef.current.splice(i, 1);
          continue;
        }

        const bpGrad = ctx.createRadialGradient(bp.x, bp.y, 0, bp.x, bp.y, bp.size * bp.life * 4);
        bpGrad.addColorStop(0, `hsla(${bp.hue}, 100%, 80%, ${bp.life})`);
        bpGrad.addColorStop(0.5, `hsla(${bp.hue}, 90%, 60%, ${bp.life * 0.4})`);
        bpGrad.addColorStop(1, `hsla(${bp.hue}, 80%, 40%, 0)`);
        ctx.fillStyle = bpGrad;
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, bp.size * bp.life * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // === Ambient glow at center (behind artwork area) ===
      const ambientGlow = ctx.createRadialGradient(cx, cy, artSize * 0.3, cx, cy, artSize * 1.2);
      const glowHue = (t * 20) % 360;
      ambientGlow.addColorStop(0, `hsla(${glowHue}, 60%, 50%, ${0.05 + bass * 0.1})`);
      ambientGlow.addColorStop(0.5, `hsla(${(glowHue + 120) % 360}, 50%, 40%, ${0.03 + mid * 0.05})`);
      ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, w, h);
    };

    draw();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [analyser, isPlaying]);

  return (
    <div className="vis3d-wrapper">
      <canvas ref={canvasRef} className="vis3d-canvas" />
      <div className="vis3d-artwork-container">
        <img src={artwork} alt={alt} className="vis3d-artwork" />
      </div>
    </div>
  );
};

export default Visualizer;
