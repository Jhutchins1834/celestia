"use client";

export interface CosmicProfile {
  name: string;
  birthDate: string; // ISO string
  sunSign: string;
  element: string;
  modality: string;
  rulingPlanet: string;
  createdAt: string;
}

export interface SavedReading {
  id: string;
  type: "daily" | "weekly" | "monthly" | "yearly" | "ask" | "tarot" | "moon-phase";
  title: string;
  content: string;
  date: string;
  favorited: boolean;
  // Tarot-specific fields
  cards?: { name: string; position?: string; reversed: boolean }[];
  spread?: string;
  // Ask-specific
  question?: string;
}

export interface AppPreferences {
  primaryMode: "astrology" | "tarot";
  streakCount: number;
  lastVisitDate: string;
  longestStreak: number;
  notificationsAsked: boolean;
}

export interface TarotCardOfTheDay {
  date: string; // YYYY-MM-DD
  card: { name: string; position: string; reversed: boolean; meaning: string; image: string };
  interpretation: string;
}

const KEYS = {
  profile: "celestia_profile",
  readings: "celestia_readings",
  preferences: "celestia_preferences",
  avatarIntroSeen: "celestia_avatar_intro_seen",
  avatarLevelUpsSeen: "celestia_avatar_levelups_seen",
  tarotCardOfTheDay: "celestia_tarot_cotd",
} as const;

function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

// Profile
export function getProfile(): CosmicProfile | null {
  return getItem<CosmicProfile>(KEYS.profile);
}

export function saveProfile(profile: CosmicProfile): void {
  setItem(KEYS.profile, profile);
}

export function hasProfile(): boolean {
  return getProfile() !== null;
}

// Readings
export function getReadings(): SavedReading[] {
  return getItem<SavedReading[]>(KEYS.readings) || [];
}

export function saveReading(reading: SavedReading): void {
  const readings = getReadings();
  readings.unshift(reading);
  setItem(KEYS.readings, readings);
}

export function toggleFavorite(readingId: string): void {
  const readings = getReadings();
  const reading = readings.find((r) => r.id === readingId);
  if (reading) {
    reading.favorited = !reading.favorited;
    setItem(KEYS.readings, readings);
  }
}

export function getReadingsByType(type: SavedReading["type"]): SavedReading[] {
  return getReadings().filter((r) => r.type === type);
}

// Preferences
export function getPreferences(): AppPreferences {
  return (
    getItem<AppPreferences>(KEYS.preferences) || {
      primaryMode: "astrology",
      streakCount: 0,
      lastVisitDate: "",
      longestStreak: 0,
      notificationsAsked: false,
    }
  );
}

export function savePreferences(prefs: AppPreferences): void {
  setItem(KEYS.preferences, prefs);
}

export function updateStreak(): AppPreferences {
  const prefs = getPreferences();
  const today = new Date().toISOString().split("T")[0];

  if (prefs.lastVisitDate === today) {
    return prefs; // Already visited today
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (prefs.lastVisitDate === yesterdayStr) {
    prefs.streakCount += 1;
  } else {
    prefs.streakCount = 1;
  }

  if (prefs.streakCount > prefs.longestStreak) {
    prefs.longestStreak = prefs.streakCount;
  }

  prefs.lastVisitDate = today;
  savePreferences(prefs);
  return prefs;
}

export function toggleMode(): AppPreferences {
  const prefs = getPreferences();
  prefs.primaryMode = prefs.primaryMode === "astrology" ? "tarot" : "astrology";
  savePreferences(prefs);
  return prefs;
}

// Avatar state
export function getAvatarIntroSeen(): boolean {
  return getItem<boolean>(KEYS.avatarIntroSeen) ?? false;
}

export function setAvatarIntroSeen(): void {
  setItem(KEYS.avatarIntroSeen, true);
}

export function getAvatarLevelUpsSeen(): number[] {
  return getItem<number[]>(KEYS.avatarLevelUpsSeen) ?? [];
}

export function markAvatarLevelUpSeen(day: number): void {
  const seen = getAvatarLevelUpsSeen();
  if (!seen.includes(day)) {
    seen.push(day);
    setItem(KEYS.avatarLevelUpsSeen, seen);
  }
}

// Tarot Card of the Day
export function getTarotCardOfTheDay(): TarotCardOfTheDay | null {
  const data = getItem<TarotCardOfTheDay>(KEYS.tarotCardOfTheDay);
  if (!data) return null;
  const today = new Date().toISOString().split("T")[0];
  if (data.date !== today) return null; // Expired — new day
  return data;
}

export function saveTarotCardOfTheDay(cotd: TarotCardOfTheDay): void {
  setItem(KEYS.tarotCardOfTheDay, cotd);
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
