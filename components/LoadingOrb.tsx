"use client";

export default function LoadingOrb({ message = "Consulting the stars..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-mystic-purple/30 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-mystic-purple to-deep-violet animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center text-moon-gold text-xl">
          &#10022;
        </div>
      </div>
      <p className="mystical-text text-star-cream/60 text-sm">{message}</p>
    </div>
  );
}
