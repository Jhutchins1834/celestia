"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Header from "@/components/Header";
import CosmicCard from "@/components/CosmicCard";
import ReadingProse from "@/components/ReadingProse";
import LoadingOrb from "@/components/LoadingOrb";
import { getProfile, saveReading, generateId } from "@/lib/storage";

const typeLabels: Record<string, string> = {
  daily: "Daily Reading",
  weekly: "Seven Days of Sky",
  monthly: "Monthly Reading",
  yearly: "Yearly Reading",
};

export default function ReadingPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;
  const [reading, setReading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profile = getProfile();
    if (!profile) {
      router.push("/onboarding");
      return;
    }

    const fetchReading = async () => {
      try {
        const res = await fetch("/api/reading", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, profile }),
        });
        const data = await res.json();
        setReading(data.reading);

        saveReading({
          id: generateId(),
          type: type as "daily" | "weekly" | "monthly" | "yearly",
          title: `${typeLabels[type] || "Reading"} — ${new Date().toLocaleDateString()}`,
          content: data.reading,
          date: new Date().toISOString(),
          favorited: false,
        });
        setSaved(true);
      } catch {
        setReading("The stars are quiet right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReading();
  }, [type, router]);

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
          {typeLabels[type] || "Reading"}
        </h1>

        <CosmicCard>
          {loading ? (
            <LoadingOrb message={`Channeling your ${type} reading...`} />
          ) : (
            <>
              <ReadingProse content={reading || ""} />
              {saved && (
                <div className="flex items-center gap-1.5 mt-6 text-star-cream/30 text-xs">
                  <Save size={12} />
                  <span>Saved to your journal</span>
                </div>
              )}
            </>
          )}
        </CosmicCard>
      </main>
    </>
  );
}
