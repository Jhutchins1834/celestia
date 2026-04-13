"use client";

import Link from "next/link";
import { Moon, Sun, BookOpen, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { getPreferences, type AppPreferences } from "@/lib/storage";
import { useMode } from "@/components/ModeProvider";

export default function Header() {
  const { mode, handleToggle } = useMode();
  const [prefs, setPrefs] = useState<AppPreferences | null>(null);

  useEffect(() => {
    setPrefs(getPreferences());
  }, []);

  const isTarot = mode === "tarot";

  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-accent-gold text-2xl transition-colors duration-[1200ms]">&#10022;</span>
        <span className="font-serif text-xl text-star-cream tracking-wide group-hover:text-accent-gold transition-colors">
          Celestia
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {prefs && prefs.streakCount > 0 && (
          <div className="flex items-center gap-1 text-accent-gold/80 text-sm transition-colors duration-[1200ms]">
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

        <button
          onClick={handleToggle}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm
            transition-all duration-[1200ms] ease-in-out
            ${isTarot
              ? "border-antique-gold/30 text-star-cream/80 hover:border-antique-gold/50"
              : "border-moon-gold/20 text-star-cream/80 hover:border-moon-gold/40"
            }
          `}
          aria-label={`Switch to ${isTarot ? "astrology" : "tarot"}`}
        >
          {isTarot ? (
            <>
              <Moon size={14} className="text-antique-gold" />
              <span>Tarot</span>
            </>
          ) : (
            <>
              <Sun size={14} className="text-moon-gold" />
              <span>Astrology</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
