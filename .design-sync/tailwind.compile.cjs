/**
 * Standalone Tailwind config used ONLY to compile a static stylesheet for the
 * design-sync bundle. Mirrors the theme in ../tailwind.config.ts but is plain
 * CJS (the CLI loads it without a TS loader) and scans the authored previews
 * as well as the component sources so every utility class the cards use is
 * emitted. Keep the theme in sync with tailwind.config.ts on any token change.
 */
const plugin = require("tailwindcss/plugin");

// base-ui v1 components (Switch, Tabs, AlertDialog) are authored with Tailwind
// v4 bare `data-*:` variant syntax, but this repo pins Tailwind v3.4. Register
// those state attributes as v3 variants so the compiled stylesheet includes the
// rules the components' class strings intend (e.g. `data-checked:bg-primary`).
// This is a build-environment shim only — it never touches the components.
const BASE_UI_STATES = [
  "checked", "unchecked", "disabled", "active", "selected", "highlighted",
  "open", "closed", "horizontal", "vertical", "on", "off", "pressed",
  "starting", "ending", "current",
];

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./.design-sync/previews/**/*.{js,ts,jsx,tsx}",
  ],
  // The design agent composes NEW utility combinations that may not appear in the
  // scanned source, so guarantee the full semantic token palette is always emitted
  // (otherwise e.g. `bg-accent` / `ring-ring` render unstyled in generated designs).
  safelist: [
    {
      pattern:
        /(bg|text|border|ring|fill|stroke|divide|outline|from|to|via)-(primary|secondary|muted|accent|destructive|card|popover|background|foreground|border|input|ring)(-foreground)?/,
      variants: ["hover", "focus", "focus-visible", "active", "disabled", "dark"],
    },
    { pattern: /(bg|text|border|ring|fill|stroke)-longevo-green/ },
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        "input-background": "hsl(var(--input-background))",
        "switch-background": "hsl(var(--switch-background))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        longevo: {
          green: "hsl(var(--longevo-green))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(({ addVariant }) => {
      for (const s of BASE_UI_STATES) {
        // element-level: `data-checked:bg-primary`
        addVariant(`data-${s}`, `&[data-${s}]`);
        // ancestor group: `group-data-horizontal/tabs:...`
        addVariant(`group-data-${s}`, `:merge(.group)[data-${s}] &`);
        // sibling peer: `peer-data-checked:...`
        addVariant(`peer-data-${s}`, `:merge(.peer)[data-${s}] ~ &`);
      }
    }),
  ],
};
