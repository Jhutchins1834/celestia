"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Header from "@/components/Header";
import CosmicCard from "@/components/CosmicCard";
import ReadingProse from "@/components/ReadingProse";
import LoadingOrb from "@/components/LoadingOrb";
import { getProfile, saveReading, generateId } from "@/lib/storage";
import { getCurrentMoonPhase, type MoonPhaseData } from "@/lib/moon";

function MoonPhaseSVG({ phaseIndex }: { phaseIndex: number }) {
  // phaseIndex: 0=New, 1=Waxing Crescent, 2=First Quarter, 3=Waxing Gibbous,
  //             4=Full, 5=Waning Gibbous, 6=Last Quarter, 7=Waning Crescent
  const r = 32;
  const cx = 40;
  const cy = 40;

  // For new moon: fully dark. For full moon: fully lit.
  // For crescents/quarters/gibbous: use an ellipse clip to show partial illumination.
  if (phaseIndex === 0) {
    // New Moon — dark circle with faint outline
    return (
      <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-lg">
        <circle cx={cx} cy={cy} r={r} fill="var(--midnight)" stroke="var(--accent-gold)" strokeWidth="1" opacity="0.5" />
        <circle cx={cx} cy={cy} r={r - 2} fill="var(--deep-violet)" opacity="0.6" />
      </svg>
    );
  }

  if (phaseIndex === 4) {
    // Full Moon — bright circle
    return (
      <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-lg">
        <defs>
          <radialGradient id="fullMoonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--star-cream)" />
            <stop offset="70%" stopColor="var(--moon-gold)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--moon-gold)" stopOpacity="0.3" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r + 4} fill="var(--moon-gold)" opacity="0.15" />
        <circle cx={cx} cy={cy} r={r} fill="url(#fullMoonGlow)" />
      </svg>
    );
  }

  // For partial phases, we draw a lit half and a dark half,
  // then use an ellipse to create the terminator line
  const isWaxing = phaseIndex < 4;

  // The "bulge" of the terminator ellipse
  // Crescent: small lit area, Gibbous: large lit area
  let terminatorRx: number;
  if (phaseIndex === 1 || phaseIndex === 7) {
    // Crescent — terminator bulges into the lit side
    terminatorRx = r * 0.6;
  } else if (phaseIndex === 2 || phaseIndex === 6) {
    // Quarter — straight line (rx = 0)
    terminatorRx = 0;
  } else {
    // Gibbous — terminator bulges into the dark side
    terminatorRx = r * 0.6;
  }

  const isGibbous = phaseIndex === 3 || phaseIndex === 5;
  const isCrescent = phaseIndex === 1 || phaseIndex === 7;

  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-lg">
      <defs>
        <clipPath id="moonClip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* Base dark circle */}
      <circle cx={cx} cy={cy} r={r} fill="var(--deep-violet)" clipPath="url(#moonClip)" />

      {/* Lit portion */}
      <g clipPath="url(#moonClip)">
        {/* For waxing: right side is lit. For waning: left side is lit. */}
        {isWaxing ? (
          <>
            {/* Right half always lit for waxing */}
            <rect x={cx} y={cy - r} width={r} height={r * 2} fill="var(--star-cream)" opacity="0.9" />
            {/* Terminator ellipse */}
            {isCrescent && (
              <ellipse cx={cx} cy={cy} rx={terminatorRx} ry={r} fill="var(--deep-violet)" />
            )}
            {isGibbous && (
              <ellipse cx={cx} cy={cy} rx={terminatorRx} ry={r} fill="var(--star-cream)" opacity="0.9" />
            )}
          </>
        ) : (
          <>
            {/* Left half always lit for waning */}
            <rect x={cx - r} y={cy - r} width={r} height={r * 2} fill="var(--star-cream)" opacity="0.9" />
            {/* Terminator ellipse */}
            {isCrescent && (
              <ellipse cx={cx} cy={cy} rx={terminatorRx} ry={r} fill="var(--deep-violet)" />
            )}
            {isGibbous && (
              <ellipse cx={cx} cy={cy} rx={terminatorRx} ry={r} fill="var(--star-cream)" opacity="0.9" />
            )}
          </>
        )}
      </g>

      {/* Subtle outline */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--accent-gold)" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

export default function MoonPhasePage() {
  const router = useRouter();
  const [moonData, setMoonData] = useState<MoonPhaseData | null>(null);
  const [reading, setReading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profile = getProfile();
    if (!profile) {
      router.push("/onboarding");
      return;
    }

    // Calculate moon phase client-side for display
    const phase = getCurrentMoonPhase(new Date());
    setMoonData(phase);

    const fetchReading = async () => {
      try {
        const res = await fetch("/api/reading", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "moon-phase", profile }),
        });
        const data = await res.json();
        setReading(data.reading);

        // Update moon data from server if available
        if (data.moonPhase) {
          setMoonData(data.moonPhase);
        }

        saveReading({
          id: generateId(),
          type: "moon-phase",
          title: `${phase.phase} — ${new Date().toLocaleDateString()}`,
          content: data.reading,
          date: new Date().toISOString(),
          favorited: false,
        });
        setSaved(true);
      } catch {
        setReading("The moon is hidden behind the clouds. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReading();
  }, [router]);

  return (
    <>
      <Header />

      <main className="flex-1 relative z-10 px-6 pb-12 max-w-lg mx-auto w-full">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-star-cream/50 hover:text-star-cream transition-colors mt-4 mb-6"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="font-serif text-2xl text-accent-gold mb-6">
          Moon Phase
        </h1>

        <CosmicCard>
          {loading ? (
            <LoadingOrb message="Reading the moon's light..." />
          ) : (
            <div className="animate-fade-in">
              {/* Moon phase display */}
              {moonData && (
                <div className="flex flex-col items-center mb-6 pb-6 border-b border-star-cream/10">
                  <MoonPhaseSVG phaseIndex={moonData.phaseIndex} />
                  <h2 className="font-serif text-xl text-accent-gold mt-4">
                    {moonData.phase}
                  </h2>
                  <p className="text-star-cream/40 text-xs mt-1">
                    {Math.round(moonData.illumination * 100)}% illuminated
                  </p>
                  <p className="text-star-cream/30 text-xs mt-1">
                    Next: {moonData.nextPhase} in {moonData.daysUntilNext} day{moonData.daysUntilNext !== 1 ? "s" : ""}
                  </p>
                </div>
              )}

              {/* Reading */}
              <ReadingProse content={reading || ""} />

              {saved && (
                <div className="flex items-center gap-1.5 mt-6 text-star-cream/30 text-xs">
                  <Save size={12} />
                  <span>Saved to your journal</span>
                </div>
              )}
            </div>
          )}
        </CosmicCard>
      </main>
    </>
  );
}
