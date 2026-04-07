export interface TarotCard {
  name: string;
  arcana: "major" | "minor";
  suit?: "wands" | "cups" | "swords" | "pentacles";
  number?: number;
  uprightMeaning: string;
  reversedMeaning: string;
  image: string; // filename in /public/tarot/
}

// Major Arcana
const majorArcana: TarotCard[] = [
  { name: "The Fool", arcana: "major", uprightMeaning: "New beginnings, innocence, spontaneity, free spirit", reversedMeaning: "Recklessness, fear of the unknown, holding back", image: "major-00-fool.jpg" },
  { name: "The Magician", arcana: "major", uprightMeaning: "Manifestation, resourcefulness, power, inspired action", reversedMeaning: "Manipulation, poor planning, untapped talents", image: "major-01-magician.jpg" },
  { name: "The High Priestess", arcana: "major", uprightMeaning: "Intuition, sacred knowledge, the subconscious mind", reversedMeaning: "Secrets, withdrawal, silence, disconnection from intuition", image: "major-02-high-priestess.jpg" },
  { name: "The Empress", arcana: "major", uprightMeaning: "Femininity, beauty, nature, nurturing, abundance", reversedMeaning: "Creative block, dependence, emptiness", image: "major-03-empress.jpg" },
  { name: "The Emperor", arcana: "major", uprightMeaning: "Authority, structure, control, fatherhood", reversedMeaning: "Tyranny, rigidity, coldness, excessive control", image: "major-04-emperor.jpg" },
  { name: "The Hierophant", arcana: "major", uprightMeaning: "Spiritual wisdom, tradition, conformity, education", reversedMeaning: "Personal beliefs, freedom, challenging the status quo", image: "major-05-hierophant.jpg" },
  { name: "The Lovers", arcana: "major", uprightMeaning: "Love, harmony, relationships, values alignment", reversedMeaning: "Self-love, disharmony, imbalance, misalignment", image: "major-06-lovers.jpg" },
  { name: "The Chariot", arcana: "major", uprightMeaning: "Control, willpower, success, determination", reversedMeaning: "Self-discipline lacking, opposition, no direction", image: "major-07-chariot.jpg" },
  { name: "Strength", arcana: "major", uprightMeaning: "Courage, patience, compassion, inner strength", reversedMeaning: "Self-doubt, weakness, insecurity, raw emotion", image: "major-08-strength.jpg" },
  { name: "The Hermit", arcana: "major", uprightMeaning: "Soul-searching, introspection, solitude, inner guidance", reversedMeaning: "Isolation, loneliness, withdrawal, lost your way", image: "major-09-hermit.jpg" },
  { name: "Wheel of Fortune", arcana: "major", uprightMeaning: "Good luck, karma, life cycles, destiny, turning point", reversedMeaning: "Bad luck, resistance to change, breaking cycles", image: "major-10-wheel.jpg" },
  { name: "Justice", arcana: "major", uprightMeaning: "Fairness, truth, cause and effect, law", reversedMeaning: "Unfairness, dishonesty, lack of accountability", image: "major-11-justice.jpg" },
  { name: "The Hanged Man", arcana: "major", uprightMeaning: "Pause, surrender, letting go, new perspectives", reversedMeaning: "Delays, resistance, stalling, indecision", image: "major-12-hanged-man.jpg" },
  { name: "Death", arcana: "major", uprightMeaning: "Endings, change, transformation, transition", reversedMeaning: "Resistance to change, personal transformation, inner purging", image: "major-13-death.jpg" },
  { name: "Temperance", arcana: "major", uprightMeaning: "Balance, moderation, patience, finding meaning", reversedMeaning: "Imbalance, excess, self-healing, realignment", image: "major-14-temperance.jpg" },
  { name: "The Devil", arcana: "major", uprightMeaning: "Shadow self, attachment, addiction, restriction", reversedMeaning: "Releasing limiting beliefs, exploring dark thoughts, detachment", image: "major-15-devil.jpg" },
  { name: "The Tower", arcana: "major", uprightMeaning: "Sudden change, upheaval, chaos, revelation, awakening", reversedMeaning: "Personal transformation, fear of change, averting disaster", image: "major-16-tower.jpg" },
  { name: "The Star", arcana: "major", uprightMeaning: "Hope, faith, purpose, renewal, spirituality", reversedMeaning: "Lack of faith, despair, disconnection", image: "major-17-star.jpg" },
  { name: "The Moon", arcana: "major", uprightMeaning: "Illusion, fear, anxiety, subconscious, intuition", reversedMeaning: "Release of fear, repressed emotion, inner confusion", image: "major-18-moon.jpg" },
  { name: "The Sun", arcana: "major", uprightMeaning: "Positivity, fun, warmth, success, vitality", reversedMeaning: "Inner child, feeling down, overly optimistic", image: "major-19-sun.jpg" },
  { name: "Judgement", arcana: "major", uprightMeaning: "Judgement, rebirth, inner calling, absolution", reversedMeaning: "Self-doubt, inner critic, ignoring the call", image: "major-20-judgement.jpg" },
  { name: "The World", arcana: "major", uprightMeaning: "Completion, integration, accomplishment, travel", reversedMeaning: "Seeking personal closure, shortcuts, delays", image: "major-21-world.jpg" },
];

function createMinorArcana(suit: "wands" | "cups" | "swords" | "pentacles", meanings: [string, string][]): TarotCard[] {
  const names = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
  return names.map((name, i) => ({
    name: `${name} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
    arcana: "minor" as const,
    suit,
    number: i + 1,
    uprightMeaning: meanings[i][0],
    reversedMeaning: meanings[i][1],
    image: `${suit}-${String(i + 1).padStart(2, "0")}.jpg`,
  }));
}

const wands = createMinorArcana("wands", [
  ["Inspiration, new opportunities, growth, potential", "An emerging idea, lack of direction, distractions"],
  ["Future planning, progress, decisions, discovery", "Personal goals, inner alignment, fear of unknown"],
  ["Expansion, foresight, overseas opportunities", "Obstacles, delays, frustration, lack of foresight"],
  ["Celebration, joy, harmony, relaxation, homecoming", "Personal celebration, inner harmony, conflict with others"],
  ["Competition, conflict, tension, diversity", "Inner conflict, avoiding conflict, respecting differences"],
  ["Public recognition, progress, self-confidence", "Inner reward, personal milestones, fall from grace"],
  ["Challenge, competition, perseverance, defending", "Exhaustion, giving up, overwhelmed"],
  ["Movement, fast paced change, action, alignment", "Waiting, slowdown, delays, frustration"],
  ["Resilience, courage, persistence, test of faith", "Inner resources, struggle, overwhelm, defensive"],
  ["Burden, extra responsibility, hard work, completion", "Doing it all, carrying the weight, delegation"],
  ["Enthusiasm, exploration, discovery, free spirit", "Setbacks, lack of ideas, limited, redirecting energy"],
  ["Energy, passion, adventure, impulsiveness", "Haste, scattered energy, delays, frustration"],
  ["Courage, confidence, independence, social butterfly", "Self-respect, self-confidence, introverted, re-establishing sense of self"],
  ["Natural leader, vision, entrepreneur, honour", "Impulsiveness, haste, ruthless, high expectations"],
]);

const cups = createMinorArcana("cups", [
  ["Love, new relationships, compassion, creativity", "Self-love, intuition, repressed emotions"],
  ["Unified love, partnership, mutual attraction", "Self-love, break-ups, disharmony, distrust"],
  ["Celebration, friendship, creativity, collaborations", "Independence, alone time, hard work, recovery"],
  ["Meditation, contemplation, apathy, reevaluation", "Retreat, withdrawal, checking in for alignment"],
  ["Regret, failure, disappointment, pessimism", "Personal setbacks, self-forgiveness, moving on"],
  ["Revisiting the past, childhood memories, innocence", "Living in the past, forgiveness, lacking playfulness"],
  ["Opportunities, choices, wishful thinking, illusion", "Alignment, personal values, overwhelmed by choices"],
  ["Disappointment, abandonment, withdrawal, escapism", "Trying one more time, indecision, aimless drifting"],
  ["Contentment, satisfaction, gratitude, wish come true", "Inner happiness, materialism, dissatisfaction"],
  ["Divine love, blissful relationships, harmony, alignment", "Disconnection, misaligned values, struggling relationships"],
  ["Creative opportunities, curiosity, possibility", "New ideas, doubting intuition, creative blocks"],
  ["Romance, charm, imagination, beauty", "Unrealistic, jealousy, moodiness"],
  ["Compassion, calm, comfort, nurturing", "Inner feelings, self-care, self-love, co-dependency"],
  ["Emotionally balanced, compassionate, diplomatic", "Self-compassion, inner feelings, moodiness, emotionally manipulative"],
]);

const swords = createMinorArcana("swords", [
  ["Breakthrough, clarity, sharp mind, new idea", "Inner clarity, re-thinking an idea, clouded judgement"],
  ["Difficult decisions, weighing options, stalemate", "Indecision, confusion, information overload, no right choice"],
  ["Heartbreak, emotional pain, sorrow, grief", "Optimism, forgiveness, moving forward, release"],
  ["Rest, restoration, contemplation, passivity", "Exhaustion, burn out, deep contemplation, stagnation"],
  ["Conflict, disagreements, competition, defeat", "Reconciliation, making amends, past resentment"],
  ["Transition, change, rite of passage, releasing baggage", "Personal transition, resistance to change, unfinished business"],
  ["Betrayal, deception, getting away with something", "Imposter syndrome, self-deceit, keeping secrets"],
  ["Negative thoughts, self-imposed restriction, imprisonment", "Self-limiting beliefs, inner critic, releasing negative thoughts"],
  ["Anxiety, worry, fear, depression, nightmares", "Inner turmoil, deep-seated fears, releasing worry, hope"],
  ["Painful endings, deep wounds, betrayal, loss", "Recovery, regeneration, resisting an inevitable end"],
  ["New ideas, curiosity, thirst for knowledge", "Self-expression, all talk and no action, haste"],
  ["Ambitious, action-oriented, driven to succeed", "Restless, unfocused, burnout, hasty"],
  ["Independent, unbiased judgment, clear boundaries", "Overly emotional, easily influenced, bitchy, cold-hearted"],
  ["Intellectual power, authority, truth, mental clarity", "Quiet power, inner truth, misuse of power, manipulation"],
]);

const pentacles = createMinorArcana("pentacles", [
  ["New financial opportunity, manifestation, abundance", "Lost opportunity, lack of planning, missed chance"],
  ["Multiple priorities, time management, prioritization", "Over-committed, disorganization, reprioritization"],
  ["Teamwork, collaboration, learning, implementation", "Lack of teamwork, disregarded, no learning"],
  ["Saving money, security, conservatism, scarcity", "Over-spending, greed, self-protection, hoarding"],
  ["Financial loss, poverty, lack mindset, isolation", "Recovery, charity, improvement, spiritual poverty"],
  ["Giving, receiving, sharing wealth, generosity", "Self-care, unpaid debts, one-sided charity"],
  ["Long-term view, sustainable results, perseverance", "Lack of long-term vision, limited success, impatience"],
  ["Apprenticeship, repetitive tasks, mastery, skill", "Self-development, perfectionism, misdirected activity"],
  ["Abundance, luxury, self-sufficiency, culmination", "Self-worth, over-investment in work, hustling"],
  ["Wealth, financial security, family, long-term success", "Financial failure, loneliness, loss, dark side of wealth"],
  ["Manifestation, financial opportunity, skill development", "Lack of progress, procrastination, learn from failure"],
  ["Practical, loyal, supportive, hard-working", "Self-discipline, laziness, boredom, feeling stuck"],
  ["Nurturing, practical, providing financially, working parent", "Self-care, work-home conflict, financial independence"],
  ["Wealth, business, leadership, security, discipline", "Financially inept, obsessed with wealth and status, stubborn"],
]);

export const tarotDeck: TarotCard[] = [
  ...majorArcana,
  ...wands,
  ...cups,
  ...swords,
  ...pentacles,
];

export type SpreadType = "one-card" | "three-card" | "celtic-cross";

export const spreadPositions: Record<SpreadType, string[]> = {
  "one-card": ["The Message"],
  "three-card": ["Past", "Present", "Future"],
  "celtic-cross": [
    "Present Situation",
    "Challenge",
    "Distant Past",
    "Recent Past",
    "Best Outcome",
    "Near Future",
    "Your Approach",
    "External Influences",
    "Hopes & Fears",
    "Final Outcome",
  ],
};

export function drawCards(count: number): (TarotCard & { reversed: boolean })[] {
  const shuffled = [...tarotDeck].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((card) => ({
    ...card,
    reversed: Math.random() < 0.3, // ~30% chance reversed
  }));
}
