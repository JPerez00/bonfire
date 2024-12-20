"use client";

import { useState, useEffect, useRef } from "react";
import { themes } from "../utils/themes";
import { Howl } from "howler";
import SettingsModal from "./SettingsModal";
import ParticlesComponent from "./Particles";
import { FaCog, FaExpand, FaGithub } from "react-icons/fa";
import Image from "next/image";
import { DateTimeDisplay } from "./DateTimeDisplay";

export default function Timer() {
  const [isClient, setIsClient] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>("darkSouls");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 minutes
  const [totalTime, setTotalTime] = useState(25 * 60); // Full duration
  const [isRunning, setIsRunning] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const currentSoundRef = useRef<Howl | null>(null);
  const menuSoundRef = useRef<Howl | null>(null);
  const alertSoundRef = useRef<Howl | null>(null);

  const [hasAlertPlayed, setHasAlertPlayed] = useState(false);

  // On mount, detect client and load theme from localStorage
  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem("selectedTheme") as keyof typeof themes;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const { sounds, colors, background, particlePreset } = themes[currentTheme];

  // Initialize menu sound after theme is set
  useEffect(() => {
    if (!isClient) return;
    menuSoundRef.current = new Howl({
      src: [sounds.menu],
      volume: 0.5,
    });

    return () => {
      menuSoundRef.current?.unload();
    };
  }, [currentTheme, isClient, sounds.menu]);

  // Initialize work/rest sound and alert sound
  useEffect(() => {
    if (!isClient) return;

    // Initialize current sound
    if (currentSoundRef.current) {
      currentSoundRef.current.stop();
      currentSoundRef.current.unload();
    }
    currentSoundRef.current = new Howl({
      src: [sounds.work],
      volume: 0.7,
      loop: true,
    });

    // Initialize alert sound
    if (alertSoundRef.current) {
      alertSoundRef.current.unload();
    }
    alertSoundRef.current = new Howl({
      src: [sounds.alert],
      volume: 1.0,
    });

    // Reset alert played state
    setHasAlertPlayed(false);

    return () => {
      currentSoundRef.current?.unload();
      alertSoundRef.current?.unload();
    };
  }, [currentTheme, isClient, sounds.work, sounds.alert]);

  // Timer logic
  useEffect(() => {
    if (!isClient) return;
    let timer: NodeJS.Timeout | null = null;

    if (isRunning) {
      if (timeLeft > 0) {
        // Play current sound if not already playing
        if (!currentSoundRef.current?.playing()) {
          currentSoundRef.current?.play();
        }
        timer = setInterval(() => {
          setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
      } else {
        // Stop current sound and play alert sound if not already played
        currentSoundRef.current?.stop();
        if (!hasAlertPlayed) {
          alertSoundRef.current?.play();
          setHasAlertPlayed(true);
        }
      }
    } else {
      currentSoundRef.current?.pause();
      if (timer) {
        clearInterval(timer);
      }
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning, isClient, timeLeft, hasAlertPlayed]);

  // Reset alert state when timer is reset or timeLeft changes
  useEffect(() => {
    if (timeLeft !== 0) {
      setHasAlertPlayed(false);
      alertSoundRef.current?.stop();
    }
  }, [timeLeft]);

  const resetTimer = () => {
    setTimeLeft(totalTime);
    setIsRunning(false);
    currentSoundRef.current?.stop();
    alertSoundRef.current?.stop();
    setHasAlertPlayed(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const playMenuSound = () => {
    if (isClient) {
      menuSoundRef.current?.play();
    }
  };

  const handleThemeChange = (theme: keyof typeof themes) => {
    setCurrentTheme(theme);
    if (isClient) {
      localStorage.setItem("selectedTheme", theme);
    }
    playMenuSound();
  };

  const percentage = (timeLeft / totalTime) * 100;

  // If not yet client, render a placeholder that matches server output 
  // to avoid hydration mismatch.
  if (!isClient) {
    // Render the default theme name so server and client match until hydrated:
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="inline-flex items-center mb-2">
          <svg
            className="animate-spin mr-3 h-7 w-7 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <h1 className="text-3xl font-semibold">Loading Bonfire</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen z-20">
      {/* Background Image */}
      <Image
        src={background}
        alt={`${currentTheme} background`}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 1920px"
        style={{ objectFit: "cover" }}
        className="absolute inset-0 z-0"
        unoptimized
      />

      {/* Particle Effects */}
      {(particlePreset === "fire" || particlePreset === "snow") && (
        <ParticlesComponent preset={particlePreset} />
      )}

      {/* Date and Time Display */}
      <div className="absolute top-3 right-3 z-30 bg-black/60 text-white px-4 py-2 rounded-lg shadow-md">
        <DateTimeDisplay />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-2 relative z-10" style={{ color: colors.gametitle }}>
        {themes[currentTheme].name}
      </h1>

      {/* Circular Timer */}
      <div className="relative w-96 h-96 flex items-center justify-center z-10">
        <svg className="absolute w-full h-full">
          {/* Background Circle */}
          <circle
            cx="50%"
            cy="50%"
            r="150" /* Larger radius */
            strokeWidth="18"
            stroke={colors.backgroundCircle} // Dynamic background color
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx="50%"
            cy="50%"
            r="150" /* Match radius for progress */
            strokeWidth="18"
            stroke={colors.progressCircle} // Dynamic progress color
            fill="none"
            strokeDasharray="942.48" /* Circumference = 2 * π * r */
            strokeDashoffset={(1 - percentage / 100) * 942.48}
            style={{
              transition: "stroke-dashoffset 0.6s linear",
            }}
          />
        </svg>
        {/* Timer Display */}
        <span className="text-7xl font-mono text-white z-10 relative">
          {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
          {String(timeLeft % 60).padStart(2, "0")}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-2 z-10 relative">
        {/* Start/Pause */}
        <button
          onClick={() => {
            playMenuSound();
            setIsRunning((prev) => !prev);
          }}
          className="px-4 py-2 rounded-lg text-white shadow-inner shadow-white/10"
          style={{ backgroundColor: colors.primary }}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        {/* Restart */}
        <button
          onClick={() => {
            playMenuSound();
            resetTimer();
          }}
          className="px-4 py-2 rounded-lg text-white bg-zinc-700 hover:bg-zinc-600 shadow-inner shadow-white/10"
        >
          Restart
        </button>
        {/* Settings */}
        <button
          onClick={() => {
            playMenuSound();
            setIsSettingsOpen(true);
          }}
          className="px-2.5 py-2 rounded-full text-white bg-zinc-800 hover:bg-zinc-700 shadow-inner shadow-white/10"
        >
          <FaCog size={18} />
        </button>
        {/* Fullscreen */}
        <button
          onClick={() => {
            playMenuSound();
            toggleFullscreen();
          }}
          className="px-2.5 py-2 rounded-full text-white bg-zinc-800 hover:bg-zinc-700 shadow-inner shadow-white/10"
        >
          <FaExpand size={18} />
        </button>
        {/* GitHub */}
        <button
          onClick={() => {
            playMenuSound();
            window.open('https://github.com/JPerez00/bonfire', '_blank');
          }}
          className="px-2.5 py-2 rounded-full text-white bg-zinc-800 hover:bg-zinc-700 shadow-inner shadow-white/10"
        >
          <FaGithub size={18} />
        </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={currentTheme}
        setTheme={handleThemeChange}
        setDuration={(minutes: number) => {
          setTotalTime(minutes * 60);
          setTimeLeft(minutes * 60);
        }}
      />
    </div>
  );
}
