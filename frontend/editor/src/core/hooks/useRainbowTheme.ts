import { useCallback } from "react";
import { usePreferences } from "@app/contexts/PreferencesContext";
import type { ThemeMode } from "@app/constants/theme";

interface RainbowThemeHook {
  themeMode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

// Thin accessor over preferences.theme; resolution lives in RainbowThemeProvider.
export function useRainbowTheme(): RainbowThemeHook {
  const { preferences, updatePreference } = usePreferences();

  const setTheme = useCallback(
    (mode: ThemeMode) => updatePreference("theme", mode),
    [updatePreference],
  );

  return {
    themeMode: preferences.theme,
    setTheme,
  };
}
