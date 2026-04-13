"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CosmicCard from "@/components/CosmicCard";
import { getSunSign } from "@/lib/astrology";
import { saveProfile, type CosmicProfile } from "@/lib/storage";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"welcome" | "form" | "reveal">("welcome");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [profile, setProfile] = useState<CosmicProfile | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;

    const date = new Date(birthDate + "T12:00:00");
    const sign = getSunSign(date);

    const newProfile: CosmicProfile = {
      name: name.trim() || "Cosmic Traveler",
      birthDate: date.toISOString(),
      sunSign: sign.name,
      element: sign.element,
      modality: sign.modality,
      rulingPlanet: sign.rulingPlanet,
      createdAt: new Date().toISOString(),
    };

    setProfile(newProfile);
    saveProfile(newProfile);
    setStep("reveal");
  };

  const handleContinue = () => {
    router.push("/");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">

      {step === "welcome" && (
        <div className="relative z-10 text-center max-w-md animate-fade-in">
          <div className="text-6xl mb-6 animate-float">&#10022;</div>
          <h1 className="font-serif text-4xl text-star-cream mb-4">
            Welcome to Celestia
          </h1>
          <p className="text-star-cream/70 leading-relaxed mb-8">
            A sacred space for cosmic reflection. The stars have been waiting for you.
          </p>
          <button
            onClick={() => setStep("form")}
            className="px-8 py-3 rounded-full border border-moon-gold/40 text-moon-gold
                       hover:bg-moon-gold/10 transition-all duration-300 font-medium"
          >
            Begin Your Journey
          </button>
        </div>
      )}

      {step === "form" && (
        <CosmicCard className="relative z-10 max-w-md w-full animate-slide-up">
          <h2 className="font-serif text-2xl text-star-cream mb-2 text-center">
            Tell Us About You
          </h2>
          <p className="text-star-cream/50 text-sm text-center mb-6">
            Your birth date unlocks your cosmic profile
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-star-cream/70 text-sm mb-1.5">
                Your name <span className="text-star-cream/30">(optional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What shall we call you?"
                className="w-full px-4 py-3 rounded-xl bg-midnight/60 border border-moon-gold/20
                           text-star-cream placeholder:text-star-cream/30
                           focus:outline-none focus:border-moon-gold/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-star-cream/70 text-sm mb-1.5">
                Birth date <span className="text-moon-gold/60">*</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-midnight/60 border border-moon-gold/20
                           text-star-cream
                           focus:outline-none focus:border-moon-gold/50 transition-colors
                           [color-scheme:dark]"
              />
            </div>

            <button
              type="submit"
              disabled={!birthDate}
              className="w-full py-3 rounded-xl bg-mystic-purple/60 border border-moon-gold/30
                         text-moon-gold font-medium
                         hover:bg-mystic-purple/80 transition-all duration-300
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Reveal My Cosmic Profile
            </button>
          </form>

          <p className="text-star-cream/30 text-xs text-center mt-4">
            For fun, reflection, and cosmic curiosity.
          </p>
        </CosmicCard>
      )}

      {step === "reveal" && profile && (
        <div className="relative z-10 max-w-md w-full animate-slide-up text-center">
          <div className="text-5xl mb-4">
            {(() => {
              const symbols: Record<string, string> = {
                Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
                Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
                Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
              };
              return symbols[profile.sunSign] || "✦";
            })()}
          </div>

          <h2 className="font-serif text-3xl text-star-cream mb-2">
            {profile.name}
          </h2>

          <CosmicCard className="mt-6 text-left" glowing>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-star-cream/50 text-sm">Sun Sign</span>
                <span className="text-moon-gold font-serif">{profile.sunSign}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-star-cream/50 text-sm">Element</span>
                <span className="text-star-cream">{profile.element}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-star-cream/50 text-sm">Modality</span>
                <span className="text-star-cream">{profile.modality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-star-cream/50 text-sm">Ruling Planet</span>
                <span className="text-star-cream">{profile.rulingPlanet}</span>
              </div>
            </div>
          </CosmicCard>

          <button
            onClick={handleContinue}
            className="mt-8 px-8 py-3 rounded-full border border-moon-gold/40 text-moon-gold
                       hover:bg-moon-gold/10 transition-all duration-300 font-medium"
          >
            Enter Celestia
          </button>
        </div>
      )}
    </div>
  );
}
