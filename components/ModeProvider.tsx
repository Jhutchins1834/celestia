"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import AmbientBackground from "@/components/AmbientBackground";
import { getPreferences, toggleMode } from "@/lib/storage";

type Mode = "astrology" | "tarot";

interface ModeContextValue {
  mode: Mode;
  handleModeChange: (newMode: Mode) => void;
  handleToggle: () => void;
}

const ModeContext = createContext<ModeContextValue>({
  mode: "astrology",
  handleModeChange: () => {},
  handleToggle: () => {},
});

export function useMode() {
  return useContext(ModeContext);
}

export default function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("astrology");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const prefs = getPreferences();
    setMode(prefs.primaryMode);
    setMounted(true);
  }, []);

  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
  }, []);

  const handleToggle = useCallback(() => {
    const updated = toggleMode();
    setMode(updated.primaryMode);
  }, []);

  return (
    <ModeContext.Provider value={{ mode, handleModeChange, handleToggle }}>
      <div
        className={`min-h-screen flex flex-col relative transition-opacity duration-300 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        data-mode={mode}
      >
        <AmbientBackground mode={mode} />
        {children}
      </div>
    </ModeContext.Provider>
  );
}
