/**
 * Moon phase calculation using synodic month approximation.
 * Based on a known new moon epoch (January 6, 2000 18:14 UTC).
 */

const SYNODIC_MONTH = 29.53058867; // days
const KNOWN_NEW_MOON = new Date("2000-01-06T18:14:00Z").getTime();

export interface MoonPhaseData {
  phase: string;
  illumination: number; // 0–1
  nextPhase: string;
  daysUntilNext: number;
  phaseIndex: number; // 0–7
}

const PHASES = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent",
] as const;

export function getCurrentMoonPhase(date: Date = new Date()): MoonPhaseData {
  const diffMs = date.getTime() - KNOWN_NEW_MOON;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // Days into current synodic cycle
  const cycleDay = ((diffDays % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;

  // Each phase spans ~3.69 days (29.53 / 8)
  const phaseLength = SYNODIC_MONTH / 8;
  const phaseIndex = Math.floor(cycleDay / phaseLength) % 8;

  // Illumination: 0 at new moon, 1 at full moon
  const angle = (cycleDay / SYNODIC_MONTH) * 2 * Math.PI;
  const illumination = (1 - Math.cos(angle)) / 2;

  // Next phase
  const nextPhaseIndex = (phaseIndex + 1) % 8;
  const nextPhaseStart = (phaseIndex + 1) * phaseLength;
  const daysUntilNext = Math.ceil(nextPhaseStart - cycleDay);

  return {
    phase: PHASES[phaseIndex],
    illumination: Math.round(illumination * 100) / 100,
    nextPhase: PHASES[nextPhaseIndex],
    daysUntilNext: Math.max(1, daysUntilNext),
    phaseIndex,
  };
}
