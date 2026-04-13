"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Layers, MessageCircle, ChevronRight, Grid3X3, CircleDot } from "lucide-react";
import AmbientBackground from "@/components/AmbientBackground";
import Header from "@/components/Header";
import CosmicCard from "@/components/CosmicCard";
import TarotCard from "@/components/TarotCard";
import ReadingProse from "@/components/ReadingProse";
import StreakBadge from "@/components/StreakBadge";
import LoadingOrb from "@/components/LoadingOrb";
import CelestialAvatar from "@/components/CelestialAvatar";
import {
  hasProfile,
  getProfile,
  getPreferences,
  updateStreak,
  getTarotCardOfTheDay,
  saveTarotCardOfTheDay,
  saveReading,
  generateId,
  type CosmicProfile,
  type AppPreferences,
  type TarotCardOfTheDay,
} from "@/lib/storage";
import { getGreeting } from "@/lib/astrology";

interface DrawnCard {
  name: string;
  position: string;
  reversed: boolean;
  meaning: string;
  image: string;
}

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CosmicProfile | null>(null);
  const [prefs, setPrefs] = useState<AppPreferences | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"astrology" | "tarot">("astrology");

  // Astrology daily reading state
  const [todayReading, setTodayReading] = useState<string | null>(null);
  const [astroLoading, setAstroLoading] = useState(false);
  const [astroExpanded, setAstroExpanded] = useState(false);

  // Tarot Card of the Day state
  const [cotd, setCotd] = useState<TarotCardOfTheDay | null>(null);
  const [cotdLoading, setCotdLoading] = useState(false);
  const [cotdExpanded, setCotdExpanded] = useState(false);

  useEffect(() => {
    if (!hasProfile()) {
      router.push("/onboarding");
      return;
    }
    const p = getProfile()!;
    setProfile(p);
    const updatedPrefs = updateStreak();
    setPrefs(updatedPrefs);
    setMode(updatedPrefs.primaryMode);

    // Check for existing Card of the Day
    const existingCotd = getTarotCardOfTheDay();
    if (existingCotd) {
      setCotd(existingCotd);
      setCotdExpanded(true);
    }

    setReady(true);
  }, [router]);

  const handleModeChange = useCallback((newMode: "astrology" | "tarot") => {
    setMode(newMode);
    setPrefs((prev) => (prev ? { ...prev, primaryMode: newMode } : prev));
  }, []);

  // Astrology: fetch daily reading
  const fetchDailyReading = async () => {
    if (!profile || astroLoading) return;
    setAstroLoading(true);
    setAstroExpanded(true);
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
      setAstroLoading(false);
    }
  };

  // Tarot: fetch Card of the Day
  const fetchCardOfTheDay = async () => {
    if (!profile || cotdLoading) return;

    // If already have today's card, just expand
    const existing = getTarotCardOfTheDay();
    if (existing) {
      setCotd(existing);
      setCotdExpanded(true);
      return;
    }

    setCotdLoading(true);
    setCotdExpanded(true);
    try {
      const res = await fetch("/api/tarot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spread: "one-card", profile }),
      });
      const data = await res.json();
      const card = data.cards[0] as DrawnCard;
      const today = new Date().toISOString().split("T")[0];

      const newCotd: TarotCardOfTheDay = {
        date: today,
        card: {
          name: card.name,
          position: card.position,
          reversed: card.reversed,
          meaning: card.meaning,
          image: card.image,
        },
        interpretation: data.interpretation,
      };

      saveTarotCardOfTheDay(newCotd);
      setCotd(newCotd);

      // Also save to journal
      saveReading({
        id: generateId(),
        type: "tarot",
        title: `Card of the Day — ${new Date().toLocaleDateString()}`,
        content: data.interpretation,
        date: new Date().toISOString(),
        favorited: false,
        cards: [{ name: card.name, position: card.position, reversed: card.reversed }],
        spread: "card-of-the-day",
      });
    } catch {
      setCotd(null);
      setCotdExpanded(false);
    } finally {
      setCotdLoading(false);
    }
  };

  if (!ready) return null;

  const greeting = getGreeting();
  const isTarot = mode === "tarot";

  return (
    <div className="min-h-screen flex flex-col relative" data-mode={mode}>
      <AmbientBackground mode={mode} />
      <Header onModeChange={handleModeChange} />

      <main className="flex-1 relative z-10 px-6 pb-12 max-w-lg mx-auto w-full">
        {/* Greeting */}
        <div className="mt-8 mb-8 animate-fade-in">
          <h1 className="font-serif text-2xl text-star-cream">
            {greeting}, {profile?.name || "traveler"}
          </h1>
          <p className="text-star-cream/50 text-sm mt-1 mystical-text">
            {isTarot ? "The deck awaits your touch" : "The cosmos is listening"}
          </p>
        </div>

        {/* Streak */}
        {prefs && prefs.streakCount > 0 && (
          <div className="mb-6">
            <StreakBadge count={prefs.streakCount} />
          </div>
        )}

        {/* ===== FEATURED CARD ===== */}
        {isTarot ? (
          /* --- Tarot: Card of the Day --- */
          <CosmicCard
            className="mb-6 animate-slide-up"
            onClick={!cotdExpanded ? fetchCardOfTheDay : undefined}
            glowing={!cotdExpanded}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-lg text-accent-gold transition-colors duration-[1200ms]">
                Card of the Day
              </h2>
              {!cotdExpanded && (
                <span className="text-star-cream/40 text-sm">Tap to reveal</span>
              )}
            </div>

            {cotdLoading && <LoadingOrb message="Drawing your card..." />}

            {cotd && !cotdLoading && (
              <div>
                <div className="flex justify-center mb-5">
                  <TarotCard
                    name={cotd.card.name}
                    reversed={cotd.card.reversed}
                    position="The Message"
                    image={cotd.card.image}
                    revealed={true}
                  />
                </div>
                <ReadingProse content={cotd.interpretation} />
              </div>
            )}

            {!cotd && !cotdLoading && (
              <p className="text-star-cream/40 mystical-text text-center py-6">
                The deck has chosen for you...
              </p>
            )}
          </CosmicCard>
        ) : (
          /* --- Astrology: Today's Reading --- */
          <CosmicCard
            className="mb-6 animate-slide-up"
            onClick={!astroExpanded ? fetchDailyReading : undefined}
            glowing={!astroExpanded}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-lg text-accent-gold transition-colors duration-[1200ms]">
                Today&apos;s Reading
              </h2>
              {!astroExpanded && (
                <span className="text-star-cream/40 text-sm">Tap to reveal</span>
              )}
            </div>

            {astroLoading && <LoadingOrb />}

            {todayReading && !astroLoading && (
              <ReadingProse content={todayReading} />
            )}

            {!todayReading && !astroLoading && (
              <p className="text-star-cream/40 mystical-text text-center py-6">
                Your daily cosmic message awaits...
              </p>
            )}
          </CosmicCard>
        )}

        {/* ===== EXPLORE ACTIONS ===== */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-star-cream/40 text-xs uppercase tracking-wider mb-2">
            Explore
          </h3>

          {isTarot ? (
            /* --- Tarot mode actions --- */
            <>
              <Link href="/tarot/three-card">
                <CosmicCard className="flex items-center justify-between !py-4">
                  <div className="flex items-center gap-3">
                    <Layers size={18} className="tarot-shift-icon text-antique-gold" />
                    <span className="text-star-cream">Three-Card Spread</span>
                  </div>
                  <ChevronRight size={16} className="tarot-shift-icon text-antique-gold/40" />
                </CosmicCard>
              </Link>

              <Link href="/tarot/celtic-cross">
                <CosmicCard className="flex items-center justify-between !py-4 mt-3">
                  <div className="flex items-center gap-3">
                    <Grid3X3 size={18} className="tarot-shift-icon text-antique-gold" />
                    <span className="text-star-cream">Celtic Cross</span>
                  </div>
                  <ChevronRight size={16} className="tarot-shift-icon text-antique-gold/40" />
                </CosmicCard>
              </Link>

              <Link href="/ask-cards">
                <CosmicCard className="flex items-center justify-between !py-4 mt-3">
                  <div className="flex items-center gap-3">
                    <MessageCircle size={18} className="tarot-shift-icon text-antique-gold" />
                    <span className="text-star-cream">Ask the Cards</span>
                  </div>
                  <ChevronRight size={16} className="tarot-shift-icon text-antique-gold/40" />
                </CosmicCard>
              </Link>
            </>
          ) : (
            /* --- Astrology mode actions --- */
            <>
              <Link href="/tarot/one-card">
                <CosmicCard className="flex items-center justify-between !py-4">
                  <div className="flex items-center gap-3">
                    <Layers size={18} className="text-mystic-purple tarot-shift-icon" />
                    <span className="text-star-cream">Pull a Tarot Card</span>
                  </div>
                  <ChevronRight size={16} className="text-star-cream/30 tarot-shift-icon" />
                </CosmicCard>
              </Link>

              <Link href="/reading/weekly">
                <CosmicCard className="flex items-center justify-between !py-4 mt-3">
                  <div className="flex items-center gap-3">
                    <Sparkles size={18} className="text-accent-gold transition-colors duration-[1200ms] tarot-shift-icon" />
                    <span className="text-star-cream">This Week</span>
                  </div>
                  <ChevronRight size={16} className="text-star-cream/30 tarot-shift-icon" />
                </CosmicCard>
              </Link>

              <Link href="/ask">
                <CosmicCard className="flex items-center justify-between !py-4 mt-3">
                  <div className="flex items-center gap-3">
                    <MessageCircle size={18} className="text-sage-whisper tarot-shift-icon" />
                    <span className="text-star-cream">Ask the Stars</span>
                  </div>
                  <ChevronRight size={16} className="text-star-cream/30 tarot-shift-icon" />
                </CosmicCard>
              </Link>
            </>
          )}
        </div>
      </main>

      {prefs && <CelestialAvatar streak={prefs.streakCount} />}
    </div>
  );
}
