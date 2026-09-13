// src/build.ts
import { existsSync as existsSync2, mkdirSync, readFileSync as readFileSync2, statSync as statSync2, writeFileSync } from "fs";
import { dirname, isAbsolute, join, resolve as resolve2 } from "path";

// ../core/dist/index.js
var defaultColors = {
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617"
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712"
  },
  zinc: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#09090b"
  },
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a"
  },
  stone: {
    50: "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",
    300: "#d6d3d1",
    400: "#a8a29e",
    500: "#78716c",
    600: "#57534e",
    700: "#44403c",
    800: "#292524",
    900: "#1c1917",
    950: "#0c0a09"
  },
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a"
  },
  orange: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
    950: "#431407"
  },
  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03"
  },
  yellow: {
    50: "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#fde047",
    400: "#facc15",
    500: "#eab308",
    600: "#ca8a04",
    700: "#a16207",
    800: "#854d0e",
    900: "#713f12",
    950: "#422006"
  },
  lime: {
    50: "#f7fee7",
    100: "#ecfccb",
    200: "#d9f99d",
    300: "#bef264",
    400: "#a3e635",
    500: "#84cc16",
    600: "#65a30d",
    700: "#4d7c0f",
    800: "#3f6212",
    900: "#365314",
    950: "#1a2e05"
  },
  emerald: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    950: "#022c22"
  },
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16"
  },
  teal: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
    950: "#042f2e"
  },
  cyan: {
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
    800: "#155e75",
    900: "#164e63",
    950: "#083344"
  },
  sky: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49"
  },
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554"
  },
  indigo: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b"
  },
  violet: {
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
    950: "#2e1065"
  },
  purple: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87",
    950: "#3b0764"
  },
  fuchsia: {
    50: "#fdf4ff",
    100: "#fae8ff",
    200: "#f5d0fe",
    300: "#f0abfc",
    400: "#e879f9",
    500: "#d946ef",
    600: "#c026d3",
    700: "#a21caf",
    800: "#86198f",
    900: "#701a75",
    950: "#4a044e"
  },
  pink: {
    50: "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#ec4899",
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
    900: "#831843",
    950: "#500724"
  },
  rose: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
    800: "#881337",
    900: "#4c0519",
    950: "#1c020c"
  }
};
var palette_default = defaultColors;
var defaultTheme = {
  colors: palette_default,
  spacing: {
    0: "0",
    px: "1px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    56: "14rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem"
  },
  typography: {
    fontSize: {
      xs: ["0.75rem", "1rem"],
      sm: ["0.875rem", "1.25rem"],
      base: ["1rem", "1.5rem"],
      lg: ["1.125rem", "1.75rem"],
      xl: ["1.25rem", "1.75rem"],
      "2xl": ["1.5rem", "2rem"],
      "3xl": ["1.875rem", "2.25rem"],
      "4xl": ["2.25rem", "2.5rem"],
      "5xl": ["3rem", "1"],
      "6xl": ["3.75rem", "1"],
      "7xl": ["4.5rem", "1"],
      "8xl": ["6rem", "1"],
      "9xl": ["8rem", "1"]
    },
    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    },
    lineHeight: {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      base: "1.5",
      relaxed: "1.625",
      loose: "2"
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em"
    }
  },
  fontFamily: {
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
  },
  breakpoints: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    glow: "0 0 20px 0 rgba(59, 130, 246, 0.5)"
  },
  borderRadius: {
    none: "0",
    xs: "0.125rem",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px"
  },
  zIndex: {
    auto: "auto",
    hide: -1,
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50
  },
  opacity: {
    0: 0,
    5: 0.05,
    10: 0.1,
    20: 0.2,
    25: 0.25,
    30: 0.3,
    40: 0.4,
    50: 0.5,
    60: 0.6,
    70: 0.7,
    75: 0.75,
    80: 0.8,
    90: 0.9,
    95: 0.95,
    100: 1
  },
  duration: {
    0: "0ms",
    75: "75ms",
    100: "100ms",
    150: "150ms",
    200: "200ms",
    300: "300ms",
    500: "500ms",
    700: "700ms",
    1e3: "1000ms"
  },
  easing: {
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
    back: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
  },
  animation: {
    spin: "spin 1s linear infinite",
    ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
    pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    bounce: "bounce 1s infinite",
    fade: "fade 300ms ease-out",
    slide: "slide 300ms ease-out",
    shimmer: "shimmer 1.5s linear infinite"
  },
  keyframes: {
    spin: "from { transform: rotate(0deg); } to { transform: rotate(360deg); }",
    ping: "75%, 100% { transform: scale(2); opacity: 0; }",
    pulse: "50% { opacity: 0.5; }",
    bounce: "0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); } 50% { transform: none; animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }",
    fade: "from { opacity: 0; } to { opacity: 1; }",
    slide: "from { transform: translateY(1rem); opacity: 0; } to { transform: translateY(0); opacity: 1; }",
    shimmer: "from { background-position: 200% 0; } to { background-position: -200% 0; }"
  }
};
var defaultVariants = {
  hover: true,
  focus: true,
  focusVisible: true,
  focusWithin: true,
  active: true,
  visited: true,
  disabled: true,
  firstChild: true,
  lastChild: true,
  group: true,
  groupHover: true,
  groupFocus: true,
  peer: true,
  peerHover: true,
  peerFocus: true,
  dark: true,
  responsive: true
};
function deepMerge(base, override) {
  if (base === null || override === null || typeof base !== "object" || typeof override !== "object" || Array.isArray(base) || Array.isArray(override)) {
    return override === void 0 ? base : override;
  }
  const result = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value === void 0) continue;
    const existing = base[key];
    result[key] = existing !== void 0 && typeof existing === "object" && existing !== null && !Array.isArray(existing) ? deepMerge(existing, value) : value;
  }
  return result;
}
function spacingKeys(spacing) {
  return spacing ? Object.keys(spacing) : [];
}
function colorEntries(colors) {
  const out = [];
  if (!colors) return out;
  for (const [name, value] of Object.entries(colors)) {
    if (typeof value === "string") {
      out.push([name, "", value]);
    } else if (value && typeof value === "object") {
      for (const [shade, color] of Object.entries(value)) {
        if (typeof color === "string") out.push([name, shade, color]);
      }
    }
  }
  return out;
}
function buildUtilityList(theme) {
  const rules = [];
  const add = (className, group, decls, category, description) => {
    rules.push({ class: className, group, decls, category, description });
  };
  const spacing = theme.spacing;
  const sKeys = spacingKeys(spacing);
  const displays = [
    ["block", "block", "Block-level element"],
    ["inline-block", "inline-block", "Inline block-level element"],
    ["inline", "inline", "Inline element"],
    ["flex", "flex", "Flex container"],
    ["inline-flex", "inline-flex", "Inline flex container"],
    ["grid", "grid", "Grid container"],
    ["inline-grid", "inline-grid", "Inline grid container"],
    ["contents", "contents", "Element becomes transparent to its children"],
    ["hidden", "none", "Visually hidden (display: none)"]
  ];
  for (const [cls, value, desc] of displays) {
    add(cls, "display", { display: value }, "display", desc);
  }
  for (const pos of ["static", "relative", "absolute", "fixed", "sticky"]) {
    add(pos, "position", { position: pos }, "position", `position: ${pos}`);
  }
  for (const key of sKeys) {
    const v = spacing[key];
    add(`inset-${key}`, "inset", { inset: v }, "inset", `inset on all sides`);
    add(`inset-x-${key}`, "inset", { "inset-inline": v }, "inset", "inset on the horizontal axis");
    add(`inset-y-${key}`, "inset", { "inset-block": v }, "inset", "inset on the vertical axis");
    add(`top-${key}`, "inset", { top: v }, "inset", "top offset");
    add(`right-${key}`, "inset", { right: v }, "inset", "right offset");
    add(`bottom-${key}`, "inset", { bottom: v }, "inset", "bottom offset");
    add(`left-${key}`, "inset", { left: v }, "inset", "left offset");
  }
  for (const [key, value] of Object.entries(theme.zIndex)) {
    add(`z-${key}`, "zIndex", { "z-index": String(value) }, "zIndex", `z-index: ${value}`);
  }
  for (const value of ["auto", "scroll", "hidden", "visible", "clip"]) {
    add(`overflow-${value}`, "overflow", { overflow: value }, "overflow", `overflow: ${value}`);
    add(
      `overflow-x-${value}`,
      "overflow",
      { "overflow-x": value },
      "overflow",
      `overflow-x: ${value}`
    );
    add(
      `overflow-y-${value}`,
      "overflow",
      { "overflow-y": value },
      "overflow",
      `overflow-y: ${value}`
    );
  }
  add("visible", "visibility", { visibility: "visible" }, "visibility", "visible");
  add("invisible", "visibility", { visibility: "hidden" }, "visibility", "invisible");
  add(
    "sr-only",
    "visibility",
    {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      border: "0"
    },
    "visibility",
    "Visually hidden but accessible to screen readers"
  );
  add(
    "not-sr-only",
    "visibility",
    {
      position: "static",
      width: "auto",
      height: "auto",
      padding: "0",
      margin: "0",
      overflow: "visible",
      clip: "auto",
      whiteSpace: "normal"
    },
    "visibility",
    "Restore an sr-only element"
  );
  for (const key of sKeys) {
    const v = spacing[key];
    add(`w-${key}`, "sizing", { width: v }, "sizing", `width`);
    add(`h-${key}`, "sizing", { height: v }, "sizing", "height");
    add(`min-w-${key}`, "sizing", { "min-width": v }, "sizing", "min-width");
    add(`min-h-${key}`, "sizing", { "min-height": v }, "sizing", "min-height");
    add(`max-w-${key}`, "sizing", { "max-width": v }, "sizing", "max-width");
    add(`max-h-${key}`, "sizing", { "max-height": v }, "sizing", "max-height");
  }
  add("w-auto", "sizing", { width: "auto" }, "sizing", "width: auto");
  add("h-auto", "sizing", { height: "auto" }, "sizing", "height: auto");
  add("w-full", "sizing", { width: "100%" }, "sizing", "width: 100%");
  add("h-full", "sizing", { height: "100%" }, "sizing", "height: 100%");
  add("w-screen", "sizing", { width: "100vw" }, "sizing", "width: viewport width");
  add("h-screen", "sizing", { height: "100vh" }, "sizing", "height: viewport height");
  add("w-fit", "sizing", { width: "fit-content" }, "sizing", "width: fit-content");
  add("h-fit", "sizing", { height: "fit-content" }, "sizing", "height: fit-content");
  add("min-w-0", "sizing", { "min-width": "0" }, "sizing", "min-width: 0");
  add("min-h-0", "sizing", { "min-height": "0" }, "sizing", "min-height: 0");
  add("min-w-full", "sizing", { "min-width": "100%" }, "sizing", "min-width: 100%");
  add("min-h-full", "sizing", { "min-height": "100%" }, "sizing", "min-height: 100%");
  add("min-h-screen", "sizing", { "min-height": "100vh" }, "sizing", "min-height: viewport height");
  add(
    "min-h-svh",
    "sizing",
    { "min-height": "100svh" },
    "sizing",
    "min-height: small viewport height"
  );
  add("max-w-full", "sizing", { "max-width": "100%" }, "sizing", "max-width: 100%");
  add("max-w-none", "sizing", { "max-width": "none" }, "sizing", "max-width: none");
  add("max-h-full", "sizing", { "max-height": "100%" }, "sizing", "max-height: 100%");
  add("max-h-screen", "sizing", { "max-height": "100vh" }, "sizing", "max-height: viewport height");
  const maxWidths = {
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem",
    full: "100%"
  };
  for (const [key, value] of Object.entries(maxWidths)) {
    add(`max-w-${key}`, "sizing", { "max-width": value }, "sizing", `max-width: ${value}`);
  }
  for (const key of sKeys) {
    const v = spacing[key];
    add(`m-${key}`, "margin", { margin: v }, "spacing", "margin on all sides");
    add(
      `mx-${key}`,
      "margin",
      { "margin-left": v, "margin-right": v },
      "spacing",
      "horizontal margin"
    );
    add(
      `my-${key}`,
      "margin",
      { "margin-top": v, "margin-bottom": v },
      "spacing",
      "vertical margin"
    );
    add(`mt-${key}`, "margin", { "margin-top": v }, "spacing", "top margin");
    add(`mb-${key}`, "margin", { "margin-bottom": v }, "spacing", "bottom margin");
    add(`ml-${key}`, "margin", { "margin-left": v }, "spacing", "left margin");
    add(`mr-${key}`, "margin", { "margin-right": v }, "spacing", "right margin");
  }
  for (const key of sKeys) {
    const v = spacing[key];
    add(`p-${key}`, "padding", { padding: v }, "spacing", "padding on all sides");
    add(
      `px-${key}`,
      "padding",
      { "padding-left": v, "padding-right": v },
      "spacing",
      "horizontal padding"
    );
    add(
      `py-${key}`,
      "padding",
      { "padding-top": v, "padding-bottom": v },
      "spacing",
      "vertical padding"
    );
    add(`pt-${key}`, "padding", { "padding-top": v }, "spacing", "top padding");
    add(`pb-${key}`, "padding", { "padding-bottom": v }, "spacing", "bottom padding");
    add(`pl-${key}`, "padding", { "padding-left": v }, "spacing", "left padding");
    add(`pr-${key}`, "padding", { "padding-right": v }, "spacing", "right padding");
  }
  for (const key of sKeys) {
    const v = spacing[key];
    add(`gap-${key}`, "gap", { gap: v }, "spacing", "gap on all axes");
    add(`gap-x-${key}`, "gap", { "column-gap": v }, "spacing", "column gap");
    add(`gap-y-${key}`, "gap", { "row-gap": v }, "spacing", "row gap");
  }
  const flexDirect = ["row", "row-reverse", "col", "col-reverse"];
  for (const d of flexDirect) {
    add(`flex-${d}`, "flex", { "flex-direction": d }, "flexbox", `flex-direction: ${d}`);
  }
  for (const [cls, val] of [
    ["flex-wrap", "wrap"],
    ["flex-nowrap", "nowrap"],
    ["flex-wrap-reverse", "wrap-reverse"]
  ]) {
    add(cls, "flex", { "flex-wrap": val }, "flexbox", `flex-wrap: ${val}`);
  }
  for (const v of ["start", "center", "end", "between", "around", "evenly"]) {
    add(
      `justify-${v === "between" ? "between" : v}`,
      "flex",
      {
        "justify-content": v === "start" ? "flex-start" : v === "end" ? "flex-end" : `space-${v}`
      },
      "flexbox",
      `justify-content: ${v === "start" ? "flex-start" : v === "end" ? "flex-end" : `space-${v}`}`
    );
  }
  for (const v of ["start", "center", "end", "stretch", "baseline"]) {
    add(
      `items-${v}`,
      "flex",
      { "align-items": v === "start" ? "flex-start" : v === "end" ? "flex-end" : v },
      "flexbox",
      `align-items`
    );
  }
  for (const v of ["start", "center", "end", "between", "around", "stretch"]) {
    add(
      `content-${v}`,
      "flex",
      {
        "align-content": v === "start" ? "flex-start" : v === "end" ? "flex-end" : v === "between" ? "space-between" : v === "around" ? "space-around" : v
      },
      "flexbox",
      "align-content"
    );
  }
  for (const v of ["auto", "start", "center", "end", "stretch"]) {
    add(
      `self-${v}`,
      "flex",
      { "align-self": v === "start" ? "flex-start" : v === "end" ? "flex-end" : v },
      "flexbox",
      "align-self"
    );
  }
  add("flex-1", "flex", { flex: "1 1 0%" }, "flexbox", "flex: 1 1 0%");
  add("flex-auto", "flex", { flex: "1 1 auto" }, "flexbox", "flex: 1 1 auto");
  add("flex-initial", "flex", { flex: "0 1 auto" }, "flexbox", "flex: 0 1 auto");
  add("flex-none", "flex", { flex: "none" }, "flexbox", "flex: none");
  add("grow", "flex", { "flex-grow": "1" }, "flexbox", "flex-grow: 1");
  add("grow-0", "flex", { "flex-grow": "0" }, "flexbox", "flex-grow: 0");
  add("shrink", "flex", { "flex-shrink": "1" }, "flexbox", "flex-shrink: 1");
  add("shrink-0", "flex", { "flex-shrink": "0" }, "flexbox", "flex-shrink: 0");
  for (let i = -6; i <= 6; i++) {
    add(`order-${i}`, "flex", { order: String(i) }, "flexbox", `order: ${i}`);
  }
  for (let i = 1; i <= 12; i++) {
    add(
      `grid-cols-${i}`,
      "grid",
      { "grid-template-columns": `repeat(${i}, minmax(0, 1fr))` },
      "grid",
      `${i} equal columns`
    );
    add(
      `col-span-${i}`,
      "grid",
      { "grid-column": `span ${i} / span ${i}` },
      "grid",
      `span ${i} columns`
    );
  }
  add("col-span-full", "grid", { "grid-column": "1 / -1" }, "grid", "span all columns");
  for (let i = 1; i <= 6; i++) {
    add(
      `grid-rows-${i}`,
      "grid",
      { "grid-template-rows": `repeat(${i}, minmax(0, 1fr))` },
      "grid",
      `${i} equal rows`
    );
    add(`row-span-${i}`, "grid", { "grid-row": `span ${i} / span ${i}` }, "grid", `span ${i} rows`);
  }
  add("row-span-full", "grid", { "grid-row": "1 / -1" }, "grid", "span all rows");
  add("col-start-1", "grid", { "grid-column-start": "1" }, "grid", "column start 1");
  add("col-end-1", "grid", { "grid-column-end": "1" }, "grid", "column end 1");
  for (const v of ["row", "col", "row-dense", "col-dense", "dense"]) {
    add(`grid-flow-${v}`, "grid", { "grid-auto-flow": v }, "grid", `grid-auto-flow: ${v}`);
  }
  for (const v of ["auto", "min", "max", "fr"]) {
    add(`auto-cols-${v}`, "grid", { "grid-auto-columns": v }, "grid", `grid-auto-columns: ${v}`);
    add(`auto-rows-${v}`, "grid", { "grid-auto-rows": v }, "grid", `grid-auto-rows: ${v}`);
  }
  const typo = theme.typography;
  if (typo?.fontSize) {
    for (const [size, value] of Object.entries(typo.fontSize)) {
      if (Array.isArray(value)) {
        const [fs, lh] = value;
        add(
          `text-${size}`,
          "typography",
          { "font-size": fs, "line-height": lh },
          "typography",
          `font-size: ${fs}`
        );
      } else {
        add(
          `text-${size}`,
          "typography",
          { "font-size": value },
          "typography",
          `font-size: ${value}`
        );
      }
    }
  }
  if (typo?.fontWeight) {
    for (const [weight, value] of Object.entries(typo.fontWeight)) {
      add(
        `font-${weight}`,
        "typography",
        { "font-weight": String(value) },
        "typography",
        `font-weight: ${value}`
      );
    }
  }
  if (theme.fontFamily) {
    for (const [family, value] of Object.entries(theme.fontFamily)) {
      add(
        `font-${family}`,
        "typography",
        { "font-family": value },
        "typography",
        `font-family: ${family}`
      );
    }
  }
  if (typo?.lineHeight) {
    for (const [height, value] of Object.entries(typo.lineHeight)) {
      add(
        `leading-${height}`,
        "typography",
        { "line-height": value },
        "typography",
        `line-height: ${value}`
      );
    }
  }
  if (typo?.letterSpacing) {
    for (const [spacingName, value] of Object.entries(typo.letterSpacing)) {
      add(
        `tracking-${spacingName}`,
        "typography",
        { "letter-spacing": value },
        "typography",
        `letter-spacing: ${value}`
      );
    }
  }
  for (const [align, cls] of [
    ["left", "text-left"],
    ["center", "text-center"],
    ["right", "text-right"],
    ["justify", "text-justify"],
    ["start", "text-start"],
    ["end", "text-end"]
  ]) {
    add(cls, "typography", { "text-align": align }, "typography", `text-align: ${align}`);
  }
  for (const [transform, cls] of [
    ["uppercase", "uppercase"],
    ["lowercase", "lowercase"],
    ["capitalize", "capitalize"],
    ["none", "normal-case"]
  ]) {
    add(
      cls,
      "typography",
      { "text-transform": transform },
      "typography",
      `text-transform: ${transform}`
    );
  }
  add("italic", "typography", { fontStyle: "italic" }, "typography", "italic");
  add("not-italic", "typography", { fontStyle: "normal" }, "typography", "not-italic");
  add(
    "truncate",
    "typography",
    {
      overflow: "hidden",
      "text-overflow": "ellipsis",
      whiteSpace: "nowrap"
    },
    "typography",
    "single-line ellipsis"
  );
  add(
    "text-ellipsis",
    "typography",
    { "text-overflow": "ellipsis" },
    "typography",
    "text-overflow: ellipsis"
  );
  add("text-clip", "typography", { "text-overflow": "clip" }, "typography", "text-overflow: clip");
  add(
    "antialiased",
    "typography",
    {
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale"
    },
    "typography",
    "font smoothing"
  );
  for (const [deco, cls] of [
    ["underline", "underline"],
    ["overline", "overline"],
    ["line-through", "line-through"],
    ["none", "no-underline"]
  ]) {
    add(
      cls,
      "textDecoration",
      { "text-decoration-line": deco },
      "textDecoration",
      `text-decoration-line: ${deco}`
    );
  }
  for (const w of ["thin", "2", "4", "8"]) {
    add(
      `decoration-${w}`,
      "textDecoration",
      {
        "text-decoration-thickness": w === "thin" ? "1px" : `${w}px`
      },
      "textDecoration",
      "decoration thickness"
    );
  }
  for (const off of ["0", "1", "2", "4", "8"]) {
    add(
      `underline-offset-${off}`,
      "textDecoration",
      { "text-underline-offset": `${off}px` },
      "textDecoration",
      "underline offset"
    );
  }
  const colorTokens = colorEntries(theme.colors);
  for (const [name, shade, value] of colorTokens) {
    const suffix = shade ? `${name}-${shade}` : name;
    add(`text-${suffix}`, "textColor", { color: value }, "colors", `color: ${value}`);
    add(
      `bg-${suffix}`,
      "backgroundColor",
      { "background-color": value },
      "colors",
      `background-color: ${value}`
    );
    add(
      `border-${suffix}`,
      "borderColor",
      { "border-color": value },
      "colors",
      `border-color: ${value}`
    );
    add(
      `from-${suffix}`,
      "gradients",
      { "--tw-gradient-from": value },
      "colors",
      `gradient from: ${value}`
    );
    add(
      `via-${suffix}`,
      "gradients",
      { "--tw-gradient-via": value },
      "colors",
      `gradient via: ${value}`
    );
    add(
      `to-${suffix}`,
      "gradients",
      { "--tw-gradient-to": value },
      "colors",
      `gradient to: ${value}`
    );
  }
  add("border", "borders", { border: "1px solid" }, "borders", "1px solid border (all sides)");
  add("border-0", "borders", { border: "0 solid" }, "borders", "no border");
  for (const w of ["2", "4", "8"]) {
    add(`border-${w}`, "borders", { border: `${w}px solid` }, "borders", `${w}px solid border`);
  }
  for (const side of ["t", "r", "b", "l"]) {
    add(
      `border-${side}`,
      "borders",
      { [`border-${side}-width`]: "1px", [`border-${side}-style`]: "solid" },
      "borders",
      `${side} border`
    );
  }
  for (const side of ["x", "y"]) {
    add(
      `border-${side}`,
      "borders",
      {
        ...side === "x" ? { "border-left": "1px solid", "border-right": "1px solid" } : { "border-top": "1px solid", "border-bottom": "1px solid" }
      },
      "borders",
      `${side === "x" ? "left+right" : "top+bottom"} border`
    );
  }
  for (const style of ["solid", "dashed", "dotted", "double", "none"]) {
    add(
      `border-${style}`,
      "borders",
      { "border-style": style },
      "borders",
      `border-style: ${style}`
    );
  }
  const radiusEntries = Object.entries(theme.borderRadius);
  add(
    "rounded",
    "borderRadius",
    { "border-radius": "0.25rem" },
    "borders",
    "border-radius: 0.25rem"
  );
  for (const [key, value] of radiusEntries) {
    add(
      `rounded-${key}`,
      "borderRadius",
      { "border-radius": value },
      "borders",
      `border-radius: ${value}`
    );
  }
  const corners = ["t", "r", "b", "l", "tl", "tr", "bl", "br"];
  for (const corner of corners) {
    add(
      `rounded-${corner}`,
      "borderRadius",
      { [borderCornerProp(corner)]: "0.25rem" },
      "borders",
      `${corner} corner radius`
    );
    for (const [key, value] of radiusEntries) {
      add(
        `rounded-${corner}-${key}`,
        "borderRadius",
        { [borderCornerProp(corner)]: value },
        "borders",
        `${corner} corner radius: ${value}`
      );
    }
  }
  function borderCornerProp(corner) {
    if (corner === "t") return "border-top-left-radius";
    if (corner === "r") return "border-top-right-radius";
    if (corner === "b") return "border-bottom-right-radius";
    if (corner === "l") return "border-bottom-left-radius";
    if (corner === "tl") return "border-top-left-radius";
    if (corner === "tr") return "border-top-right-radius";
    if (corner === "bl") return "border-bottom-left-radius";
    return "border-bottom-right-radius";
  }
  for (const pos of ["top", "left", "center", "right", "bottom"]) {
    add(
      `bg-${pos}`,
      "backgrounds",
      { "background-position": pos },
      "backgrounds",
      `background-position: ${pos}`
    );
  }
  for (const [rep, cls] of [
    ["no-repeat", "bg-no-repeat"],
    ["repeat", "bg-repeat"],
    ["repeat-x", "bg-repeat-x"],
    ["repeat-y", "bg-repeat-y"],
    ["round", "bg-repeat-round"],
    ["space", "bg-repeat-space"]
  ]) {
    add(
      cls,
      "backgrounds",
      { "background-repeat": rep },
      "backgrounds",
      `background-repeat: ${rep}`
    );
  }
  for (const size of ["auto", "cover", "contain"]) {
    add(
      `bg-${size}`,
      "backgrounds",
      { "background-size": size },
      "backgrounds",
      `background-size: ${size}`
    );
  }
  for (const attach of ["fixed", "local", "scroll"]) {
    add(
      `bg-${attach}`,
      "backgrounds",
      { "background-attachment": attach },
      "backgrounds",
      `background-attachment: ${attach}`
    );
  }
  for (const dir of ["t", "tr", "r", "br", "b", "bl", "l", "tl"]) {
    add(
      `bg-gradient-to-${dir}`,
      "backgrounds",
      {
        backgroundImage: `linear-gradient(to ${dir === "t" ? "top" : dir === "tr" ? "top right" : dir === "r" ? "right" : dir === "br" ? "bottom right" : dir === "b" ? "bottom" : dir === "bl" ? "bottom left" : dir === "l" ? "left" : "top left"}, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))`
      },
      "backgrounds",
      `linear gradient to ${dir}`
    );
  }
  for (const [key, value] of Object.entries(theme.shadows)) {
    const cls = key === "base" ? "shadow" : `shadow-${key}`;
    add(cls, "shadows", { "box-shadow": value }, "effects", `box-shadow: ${value}`);
  }
  for (const [key, value] of Object.entries(theme.opacity)) {
    add(`opacity-${key}`, "opacity", { opacity: String(value) }, "effects", `opacity: ${value}`);
  }
  add("blur-0", "filters", { filter: "none", "backdrop-filter": "none" }, "effects", "no blur");
  for (const [px, cls] of [
    ["4", "blur-sm"],
    ["8", "blur"],
    ["12", "blur-md"],
    ["16", "blur-lg"],
    ["24", "blur-xl"],
    ["40", "blur-2xl"]
  ]) {
    add(
      cls,
      "filters",
      { backdropFilter: `blur(${px}px)`, filter: `blur(${px}px)` },
      "effects",
      `backdrop-blur(${px}px)`
    );
  }
  add("brightness-0", "filters", { filter: "brightness(0)" }, "effects", "brightness 0");
  for (const p of ["50", "75", "90", "95", "100", "105", "110", "125", "150", "200"]) {
    add(
      `brightness-${p}`,
      "filters",
      { filter: `brightness(${p}%)` },
      "effects",
      `brightness ${p}%`
    );
  }
  add("grayscale", "filters", { filter: "grayscale(100%)" }, "effects", "grayscale");
  add("invert", "filters", { filter: "invert(100%)" }, "effects", "invert colors");
  add("saturate-0", "filters", { filter: "saturate(0)" }, "effects", "saturate 0");
  for (const p of ["50", "100", "150", "200"]) {
    add(`saturate-${p}`, "filters", { filter: `saturate(${p}%)` }, "effects", `saturate ${p}%`);
  }
  add("contrast-more", "filters", { filter: "contrast(1.2)" }, "effects", "contrast +20%");
  add("contrast-less", "filters", { filter: "contrast(0.8)" }, "effects", "contrast -20%");
  add(
    "drop-shadow",
    "filters",
    { filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))" },
    "effects",
    "drop shadow"
  );
  add(
    "drop-shadow-lg",
    "filters",
    { filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.2))" },
    "effects",
    "large drop shadow"
  );
  add("backdrop-blur", "filters", { "backdrop-filter": "blur(8px)" }, "effects", "backdrop blur");
  add(
    "backdrop-grayscale",
    "filters",
    { "backdrop-filter": "grayscale(100%)" },
    "effects",
    "backdrop grayscale"
  );
  add(
    "backdrop-invert",
    "filters",
    { "backdrop-filter": "invert(100%)" },
    "effects",
    "backdrop invert"
  );
  for (const v of [
    "50",
    "75",
    "90",
    "95",
    "100",
    "105",
    "110",
    "125",
    "150",
    "175",
    "200"
  ]) {
    add(
      `scale-${v}`,
      "transforms",
      { transform: `scale(${Number(v) / 100})` },
      "transforms",
      `scale ${v}%`
    );
  }
  for (const d of ["0", "45", "90", "135", "180", "225", "270", "315", "360"]) {
    add(
      `rotate-${d}`,
      "transforms",
      { transform: `rotate(${d}deg)` },
      "transforms",
      `rotate ${d}deg`
    );
  }
  add("-rotate-45", "transforms", { transform: "rotate(-45deg)" }, "transforms", "rotate -45deg");
  add("-rotate-90", "transforms", { transform: "rotate(-90deg)" }, "transforms", "rotate -90deg");
  add(
    "-rotate-180",
    "transforms",
    { transform: "rotate(-180deg)" },
    "transforms",
    "rotate -180deg"
  );
  for (const key of sKeys) {
    const v = spacing[key];
    add(
      `translate-x-${key}`,
      "transforms",
      { transform: `translateX(${v})` },
      "transforms",
      "translateX"
    );
    add(
      `translate-y-${key}`,
      "transforms",
      { transform: `translateY(${v})` },
      "transforms",
      "translateY"
    );
    add(
      `-translate-x-${key}`,
      "transforms",
      { transform: `translateX(calc(-1 * ${v}))` },
      "transforms",
      "-translateX"
    );
    add(
      `-translate-y-${key}`,
      "transforms",
      { transform: `translateY(calc(-1 * ${v}))` },
      "transforms",
      "-translateY"
    );
  }
  add(
    "transform",
    "transforms",
    {
      transform: "translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))"
    },
    "transforms",
    "enable transform"
  );
  add(
    "transform-gpu",
    "transforms",
    { transform: "translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)" },
    "transforms",
    "GPU transform"
  );
  add("transform-none", "transforms", { transform: "none" }, "transforms", "no transform");
  add(
    "transition",
    "transitions",
    {
      transitionProperty: "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      transitionDuration: "150ms"
    },
    "transitions",
    "standard transition set"
  );
  add(
    "transition-all",
    "transitions",
    {
      transitionProperty: "all",
      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      transitionDuration: "150ms"
    },
    "transitions",
    "transition: all"
  );
  add(
    "transition-none",
    "transitions",
    { transitionProperty: "none" },
    "transitions",
    "no transition"
  );
  add(
    "transition-colors",
    "transitions",
    {
      transitionProperty: "color, background-color, border-color, text-decoration-color, fill, stroke",
      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      transitionDuration: "150ms"
    },
    "transitions",
    "color transitions"
  );
  add(
    "transition-opacity",
    "transitions",
    {
      transitionProperty: "opacity",
      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      transitionDuration: "150ms"
    },
    "transitions",
    "opacity transitions"
  );
  add(
    "transition-shadow",
    "transitions",
    {
      transitionProperty: "box-shadow",
      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      transitionDuration: "150ms"
    },
    "transitions",
    "box-shadow transitions"
  );
  add(
    "transition-transform",
    "transitions",
    {
      transitionProperty: "transform",
      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      transitionDuration: "150ms"
    },
    "transitions",
    "transform transitions"
  );
  for (const [key, value] of Object.entries(theme.duration)) {
    add(
      `duration-${key}`,
      "transitions",
      { transitionDuration: value },
      "transitions",
      `transition-duration: ${value}`
    );
  }
  for (const [key, value] of Object.entries(theme.easing)) {
    add(
      `ease-${key}`,
      "transitions",
      { "transition-timing-function": value },
      "transitions",
      `transition-timing-function: ${value}`
    );
  }
  for (const [name, value] of Object.entries(theme.animation)) {
    add(`animate-${name}`, "animations", { animation: value }, "animations", `animation: ${value}`);
  }
  add("animate-none", "animations", { animation: "none" }, "animations", "no animation");
  for (const [play, cls] of [
    ["paused", "animation-paused"],
    ["running", "animation-running"]
  ]) {
    add(
      cls,
      "animations",
      { "animation-play-state": play },
      "animations",
      `animation-play-state: ${play}`
    );
  }
  for (const cursor of [
    "default",
    "pointer",
    "wait",
    "text",
    "move",
    "help",
    "not-allowed",
    "resize",
    "zoom-in",
    "zoom-out"
  ]) {
    add(`cursor-${cursor}`, "cursors", { cursor }, "cursors", `cursor: ${cursor}`);
  }
  for (const [mode, cls] of [
    ["normal", "whitespace-normal"],
    ["nowrap", "whitespace-nowrap"],
    ["pre", "whitespace-pre"],
    ["pre-line", "whitespace-pre-line"],
    ["pre-wrap", "whitespace-pre-wrap"],
    ["break-spaces", "break-spaces"]
  ]) {
    add(cls, "whitespace", { whiteSpace: mode }, "whitespace", `white-space: ${mode}`);
  }
  for (const [val, cls] of [
    ["left", "float-left"],
    ["right", "float-right"],
    ["none", "float-none"]
  ]) {
    add(cls, "whitespace", { float: val }, "whitespace", `float: ${val}`);
  }
  add("clear-left", "whitespace", { clear: "left" }, "whitespace", "clear: left");
  add("clear-right", "whitespace", { clear: "right" }, "whitespace", "clear: right");
  add("clear-both", "whitespace", { clear: "both" }, "whitespace", "clear: both");
  for (const val of ["none", "disc", "decimal"]) {
    add(`list-${val}`, "whitespace", { listStyleType: val }, "whitespace", `list-style: ${val}`);
  }
  add(
    "list-none",
    "whitespace",
    { "list-style": "none", "list-style-type": "none" },
    "whitespace",
    "remove list styling"
  );
  for (const val of ["none", "visible", "collapse", "hidden", "scroll"]) {
    add(
      `resize-${val}`,
      "whitespace",
      { resize: val },
      "whitespace",
      `resize: ${val}`
    );
  }
  add(
    "select-none",
    "whitespace",
    { userSelect: "none" },
    "whitespace",
    "user-select: none"
  );
  add(
    "select-text",
    "whitespace",
    { userSelect: "text" },
    "whitespace",
    "user-select: text"
  );
  add(
    "select-all",
    "whitespace",
    { userSelect: "all" },
    "whitespace",
    "user-select: all"
  );
  return rules;
}
var componentCss = {
  glass: `
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  border-radius: 0.75rem;
  color: #f8fafc;
}

.glass-light {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px rgba(31, 41, 55, 0.12);
  border-radius: 0.75rem;
  color: #1f2937;
}

.glass-dark {
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
  border-radius: 0.75rem;
  color: #f8fafc;
}
`,
  neon: `
.neon-card {
  background: #0a1929;
  border: 1px solid rgba(0, 217, 255, 0.4);
  border-radius: 0.75rem;
  box-shadow: 0 0 12px rgba(0, 217, 255, 0.35), inset 0 0 18px rgba(0, 217, 255, 0.08);
  color: #e0f7ff;
  transition: box-shadow 200ms ease, border-color 200ms ease;
}
.neon-card:hover {
  box-shadow: 0 0 24px rgba(0, 217, 255, 0.6), inset 0 0 24px rgba(0, 217, 255, 0.12);
  border-color: rgba(0, 217, 255, 0.8);
}

.neon-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #00d9ff 0%, #ff006e 100%);
  color: #050d1a;
  font-weight: 700;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  box-shadow: 0 0 18px rgba(0, 217, 255, 0.45);
  transition: box-shadow 200ms ease, transform 200ms ease;
}
.neon-btn:hover {
  box-shadow: 0 0 32px rgba(255, 0, 110, 0.6);
  transform: translateY(-1px);
}

.neon-glow {
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.6), 0 0 30px rgba(0, 217, 255, 0.3);
}

.neon-text {
  color: #00d9ff;
  text-shadow: 0 0 8px rgba(0, 217, 255, 0.8), 0 0 24px rgba(0, 217, 255, 0.4);
}
`,
  brutalist: `
.brutalist-card {
  background: #fff;
  border: 3px solid #000;
  border-radius: 0;
  box-shadow: 8px 8px 0 #000;
  color: #000;
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.brutalist-card:hover {
  transform: translate(-4px, -4px);
  box-shadow: 12px 12px 0 #f43f5e;
}

.brutalist-btn {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  background: #facc15;
  border: 3px solid #000;
  border-radius: 0;
  box-shadow: 5px 5px 0 #000;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: transform 100ms ease, box-shadow 100ms ease;
}
.brutalist-btn:hover {
  background: #f43f5e;
  color: #fff;
}
.brutalist-btn:active {
  transform: translate(5px, 5px);
  box-shadow: 0 0 0 #000;
}
`,
  minimalist: `
.minimalist-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  color: #1f2937;
  transition: box-shadow 200ms ease, border-color 200ms ease;
}
.minimalist-card:hover {
  border-color: #9ca3af;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.minimalist-btn {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: #111827;
  color: #f9fafb;
  border: 1px solid #111827;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
}
.minimalist-btn:hover {
  background: #f9fafb;
  color: #111827;
}
`,
  skeletons: `
.skeleton-rect {
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  border-radius: 0.375rem;
  animation: shimmer 1.5s linear infinite;
}

.skeleton-circle {
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  border-radius: 9999px;
  animation: shimmer 1.5s linear infinite;
}

.skeleton-text {
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
  height: 1em;
  animation: shimmer 1.5s linear infinite;
}
`,
  helpers: `
.hover-lift {
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.2);
}

.gradient-text {
  background-image: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.gradient-neon {
  background: linear-gradient(135deg, #0a1929 0%, #16213e 45%, #0f3460 100%);
}
.gradient-pastel {
  background: linear-gradient(135deg, #fdf2f8 0%, #eff6ff 50%, #ecfdf5 100%);
}
.gradient-nature {
  background: linear-gradient(135deg, #14532d 0%, #166534 50%, #365314 100%);
}
.gradient-brutalist {
  background: linear-gradient(135deg, #facc15 0%, #f43f5e 100%);
}
`
};
var componentNames = Object.keys(componentCss);
function escapeClass(className) {
  return className.replace(/([.:#[\]\\])/g, "\\$1");
}
function stringifyDecls(decls, important = false) {
  const parts = [];
  for (const [prop, value] of Object.entries(decls)) {
    if (value === void 0 || value === null) continue;
    const suffix = important ? " !important" : "";
    parts.push(`${prop}: ${String(value)}${suffix}`);
  }
  return parts.join("; ");
}
var DEFAULT_EXTRACTOR = /[[\w\\:/.-]+/g;
function extractClasses(content, pattern) {
  const regex = pattern ? new RegExp(pattern, "g") : DEFAULT_EXTRACTOR;
  const classes = /* @__PURE__ */ new Set();
  for (const chunk of content) {
    if (!chunk) continue;
    for (const match of chunk.matchAll(regex)) {
      const token = match[0];
      if (token.length > 64) continue;
      const unescaped = token.replace(/\\:/g, ":").replace(/\\\\/g, "\\");
      const cleaned = unescaped.replace(/^\.+/, "");
      if (cleaned.length > 1) classes.add(cleaned);
    }
  }
  return classes;
}
function splitClass(token) {
  if (!token.includes(":")) return { prefixes: [], base: token };
  const parts = token.split(":");
  return { prefixes: parts.slice(0, -1), base: parts[parts.length - 1] };
}
function minifyCss(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>~])\s*/g, "$1").replace(/\s{2,}/g, " ").replace(/\s+\}/g, "}").trim();
}
function byteLength(str) {
  return Buffer.byteLength(str, "utf-8");
}
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
var STATE_VARIANTS = [
  {
    prefix: "hover",
    suffix: ":hover",
    ancestor: "",
    configKey: "hover",
    description: "applies on hover"
  },
  {
    prefix: "focus",
    suffix: ":focus",
    ancestor: "",
    configKey: "focus",
    description: "applies on focus"
  },
  {
    prefix: "focus-visible",
    suffix: ":focus-visible",
    ancestor: "",
    configKey: "focusVisible",
    description: "applies on keyboard focus"
  },
  {
    prefix: "focus-within",
    suffix: ":focus-within",
    ancestor: "",
    configKey: "focusWithin",
    description: "applies when a descendant has focus"
  },
  {
    prefix: "active",
    suffix: ":active",
    ancestor: "",
    configKey: "active",
    description: "applies while the element is active (pressed)"
  },
  {
    prefix: "visited",
    suffix: ":visited",
    ancestor: "",
    configKey: "visited",
    description: "applies to visited links"
  },
  {
    prefix: "disabled",
    suffix: ":disabled",
    ancestor: "",
    configKey: "disabled",
    description: "applies when disabled"
  },
  {
    prefix: "first",
    suffix: ":first-child",
    ancestor: "",
    configKey: "firstChild",
    description: "applies to the first child"
  },
  {
    prefix: "last",
    suffix: ":last-child",
    ancestor: "",
    configKey: "lastChild",
    description: "applies to the last child"
  },
  {
    prefix: "group-hover",
    suffix: "",
    ancestor: ".group:hover",
    configKey: "groupHover",
    description: "applies when the .group parent is hovered"
  },
  {
    prefix: "group-focus",
    suffix: "",
    ancestor: ".group:focus",
    configKey: "groupFocus",
    description: "applies when the .group parent has focus"
  },
  {
    prefix: "peer-hover",
    suffix: "",
    ancestor: ".peer:hover ~",
    configKey: "peerHover",
    description: "applies when the preceding .peer sibling is hovered"
  },
  {
    prefix: "peer-focus",
    suffix: "",
    ancestor: ".peer:focus ~",
    configKey: "peerFocus",
    description: "applies when the preceding .peer sibling has focus"
  },
  {
    prefix: "dark",
    suffix: "",
    ancestor: ".dark",
    configKey: "dark",
    description: "applies inside a .dark ancestor (class dark mode)"
  }
];
var variantByPrefix = new Map(STATE_VARIANTS.map((v) => [v.prefix, v]));
var CSSGenerator = class {
  config;
  theme;
  variantCfg;
  utilities;
  breakpoints;
  utilityByClass;
  extraBase;
  extraComponents;
  constructor(config = {}) {
    const draft = { ...config };
    const plugins = config.plugins ?? [];
    for (const plugin of plugins) {
      if (plugin.config) plugin.config(draft);
    }
    this.config = {
      theme: deepMerge(defaultTheme, draft.theme ?? {}),
      variants: { ...defaultVariants, ...draft.variants },
      content: draft.content,
      purge: draft.purge ?? [],
      safelist: draft.safelist ?? [],
      plugins,
      important: draft.important ?? false,
      corePlugins: draft.corePlugins ?? {},
      extractorPattern: draft.extractorPattern
    };
    this.theme = this.config.theme;
    this.variantCfg = this.config.variants;
    this.breakpoints = Object.entries(this.theme.breakpoints ?? {}).filter(([, px]) => typeof px === "number" && px > 0).map(([name, px]) => ({ name, px })).sort((a, b) => a.px - b.px);
    this.utilities = buildUtilityList(this.theme);
    this.extraBase = {};
    this.extraComponents = {};
    const gen = {
      addUtilities: (utilities, group = "plugin") => {
        for (const [cls, decls] of Object.entries(utilities)) {
          this.utilities.push({
            class: cls,
            group,
            category: GROUP_LABELS[group] ?? group,
            decls,
            description: `plugin utility ${cls}`
          });
        }
      },
      addComponents: (components) => {
        Object.assign(this.extraComponents, components);
      },
      addBase: (base) => {
        Object.assign(this.extraBase, base);
      }
    };
    for (const plugin of plugins) {
      if (plugin.handler) plugin.handler(gen);
    }
    this.utilityByClass = /* @__PURE__ */ new Map();
    for (const rule of this.utilities) this.utilityByClass.set(rule.class, rule);
  }
  // ───────────────────────────────────────────── API ─────────────────────────────────────────────
  /**
   * Generate the stylesheet.
   *
   * - `full` mode (default): base styles, CSS variables, keyframes, every
   *   utility + its responsive variants, and the component set.
   * - `jit` mode: only the utilities found in `options.content`
   *   (state variants and variant combinations included).
   */
  generate(options = {}) {
    const mode = options.mode ?? (this.hasContent() ? "jit" : "full");
    const css = mode === "jit" ? this.generateJIT(options.content ?? this.getContentFromConfig(), options) : this.generateFull(options);
    return options.minify ? minifyCss(css) : css;
  }
  /** Generate JIT CSS from explicit content */
  generateFromContent(content, options = {}) {
    const css = this.generateJIT(content, options);
    return options.minify ? minifyCss(css) : css;
  }
  /** All utility rules in catalog order */
  getUtilities() {
    return [...this.utilities];
  }
  /** Look up a single utility by (base) class name */
  getUtility(className) {
    return this.utilityByClass.get(className);
  }
  /** Statistics about a generated stylesheet */
  getStats(css) {
    const generated = css ?? this.generate();
    const minified = minifyCss(generated);
    const ruleCount = (generated.match(/\{[^{}]*\}/g) ?? []).length;
    return {
      utilities: this.utilities.length,
      responsiveRules: (generated.match(/@media/g) ?? []).length,
      variantRules: ruleCount,
      totalRules: ruleCount,
      sizeBytes: byteLength(generated),
      minifiedSizeBytes: byteLength(minified)
    };
  }
  minify(css) {
    return minifyCss(css);
  }
  // ───────────────────────────── layer accessors ─────────────────────────────
  // Exposed for bundler integrations (PostCSS, Vite) that need individual layers.
  /** Base styles (reset, defaults, reduced-motion) */
  getBase() {
    return this.baseStyles();
  }
  /** `:root` CSS variables */
  getVariables() {
    return this.variables();
  }
  /** `@keyframes` for the referenced animations */
  getKeyframes(names) {
    return this.keyframes(names);
  }
  /**
   * Full utility set.
   * @param includeVariants when true (default) state variants are included
   *   as well — the standard full build omits them (JIT-only) to stay lean.
   */
  getUtilitiesFull(includeVariants = true) {
    let css = "";
    const rules = this.utilities.filter((r) => this.isGroupEnabled(r.group));
    const variants = includeVariants ? this.enabledVariants() : [];
    const breakpoints = this.enabledBreakpoints();
    let lastGroup = "";
    for (const rule of rules) {
      if (rule.group !== lastGroup) {
        lastGroup = rule.group;
        css += `
/* ${GROUP_LABELS[rule.group] ?? rule.group} */
`;
      }
      css += this.emitRule(rule);
    }
    for (const bp of breakpoints) {
      css += `
@media (min-width: ${bp.px}px) {
`;
      for (const rule of rules) {
        if (rule.responsive === false) continue;
        css += this.emitRule(rule, bp.name);
      }
      css += "}\n";
    }
    for (const variant of variants) {
      css += `
/* variant: ${variant.prefix} */
`;
      for (const rule of rules) {
        if (rule.variantable === false) continue;
        css += this.emitRule(rule, variant.prefix);
      }
    }
    return css;
  }
  /** Design-paradigm component CSS */
  getComponents() {
    return this.components();
  }
  // ─────────────────────────────────────────── internals ───────────────────────────────────────────
  hasContent() {
    if (this.config.content !== void 0) {
      const c = this.config.content;
      return c !== "" && !(Array.isArray(c) && c.length === 0);
    }
    return false;
  }
  getContentFromConfig() {
    const content = this.config.content ?? this.config.purge;
    if (typeof content === "string") return [content];
    return Array.isArray(content) ? content : [];
  }
  enabledVariants() {
    return STATE_VARIANTS.filter((v) => this.variantCfg[v.configKey] !== false);
  }
  enabledBreakpoints() {
    return this.variantCfg.responsive !== false ? this.breakpoints : [];
  }
  isGroupEnabled(group) {
    return this.config.corePlugins?.[group] !== false;
  }
  /** Wrap a selector with the `important` scope when configured as a string */
  wrapSelector(selector) {
    const imp = this.config.important;
    if (typeof imp === "string" && imp.trim()) {
      return imp.trim().split(",").map((s) => s.trim()).map((scope) => `${scope} ${selector}`).join(", ");
    }
    return selector;
  }
  emitRule(rule, prefix = "", media) {
    const variant = prefix ? variantByPrefix.get(prefix) : void 0;
    let selector;
    if (variant) {
      const full = variant.prefix === prefix ? `${variant.prefix}:${rule.class}` : rule.class;
      const suffix = variant.suffix;
      const ancestor = variant.ancestor;
      selector = ancestor ? `${ancestor} .${escapeClass(full)}` : `.${escapeClass(full)}${suffix}`;
    } else if (prefix) {
      selector = `.${escapeClass(`${prefix}:${rule.class}`)}`;
    } else {
      selector = `.${escapeClass(rule.class)}`;
    }
    selector = this.wrapSelector(selector);
    const decls = stringifyDecls(rule.decls, this.config.important === true);
    const body = `${selector} { ${decls}; }`;
    return media ? `  ${body}
` : `${body}
`;
  }
  // ─────────────────────────────── layers ───────────────────────────────
  baseStyles() {
    if (!this.isGroupEnabled("base")) return "";
    const font = this.theme.fontFamily?.sans ?? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    let css = `/* Nakshora v3 \u2014 Base */
*, ::before, ::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #e5e7eb;
}

* {
  margin: 0;
  padding: 0;
}

html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

body {
  font-family: ${font};
  line-height: 1.5;
  color: #1f2937;
  background-color: #ffffff;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
  color: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

h1, h2, h3, h4, h5, h6 {
  font-size: inherit;
  font-weight: inherit;
}

a {
  color: inherit;
  text-decoration: inherit;
}

button {
  cursor: pointer;
  background: none;
}

:where([tabindex="-1"]):focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;
    for (const [selector, decls] of Object.entries(this.extraBase)) {
      css += `${this.wrapSelector(selector)} { ${stringifyDecls(decls, this.config.important === true)}; }
`;
    }
    return css;
  }
  variables() {
    if (!this.isGroupEnabled("variables")) return "";
    let css = "\n/* Nakshora v3 \u2014 CSS Variables */\n:root {\n";
    for (const [name, scale] of Object.entries(this.theme.colors ?? {})) {
      if (typeof scale === "string") {
        css += `  --color-${name}: ${scale};
`;
      } else if (scale) {
        for (const [shade, value] of Object.entries(scale)) {
          if (typeof value === "string") css += `  --color-${name}-${shade}: ${value};
`;
        }
      }
    }
    for (const [key, value] of Object.entries(this.theme.spacing ?? {})) {
      css += `  --spacing-${key}: ${value};
`;
    }
    const fontSize = this.theme.typography?.fontSize ?? {};
    for (const [size, value] of Object.entries(fontSize)) {
      css += `  --text-${size}: ${Array.isArray(value) ? value[0] : value};
`;
    }
    for (const [name, value] of Object.entries(this.theme.fontFamily ?? {})) {
      css += `  --font-${name}: ${value};
`;
    }
    css += "}\n";
    return css;
  }
  keyframes(names) {
    if (!this.isGroupEnabled("animations")) return "";
    const keyframes = this.theme.keyframes ?? {};
    const animations = this.theme.animation ?? {};
    const needed = names ?? new Set(Object.values(animations).map((v) => v.split(/\s+/)[0]));
    let css = "";
    for (const [name, body] of Object.entries(keyframes)) {
      if (!needed.has(name)) continue;
      css += `@keyframes ${name} {
${body.split(";").map((s) => s.trim() ? `  ${s.trim()};` : "").join("\n")}
}
`;
    }
    return css ? `
/* Nakshora v3 \u2014 Keyframes */
${css}` : "";
  }
  components() {
    if (!this.isGroupEnabled("components")) return "";
    let css = "\n/* Nakshora v3 \u2014 Components */\n";
    for (const block of Object.values(componentCss)) css += block;
    for (const [selector, decls] of Object.entries(this.extraComponents)) {
      css += `${this.wrapSelector(selector)} { ${stringifyDecls(decls, this.config.important === true)}; }
`;
    }
    return css;
  }
  // ─────────────────────────────── full mode ───────────────────────────────
  generateFull(_options) {
    let css = `/*! Nakshora v3.0.0 \u2014 utility-first CSS framework (full build) */
`;
    css += this.baseStyles();
    css += this.variables();
    css += this.keyframes();
    css += "\n/* \u2500\u2500\u2500 Utilities \u2500\u2500\u2500 */\n";
    css += this.getUtilitiesFull(false);
    css += this.components();
    return css;
  }
  // ─────────────────────────────── JIT mode ───────────────────────────────
  /**
   * Compile a JIT build from content.
   * @param internal.utilitiesOnly emit only the utilities section (no base/variables/keyframes/components)
   */
  generateJIT(content, _options, internal) {
    const utilitiesOnly = internal?.utilitiesOnly ?? false;
    const chunks = typeof content === "string" ? [content] : content ?? [];
    const found = extractClasses(chunks, this.config.extractorPattern);
    for (const safe of this.config.safelist ?? []) found.add(safe);
    const bpNames = new Map(this.breakpoints.map((b) => [b.name, b]));
    const usedAnimations = /* @__PURE__ */ new Set();
    const emitted = /* @__PURE__ */ new Set();
    const blocks = [];
    for (const token of found) {
      const { prefixes, base } = splitClass(token);
      if (prefixes.length > 3) continue;
      const rule = this.utilityByClass.get(base);
      if (!rule) continue;
      if (!this.isGroupEnabled(rule.group)) continue;
      let media;
      let ancestor = "";
      let suffix = "";
      let variantOrder = 0;
      const prefixParts = [token];
      let ok = true;
      const responsiveEnabled = this.variantCfg.responsive !== false;
      for (const prefix of prefixes) {
        const bp = responsiveEnabled ? bpNames.get(prefix) : void 0;
        if (bp) {
          media = `@media (min-width: ${bp.px}px)`;
          continue;
        }
        const variant = variantByPrefix.get(prefix);
        if (!variant) {
          ok = false;
          break;
        }
        if (this.variantCfg[variant.configKey] === false) {
          ok = false;
          break;
        }
        if (variant.suffix) {
          suffix += variant.suffix;
          variantOrder++;
        } else {
          ancestor = `${ancestor} ${variant.ancestor}`.trim();
          variantOrder++;
        }
      }
      if (!ok) continue;
      const className = prefixParts.join("");
      if (emitted.has(className)) continue;
      emitted.add(className);
      if (rule.group === "animations") {
        const first = String(rule.decls.animation ?? "").split(/\s+/)[0];
        if (first) usedAnimations.add(first);
      }
      const selector = ancestor ? `${ancestor} .${escapeClass(className)}${suffix}` : `.${escapeClass(className)}${suffix}`;
      const wrapped = this.wrapSelector(selector);
      const body = `${wrapped} { ${stringifyDecls(rule.decls, this.config.important === true)}; }
`;
      blocks.push({ media, variantOrder, body: media ? `  ${body}` : body });
    }
    blocks.sort((a, b) => a.variantOrder - b.variantOrder);
    let css = "";
    if (!utilitiesOnly) {
      css += `/*! Nakshora v3.0.0 \u2014 JIT build \xB7 ${emitted.size} classes */
`;
      css += this.baseStyles();
      css += this.variables();
      css += this.keyframes(usedAnimations);
    }
    const plain = [];
    const byMedia = /* @__PURE__ */ new Map();
    for (const block of blocks) {
      if (block.media) {
        const list = byMedia.get(block.media) ?? [];
        list.push(block.body);
        byMedia.set(block.media, list);
      } else {
        plain.push(block.body);
      }
    }
    css += "\n/* \u2500\u2500\u2500 Utilities (JIT) \u2500\u2500\u2500 */\n";
    css += plain.join("");
    const sortedMedia = [...byMedia.entries()].sort(
      (a, b) => parseInt(a[0].match(/min-width: (\d+)/)?.[1] ?? "0", 10) - parseInt(b[0].match(/min-width: (\d+)/)?.[1] ?? "0", 10)
    );
    for (const [media, bodies] of sortedMedia) {
      css += `
${media} {
${bodies.join("")}
}
`;
    }
    css += this.components();
    return css;
  }
};
var GROUP_LABELS = {
  display: "Display",
  position: "Position",
  inset: "Inset",
  zIndex: "Z-Index",
  overflow: "Overflow",
  visibility: "Visibility",
  sizing: "Sizing",
  margin: "Margin",
  padding: "Padding",
  gap: "Gap",
  flex: "Flexbox",
  grid: "Grid",
  typography: "Typography",
  textDecoration: "Text Decoration",
  textColor: "Text Colors",
  backgroundColor: "Background Colors",
  borderColor: "Border Colors",
  gradients: "Gradient Stops",
  borders: "Borders",
  borderRadius: "Border Radius",
  backgrounds: "Backgrounds",
  shadows: "Shadows",
  opacity: "Opacity",
  filters: "Filters",
  transforms: "Transforms",
  transitions: "Transitions",
  animations: "Animations",
  cursors: "Cursors",
  whitespace: "Whitespace & Misc",
  base: "Base",
  variables: "Variables",
  components: "Components",
  plugin: "Plugins"
};
var version = "3.0.0";

// src/content.ts
import { existsSync, readFileSync, statSync } from "fs";
import { resolve } from "path";
import { globby } from "globby";
async function resolveContent(content, cwd = process.cwd()) {
  if (!content) return [];
  const entries = Array.isArray(content) ? content : [content];
  const chunks = [];
  const globs = [];
  const raw = [];
  for (const entry of entries) {
    if (!entry) continue;
    if (entry.includes("*") || entry.includes("{") || entry.includes("[")) {
      globs.push(entry);
    } else if (existsSync(resolve(cwd, entry)) && statSync(resolve(cwd, entry)).isFile()) {
      raw.push(readFileSync(resolve(cwd, entry), "utf-8"));
    } else {
      raw.push(entry);
    }
  }
  if (globs.length > 0) {
    const files = await globby(globs, { cwd, absolute: true });
    for (const file of files) {
      try {
        raw.push(readFileSync(file, "utf-8"));
      } catch {
      }
    }
  }
  chunks.push(...raw);
  return chunks;
}

// src/build.ts
var SOURCE_RE = /@nakshora\s+source\s*;?/g;
var UTILITIES_RE = /@nakshora\s+utilities\s*;?/g;
async function runBuild(input) {
  const cwd = input.cwd ?? process.cwd();
  const config = input.config;
  const generator = new CSSGenerator(config);
  const content = await resolveContent(config.content ?? config.purge, cwd);
  const mode = input.mode ?? (content.length > 0 ? "jit" : "full");
  const options = { minify: input.minify, mode, content };
  let css;
  let classes;
  if (mode === "jit") {
    css = generator.generateJIT(content, options);
    classes = countClasses(css);
  } else {
    css = generator.generate({ ...options, mode: "full" });
    classes = countClasses(css);
  }
  if (input.input) {
    const absInput = isAbsolute(input.input) ? input.input : resolve2(cwd, input.input);
    if (existsSync2(absInput)) {
      const source = readFileSync2(absInput, "utf-8");
      if (SOURCE_RE.test(source) || UTILITIES_RE.test(source)) {
        const hasJitContent = content.length > 0;
        const sourceCss = hasJitContent ? css : generator.generate({ minify: false, mode: "full" });
        const utilCss = hasJitContent ? generator.generateJIT(content, { minify: false }, { utilitiesOnly: true }) : generator.getUtilitiesFull(true);
        const out = source.replace(SOURCE_RE, () => sourceCss).replace(UTILITIES_RE, () => utilCss);
        css = input.minify ? minifyCss(out) : out;
      }
    }
  }
  if (input.output) {
    const outPath = isAbsolute(input.output) ? input.output : resolve2(cwd, input.output);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, css, "utf-8");
  } else {
    process.stdout.write(css);
  }
  return {
    css,
    classes,
    sizeBytes: Buffer.byteLength(css, "utf-8"),
    minifiedSizeBytes: Buffer.byteLength(minifyCss(css), "utf-8")
  };
}
function countClasses(css) {
  return (css.match(/\.([a-zA-Z0-9\\\-_]+)/g) ?? []).length;
}
function summarize(result, output) {
  const size = output ? formatBytes(result.sizeBytes) : "stdout";
  return `${result.classes} classes \xB7 ${size} (${formatBytes(result.minifiedSizeBytes)} min)`;
}
async function collectWatchPaths(config, input, cwd = process.cwd()) {
  const paths = /* @__PURE__ */ new Set();
  const content = Array.isArray(config.content) ? config.content : config.content ? [config.content] : config.purge ?? [];
  for (const entry of content) {
    if (!entry) continue;
    if (entry.includes("*")) {
      const root = entry.split("*")[0];
      const abs = isAbsolute(root) ? root : resolve2(cwd, root);
      try {
        if (statSync2(abs).isDirectory()) paths.add(abs);
      } catch {
        const dir = dirname(abs);
        try {
          if (statSync2(dir).isDirectory()) paths.add(dir);
        } catch {
        }
      }
    } else if (!entry.includes(" ") && existsSync2(resolve2(cwd, entry))) {
      const abs = resolve2(cwd, entry);
      if (statSync2(abs).isFile()) paths.add(abs);
      else if (statSync2(abs).isDirectory()) paths.add(abs);
    }
  }
  if (input.input) {
    const abs = isAbsolute(input.input) ? input.input : join(cwd, input.input);
    if (existsSync2(abs)) paths.add(abs);
  }
  if (input.config && input.config.__file) {
    paths.add(input.config.__file);
  }
  return [...paths];
}

// src/config-loader.ts
import { existsSync as existsSync3, readFileSync as readFileSync3 } from "fs";
import { dirname as dirname2, isAbsolute as isAbsolute2, join as join2, resolve as resolve3 } from "path";
var CONFIG_FILES = [
  "nakshora.config.ts",
  "nakshora.config.js",
  "nakshora.config.mjs",
  "nakshora.config.cjs",
  "nakshora.config.json"
];
function findConfigFile(startDir = process.cwd()) {
  let dir = resolve3(startDir);
  for (let i = 0; i < 5; i++) {
    for (const file of CONFIG_FILES) {
      const candidate = join2(dir, file);
      if (existsSync3(candidate)) return candidate;
    }
    const parent = dirname2(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}
async function loadConfigFile(file) {
  const ext = file.slice(file.lastIndexOf("."));
  if (ext === ".json") {
    return JSON.parse(readFileSync3(file, "utf-8"));
  }
  try {
    const mod = await import(file);
    const cfg = mod.default ?? mod;
    return cfg;
  } catch (err) {
    if (ext === ".ts" && err.message.includes("Unknown file extension")) {
      throw new Error(
        `TypeScript configs require Node >= 22.18 (native type stripping).
You are on Node ${process.version}. Use a .js, .mjs or .json config instead,
or upgrade Node (https://nodejs.org).`
      );
    }
    throw err;
  }
}
async function resolveConfig(explicitPath, startDir) {
  const file = explicitPath ? isAbsolute2(explicitPath) ? explicitPath : resolve3(startDir ?? process.cwd(), explicitPath) : findConfigFile(startDir);
  if (!file) return { config: {}, file: null };
  if (!existsSync3(file)) {
    throw new Error(`Config file not found: ${file}`);
  }
  const config = await loadConfigFile(file);
  return { config, file };
}

// src/watch.ts
import { readdirSync, statSync as statSync3, watch } from "fs";
import { dirname as dirname3, join as join3, resolve as resolve4 } from "path";
function createWatcher(paths, onChange) {
  const dirs = /* @__PURE__ */ new Set();
  for (const p of paths) {
    try {
      const abs = resolve4(p);
      if (statSync3(abs).isDirectory()) dirs.add(abs);
      else dirs.add(dirname3(abs));
    } catch {
    }
  }
  if (dirs.size === 0) {
    return { close() {
    } };
  }
  const closed = { value: false };
  let timer;
  const watchers = [];
  let usePolling = false;
  for (const dir of dirs) {
    try {
      const w = watch(dir, { recursive: true }, () => {
        if (closed.value) return;
        onChange();
      });
      watchers.push(w);
    } catch {
      usePolling = true;
    }
  }
  if (usePolling) {
    const snapshot = () => {
      const map = /* @__PURE__ */ new Map();
      const walk = (dir) => {
        let entries = [];
        try {
          entries = readdirSync(dir);
        } catch {
          return;
        }
        for (const name of entries) {
          const full = join3(dir, name);
          let st;
          try {
            st = statSync3(full);
          } catch {
            continue;
          }
          if (st.isDirectory()) {
            if (name !== "node_modules" && name !== ".git" && name !== "dist") walk(full);
          } else {
            map.set(full, st.mtimeMs);
          }
        }
      };
      for (const dir of dirs) walk(dir);
      return map;
    };
    let last = snapshot();
    timer = setInterval(() => {
      if (closed.value) return;
      const current = snapshot();
      if (current.size !== last.size) {
        onChange();
        last = current;
        return;
      }
      for (const [file, mtime] of current) {
        if (mtime !== last.get(file)) {
          onChange();
          last = current;
          return;
        }
      }
    }, 400);
    if (typeof timer.unref === "function") timer.unref();
  }
  return {
    close() {
      closed.value = true;
      if (timer) clearInterval(timer);
      for (const w of watchers) w.close();
    }
  };
}
export {
  collectWatchPaths,
  createWatcher,
  findConfigFile,
  loadConfigFile,
  resolveConfig,
  resolveContent,
  runBuild,
  summarize,
  version
};
//# sourceMappingURL=index.js.map