"use client";

import React, { useCallback, useMemo } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { ISourceOptions, Engine, Container } from "tsparticles-engine";

interface ParticlesComponentProps {
  preset: "fire" | "snow" | "none";
}

const ParticlesComponent: React.FC<ParticlesComponentProps> = ({ preset }) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    // Load the full tsParticles package
    await loadFull(engine);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const particlesLoaded = useCallback(async (_container?: Container) => {
    // You can use this callback to interact with the particles instance
  }, []);

  // Memoize the options to prevent re-creation on every render
  const particlesOptions = useMemo<ISourceOptions>(() => {
    switch (preset) {
      case "fire":
        return {
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          particles: {
            number: {
              value: 60,
              density: {
                enable: true,
                area: 800,
              },
            },
            color: {
              value: "#f98b4c",
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.6,
              random: false,
              anim: {
                enable: true,
                speed: 1, // Smooth fade-out
                opacity_min: 0, // Fade out completely
                sync: false,
              },
            },
            size: {
              value: 4,
              random: { enable: true, minimumValue: 1 },
              anim: {
                enable: true,
                speed: 2, // Synchronized growth
                size_min: 3, // Minimum size after growth
                sync: false,
              },
            },
            move: {
              enable: true,
              speed: 4,
              direction: "top" as const, // Move upwards
              random: false,
              straight: false,
              outModes: {
                default: "out",
              },
              attract: {
                enable: false,
              },
            },
          },
          interactivity: {
            events: {
              onHover: {
                enable: false,
              },
              onClick: {
                enable: false,
              },
              resize: true,
            },
          },
          detectRetina: true,
        };
      case "snow":
        return {
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          particles: {
            number: {
              value: 100,
              density: {
                enable: true,
                area: 800,
              },
            },
            color: {
              value: "#ffffff",
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.4,
              random: true,
              anim: {
                enable: false,
              },
            },
            size: {
              value: 2,
              random: true,
              anim: {
                enable: false,
              },
            },
            move: {
              enable: true,
              speed: 1,
              direction: "bottom" as const,
              random: false,
              straight: false,
              outModes: {
                default: "out",
              },
              attract: {
                enable: false,
              },
            },
          },
          interactivity: {
            events: {
              onHover: {
                enable: false,
              },
              onClick: {
                enable: false,
              },
              resize: true,
            },
          },
          detectRetina: true,
        };
      case "none":
      default:
        return {}; // Empty configuration when no preset is selected
    }
  }, [preset]);

  // If no preset is selected, do not render particles
  if (preset === "none") return null;

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={particlesOptions}
      className="absolute inset-0 pointer-events-none z-5" // Adjusted z-index
    />
  );
};

export default ParticlesComponent;
