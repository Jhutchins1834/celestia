"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Save } from "lucide-react";
import Header from "@/components/Header";
import CosmicCard from "@/components/CosmicCard";
import ReadingProse from "@/components/ReadingProse";
import LoadingOrb from "@/components/LoadingOrb";
import { getProfile, saveReading, generateId } from "@/lib/storage";

export default function AskPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
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
    setAnswer(null);
    setSaved(false);

    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "ask", profile, question: question.trim() }),
      });
      const data = await res.json();
      setAnswer(data.reading);

      saveReading({
        id: generateId(),
        type: "ask",
        title: question.trim(),
        content: data.reading,
        date: new Date().toISOString(),
        favorited: false,
        question: question.trim(),
      });
      setSaved(true);
    } catch {
      setAnswer("The stars are quiet right now. Please try again.");
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
          Ask the Stars
        </h1>
        <p className="text-star-cream/50 text-sm mb-6 mystical-text">
          What weighs on your mind tonight?
        </p>

        <form onSubmit={handleAsk} className="mb-6">
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What should I focus on this week? Am I on the right path? What energy should I lean into?"
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
            <LoadingOrb message="The stars are considering your question..." />
          </CosmicCard>
        )}

        {answer && !loading && (
          <CosmicCard className="animate-slide-up">
            <ReadingProse content={answer} />
            {saved && (
              <div className="flex items-center gap-1.5 mt-6 text-star-cream/30 text-xs">
                <Save size={12} />
                <span>Saved to your journal</span>
              </div>
            )}
          </CosmicCard>
        )}
      </main>
    </>
  );
}
