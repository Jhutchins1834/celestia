import { NextRequest, NextResponse } from "next/server";
import { drawCards, spreadPositions, type SpreadType } from "@/lib/data/tarot";
import { generateTarotReading } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spread, profile } = body;

    if (!spread || !profile) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const validSpreads: SpreadType[] = ["one-card", "three-card", "celtic-cross"];
    if (!validSpreads.includes(spread)) {
      return NextResponse.json(
        { error: "Invalid spread type" },
        { status: 400 }
      );
    }

    const positions = spreadPositions[spread as SpreadType];
    const cards = drawCards(positions.length);

    const cardsWithPositions = cards.map((card, i) => ({
      name: card.name,
      position: positions[i],
      reversed: card.reversed,
      meaning: card.reversed ? card.reversedMeaning : card.uprightMeaning,
      image: card.image,
    }));

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const interpretation = await generateTarotReading({
      cards: cardsWithPositions,
      spread: spread === "one-card" ? "single card" : spread === "three-card" ? "three-card (Past, Present, Future)" : "Celtic Cross",
      sunSign: profile.sunSign,
      element: profile.element,
      date: today,
      name: profile.name !== "Cosmic Traveler" ? profile.name : undefined,
    });

    return NextResponse.json({
      cards: cardsWithPositions,
      interpretation,
    });
  } catch (error) {
    console.error("Tarot API error:", error);
    return NextResponse.json(
      { error: "Failed to generate tarot reading" },
      { status: 500 }
    );
  }
}
