"use client";

import { useState } from "react";

interface TarotCardProps {
  name: string;
  reversed: boolean;
  position?: string;
  image: string;
  revealed?: boolean;
  onClick?: () => void;
}

export default function TarotCard({
  name,
  reversed,
  position,
  revealed = true,
  onClick,
}: TarotCardProps) {
  const [flipped, setFlipped] = useState(revealed);

  const handleClick = () => {
    if (!flipped) setFlipped(true);
    onClick?.();
  };

  return (
    <div className="flex flex-col items-center gap-2" onClick={handleClick}>
      {position && (
        <span className="text-xs text-accent-gold/70 uppercase tracking-wider">
          {position}
        </span>
      )}
      <div
        className={`
          tarot-drawn-card
          relative w-28 h-44 sm:w-32 sm:h-52 rounded-xl overflow-hidden
          border border-accent-gold/30 cursor-pointer
          transition-all duration-500 ease-out
          ${flipped ? "" : "hover:scale-105"}
          ${reversed && flipped ? "rotate-180" : ""}
        `}
      >
        {flipped ? (
          <div className="tarot-card-face w-full h-full bg-gradient-to-br from-deep-violet to-mystic-purple flex items-center justify-center p-3">
            <span className="font-serif text-sm text-center text-star-cream leading-tight">
              {name}
            </span>
          </div>
        ) : (
          <div className="tarot-card-back w-full h-full bg-gradient-to-br from-mystic-purple to-deep-violet flex items-center justify-center">
            <span className="text-4xl text-accent-gold/40">&#10022;</span>
          </div>
        )}
      </div>
      {flipped && (
        <span className="text-xs text-star-cream/50">
          {reversed ? "(Reversed)" : ""}
        </span>
      )}
    </div>
  );
}
