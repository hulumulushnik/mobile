import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ThemeColors, ThemeMode } from "@/types";

const THEME_STORAGE_KEY = "@todo_theme_mode";

export const lightColors: ThemeColors = {
  bg: "#e9ecf5",
  surface: "#ffffff",
  text: "#1e293b",
  textMuted: "#64748b",
  border: "#e2e8f0",
  primary: "#6366f1",
  success: "#10b981",
  danger: "#dc2626",
  statusBarStyle: "dark",
};

export const darkColors: ThemeColors = {
  bg: "#0f172a",
  surface: "#1e293b",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  border: "#334155",
  primary: "#818cf8",
  success: "#34d399",
  danger: "#f87171",
  statusBarStyle: "light",
};

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode === "light" || savedMode === "dark") {
          setMode(savedMode);
        }
      } catch (err) {
        console.error("Не вдалося зчитати тему з AsyncStorage:", err);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const next: ThemeMode = prev === "light" ? "dark" : "light";
      AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch((err) =>
        console.error("Не вдалося зберегти тему в AsyncStorage:", err),
      );
      return next;
    });
  };

  const colors = mode === "light" ? lightColors : darkColors;

  const value = useMemo<ThemeContextType>(
    () => ({
      mode,
      colors,
      isDarkMode: mode === "dark",
      toggleTheme,
      isReady,
    }),
    [mode, colors, isReady],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme має використовуватися всередині ThemeProvider");
  }
  return ctx;
}
