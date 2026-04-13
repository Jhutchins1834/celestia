"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Header from "@/components/Header";
import CosmicCard from "@/components/CosmicCard";
import TarotCard from "@/components/TarotCard";
import ReadingProse from "@/components/ReadingProse";
import LoadingOrb from "@/components/LoadingOrb";
import { getProfile, saveReading, generateId } from "@/lib/storage";

const spreadLabels: Record<string, string> = {
  "one-card": "Single Card Pull",
  "three-card": "Past, Present, Future",
  "celtic-cross": "Celtic Cross",
};

interface DrawnCard {
  name: string;
  position: string;
  reversed: boolean;
  meaning: string;
  image: string;
}

export default function TarotSpreadPage() {
  const params = useParams();
  const router = useRouter();
  const spread = params.spread as string;
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profile = getProfile();
    if (!profile) {
      router.push("/onboarding");
      return;
    }

    const fetchTarot = async () => {
      try {
        const res = await fetch("/api/tarot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ spread, profile }),
        });
        const data = await res.json();
        setCards(data.cards);
        setInterpretation(data.interpretation);

        saveReading({
          id: generateId(),
          type: "tarot",
          title: `${spreadLabels[spread] || "Tarot"} — ${new Date().toLocaleDateString()}`,
          content: data.interpretation,
          date: new Date().toISOString(),
          favorited: false,
          cards: data.cards.map((c: DrawnCard) => ({
            name: c.name,
            position: c.position,
            reversed: c.reversed,
          })),
          spread,
        });
        setSaved(true);
      } catch {
        setInterpretation("The cards are resting. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTarot();
  }, [spread, router]);

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

        <h1 className="font-serif text-2xl text-accent-gold mb-6">
          {spreadLabels[spread] || "Tarot Reading"}
        </h1>

        {loading ? (
          <CosmicCard>
            <LoadingOrb message="Drawing your cards..." />
          </CosmicCard>
        ) : (
          <>
            <div className={`flex flex-wrap justify-center gap-4 mb-8 ${
              spread === "celtic-cross" ? "gap-3" : "gap-6"
            }`}>
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

            <CosmicCard>
              <h2 className="font-serif text-lg text-accent-gold mb-4">
                Interpretation
              </h2>
              <ReadingProse content={interpretation || ""} />
              {saved && (
                <div className="flex items-center gap-1.5 mt-6 text-star-cream/30 text-xs">
                  <Save size={12} />
                  <span>Saved to your journal</span>
                </div>
              )}
            </CosmicCard>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {Object.entries(spreadLabels)
                .filter(([key]) => key !== spread)
                .map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => router.push(`/tarot/${key}`)}
                    className="px-4 py-2 rounded-full border border-accent-gold/20
                               text-star-cream/60 text-sm hover:border-accent-gold/40
                               hover:text-star-cream transition-all"
                  >
                    {label}
                  </button>
                ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
