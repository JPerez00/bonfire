"use client";

import { themes } from "../utils/themes";
import React, { useState, useRef, useEffect } from "react";
import { Howl } from "howler";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: keyof typeof themes;
  setTheme: (theme: keyof typeof themes) => void; // Updated this line
  setDuration: (minutes: number) => void;
}

function CloseIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SettingsModal({
  isOpen,
  onClose,
  currentTheme,
  setTheme,
  setDuration,
}: SettingsModalProps) {
  const [localTheme, setLocalTheme] = useState<keyof typeof themes>(currentTheme);
  const [localDuration, setLocalDuration] = useState<number>(25); // Default 25 minutes

  const menuSoundRef = useRef<Howl | null>(null);

  // Update the menu sound whenever the localTheme changes
  useEffect(() => {
    // Unload the previous sound if it exists
    if (menuSoundRef.current) {
      menuSoundRef.current.unload();
    }

    // Initialize the new menu sound based on the selected theme
    menuSoundRef.current = new Howl({
      src: [themes[localTheme].sounds.menu],
      preload: true,
      volume: 0.5,
    });

    // Cleanup on unmount
    return () => {
      menuSoundRef.current?.unload();
    };
  }, [localTheme]);

  const playMenuSound = () => {
    menuSoundRef.current?.play();
  };

  if (!isOpen) return null;

  const handleApplySettings = () => {
    playMenuSound();
    setTheme(localTheme); // Calls the passed in function which is handleThemeChange in Timer
    setDuration(localDuration);
    onClose();
  };

  const handleClose = () => {
    playMenuSound();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative bg-zinc-900 p-6 rounded-lg w-96 shadow-lg">
        {/* Close Icon */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800"
        >
          <CloseIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl text-white font-bold mb-8 text-center">Settings</h2>

        {/* Theme Selector */}
        <div className="mb-4">
          <label htmlFor="theme-selector" className="text-white block mb-2">
            Select Theme
          </label>
          <select
            id="theme-selector"
            className="w-full p-2 rounded bg-zinc-800 text-zinc-300"
            value={localTheme}
            onChange={(e) => setLocalTheme(e.target.value as keyof typeof themes)}
          >
            {Object.keys(themes).map((key) => (
              <option key={key} value={key}>
                {themes[key as keyof typeof themes].name}
              </option>
            ))}
          </select>
        </div>

        {/* Timer Duration */}
        <div className="mb-4">
          <label htmlFor="timer-duration" className="text-white block mb-2">
            Set Timer Duration
          </label>
          <input
            id="timer-duration"
            type="number"
            min="1"
            max="120"
            className="w-full p-2 rounded bg-zinc-800 text-white placeholder:text-zinc-500"
            value={localDuration}
            onChange={(e) => setLocalDuration(Number(e.target.value))}
            placeholder="Enter duration in minutes"
          />
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApplySettings}
          className="w-full bg-slate-600 text-white py-2 rounded hover:bg-slate-700"
        >
          Apply Settings
        </button>
      </div>
    </div>
  );
}
