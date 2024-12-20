"use client";

import { useState } from "react";
import { themes } from "../utils/themes";

interface ThemeSwitcherProps {
  onThemeChange: (theme: keyof typeof themes) => void;
}

export default function ThemeSwitcher({ onThemeChange }: ThemeSwitcherProps) {
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof themes>(
    "darkSouls"
  );

  return (
    <div className="flex gap-4 mt-6">
      {Object.keys(themes).map((key) => {
        const themeKey = key as keyof typeof themes; // Explicitly cast here
        return (
          <button
            key={themeKey}
            onClick={() => {
              setSelectedTheme(themeKey);
              onThemeChange(themeKey); // Pass the themeKey correctly
            }}
            className={`px-4 py-2 rounded-lg ${
              selectedTheme === themeKey ? "bg-zinc-700" : "bg-zinc-800"
            }`}
          >
            {themes[themeKey].name}
          </button>
        );
      })}
    </div>
  );
}
