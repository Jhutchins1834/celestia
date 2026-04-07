import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Celestia, a wise and warm cosmic guide. You write personalized astrological readings for someone who wants to feel seen and understood. Your voice is poetic but grounded, intelligent, and validating — never condescending, never babyish, never generic. You write for someone smart enough to handle nuance. Reference the current date's approximate planetary transits naturally. Keep readings specific, sensory, and actionable. End with one small reflection or invitation, never a command. Never make medical, financial, or safety claims. This is for reflection and fun.`;

export async function generateReading(params: {
  type: "daily" | "weekly" | "monthly" | "yearly" | "ask";
  sunSign: string;
  element: string;
  rulingPlanet: string;
  date: string;
  question?: string;
  name?: string;
}): Promise<string> {
  const wordGuide = {
    daily: "about 120 words",
    weekly: "about 200 words",
    monthly: "about 300 words",
    yearly: "about 500 words, structured by season",
    ask: "about 150 words",
  };

  let userPrompt = `Write a ${params.type} horoscope reading for a ${params.sunSign} (${params.element} sign, ruled by ${params.rulingPlanet}).`;
  userPrompt += ` Today's date is ${params.date}.`;
  userPrompt += ` Keep it ${wordGuide[params.type]}.`;

  if (params.name) {
    userPrompt += ` The reader's name is ${params.name}.`;
  }

  if (params.type === "ask" && params.question) {
    userPrompt += ` They're asking: "${params.question}"`;
  }

  if (params.type === "yearly") {
    userPrompt += ` Structure the reading by season (Spring, Summer, Autumn, Winter) with a brief intro and closing.`;
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  return textBlock?.text || "The stars are quiet right now. Please try again.";
}

export async function generateTarotReading(params: {
  cards: { name: string; position: string; reversed: boolean; meaning: string }[];
  spread: string;
  sunSign: string;
  element: string;
  date: string;
  name?: string;
}): Promise<string> {
  const cardDescriptions = params.cards
    .map(
      (c) =>
        `Position: ${c.position} — Card: ${c.name}${c.reversed ? " (Reversed)" : ""} — Traditional meaning: ${c.meaning}`
    )
    .join("\n");

  let userPrompt = `Interpret this ${params.spread} tarot spread for a ${params.sunSign} (${params.element} sign). Today is ${params.date}.\n\n${cardDescriptions}`;

  if (params.name) {
    userPrompt += `\n\nThe reader's name is ${params.name}.`;
  }

  userPrompt += `\n\nGive a cohesive, narrative interpretation that weaves the cards together. Be specific and insightful. About 200 words for a one-card pull, 300 for three-card, 500 for celtic cross.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  return textBlock?.text || "The cards are resting. Please try again.";
}
