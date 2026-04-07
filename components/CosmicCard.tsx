"use client";

import { ReactNode } from "react";

interface CosmicCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glowing?: boolean;
}

export default function CosmicCard({ children, className = "", onClick, glowing }: CosmicCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-2xl border border-moon-gold/20
        bg-gradient-to-br from-deep-violet/80 to-midnight/90
        backdrop-blur-sm p-6
        transition-all duration-300
        ${onClick ? "cursor-pointer hover:border-moon-gold/40 hover:scale-[1.01]" : ""}
        ${glowing ? "animate-glow" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
