"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAvatarIntroSeen,
  setAvatarIntroSeen,
  getAvatarLevelUpsSeen,
  markAvatarLevelUpSeen,
} from "@/lib/storage";

interface CelestialAvatarProps {
  streak: number;
}

// --- Tier derivation ---

const LEVEL_UP_DAYS = [2, 5, 10, 30, 50] as const;

function getTier(streak: number): number {
  if (streak >= 50) return 6;
  if (streak >= 30) return 5;
  if (streak >= 10) return 4;
  if (streak >= 5) return 3;
  if (streak >= 2) return 2;
  return 1;
}

// --- Speech bubble messages ---

const LEVEL_UP_MESSAGES: Record<number, string> = {
  2: "I feel a little brighter today. Thank you for returning.",
  5: "My cloak is forming. The stars approve.",
  10: "A crown of stars finds me. Your devotion is noticed.",
  30: "I have wings now. We are bound, you and I.",
  50: "I am ascended. Few ever reach this place.",
};

const INTRO_MESSAGE =
  "Hi, I\u2019m your Celestial Avatar. Level me up by returning each day to see how your changes affect mine.";

// --- SVG sub-components for each tier layer ---

function OrbBody({ tier }: { tier: number }) {
  const glowOpacity = 0.15 + tier * 0.05;
  const bodyBrightness = 0.6 + tier * 0.06;
  return (
    <g>
      {/* Outer glow */}
      <circle
        cx="50"
        cy="50"
        r={28 + tier * 2}
        fill={`rgba(232, 194, 107, ${glowOpacity})`}
      />
      {/* Body */}
      <circle
        cx="50"
        cy="50"
        r="18"
        fill={`rgba(74, 43, 122, ${bodyBrightness})`}
        stroke="var(--moon-gold)"
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />
      {/* Inner highlight */}
      <circle cx="50" cy="46" r="8" fill="rgba(232, 194, 107, 0.08)" />
      {/* Eyes */}
      <circle cx="44" cy="49" r="1.8" fill="var(--star-cream)" opacity="0.9" />
      <circle cx="56" cy="49" r="1.8" fill="var(--star-cream)" opacity="0.9" />
      {/* Eye sparkles */}
      <circle cx="44.6" cy="48.4" r="0.6" fill="var(--moon-gold)" opacity="0.7" />
      <circle cx="56.6" cy="48.4" r="0.6" fill="var(--moon-gold)" opacity="0.7" />
    </g>
  );
}

function CrescentMoon() {
  return (
    <g transform="translate(50, 24)" opacity="0.85">
      <path
        d="M-4,-6 A8,8 0 0,1 4,-6 A6,6 0 0,0 -4,-6 Z"
        fill="var(--moon-gold)"
        transform="rotate(-15)"
      />
    </g>
  );
}

function StarCloak() {
  return (
    <g opacity="0.5">
      {/* Flowing wisps */}
      <path
        d="M38,64 Q30,78 26,90"
        stroke="var(--mystic-purple)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M42,66 Q36,80 34,92"
        stroke="var(--moon-gold)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M58,66 Q64,80 66,92"
        stroke="var(--moon-gold)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M62,64 Q70,78 74,90"
        stroke="var(--mystic-purple)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Constellation dots in the cloak */}
      <circle cx="30" cy="82" r="1" fill="var(--star-cream)" opacity="0.5" />
      <circle cx="35" cy="88" r="0.8" fill="var(--star-cream)" opacity="0.4" />
      <circle cx="66" cy="85" r="1" fill="var(--star-cream)" opacity="0.5" />
      <circle cx="70" cy="80" r="0.8" fill="var(--star-cream)" opacity="0.4" />
    </g>
  );
}

function StarCrown() {
  const starPoints = (cx: number, cy: number, r: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 72 - 90) * (Math.PI / 180);
      const innerAngle = ((i * 72 + 36) - 90) * (Math.PI / 180);
      pts.push(`${cx + r * Math.cos(outerAngle)},${cy + r * Math.sin(outerAngle)}`);
      pts.push(`${cx + r * 0.45 * Math.cos(innerAngle)},${cy + r * 0.45 * Math.sin(innerAngle)}`);
    }
    return pts.join(" ");
  };

  return (
    <g opacity="0.85">
      <polygon points={starPoints(50, 20, 4)} fill="var(--moon-gold)" />
      <polygon points={starPoints(40, 24, 2.5)} fill="var(--moon-gold)" opacity="0.7" />
      <polygon points={starPoints(60, 24, 2.5)} fill="var(--moon-gold)" opacity="0.7" />
      {/* Connecting arc */}
      <path
        d="M38,26 Q50,18 62,26"
        stroke="var(--moon-gold)"
        strokeWidth="0.6"
        fill="none"
        opacity="0.4"
      />
    </g>
  );
}

function ConstellationWings() {
  return (
    <g opacity="0.7">
      {/* Left wing */}
      <line x1="34" y1="46" x2="18" y2="36" stroke="var(--star-cream)" strokeWidth="0.5" opacity="0.5" />
      <line x1="18" y1="36" x2="8" y2="30" stroke="var(--star-cream)" strokeWidth="0.5" opacity="0.4" />
      <line x1="18" y1="36" x2="14" y2="46" stroke="var(--star-cream)" strokeWidth="0.5" opacity="0.4" />
      <line x1="14" y1="46" x2="6" y2="50" stroke="var(--star-cream)" strokeWidth="0.5" opacity="0.3" />
      <circle cx="18" cy="36" r="1.5" fill="var(--moon-gold)" opacity="0.8" />
      <circle cx="8" cy="30" r="1" fill="var(--star-cream)" opacity="0.6" />
      <circle cx="14" cy="46" r="1.2" fill="var(--moon-gold)" opacity="0.7" />
      <circle cx="6" cy="50" r="0.8" fill="var(--star-cream)" opacity="0.5" />
      {/* Right wing */}
      <line x1="66" y1="46" x2="82" y2="36" stroke="var(--star-cream)" strokeWidth="0.5" opacity="0.5" />
      <line x1="82" y1="36" x2="92" y2="30" stroke="var(--star-cream)" strokeWidth="0.5" opacity="0.4" />
      <line x1="82" y1="36" x2="86" y2="46" stroke="var(--star-cream)" strokeWidth="0.5" opacity="0.4" />
      <line x1="86" y1="46" x2="94" y2="50" stroke="var(--star-cream)" strokeWidth="0.5" opacity="0.3" />
      <circle cx="82" cy="36" r="1.5" fill="var(--moon-gold)" opacity="0.8" />
      <circle cx="92" cy="30" r="1" fill="var(--star-cream)" opacity="0.6" />
      <circle cx="86" cy="46" r="1.2" fill="var(--moon-gold)" opacity="0.7" />
      <circle cx="94" cy="50" r="0.8" fill="var(--star-cream)" opacity="0.5" />
    </g>
  );
}

function AscendedParticles() {
  // Small orbiting sparkles for the final form
  return (
    <g>
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const r = 34;
        const cx = 50 + r * Math.cos(rad);
        const cy = 50 + r * Math.sin(rad);
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={0.8 + (i % 3) * 0.3}
            fill="var(--moon-gold)"
            opacity={0.3 + (i % 3) * 0.15}
          >
            <animate
              attributeName="opacity"
              values={`${0.2 + (i % 3) * 0.1};${0.6 + (i % 2) * 0.2};${0.2 + (i % 3) * 0.1}`}
              dur={`${2 + i * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>
        );
      })}
    </g>
  );
}

// --- Speech Bubble ---

function SpeechBubble({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div
      onClick={onDismiss}
      className="absolute bottom-full right-0 mb-3 w-56 sm:w-64 cursor-pointer animate-fade-in"
    >
      <div
        className="relative rounded-xl px-4 py-3 border"
        style={{
          backgroundColor: "var(--star-cream)",
          borderColor: "var(--moon-gold)",
          borderWidth: "1px",
        }}
      >
        <p
          className="mystical-text text-xs sm:text-sm leading-relaxed"
          style={{ color: "var(--midnight)" }}
        >
          {message}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="absolute top-1.5 right-2 text-xs opacity-40 hover:opacity-70"
          style={{ color: "var(--midnight)" }}
          aria-label="Dismiss"
        >
          &times;
        </button>
        {/* Tail */}
        <div
          className="absolute -bottom-[7px] right-6 w-3 h-3 rotate-45 border-r border-b"
          style={{
            backgroundColor: "var(--star-cream)",
            borderColor: "var(--moon-gold)",
            borderWidth: "0 1px 1px 0",
          }}
        />
      </div>
    </div>
  );
}

// --- Main Component ---

export default function CelestialAvatar({ streak }: CelestialAvatarProps) {
  const tier = getTier(streak);
  const [bubbleMessage, setBubbleMessage] = useState<string | null>(null);

  const dismissBubble = useCallback(() => {
    setBubbleMessage(null);
  }, []);

  useEffect(() => {
    // Check intro
    if (streak === 1 && !getAvatarIntroSeen()) {
      setBubbleMessage(INTRO_MESSAGE);
      return;
    }

    // Check level-ups
    const seen = getAvatarLevelUpsSeen();
    for (const day of LEVEL_UP_DAYS) {
      if (streak >= day && !seen.includes(day) && LEVEL_UP_MESSAGES[day]) {
        setBubbleMessage(LEVEL_UP_MESSAGES[day]);
        markAvatarLevelUpSeen(day);
        // Auto-dismiss after 8 seconds
        const timer = setTimeout(() => setBubbleMessage(null), 8000);
        return () => clearTimeout(timer);
      }
    }
  }, [streak]);

  const handleDismissBubble = useCallback(() => {
    // If this was the intro, mark it seen on dismiss
    if (streak === 1 && !getAvatarIntroSeen()) {
      setAvatarIntroSeen();
    }
    setBubbleMessage(null);
  }, [streak]);

  return (
    <div
      className="fixed bottom-6 right-6 z-40 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]"
      style={{ pointerEvents: "auto" }}
    >
      {/* Speech Bubble */}
      {bubbleMessage && (
        <SpeechBubble message={bubbleMessage} onDismiss={handleDismissBubble} />
      )}

      {/* Avatar SVG */}
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full celestial-avatar-pulse"
      >
        {/* Tier 5+ wings (behind body) */}
        {tier >= 5 && <ConstellationWings />}

        {/* Tier 3+ cloak (behind body) */}
        {tier >= 3 && <StarCloak />}

        {/* Core body — always present */}
        <OrbBody tier={tier} />

        {/* Tier 2+ crescent moon */}
        {tier >= 2 && <CrescentMoon />}

        {/* Tier 4+ star crown (replaces moon visually, stacks above) */}
        {tier >= 4 && <StarCrown />}

        {/* Tier 6 ascended particles */}
        {tier >= 6 && <AscendedParticles />}
      </svg>

      {/* Pulse animation style — scoped here to avoid globals */}
      <style jsx>{`
        .celestial-avatar-pulse {
          animation: avatarPulse 4s ease-in-out infinite;
        }
        @keyframes avatarPulse {
          0%, 100% {
            filter: drop-shadow(0 0 6px rgba(232, 194, 107, 0.2));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 14px rgba(232, 194, 107, 0.35));
            transform: scale(1.04);
          }
        }
      `}</style>
    </div>
  );
}
