"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Layers, MessageCircle, ChevronRight } from "lucide-react";
import StarfieldBackground from "@/components/StarfieldBackground";
import Header from "@/components/Header";
import CosmicCard from "@/components/CosmicCard";
import ReadingProse from "@/components/ReadingProse";
import StreakBadge from "@/components/StreakBadge";
import LoadingOrb from "@/components/LoadingOrb";
import {
  hasProfile,
  getProfile,
  getPreferences,
  updateStreak,
  type CosmicProfile,
  type AppPreferences,
} from "@/lib/storage";
import { getGreeting } from "@/lib/astrology";

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CosmicProfile | null>(null);
  const [prefs, setPrefs] = useState<AppPreferences | null>(null);
  const [todayReading, setTodayReading] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasProfile()) {
      router.push("/onboarding");
      return;
    }
    const p = getProfile()!;
    setProfile(p);
    const updatedPrefs = updateStreak();
    setPrefs(updatedPrefs);
    setReady(true);
  }, [router]);

  const fetchDailyReading = async () => {
    if (!profile || loading) return;
    setLoading(true);
    setExpanded(true);
    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "daily", profile }),
      });
      const data = await res.json();
      setTodayReading(data.reading);
    } catch {
      setTodayReading("The stars are a bit cloudy right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) return null;

  const greeting = getGreeting();

  return (
    <div className="min-h-screen flex flex-col relative">
      <StarfieldBackground />
      <Header />

      <main className="flex-1 relative z-10 px-6 pb-12 max-w-lg mx-auto w-full">
        {/* Greeting */}
        <div className="mt-8 mb-8 animate-fade-in">
          <h1 className="font-serif text-2xl text-star-cream">
            {greeting}, {profile?.name || "traveler"}
          </h1>
          <p className="text-star-cream/50 text-sm mt-1 mystical-text">
            The cosmos is listening
          </p>
        </div>

        {/* Streak */}
        {prefs && prefs.streakCount > 0 && (
          <div className="mb-6">
            <StreakBadge count={prefs.streakCount} />
          </div>
        )}

        {/* Today's Reading Card */}
        <CosmicCard
          className="mb-6 animate-slide-up"
          onClick={!expanded ? fetchDailyReading : undefined}
          glowing={!expanded}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-lg text-moon-gold">
              {prefs?.primaryMode === "tarot" ? "Today's Card" : "Today's Reading"}
            </h2>
            {!expanded && (
              <span className="text-star-cream/40 text-sm">Tap to reveal</span>
            )}
          </div>

          {loading && <LoadingOrb />}

          {todayReading && !loading && (
            <ReadingProse content={todayReading} />
          )}

          {!todayReading && !loading && (
            <p className="text-star-cream/40 mystical-text text-center py-6">
              Your daily cosmic message awaits...
            </p>
          )}
        </CosmicCard>

        {/* Quick Actions */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-star-cream/40 text-xs uppercase tracking-wider mb-2">
            Explore
          </h3>

          <Link href="/tarot/one-card">
            <CosmicCard className="flex items-center justify-between !py-4">
              <div className="flex items-center gap-3">
                <Layers size={18} className="text-mystic-purple" />
                <span className="text-star-cream">Pull a Tarot Card</span>
              </div>
              <ChevronRight size={16} className="text-star-cream/30" />
            </CosmicCard>
          </Link>

          <Link href="/reading/weekly">
            <CosmicCard className="flex items-center justify-between !py-4 mt-3">
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-moon-gold" />
                <span className="text-star-cream">This Week</span>
              </div>
              <ChevronRight size={16} className="text-star-cream/30" />
            </CosmicCard>
          </Link>

          <Link href="/ask">
            <CosmicCard className="flex items-center justify-between !py-4 mt-3">
              <div className="flex items-center gap-3">
                <MessageCircle size={18} className="text-sage-whisper" />
                <span className="text-star-cream">Ask the Stars</span>
              </div>
              <ChevronRight size={16} className="text-star-cream/30" />
            </CosmicCard>
          </Link>
        </div>
      </main>
    </div>
  );
}
