import { NextRequest, NextResponse } from "next/server";
import { generateReading } from "@/lib/claude";
import { getCurrentMoonPhase } from "@/lib/moon";

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

    const validTypes = ["daily", "weekly", "monthly", "yearly", "ask", "moon-phase"];
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

    // Calculate moon phase server-side for moon-phase readings
    const moonData = type === "moon-phase" ? getCurrentMoonPhase(new Date()) : undefined;

    const reading = await generateReading({
      type,
      sunSign: profile.sunSign,
      element: profile.element,
      rulingPlanet: profile.rulingPlanet,
      date: today,
      question: type === "ask" ? question : undefined,
      name: profile.name !== "Cosmic Traveler" ? profile.name : undefined,
      moonPhase: moonData?.phase,
      illumination: moonData?.illumination,
    });

    return NextResponse.json({
      reading,
      ...(moonData && { moonPhase: moonData }),
    });
  } catch (error) {
    console.error("Reading API error:", error);
    return NextResponse.json(
      { error: "Failed to generate reading" },
      { status: 500 }
    );
  }
}
