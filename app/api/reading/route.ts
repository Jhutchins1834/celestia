import { NextRequest, NextResponse } from "next/server";
import { generateReading } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, profile, question } = body;

    if (!type || !profile) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const validTypes = ["daily", "weekly", "monthly", "yearly", "ask"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid reading type" },
        { status: 400 }
      );
    }

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const reading = await generateReading({
      type,
      sunSign: profile.sunSign,
      element: profile.element,
      rulingPlanet: profile.rulingPlanet,
      date: today,
      question: type === "ask" ? question : undefined,
      name: profile.name !== "Cosmic Traveler" ? profile.name : undefined,
    });

    return NextResponse.json({ reading });
  } catch (error) {
    console.error("Reading API error:", error);
    return NextResponse.json(
      { error: "Failed to generate reading" },
      { status: 500 }
    );
  }
}
