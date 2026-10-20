export const typography = {
  fontFamily: {
    sans: "Inter, system-ui, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },

  size: {
    display: "clamp(2.5rem, 6vw, 4rem)",
    h1: "clamp(2rem, 5vw, 2.75rem)",
    h2: "clamp(1.5rem, 3vw, 2rem)",
    h3: "1.5rem",
    body: "1rem",
    small: "0.875rem",
    caption: "0.75rem",
  },

  lineHeight: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.7,
  },
} as const;