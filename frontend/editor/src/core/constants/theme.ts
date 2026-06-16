// Theme constants and utilities

// Stored theme preference. "system" follows the OS.
export type ThemeMode = "light" | "dark" | "system";

// The concrete scheme applied to the UI.
export type ColorScheme = "light" | "dark";

// Detect OS theme preference.
export function getSystemTheme(): ColorScheme {
  return window?.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Resolve a theme preference to a concrete light/dark scheme.
// Falls back to systemScheme for unrecognised values (e.g. stale "rainbow").
export function resolveColorScheme(
  mode: ThemeMode,
  systemScheme: ColorScheme,
): ColorScheme {
  if (mode === "light" || mode === "dark") return mode;
  return systemScheme;
}
