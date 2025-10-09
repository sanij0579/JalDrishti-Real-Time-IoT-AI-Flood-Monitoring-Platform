import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { themes } from "../constants/themes";

type ThemeType = "light" | "dark" | "festival" |"diwali";


interface ThemeContextType {
  theme: typeof themes.light;
  activeTheme: ThemeType;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: themes.light,
  activeTheme: "light",
  loading: true,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTheme, setActiveTheme] = useState<ThemeType>("light");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await axios.get(
          "http://10.107.0.142:8000/api/theme/active/"
        );
        const newTheme = res.data.name as ThemeType;

        // Update only if theme changed
        setActiveTheme(prev => (prev !== newTheme ? newTheme : prev));
      } catch (error) {
        console.log("Theme fetch failed, using light fallback");
      } finally {
        setLoading(false);
      }
    };

    fetchTheme(); // initial fetch

    // Poll every 5 seconds
    const interval = setInterval(fetchTheme, 5000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme: themes[activeTheme], activeTheme, loading }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);