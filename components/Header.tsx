"use client";

import Link from "next/link";
import { Moon, Sun, BookOpen, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { getPreferences, toggleMode, type AppPreferences } from "@/lib/storage";

export default function Header() {
  const [prefs, setPrefs] = useState<AppPreferences | null>(null);

  useEffect(() => {
    setPrefs(getPreferences());
  }, []);

  const handleToggle = () => {
    const updated = toggleMode();
    setPrefs(updated);
  };

  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-moon-gold text-2xl">&#10022;</span>
        <span className="font-serif text-xl text-star-cream tracking-wide group-hover:text-moon-gold transition-colors">
          Celestia
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {prefs && prefs.streakCount > 0 && (
          <div className="flex items-center gap-1 text-moon-gold/80 text-sm">
            <Flame size={16} />
            <span>{prefs.streakCount}</span>
          </div>
        )}

        <Link
          href="/journal"
          className="text-star-cream/60 hover:text-star-cream transition-colors"
          aria-label="Journal"
        >
          <BookOpen size={20} />
        </Link>

        {prefs && (
          <button
            onClick={handleToggle}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-moon-gold/20
                       text-sm text-star-cream/80 hover:border-moon-gold/40 transition-all"
            aria-label={`Switch to ${prefs.primaryMode === "astrology" ? "tarot" : "astrology"}`}
          >
            {prefs.primaryMode === "astrology" ? (
              <>
                <Sun size={14} className="text-moon-gold" />
                <span>Astrology</span>
              </>
            ) : (
              <>
                <Moon size={14} className="text-mystic-purple" />
                <span>Tarot</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
