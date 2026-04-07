"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

interface StreakBadgeProps {
  count: number;
}

const milestones = [3, 7, 14, 30];

export default function StreakBadge({ count }: StreakBadgeProps) {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (milestones.includes(count)) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  if (count <= 0) return null;

  const messages: Record<number, string> = {
    3: "Three days of cosmic connection",
    7: "A full week with the stars",
    14: "Two weeks of celestial wisdom",
    30: "A lunar cycle of devotion",
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5 text-moon-gold">
        <Flame size={18} className={count >= 7 ? "animate-pulse" : ""} />
        <span className="text-sm font-medium">{count} day streak</span>
      </div>

      {showCelebration && messages[count] && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap animate-fade-in">
          <div className="px-4 py-2 rounded-full bg-moon-gold/10 border border-moon-gold/30 text-moon-gold text-xs mystical-text">
            {messages[count]}
          </div>
        </div>
      )}
    </div>
  );
}
