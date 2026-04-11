"use client";

import { useEffect, useRef, useCallback } from "react";

interface AmbientBackgroundProps {
  mode: "astrology" | "tarot";
}

// --- Starfield canvas ---

function useStarfield(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: { x: number; y: number; radius: number; opacity: number; speed: number }[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      createStars();
    }

    function createStars() {
      stars = [];
      const count = Math.floor((canvas!.width * canvas!.height) / 4000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.005 + 0.002,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const star of stars) {
        star.opacity += Math.sin(Date.now() * star.speed) * 0.01;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(244, 237, 224, ${star.opacity})`;
        ctx!.fill();
      }
      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}

// --- Tarot parlor canvas ---

interface TarotParticle {
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  rotationSpeed: number;
  driftX: number;
  driftY: number;
  opacity: number;
}

interface Ember {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  flickerSpeed: number;
  phase: number;
}

function useTarotParlor(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let cards: TarotParticle[] = [];
    let embers: Ember[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      createParticles();
    }

    function createParticles() {
      const isMobile = canvas!.width < 640;
      const cardCount = isMobile ? 6 : 10;
      const emberCount = isMobile ? 4 : 8;

      cards = [];
      for (let i = 0; i < cardCount; i++) {
        const scale = 0.6 + Math.random() * 0.8;
        cards.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          w: 24 * scale,
          h: 40 * scale,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.002,
          driftX: (Math.random() - 0.5) * 0.3,
          driftY: 0.15 + Math.random() * 0.25,
          opacity: 0.06 + Math.random() * 0.06,
        });
      }

      embers = [];
      for (let i = 0; i < emberCount; i++) {
        embers.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          radius: 1 + Math.random() * 2,
          baseOpacity: 0.15 + Math.random() * 0.15,
          flickerSpeed: 0.003 + Math.random() * 0.004,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function drawRoundedRect(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Draw drifting card silhouettes
      for (const card of cards) {
        card.x += card.driftX;
        card.y += card.driftY;
        card.rotation += card.rotationSpeed;

        // Wrap around
        if (card.y > canvas!.height + 60) {
          card.y = -60;
          card.x = Math.random() * canvas!.width;
        }
        if (card.x < -60) card.x = canvas!.width + 60;
        if (card.x > canvas!.width + 60) card.x = -60;

        ctx!.save();
        ctx!.translate(card.x, card.y);
        ctx!.rotate(card.rotation);
        ctx!.globalAlpha = card.opacity;

        // Card body
        drawRoundedRect(ctx!, -card.w / 2, -card.h / 2, card.w, card.h, 3);
        ctx!.fillStyle = "#C9A86A";
        ctx!.fill();

        // Inner border
        drawRoundedRect(
          ctx!,
          -card.w / 2 + 2,
          -card.h / 2 + 2,
          card.w - 4,
          card.h - 4,
          2
        );
        ctx!.strokeStyle = "#C9A86A";
        ctx!.lineWidth = 0.5;
        ctx!.stroke();

        ctx!.restore();
      }

      // Draw embers
      const now = Date.now();
      for (const ember of embers) {
        const flicker = Math.sin(now * ember.flickerSpeed + ember.phase);
        const opacity = ember.baseOpacity + flicker * 0.08;

        ctx!.beginPath();
        ctx!.arc(ember.x, ember.y, ember.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(201, 168, 106, ${Math.max(0.05, opacity)})`;
        ctx!.fill();

        // Subtle glow
        ctx!.beginPath();
        ctx!.arc(ember.x, ember.y, ember.radius * 3, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(201, 168, 106, ${Math.max(0.02, opacity * 0.2)})`;
        ctx!.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}

// --- Main component ---

export default function AmbientBackground({ mode }: AmbientBackgroundProps) {
  const starfieldRef = useRef<HTMLCanvasElement>(null);
  const tarotRef = useRef<HTMLCanvasElement>(null);

  useStarfield(starfieldRef);
  useTarotParlor(tarotRef);

  const isAstrology = mode === "astrology";

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Background color layer */}
      <div
        className="absolute inset-0 transition-all duration-[1200ms] ease-in-out"
        style={{
          background: isAstrology
            ? "#0B0B2E"
            : "radial-gradient(ellipse at 50% 40%, #3D0F1A 0%, #2A0A12 50%, #1A0610 100%)",
        }}
      />

      {/* Starfield canvas */}
      <canvas
        ref={starfieldRef}
        className="absolute inset-0 transition-all duration-[700ms] ease-in-out"
        style={{
          opacity: isAstrology ? 1 : 0,
          transform: isAstrology ? "scale(1)" : "scale(1.15)",
        }}
        aria-hidden="true"
      />

      {/* Tarot parlor canvas */}
      <canvas
        ref={tarotRef}
        className="absolute inset-0 transition-all duration-[700ms] ease-in-out"
        style={{
          opacity: isAstrology ? 0 : 1,
          transform: isAstrology ? "translateY(40px)" : "translateY(0)",
          transitionDelay: isAstrology ? "0ms" : "400ms",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
