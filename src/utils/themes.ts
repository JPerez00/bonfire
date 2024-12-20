// src/utils/themes.ts

export type ThemeConfig = {
  name: string;
  background: string;
  sounds: {
    work: string;
    rest: string;
    alert: string;
    menu: string;
  };
  colors: {
    gametitle: string;
    primary: string;
    text: string;
    backgroundCircle: string;
    progressCircle: string;
  };
  particlePreset: "fire" | "snow" | "none"; // Ensure "none" is included
};

export const themes: Record<string, ThemeConfig> = {
  darkSouls: {
    name: "Dark Souls: Remastered",
    background: "/assets/darkSouls-bg.jpg",
    sounds: {
      work: "/assets/sounds/firelink-shrine.mp3",
      rest: "/assets/sounds/bonfire-rest.mp3",
      alert: "/assets/sounds/you-died.mp3",
      menu: "/assets/sounds/dark-menu.mp3",
    },
    colors: {
      gametitle: "#fff",
      primary: "#6b2b1f",
      text: "#c9c5bb",
      backgroundCircle: "#9b3015",
      progressCircle: "#6b2b1f",
    },
    particlePreset: "fire", // or "none" if you want no particles
  },
  shadowColossus: {
    name: "Shadow of the Colossus",
    background: "/assets/shadowColossus-bg.jpg",
    sounds: {
      work: "/assets/sounds/sotc-forbidden-lands.mp3",
      rest: "/assets/sounds/sotc-wander-theme.mp3",
      alert: "/assets/sounds/sotc-colossus-alert.mp3",
      menu: "/assets/sounds/shadow-menu.mp3",
    },
    colors: {
      gametitle: "#526762",
      primary: "#565656",
      text: "#DADADA",
      backgroundCircle: "#444444",
      progressCircle: "#A8A8A8",
    },
    particlePreset: "snow", // or "none" if you want no particles
  },
  // Add more themes here as needed, ensuring each has a 'particlePreset'
};
