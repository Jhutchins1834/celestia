export interface ZodiacSign {
  name: string;
  symbol: string;
  dateRange: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  element: "Fire" | "Earth" | "Air" | "Water";
  modality: "Cardinal" | "Fixed" | "Mutable";
  rulingPlanet: string;
  traits: string[];
  description: string;
}

export const zodiacSigns: ZodiacSign[] = [
  {
    name: "Aries",
    symbol: "♈",
    dateRange: "Mar 21 – Apr 19",
    startMonth: 3, startDay: 21, endMonth: 4, endDay: 19,
    element: "Fire", modality: "Cardinal", rulingPlanet: "Mars",
    traits: ["bold", "ambitious", "courageous", "energetic"],
    description: "The fearless initiator of the zodiac, Aries blazes trails with passion and determination."
  },
  {
    name: "Taurus",
    symbol: "♉",
    dateRange: "Apr 20 – May 20",
    startMonth: 4, startDay: 20, endMonth: 5, endDay: 20,
    element: "Earth", modality: "Fixed", rulingPlanet: "Venus",
    traits: ["reliable", "patient", "devoted", "sensual"],
    description: "Grounded and steady, Taurus finds beauty in the tangible and builds lasting foundations."
  },
  {
    name: "Gemini",
    symbol: "♊",
    dateRange: "May 21 – Jun 20",
    startMonth: 5, startDay: 21, endMonth: 6, endDay: 20,
    element: "Air", modality: "Mutable", rulingPlanet: "Mercury",
    traits: ["curious", "adaptable", "witty", "expressive"],
    description: "The cosmic communicator, Gemini dances between ideas with quicksilver grace."
  },
  {
    name: "Cancer",
    symbol: "♋",
    dateRange: "Jun 21 – Jul 22",
    startMonth: 6, startDay: 21, endMonth: 7, endDay: 22,
    element: "Water", modality: "Cardinal", rulingPlanet: "Moon",
    traits: ["intuitive", "nurturing", "protective", "empathetic"],
    description: "Guided by the Moon, Cancer holds space with fierce tenderness and deep emotional wisdom."
  },
  {
    name: "Leo",
    symbol: "♌",
    dateRange: "Jul 23 – Aug 22",
    startMonth: 7, startDay: 23, endMonth: 8, endDay: 22,
    element: "Fire", modality: "Fixed", rulingPlanet: "Sun",
    traits: ["creative", "generous", "warm", "magnetic"],
    description: "Radiant and regal, Leo illuminates every room with creative fire and generous spirit."
  },
  {
    name: "Virgo",
    symbol: "♍",
    dateRange: "Aug 23 – Sep 22",
    startMonth: 8, startDay: 23, endMonth: 9, endDay: 22,
    element: "Earth", modality: "Mutable", rulingPlanet: "Mercury",
    traits: ["analytical", "thoughtful", "practical", "dedicated"],
    description: "The sacred healer, Virgo weaves order from chaos with quiet precision and deep care."
  },
  {
    name: "Libra",
    symbol: "♎",
    dateRange: "Sep 23 – Oct 22",
    startMonth: 9, startDay: 23, endMonth: 10, endDay: 22,
    element: "Air", modality: "Cardinal", rulingPlanet: "Venus",
    traits: ["harmonious", "fair", "social", "aesthetic"],
    description: "The cosmic diplomat, Libra seeks beauty and balance in all things."
  },
  {
    name: "Scorpio",
    symbol: "♏",
    dateRange: "Oct 23 – Nov 21",
    startMonth: 10, startDay: 23, endMonth: 11, endDay: 21,
    element: "Water", modality: "Fixed", rulingPlanet: "Pluto",
    traits: ["intense", "perceptive", "transformative", "passionate"],
    description: "Scorpio dives into the depths, unafraid of shadows, emerging transformed and powerful."
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    dateRange: "Nov 22 – Dec 21",
    startMonth: 11, startDay: 22, endMonth: 12, endDay: 21,
    element: "Fire", modality: "Mutable", rulingPlanet: "Jupiter",
    traits: ["adventurous", "philosophical", "optimistic", "free-spirited"],
    description: "The cosmic archer aims for truth, exploring the world with boundless curiosity and joy."
  },
  {
    name: "Capricorn",
    symbol: "♑",
    dateRange: "Dec 22 – Jan 19",
    startMonth: 12, startDay: 22, endMonth: 1, endDay: 19,
    element: "Earth", modality: "Cardinal", rulingPlanet: "Saturn",
    traits: ["disciplined", "ambitious", "wise", "resilient"],
    description: "The mountain climber of the zodiac, Capricorn builds empires with patience and vision."
  },
  {
    name: "Aquarius",
    symbol: "♒",
    dateRange: "Jan 20 – Feb 18",
    startMonth: 1, startDay: 20, endMonth: 2, endDay: 18,
    element: "Air", modality: "Fixed", rulingPlanet: "Uranus",
    traits: ["innovative", "humanitarian", "independent", "visionary"],
    description: "The water bearer pours out visions of the future, connecting community through original thought."
  },
  {
    name: "Pisces",
    symbol: "♓",
    dateRange: "Feb 19 – Mar 20",
    startMonth: 2, startDay: 19, endMonth: 3, endDay: 20,
    element: "Water", modality: "Mutable", rulingPlanet: "Neptune",
    traits: ["intuitive", "compassionate", "dreamy", "artistic"],
    description: "Pisces swims between worlds, channeling the collective unconscious into art, healing, and love."
  }
];

export const elements = {
  Fire: { signs: ["Aries", "Leo", "Sagittarius"], quality: "passionate, dynamic, and temperamental" },
  Earth: { signs: ["Taurus", "Virgo", "Capricorn"], quality: "grounded, practical, and steady" },
  Air: { signs: ["Gemini", "Libra", "Aquarius"], quality: "intellectual, social, and communicative" },
  Water: { signs: ["Cancer", "Scorpio", "Pisces"], quality: "emotional, intuitive, and deeply feeling" },
};
