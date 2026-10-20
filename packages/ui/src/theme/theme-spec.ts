export type MotionProfile = "none" | "slow" | "medium" | "fast";

export type VisualizerProfile =
  | "none"
  | "warm-wave"
  | "pulse"
  | "bars";

export interface ThemeSpec {
  palette: {
    background: string;
    surface: string;
    accent: string;
    text: string;
  };

  motion: MotionProfile;
  texture: "none" | "grain" | "crt";
  visualizer: VisualizerProfile;
  intensity: number;
}

export const defaultTheme: ThemeSpec = {
  palette: {
    background: "#0B0908",
    surface: "#201712",
    accent: "#D18A4D",
    text: "#F2E9DE",
  },
  motion: "slow",
  texture: "grain",
  visualizer: "warm-wave",
  intensity: 0.35,
};

export function clampTheme(theme: ThemeSpec): ThemeSpec {
  return {
    ...theme,
    intensity: Math.min(1, Math.max(0, theme.intensity)),
  };
}