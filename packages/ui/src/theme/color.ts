export const colors = {
  bg0: "#0B0908",
  bg1: "#15100D",
  surface: "#201712",

  cream: "#F2E9DE",
  muted: "#B5A69A",

  amber: "#D18A4D",
  retroGreen: "#8FCB81",
  red: "#D75A4A",

  black: "#000000",
  white: "#FFFFFF",
} as const;

export type SonoraColor = keyof typeof colors;