"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Sparkles, Layers, MessageCircle, Calendar, Star } from "lucide-react";
import Header from "@/components/Header";
import CosmicCard from "@/components/CosmicCard";
import ReadingProse from "@/components/ReadingProse";
import { getReadings, toggleFavorite, type SavedReading } from "@/lib/storage";

const typeIcons: Record<string, React.ReactNode> = {
  daily: <Sparkles size={14} className="text-accent-gold" />,
  weekly: <Calendar size={14} className="text-accent-gold" />,
  monthly: <Star size={14} className="text-accent-gold" />,
  yearly: <Star size={14} className="text-accent-gold" />,
  tarot: <Layers size={14} className="text-mystic-purple" />,
  ask: <MessageCircle size={14} className="text-sage-whisper" />,
};

const filterOptions = [
  { value: "all", label: "All" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "tarot", label: "Tarot" },
  { value: "ask", label: "Questions" },
  { value: "favorites", label: "Favorites" },
];

export default function JournalPage() {
  const router = useRouter();
  const [readings, setReadings] = useState<SavedReading[]>([]);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setReadings(getReadings());
  }, []);

  const filteredReadings = readings.filter((r) => {
    if (filter === "all") return true;
    if (filter === "favorites") return r.favorited;
    return r.type === filter;
  });

  const handleFavorite = (id: string) => {
    toggleFavorite(id);
    setReadings(getReadings());
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

        <h1 className="font-serif text-2xl text-accent-gold mb-6">
          Your Cosmic Journal
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                filter === opt.value
                  ? "bg-mystic-purple/60 text-accent-gold border border-accent-gold/30"
                  : "border border-star-cream/10 text-star-cream/40 hover:text-star-cream/60"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Reading List */}
        {filteredReadings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-star-cream/30 mystical-text">
              {filter === "all"
                ? "Your journal is empty. Go get your first reading!"
                : "No readings of this type yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReadings.map((reading) => (
              <CosmicCard
                key={reading.id}
                onClick={() =>
                  setExpandedId(expandedId === reading.id ? null : reading.id)
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    {typeIcons[reading.type]}
                    <div className="min-w-0">
                      <h3 className="text-star-cream text-sm font-medium truncate">
                        {reading.title}
                      </h3>
                      <p className="text-star-cream/30 text-xs">
                        {new Date(reading.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavorite(reading.id);
                    }}
                    className="ml-2 flex-shrink-0"
                    aria-label={reading.favorited ? "Unfavorite" : "Favorite"}
                  >
                    <Heart
                      size={16}
                      className={
                        reading.favorited
                          ? "fill-accent-gold text-accent-gold"
                          : "text-star-cream/20 hover:text-star-cream/40"
                      }
                    />
                  </button>
                </div>

                {expandedId === reading.id && (
                  <div className="mt-4 pt-4 border-t border-star-cream/10 animate-fade-in">
                    {reading.question && (
                      <p className="text-star-cream/50 text-xs mb-3 mystical-text">
                        &ldquo;{reading.question}&rdquo;
                      </p>
                    )}
                    {reading.cards && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {reading.cards.map((card, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-mystic-purple/30 text-star-cream/60"
                          >
                            {card.name}
                            {card.reversed ? " (R)" : ""}
                          </span>
                        ))}
                      </div>
                    )}
                    <ReadingProse content={reading.content} />
                  </div>
                )}
              </CosmicCard>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
