import { createContext, useContext, useState, ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { useIsomorphicEffect } from "@mantine/hooks";
import { useRainbowTheme } from "@app/hooks/useRainbowTheme";
import { mantineTheme } from "@app/theme/mantineTheme";
import { ToastProvider } from "@app/components/toast";
import ToastRenderer from "@app/components/toast/ToastRenderer";
import { ToastPortalBinder } from "@app/components/toast";
import {
  type ThemeMode,
  getSystemTheme,
  resolveColorScheme,
} from "@app/constants/theme";
// SUI shared design-system tokens (used by @shared/components); key on `data-theme`.
import "@shared/tokens/tokens.css";

interface RainbowThemeContextType {
  themeMode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

const RainbowThemeContext = createContext<RainbowThemeContextType | null>(null);

export function useRainbowThemeContext() {
  const context = useContext(RainbowThemeContext);
  if (!context) {
    throw new Error(
      "useRainbowThemeContext must be used within RainbowThemeProvider",
    );
  }
  return context;
}

interface RainbowThemeProviderProps {
  children: ReactNode;
}

export function RainbowThemeProvider({ children }: RainbowThemeProviderProps) {
  const rainbowTheme = useRainbowTheme();

  // Track the OS scheme so "system" updates live; only subscribe while on system.
  const [systemScheme, setSystemScheme] = useState(getSystemTheme);
  useIsomorphicEffect(() => {
    if (rainbowTheme.themeMode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemScheme(media.matches ? "dark" : "light");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [rainbowTheme.themeMode]);

  // Single source of truth: the theme preference resolved to light/dark.
  const colorScheme = resolveColorScheme(rainbowTheme.themeMode, systemScheme);

  // Mantine drives `data-mantine-color-scheme`; mirror it to `data-theme` for SUI tokens.
  useIsomorphicEffect(() => {
    document.documentElement.setAttribute("data-theme", colorScheme);
  }, [colorScheme]);

  return (
    <RainbowThemeContext.Provider value={rainbowTheme}>
      <MantineProvider
        theme={mantineTheme}
        defaultColorScheme={colorScheme}
        forceColorScheme={colorScheme}
      >
        <div style={{ minHeight: "100vh" }}>
          <ToastProvider>
            <ToastPortalBinder />
            {children}
            <ToastRenderer />
          </ToastProvider>
        </div>
      </MantineProvider>
    </RainbowThemeContext.Provider>
  );
}
