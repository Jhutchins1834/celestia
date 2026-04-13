"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Save } from "lucide-react";
import Header from "@/components/Header";
import CosmicCard from "@/components/CosmicCard";
import TarotCard from "@/components/TarotCard";
import ReadingProse from "@/components/ReadingProse";
import LoadingOrb from "@/components/LoadingOrb";
import { getProfile, saveReading, generateId } from "@/lib/storage";

interface DrawnCard {
  name: string;
  position: string;
  reversed: boolean;
  meaning: string;
  image: string;
}

export default function AskCardsPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const profile = getProfile();
    if (!profile) {
      router.push("/onboarding");
      return;
    }

    setLoading(true);
    setInterpretation(null);
    setCards([]);
    setSaved(false);

    try {
      const res = await fetch("/api/tarot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spread: "one-card",
          profile,
          question: question.trim(),
        }),
      });
      const data = await res.json();
      setCards(data.cards);
      setInterpretation(data.interpretation);

      saveReading({
        id: generateId(),
        type: "tarot",
        title: question.trim(),
        content: data.interpretation,
        date: new Date().toISOString(),
        favorited: false,
        cards: data.cards.map((c: DrawnCard) => ({
          name: c.name,
          position: c.position,
          reversed: c.reversed,
        })),
        spread: "ask-cards",
        question: question.trim(),
      });
      setSaved(true);
    } catch {
      setInterpretation("The cards are resting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

        <h1 className="font-serif text-2xl text-accent-gold mb-2">
          Ask the Cards
        </h1>
        <p className="text-star-cream/50 text-sm mb-6 mystical-text">
          Whisper your question and let the deck answer
        </p>

        <form onSubmit={handleAsk} className="mb-6">
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What does the universe want me to know? Should I take that leap? What's blocking me?"
              rows={3}
              className="w-full px-4 py-3 pr-12 rounded-xl bg-deep-violet/60 border border-accent-gold/20
                         text-star-cream placeholder:text-star-cream/30 resize-none
                         focus:outline-none focus:border-accent-gold/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="absolute bottom-3 right-3 p-2 rounded-full bg-mystic-purple/60
                         text-accent-gold hover:bg-mystic-purple transition-colors
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </form>

        {loading && (
          <CosmicCard>
            <LoadingOrb message="The cards are turning..." />
          </CosmicCard>
        )}

        {cards.length > 0 && !loading && (
          <>
            <div className="flex justify-center mb-6">
              {cards.map((card, i) => (
                <TarotCard
                  key={i}
                  name={card.name}
                  reversed={card.reversed}
                  position={card.position}
                  image={card.image}
                  revealed={true}
                />
              ))}
            </div>

            <CosmicCard className="animate-slide-up">
              <ReadingProse content={interpretation || ""} />
              {saved && (
                <div className="flex items-center gap-1.5 mt-6 text-star-cream/30 text-xs">
                  <Save size={12} />
                  <span>Saved to your journal</span>
                </div>
              )}
            </CosmicCard>
          </>
        )}
      </main>
    </>
  );
}
