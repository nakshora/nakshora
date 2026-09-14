// src/build.ts
import { existsSync as existsSync2, mkdirSync, readFileSync as readFileSync2, statSync as statSync2, writeFileSync } from "fs";
import { basename, dirname, isAbsolute, join, resolve as resolve2 } from "path";

// ../core/dist/index.js
var defaultColors = {
  inherit: "inherit",
  current: "currentColor",
  transparent: "transparent",
  black: "#000",
  white: "#fff",
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
    800: "#9f1239",
    900: "#881337",
    950: "#4c0519"
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
  responsive: true,
  maxResponsive: true,
  containerQueries: true,
  arbitraryVariants: true
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
var HEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
var SHORT_HEX = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
var VALUE = `(?:\\d+|\\d*\\.\\d+)%?`;
var SEP = `(?:\\s*,\\s*|\\s+)`;
var ALPHA_SEP = `\\s*[,/]\\s*`;
var CUSTOM_PROPERTY = `var\\(--(?:[^ )]*?)(?:,(?:[^ )]*?|var\\(--[^ )]*?\\)))?\\)`;
var RGB = new RegExp(
  `^(rgba?)\\(\\s*(${VALUE}|${CUSTOM_PROPERTY})(?:${SEP}(${VALUE}|${CUSTOM_PROPERTY}))?(?:${SEP}(${VALUE}|${CUSTOM_PROPERTY}))?(?:${ALPHA_SEP}(${VALUE}|${CUSTOM_PROPERTY}))?\\s*\\)$`
);
var HSL = new RegExp(
  `^(hsla?)\\(\\s*((?:${VALUE})(?:deg|rad|grad|turn)?|${CUSTOM_PROPERTY})(?:${SEP}(${VALUE}|${CUSTOM_PROPERTY}))?(?:${SEP}(${VALUE}|${CUSTOM_PROPERTY}))?(?:${ALPHA_SEP}(${VALUE}|${CUSTOM_PROPERTY}))?\\s*\\)$`
);
var NAMED_COLORS = {
  black: [0, 0, 0],
  white: [255, 255, 255],
  red: [255, 0, 0],
  green: [0, 128, 0],
  blue: [0, 0, 255],
  yellow: [255, 255, 0],
  cyan: [0, 255, 255],
  magenta: [255, 0, 255],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  silver: [192, 192, 192],
  maroon: [128, 0, 0],
  olive: [128, 128, 0],
  lime: [0, 255, 0],
  aqua: [0, 255, 255],
  teal: [0, 128, 128],
  navy: [0, 0, 128],
  fuchsia: [255, 0, 255],
  purple: [128, 0, 128],
  orange: [255, 165, 0],
  hotpink: [255, 105, 180],
  rebeccapurple: [102, 51, 153],
  tomato: [255, 99, 71],
  gold: [255, 215, 0],
  coral: [255, 127, 80],
  salmon: [250, 128, 114],
  crimson: [220, 20, 60],
  indigo: [75, 0, 130],
  violet: [238, 130, 238],
  pink: [255, 192, 203],
  brown: [165, 42, 42],
  tan: [210, 180, 140],
  khaki: [240, 230, 140],
  turquoise: [64, 224, 208],
  skyblue: [135, 206, 235],
  steelblue: [70, 130, 180],
  slategray: [112, 128, 144],
  darkgray: [169, 169, 169],
  lightgray: [211, 211, 211],
  whitesmoke: [245, 245, 245],
  ivory: [255, 255, 240],
  beige: [245, 245, 220],
  wheat: [245, 222, 179],
  chocolate: [210, 105, 30],
  firebrick: [178, 34, 34],
  darkred: [139, 0, 0],
  darkgreen: [0, 100, 0],
  darkblue: [0, 0, 139],
  royalblue: [65, 105, 225],
  dodgerblue: [30, 144, 255],
  deepskyblue: [0, 191, 255],
  limegreen: [50, 205, 50],
  forestgreen: [34, 139, 34],
  seagreen: [46, 139, 87],
  springgreen: [0, 255, 127],
  orangered: [255, 69, 0],
  darkorange: [255, 140, 0],
  plum: [221, 160, 221],
  orchid: [218, 112, 214],
  lavender: [230, 230, 250],
  mintcream: [245, 255, 250],
  azure: [240, 255, 255],
  aliceblue: [240, 248, 255],
  honeydew: [240, 255, 240],
  linen: [250, 240, 230],
  snow: [255, 250, 250],
  seashell: [255, 245, 238],
  transparent: [0, 0, 0]
};
function parseColor(value, { loose = false } = {}) {
  if (typeof value !== "string") return null;
  value = value.trim();
  if (value === "transparent") return { mode: "rgb", color: ["0", "0", "0"], alpha: "0" };
  const named = NAMED_COLORS[value.toLowerCase()];
  if (named && value !== "transparent") return { mode: "rgb", color: named.map(String) };
  const hex = value.replace(SHORT_HEX, (_, r, g, b, a) => ["#", r, r, g, g, b, b, a ? a + a : ""].join("")).match(HEX);
  if (hex !== null) {
    return {
      mode: "rgb",
      color: [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)].map(String),
      alpha: hex[4] ? (parseInt(hex[4], 16) / 255).toString() : void 0
    };
  }
  const match = value.match(RGB) ?? value.match(HSL);
  if (match === null) return null;
  const color = [match[2], match[3], match[4]].filter(Boolean).map(String);
  if (color.length === 2 && color[0].startsWith("var(")) {
    return { mode: match[1], color: [color[0]], alpha: color[1] };
  }
  if (!loose && color.length !== 3) return null;
  if (color.length < 3 && !color.some((p) => /^var\(.*?\)$/.test(p))) return null;
  return { mode: match[1].replace("a", ""), color, alpha: match[5]?.toString() };
}
function formatColor({ mode, color, alpha }) {
  const hasAlpha = alpha !== void 0;
  return `${mode}(${color.join(" ")}${hasAlpha ? ` / ${alpha}` : ""})`;
}
function withAlphaValue(color, alpha, defaultValue) {
  const parsed = parseColor(color, { loose: true });
  if (parsed === null) return defaultValue ?? color;
  return formatColor({ ...parsed, alpha });
}
function withAlphaVariable(color, properties, variable) {
  const props = Array.isArray(properties) ? properties : [properties];
  const parsed = parseColor(color);
  if (parsed === null || parsed.alpha !== void 0) {
    return Object.fromEntries(props.map((p) => [p, color]));
  }
  const value = formatColor({ ...parsed, alpha: `var(${variable}, 1)` });
  return { [variable]: "1", ...Object.fromEntries(props.map((p) => [p, value])) };
}
function escapeClassName(className) {
  const SINGLE_ESCAPE = /[ -,./:-@[\]^`{-~]/;
  let output = "";
  for (let i = 0; i < className.length; i++) {
    const ch = className.charAt(i);
    const code = className.charCodeAt(i);
    if (code < 32 || code > 126) {
      const cp = className.codePointAt(i);
      if (cp > 65535) i++;
      output += `\\${cp.toString(16).toUpperCase()} `;
    } else if (ch === "\\" || SINGLE_ESCAPE.test(ch)) {
      output += `\\${ch}`;
    } else {
      output += ch;
    }
  }
  const first = className.charAt(0);
  if (/^-[-\d]/.test(output)) output = `\\-${output.slice(1)}`;
  else if (/\d/.test(first)) output = `\\3${first} ${output.slice(1)}`;
  output = output.replace(
    /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g,
    (m, bs, esc) => bs && bs.length % 2 ? m : `${bs ?? ""}${esc}`
  );
  return output.replace(/\\,/g, "\\2c ");
}
var MATH_FUNCTIONS = [
  "calc",
  "min",
  "max",
  "clamp",
  "mod",
  "rem",
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "atan2",
  "pow",
  "sqrt",
  "hypot",
  "log",
  "exp",
  "round"
];
var AUTO_VAR_INJECTION_EXCEPTIONS = /* @__PURE__ */ new Set([
  "scroll-timeline-name",
  "timeline-scope",
  "view-timeline-name",
  "font-palette",
  "anchor-name",
  "anchor-scope",
  "position-anchor",
  "position-try-options",
  "scroll-timeline",
  "animation-timeline",
  "view-timeline",
  "position-try"
]);
var CSS_FUNCTIONS = ["min", "max", "clamp", "calc"];
function isCSSFunction(value) {
  return CSS_FUNCTIONS.some((fn) => new RegExp(`^${fn}\\(.*\\)`).test(value));
}
function splitAtTopLevelOnly(input, sep2) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let last = 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "(" || ch === "[" || ch === "{") depth++;
    else if (ch === ")" || ch === "]" || ch === "}") depth--;
    else if (depth === 0 && input.startsWith(sep2, i)) {
      parts.push(input.slice(last, i));
      i += sep2.length - 1;
      last = i + 1;
    }
  }
  parts.push(input.slice(last));
  return parts;
}
function addWhitespaceAroundMathOperators(input) {
  if (!MATH_FUNCTIONS.some((fn) => input.includes(fn))) return input;
  let result = "";
  const formattable = [];
  let valuePos = null;
  let lastValuePos = null;
  const isDigit = (c) => c >= 48 && c <= 57;
  const isLower = (c) => c >= 97 && c <= 122;
  const isUpper = (c) => c >= 65 && c <= 90;
  const isOp = (c) => c === 43 || c === 42 || c === 47 || c === 45;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    if (isDigit(char)) valuePos = i;
    else if (valuePos !== null && (char === 37 || isLower(char) || isUpper(char))) valuePos = i;
    else {
      lastValuePos = valuePos;
      valuePos = null;
    }
    if (char === 40) {
      result += input[i];
      let start = i;
      for (let j = i - 1; j >= 0; j--) {
        const inner = input.charCodeAt(j);
        if (isDigit(inner) || isLower(inner)) start = j;
        else break;
      }
      const fn = input.slice(start, i);
      if (MATH_FUNCTIONS.includes(fn)) {
        formattable.unshift(true);
        continue;
      } else if (formattable[0] && fn === "") {
        formattable.unshift(true);
        continue;
      }
      formattable.unshift(false);
      continue;
    } else if (char === 41) {
      result += input[i];
      formattable.shift();
    } else if (char === 44 && formattable[0]) {
      result += ", ";
      continue;
    } else if (char === 32 && formattable[0] && result.charCodeAt(result.length - 1) === 32) {
      continue;
    } else if (isOp(char) && formattable[0]) {
      const trimmed = result.trimEnd();
      const prev = trimmed.charCodeAt(trimmed.length - 1);
      const prevPrev = trimmed.charCodeAt(trimmed.length - 2);
      const next = input.charCodeAt(i + 1);
      if ((prev === 101 || prev === 69) && isDigit(prevPrev)) {
        result += input[i];
        continue;
      } else if (isOp(prev)) {
        result += input[i];
        continue;
      } else if (prev === 40 || prev === 44) {
        result += input[i];
        continue;
      } else if (input.charCodeAt(i - 1) === 32) {
        result += `${input[i]} `;
      } else if (isDigit(prev) || isDigit(next) || prev === 41 || next === 40 || isOp(next) || lastValuePos !== null && lastValuePos === i - 1) {
        result += ` ${input[i]} `;
      } else {
        result += input[i];
      }
    } else {
      result += input[i];
    }
  }
  return result;
}
function normalizeValue(value, context, isRoot = true) {
  const isVarException = context?.property !== void 0 && AUTO_VAR_INJECTION_EXCEPTIONS.has(context.property);
  if (value.startsWith("--") && !isVarException) return `var(${value})`;
  if (value.includes("url(")) {
    return value.split(/(url\(.*?\))/g).filter(Boolean).map((part) => /^url\(.*?\)$/.test(part) ? part : normalizeValue(part, context, false)).join("");
  }
  value = value.replace(/([^\\])_+/g, (full, before) => before + " ".repeat(full.length - 1)).replace(/^_/g, " ").replace(/\\_/g, "_");
  if (isRoot) value = value.trim();
  return addWhitespaceAroundMathOperators(value);
}
function normalizeAttributeSelectors(value) {
  if (!value.includes("=")) return value;
  return value.replace(/(=.*)/g, (_full, match) => {
    if (match[1] === "'" || match[1] === '"') return match;
    if (match.length > 2) {
      const trailing = match[match.length - 1];
      if (match[match.length - 2] === " " && /^[isIS]$/.test(trailing)) {
        return `="${match.slice(1, -2)}" ${trailing}`;
      }
    }
    return `="${match.slice(1)}"`;
  });
}
var LENGTH_UNITS = [
  "cm",
  "mm",
  "Q",
  "in",
  "pc",
  "pt",
  "px",
  "em",
  "ex",
  "ch",
  "rem",
  "lh",
  "rlh",
  "vw",
  "vh",
  "vmin",
  "vmax",
  "vb",
  "vi",
  "svw",
  "svh",
  "lvw",
  "lvh",
  "dvw",
  "dvh",
  "cqw",
  "cqh",
  "cqi",
  "cqb",
  "cqmin",
  "cqmax"
];
var LENGTH_RE = new RegExp(
  `^[+-]?[0-9]*\\.?[0-9]+(?:[eE][+-]?[0-9]+)?(?:${LENGTH_UNITS.join("|")})$`
);
var typeCheckers = {
  any: () => true,
  url: (v) => v.startsWith("url("),
  number: (v) => !isNaN(Number(v)) || isCSSFunction(v),
  integer: (v) => /^-?\d+$/.test(v),
  percentage: (v) => v.endsWith("%") && !isNaN(Number(v.slice(0, -1))) || isCSSFunction(v),
  length: (v) => v === "0" || LENGTH_RE.test(v) || isCSSFunction(v),
  "line-width": (v) => ["thin", "medium", "thick"].includes(v),
  shadow: (v) => {
    const SHADOW_KEYWORDS2 = /* @__PURE__ */ new Set(["inset", "inherit", "initial", "revert", "unset"]);
    return splitAtTopLevelOnly(normalizeValue(v), ",").every((shadow) => {
      const parts = shadow.trim().split(/ +(?![^(]*\))/g);
      let lengths = 0;
      let seenKeyword = false;
      for (const part of parts) {
        if (!seenKeyword && SHADOW_KEYWORDS2.has(part)) seenKeyword = true;
        else if (/^-?(\d+|\.\d+)(.*?)$/.test(part)) lengths++;
      }
      return lengths >= 2;
    });
  },
  color: (v) => {
    let colors = 0;
    const ok = splitAtTopLevelOnly(v, "_").every((part) => {
      part = normalizeValue(part);
      if (part.startsWith("var(")) return true;
      if (parseColor(part, { loose: true }) !== null) return colors++, true;
      return false;
    });
    return ok && colors > 0;
  },
  image: (v) => {
    let images = 0;
    const ok = splitAtTopLevelOnly(v, ",").every((part) => {
      part = normalizeValue(part);
      if (part.startsWith("var(")) return true;
      if (part.startsWith("url(") || typeCheckers.gradient(part) || ["element(", "image(", "cross-fade(", "image-set("].some((fn) => part.startsWith(fn))) {
        images++;
        return true;
      }
      return false;
    });
    return ok && images > 0;
  },
  gradient: (v) => {
    v = normalizeValue(v);
    return [
      "conic-gradient",
      "linear-gradient",
      "radial-gradient",
      "repeating-conic-gradient",
      "repeating-linear-gradient",
      "repeating-radial-gradient"
    ].some((t) => v.startsWith(`${t}(`));
  },
  position: (v) => {
    let positions = 0;
    const ok = splitAtTopLevelOnly(v, "_").every((part) => {
      part = normalizeValue(part);
      if (part.startsWith("var(")) return true;
      if (["center", "top", "right", "bottom", "left"].includes(part) || typeCheckers.length(part) || typeCheckers.percentage(part)) {
        positions++;
        return true;
      }
      return false;
    });
    return ok && positions > 0;
  },
  "family-name": (v) => {
    let fonts = 0;
    const ok = splitAtTopLevelOnly(v, ",").every((part) => {
      part = normalizeValue(part);
      if (part.startsWith("var(")) return true;
      if (part.includes(" ") && !/(['"])([^"']+)\1/g.test(part)) return false;
      if (/^\d/g.test(part)) return false;
      fonts++;
      return true;
    });
    return ok && fonts > 0;
  },
  "generic-name": (v) => [
    "serif",
    "sans-serif",
    "monospace",
    "cursive",
    "fantasy",
    "system-ui",
    "ui-serif",
    "ui-sans-serif",
    "ui-monospace",
    "ui-rounded",
    "math",
    "emoji",
    "fangsong"
  ].includes(v),
  "absolute-size": (v) => [
    "xx-small",
    "x-small",
    "small",
    "medium",
    "large",
    "x-large",
    "xx-large",
    "xxx-large"
  ].includes(v),
  "relative-size": (v) => ["larger", "smaller"].includes(v),
  size: (v) => typeCheckers["bg-size"](v),
  "bg-size": (v) => {
    const parts = splitAtTopLevelOnly(normalizeValue(v), ",");
    return parts.every(
      (p) => splitAtTopLevelOnly(p.trim(), " ").every(
        (s) => ["auto", "cover", "contain"].includes(s) || typeCheckers.length(s) || typeCheckers.percentage(s)
      )
    );
  },
  angle: (v) => /^[+-]?[0-9]*\.?[0-9]+(deg|rad|grad|turn)$/.test(v) || v === "0" || isCSSFunction(v),
  time: (v) => /^[+-]?[0-9]*\.?[0-9]+(ms|s)$/.test(v) || isCSSFunction(v),
  lookup: () => false
};
var TYPE_HINTS = /* @__PURE__ */ new Set([
  "color",
  "url",
  "image",
  "length",
  "percentage",
  "position",
  "family-name",
  "generic-name",
  "number",
  "line-width",
  "absolute-size",
  "relative-size",
  "shadow",
  "size",
  "angle",
  "time",
  "integer",
  "any"
]);
function splitTypeHint(raw) {
  const m = /^([a-z-]+):(.+)$/s.exec(raw);
  if (m && TYPE_HINTS.has(m[1])) return { hint: m[1], value: m[2] };
  return { value: raw };
}
function coerceValue(raw, types, context) {
  const { hint, value } = splitTypeHint(raw);
  if (hint) {
    if (!types.includes(hint) && !(hint === "any")) return null;
    return { type: hint, value: normalizeValue(value, context) };
  }
  const normalized = normalizeValue(value, context);
  for (const type of types) {
    const check = typeCheckers[type];
    if (check && check(value)) return { type, value: normalized };
  }
  return null;
}
function negateValue(value) {
  if (typeof value !== "string") return null;
  value = value.trim();
  if (value === "-") return null;
  if (/^-?[0-9]*\.?[0-9]+(?:[eE][+-]?[0-9]+)?[a-zA-Z%]*$/.test(value)) {
    const v = value;
    if (/^0+(\.0+)?$/.test(v)) return v;
    if (v.startsWith("-")) return v.slice(1);
    return `-${v}`;
  }
  if (/^(calc|min|max|clamp|var)\(/.test(value)) return `calc(${value} * -1)`;
  return null;
}
var SPECIALS = /([[\]'"`])([^[\]'"`])?/g;
var ALLOWED_CLASS_CHARACTERS = /[^"'`\s<>\]]+/;
function any(sources) {
  return `(?:${sources.map(toSource).join("|")})`;
}
function optional(source) {
  return `(?:${toSource(source)})?`;
}
function pattern(source) {
  return new RegExp(toSource(source), "g");
}
function toSource(source) {
  const list = Array.isArray(source) ? source : [source];
  return list.map((s) => s instanceof RegExp ? s.source : s).join("");
}
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function* buildRegExps(prefix, separator) {
  const prefixPattern = prefix !== "" ? optional(pattern([/-?/, escapeRegex(prefix)])) : "";
  const utility = any([
    // Arbitrary properties (without square brackets)
    /\[[^\s:'"`]+:[^\s\[\]]+\]/,
    // Arbitrary properties with balanced square brackets
    /\[[^\s:'"`\]]+:[^\s]+?\[[^\s]+\][^\s]+?\]/,
    // Utilities
    pattern([
      // Utility Name / Group Name
      any([/-?(?:\w+)/, /@(?:\w+)/]),
      // Normal/Arbitrary values
      optional(
        any([
          pattern([
            // Arbitrary values
            any([
              /-(?:\w+-)*\['[^\s]+'\]/,
              /-(?:\w+-)*\["[^\s]+"\]/,
              /-(?:\w+-)*\[`[^\s]+`\]/,
              /-(?:\w+-)*\[(?:[^\s\[\]]+\[[^\s\[\]]+\])*[^\s:\[\]]+\]/
            ]),
            // Not immediately followed by an `{[(`
            /(?![{([]])/,
            // optionally followed by an opacity modifier
            /(?:\/[^\s'"`\\><$]*)?/
          ]),
          pattern([
            // Arbitrary values
            any([
              /-(?:\w+-)*\['[^\s]+'\]/,
              /-(?:\w+-)*\["[^\s]+"\]/,
              /-(?:\w+-)*\[`[^\s]+`\]/,
              /-(?:\w+-)*\[(?:[^\s\[\]]+\[[^\s\[\]]+\])*[^\s\[\]]+\]/
            ]),
            // Not immediately followed by an `{[(`
            /(?![{([]])/,
            // optionally followed by an opacity modifier
            /(?:\/[^\s'"`\\$]*)?/
          ]),
          // Normal values w/o quotes — may include an opacity modifier
          /[-\/][^\s'"`\\$={><]*/
        ])
      )
    ])
  ]);
  const variantPatterns = [
    // Without quotes
    any([
      // This is here to provide special support for the `@` variant
      pattern([/@\[[^\s"'`]+\](\/[^\s"'`]+)?/, separator]),
      // With variant modifier (e.g.: group-[..]/modifier)
      pattern([/([^\s"'`\[\\]+-)?\[[^\s"'`]+\]\/[\w_-]+/, separator]),
      pattern([/([^\s"'`\[\\]+-)?\[[^\s"'`]+\]/, separator]),
      pattern([/[^\s"'`\[\\]+/, separator])
    ]),
    // With quotes allowed
    any([
      // With variant modifier (e.g.: group-[..]/modifier)
      pattern([/([^\s"'`\[\\]+-)?\[[^\s`]+\]\/[\w_-]+/, separator]),
      pattern([/([^\s"'`\[\\]+-)?\[[^\s`]+\]/, separator]),
      pattern([/[^\s`\[\\]+/, separator])
    ])
  ];
  for (const variantPattern of variantPatterns) {
    yield pattern([
      // Variants
      "((?=((",
      variantPattern,
      ")+))\\2)?",
      // Important (optional)
      /!?/,
      prefixPattern,
      utility
    ]);
  }
  yield /[^<>"'`\s.(){}[\]#=%$][^<>"'`\s(){}[\]#=%$]*[^<>"'`\s.(){}[\]#=%:$]/g;
}
function clipAtBalancedParens(input) {
  if (!input.includes("-[")) return input;
  let depth = 0;
  const openStringTypes = [];
  const matches = Array.from(input.matchAll(SPECIALS)).flatMap((match) => {
    const [, ...groups] = match;
    return groups.map((group, idx) => ({ char: group, index: (match.index ?? 0) + idx }));
  });
  for (const match of matches) {
    const char = match.char;
    const inStringType = openStringTypes[openStringTypes.length - 1];
    if (char === inStringType) openStringTypes.pop();
    else if (char === "'" || char === '"' || char === "`") openStringTypes.push(char);
    if (inStringType) continue;
    if (char === "[") {
      depth++;
      continue;
    }
    if (char === "]") {
      depth--;
      continue;
    }
    if (depth < 0) return input.substring(0, match.index - 1);
    if (depth === 0 && char !== void 0 && !ALLOWED_CLASS_CHARACTERS.test(char)) {
      return input.substring(0, match.index);
    }
  }
  return input;
}
function splitAtTopLevelDot(input) {
  const parts = [];
  let depth = 0;
  let last = 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === "[" || ch === "(") depth++;
    else if (ch === "]" || ch === ")") depth--;
    else if (ch === "." && depth === 0) {
      parts.push(input.slice(last, i));
      last = i + 1;
    }
  }
  parts.push(input.slice(last));
  return parts;
}
var cache = /* @__PURE__ */ new Map();
function createExtractor(options = {}) {
  const prefix = options.prefix ?? "";
  const separator = options.separator ?? ":";
  const key = `${prefix}\0${separator}`;
  let patterns = cache.get(key);
  if (!patterns) {
    patterns = Array.from(buildRegExps(prefix, escapeRegex(separator)));
    cache.set(key, patterns);
  }
  const compiled = patterns;
  return (content) => {
    const results = [];
    for (const p of compiled) {
      for (const result of content.match(p) ?? []) results.push(clipAtBalancedParens(result));
    }
    for (const result of results.slice()) {
      const segments = splitAtTopLevelDot(result);
      for (let idx = 0; idx < segments.length; idx++) {
        const segment = segments[idx];
        if (idx >= segments.length - 1) {
          results.push(segment);
          continue;
        }
        const next = Number(segments[idx + 1]);
        if (Number.isNaN(next)) results.push(segment);
        else idx++;
      }
    }
    return results;
  };
}
function extractCandidates(chunks, options = {}) {
  const out = /* @__PURE__ */ new Set();
  if (options.pattern) {
    const regex = new RegExp(options.pattern, "g");
    for (const chunk of chunks)
      for (const m of chunk.matchAll(regex)) if (m[0].length > 1) out.add(m[0]);
    return out;
  }
  const extract = createExtractor(options);
  for (const chunk of chunks) {
    if (!chunk) continue;
    for (const token of extract(chunk)) {
      if (token.length < 2 || token.length > 256) continue;
      const unescaped = token.includes("\\") ? token.replace(/\\([:./[\]#!])/g, "$1") : token;
      out.add(unescaped);
    }
  }
  return out;
}
function parseCss(css) {
  const root = { type: "root", nodes: [] };
  const stack = [root];
  let i = 0;
  const n = css.length;
  const top = () => stack[stack.length - 1].nodes;
  const readUntil = (stops) => {
    let depth = 0;
    let quote = null;
    const start = i;
    while (i < n) {
      const ch = css[i];
      if (quote) {
        if (ch === "\\") i++;
        else if (ch === quote) quote = null;
      } else if (ch === "\\")
        i++;
      else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === "(" || ch === "[") depth++;
      else if (ch === ")" || ch === "]") depth = Math.max(0, depth - 1);
      else if (ch === "/" && css[i + 1] === "*") {
        const end = css.indexOf("*/", i + 2);
        i = end === -1 ? n : end + 1;
      } else if (depth === 0 && stops.includes(ch)) break;
      i++;
    }
    return css.slice(start, i);
  };
  while (i < n) {
    const ch = css[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      const text2 = css.slice(i + 2, end === -1 ? n : end);
      top().push({ type: "comment", text: text2 });
      i = end === -1 ? n : end + 2;
      continue;
    }
    if (ch === "}") {
      if (stack.length > 1) stack.pop();
      i++;
      continue;
    }
    if (ch === ";") {
      i++;
      continue;
    }
    if (ch === "@") {
      const head2 = readUntil("{;}").trim();
      const m = /^@([\w-]+)\s*([\s\S]*)$/.exec(head2);
      const name = m ? m[1] : head2.slice(1);
      const params = m ? m[2].trim() : "";
      if (css[i] === "{") {
        const node = { type: "atrule", name, params, nodes: [] };
        top().push(node);
        stack.push(node);
        i++;
      } else {
        top().push({ type: "atrule", name, params });
        if (css[i] === ";") i++;
      }
      continue;
    }
    const head = readUntil("{;}");
    if (css[i] === "{") {
      const node = { type: "rule", selector: head.trim(), nodes: [] };
      top().push(node);
      stack.push(node);
      i++;
      continue;
    }
    const text = head.trim();
    if (text) {
      const colon = text.indexOf(":");
      if (colon > 0) {
        const prop = text.slice(0, colon).trim();
        let value = text.slice(colon + 1).trim();
        let important = false;
        if (/!\s*important$/i.test(value)) {
          important = true;
          value = value.replace(/\s*!\s*important$/i, "").trim();
        }
        top().push({ type: "decl", prop, value, important });
      }
    }
    if (css[i] === ";") i++;
  }
  return root;
}
function serializeCss(root, options = {}) {
  const nodes = Array.isArray(root) ? root : root.nodes;
  const minify = options.minify ?? false;
  const out = [];
  const emit = (list, depth) => {
    const pad = minify ? "" : "  ".repeat(depth);
    for (const node of list) {
      if (node.type === "comment") {
        if (!minify || node.text.startsWith("!"))
          out.push(`${pad}/*${node.text}*/${minify ? "" : "\n"}`);
        continue;
      }
      if (node.type === "decl") {
        out.push(
          `${pad}${node.prop}:${minify ? "" : " "}${node.value}${node.important ? minify ? "!important" : " !important" : ""};${minify ? "" : "\n"}`
        );
        continue;
      }
      if (node.type === "atrule") {
        if (node.nodes === void 0) {
          out.push(
            `${pad}@${node.name}${node.params ? ` ${node.params}` : ""};${minify ? "" : "\n"}`
          );
          continue;
        }
        const head = `@${node.name}${node.params ? ` ${node.params}` : ""}`;
        const onlyDecls2 = node.nodes.every((c) => c.type === "decl");
        if (onlyDecls2 && !minify) {
          out.push(
            `${pad}${head} { ${node.nodes.map((d) => declText(d)).join(" ")} }
`
          );
          continue;
        }
        out.push(`${pad}${head}${minify ? "{" : " {\n"}`);
        emit(node.nodes, depth + 1);
        out.push(`${pad}}${minify ? "" : "\n"}`);
        continue;
      }
      const onlyDecls = node.nodes.every((c) => c.type === "decl");
      if (minify) {
        const sel = compactSelector(node.selector);
        if (onlyDecls) {
          out.push(`${sel}{${node.nodes.map((d) => declText(d, true)).join("")}}`);
        } else {
          out.push(`${sel}{`);
          emit(node.nodes, depth + 1);
          out.push("}");
        }
        continue;
      }
      if (onlyDecls) {
        out.push(
          `${pad}${node.selector} { ${node.nodes.map((d) => declText(d)).join(" ")} }
`
        );
      } else {
        out.push(`${pad}${node.selector} {
`);
        emit(node.nodes, depth + 1);
        out.push(`${pad}}
`);
      }
    }
  };
  emit(nodes, 0);
  return out.join("");
}
function compactSelector(selector) {
  let out = "";
  let depth = 0;
  let quote = null;
  for (let i = 0; i < selector.length; i++) {
    const ch = selector[i];
    if (quote) {
      out += ch;
      if (ch === "\\") out += selector[++i] ?? "";
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "\\") {
      out += ch + (selector[++i] ?? "");
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;
    if (depth === 0 && (ch === ">" || ch === "+" || ch === "~" || ch === ",")) {
      out = out.trimEnd() + ch;
      while (selector[i + 1] === " ") i++;
      continue;
    }
    out += ch;
  }
  return out;
}
function declText(d, minify = false) {
  return `${d.prop}:${minify ? "" : " "}${d.value}${d.important ? minify ? "!important" : " !important" : ""};`;
}
function minifyCssSafe(css) {
  return serializeCss(parseCss(css), { minify: true });
}
function* walkRules(nodes, ancestors = []) {
  for (const node of nodes) {
    if (node.type === "rule") {
      yield { rule: node, ancestors };
      yield* walkRules(node.nodes, ancestors);
    } else if (node.type === "atrule" && node.nodes) {
      yield* walkRules(node.nodes, [...ancestors, node]);
    }
  }
}
function kebabProp(prop) {
  if (prop.startsWith("--")) return prop;
  return prop.replace(/^(Webkit|Moz|Ms|O)(?=[A-Z])/, (m) => `-${m.toLowerCase()}`).replace(/([a-z\d])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();
}
var UNITLESS = /* @__PURE__ */ new Set([
  "box-flex",
  "box-flex-group",
  "column-count",
  "flex",
  "flex-grow",
  "flex-positive",
  "flex-shrink",
  "flex-negative",
  "font-weight",
  "line-clamp",
  "line-height",
  "opacity",
  "order",
  "orphans",
  "tab-size",
  "widows",
  "z-index",
  "zoom",
  "fill-opacity",
  "stroke-dashoffset",
  "stroke-opacity",
  "stroke-width"
]);
function numberToCss(prop, value) {
  if (value === 0 || prop.startsWith("--") || UNITLESS.has(prop)) return String(value);
  return `${value}px`;
}
function cssInJsToNodes(input, parentSelector) {
  const out = [];
  const list = Array.isArray(input) ? input : [input];
  for (const obj of list) {
    if (!obj || typeof obj !== "object") continue;
    let run = [];
    const flush = () => {
      if (run.length === 0) return;
      if (parentSelector === void 0) out.push(...run);
      else out.push({ type: "rule", selector: parentSelector, nodes: run });
      run = [];
    };
    for (const [key, value] of Object.entries(obj)) {
      if (value === void 0 || value === null) continue;
      if (typeof value === "string" || typeof value === "number") {
        const prop = kebabProp(key);
        let v = typeof value === "number" ? numberToCss(prop, value) : value;
        let important = false;
        if (/!important$/i.test(v)) {
          important = true;
          v = v.replace(/\s*!important$/i, "");
        }
        run.push({ type: "decl", prop, value: v, important });
        continue;
      }
      if (Array.isArray(value) && value.every((v) => typeof v === "string" || typeof v === "number")) {
        const prop = kebabProp(key);
        for (const v of value)
          run.push({
            type: "decl",
            prop,
            value: typeof v === "number" ? numberToCss(prop, v) : String(v)
          });
        continue;
      }
      flush();
      if (key.startsWith("@")) {
        const m = /^@([\w-]+)\s*([\s\S]*)$/.exec(key.trim());
        const name = m ? m[1] : key.slice(1);
        const params = m ? m[2].trim() : "";
        const inner2 = cssInJsToNodes(value, parentSelector);
        out.push({ type: "atrule", name, params, nodes: inner2 });
        continue;
      }
      const selectors = splitSelectorList(key);
      const resolved = selectors.map((sel) => {
        if (parentSelector === void 0) return sel;
        const parents = splitSelectorList(parentSelector);
        if (sel.includes("&")) return parents.map((p) => sel.replace(/&/g, p)).join(", ");
        return parents.map((p) => `${p} ${sel}`).join(", ");
      }).join(", ");
      const inner = cssInJsToNodes(value, resolved);
      if (inner.length === 0) out.push({ type: "rule", selector: resolved, nodes: [] });
      else out.push(...inner);
    }
    flush();
  }
  return out;
}
function collapseAdjacentRules(nodes) {
  const out = [];
  const ws = (s) => s.replace(/\s+/g, " ");
  for (const node of nodes) {
    const prev = out[out.length - 1];
    if (prev && node.type === "rule" && prev.type === "rule" && ws(prev.selector) === ws(node.selector)) {
      prev.nodes.push(...node.nodes);
      continue;
    }
    if (prev && node.type === "atrule" && prev.type === "atrule" && node.name !== "font-face" && prev.name === node.name && ws(prev.params) === ws(node.params) && prev.nodes && node.nodes) {
      prev.nodes.push(...node.nodes);
      continue;
    }
    out.push(node.type === "atrule" && node.nodes ? { ...node, nodes: [...node.nodes] } : node);
  }
  for (const node of out)
    if (node.type === "atrule" && node.nodes) node.nodes = collapseAdjacentRules(node.nodes);
  return out;
}
function splitSelectorList(selector) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let cur = "";
  for (let i = 0; i < selector.length; i++) {
    const ch = selector[i];
    if (quote) {
      cur += ch;
      if (ch === "\\" && i + 1 < selector.length) cur += selector[++i];
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;
    else if (ch === "," && depth === 0) {
      parts.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}
function flattenNodes(nodes) {
  const out = [];
  for (const node of nodes) {
    if (node.type === "rule") {
      const decls = node.nodes.filter((n) => n.type === "decl" || n.type === "comment");
      const nested = node.nodes.filter((n) => n.type !== "decl" && n.type !== "comment");
      if (decls.length || nested.length === 0)
        out.push({ type: "rule", selector: node.selector, nodes: decls });
      for (const child of nested) {
        if (child.type === "rule") {
          const sel = child.selector.includes("&") ? child.selector.replace(/&/g, node.selector) : `${node.selector} ${child.selector}`;
          out.push(...flattenNodes([{ type: "rule", selector: sel, nodes: child.nodes }]));
        } else if (child.type === "atrule" && child.nodes) {
          out.push({
            type: "atrule",
            name: child.name,
            params: child.params,
            nodes: flattenNodes([{ type: "rule", selector: node.selector, nodes: child.nodes }])
          });
        }
      }
    } else if (node.type === "atrule" && node.nodes) {
      out.push({
        type: "atrule",
        name: node.name,
        params: node.params,
        nodes: flattenNodes(node.nodes)
      });
    } else out.push(node);
  }
  return out;
}
function escapeClass(className) {
  return escapeClassName(className);
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
function extractClasses(content, pattern2) {
  return extractCandidates(content, { pattern: pattern2 });
}
function minifyCss(css) {
  return minifyCssSafe(css);
}
var encoder = typeof TextEncoder !== "undefined" ? new TextEncoder() : void 0;
function byteLength(str) {
  if (encoder) return encoder.encode(str).length;
  let bytes = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c < 128) bytes += 1;
    else if (c < 2048) bytes += 2;
    else if (c >= 55296 && c <= 56319) {
      bytes += 4;
      i++;
    } else bytes += 3;
  }
  return bytes;
}
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
var tailwindDefaults = {
  animation: {
    none: "none",
    spin: "spin 1s linear infinite",
    ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
    pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    bounce: "bounce 1s infinite"
  },
  aspectRatio: {
    auto: "auto",
    square: "1 / 1",
    video: "16 / 9"
  },
  backgroundImage: {
    none: "none",
    "gradient-to-t": "linear-gradient(to top, var(--tw-gradient-stops))",
    "gradient-to-tr": "linear-gradient(to top right, var(--tw-gradient-stops))",
    "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
    "gradient-to-br": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
    "gradient-to-b": "linear-gradient(to bottom, var(--tw-gradient-stops))",
    "gradient-to-bl": "linear-gradient(to bottom left, var(--tw-gradient-stops))",
    "gradient-to-l": "linear-gradient(to left, var(--tw-gradient-stops))",
    "gradient-to-tl": "linear-gradient(to top left, var(--tw-gradient-stops))"
  },
  backgroundPosition: {
    bottom: "bottom",
    center: "center",
    left: "left",
    "left-bottom": "left bottom",
    "left-top": "left top",
    right: "right",
    "right-bottom": "right bottom",
    "right-top": "right top",
    top: "top"
  },
  backgroundSize: {
    auto: "auto",
    cover: "cover",
    contain: "contain"
  },
  blur: {
    "0": "0",
    none: "",
    sm: "4px",
    DEFAULT: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "40px",
    "3xl": "64px"
  },
  borderRadius: {
    none: "0px",
    sm: "0.125rem",
    DEFAULT: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px"
  },
  borderWidth: {
    "0": "0px",
    "2": "2px",
    "4": "4px",
    "8": "8px",
    DEFAULT: "1px"
  },
  boxShadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    none: "none"
  },
  brightness: {
    "0": "0",
    "50": ".5",
    "75": ".75",
    "90": ".9",
    "95": ".95",
    "100": "1",
    "105": "1.05",
    "110": "1.1",
    "125": "1.25",
    "150": "1.5",
    "200": "2"
  },
  contrast: {
    "0": "0",
    "50": ".5",
    "75": ".75",
    "100": "1",
    "125": "1.25",
    "150": "1.5",
    "200": "2"
  },
  cursor: {
    auto: "auto",
    default: "default",
    pointer: "pointer",
    wait: "wait",
    text: "text",
    move: "move",
    help: "help",
    "not-allowed": "not-allowed",
    none: "none",
    "context-menu": "context-menu",
    progress: "progress",
    cell: "cell",
    crosshair: "crosshair",
    "vertical-text": "vertical-text",
    alias: "alias",
    copy: "copy",
    "no-drop": "no-drop",
    grab: "grab",
    grabbing: "grabbing",
    "all-scroll": "all-scroll",
    "col-resize": "col-resize",
    "row-resize": "row-resize",
    "n-resize": "n-resize",
    "e-resize": "e-resize",
    "s-resize": "s-resize",
    "w-resize": "w-resize",
    "ne-resize": "ne-resize",
    "nw-resize": "nw-resize",
    "se-resize": "se-resize",
    "sw-resize": "sw-resize",
    "ew-resize": "ew-resize",
    "ns-resize": "ns-resize",
    "nesw-resize": "nesw-resize",
    "nwse-resize": "nwse-resize",
    "zoom-in": "zoom-in",
    "zoom-out": "zoom-out"
  },
  dropShadow: {
    sm: "0 1px 1px rgb(0 0 0 / 0.05)",
    DEFAULT: ["0 1px 2px rgb(0 0 0 / 0.1)", "0 1px 1px rgb(0 0 0 / 0.06)"],
    md: ["0 4px 3px rgb(0 0 0 / 0.07)", "0 2px 2px rgb(0 0 0 / 0.06)"],
    lg: ["0 10px 8px rgb(0 0 0 / 0.04)", "0 4px 3px rgb(0 0 0 / 0.1)"],
    xl: ["0 20px 13px rgb(0 0 0 / 0.03)", "0 8px 5px rgb(0 0 0 / 0.08)"],
    "2xl": "0 25px 25px rgb(0 0 0 / 0.15)",
    none: "0 0 #0000"
  },
  flex: {
    "1": "1 1 0%",
    auto: "1 1 auto",
    initial: "0 1 auto",
    none: "none"
  },
  flexGrow: {
    "0": "0",
    DEFAULT: "1"
  },
  flexShrink: {
    "0": "0",
    DEFAULT: "1"
  },
  fontFamily: {
    sans: [
      "ui-sans-serif",
      "system-ui",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"'
    ],
    serif: ["ui-serif", "Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
    mono: [
      "ui-monospace",
      "SFMono-Regular",
      "Menlo",
      "Monaco",
      "Consolas",
      '"Liberation Mono"',
      '"Courier New"',
      "monospace"
    ]
  },
  fontSize: {
    xs: [
      "0.75rem",
      {
        lineHeight: "1rem"
      }
    ],
    sm: [
      "0.875rem",
      {
        lineHeight: "1.25rem"
      }
    ],
    base: [
      "1rem",
      {
        lineHeight: "1.5rem"
      }
    ],
    lg: [
      "1.125rem",
      {
        lineHeight: "1.75rem"
      }
    ],
    xl: [
      "1.25rem",
      {
        lineHeight: "1.75rem"
      }
    ],
    "2xl": [
      "1.5rem",
      {
        lineHeight: "2rem"
      }
    ],
    "3xl": [
      "1.875rem",
      {
        lineHeight: "2.25rem"
      }
    ],
    "4xl": [
      "2.25rem",
      {
        lineHeight: "2.5rem"
      }
    ],
    "5xl": [
      "3rem",
      {
        lineHeight: "1"
      }
    ],
    "6xl": [
      "3.75rem",
      {
        lineHeight: "1"
      }
    ],
    "7xl": [
      "4.5rem",
      {
        lineHeight: "1"
      }
    ],
    "8xl": [
      "6rem",
      {
        lineHeight: "1"
      }
    ],
    "9xl": [
      "8rem",
      {
        lineHeight: "1"
      }
    ]
  },
  fontWeight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900"
  },
  gradientColorStopPositions: {
    "0%": "0%",
    "5%": "5%",
    "10%": "10%",
    "15%": "15%",
    "20%": "20%",
    "25%": "25%",
    "30%": "30%",
    "35%": "35%",
    "40%": "40%",
    "45%": "45%",
    "50%": "50%",
    "55%": "55%",
    "60%": "60%",
    "65%": "65%",
    "70%": "70%",
    "75%": "75%",
    "80%": "80%",
    "85%": "85%",
    "90%": "90%",
    "95%": "95%",
    "100%": "100%"
  },
  grayscale: {
    "0": "0",
    DEFAULT: "100%"
  },
  gridAutoColumns: {
    auto: "auto",
    min: "min-content",
    max: "max-content",
    fr: "minmax(0, 1fr)"
  },
  gridAutoRows: {
    auto: "auto",
    min: "min-content",
    max: "max-content",
    fr: "minmax(0, 1fr)"
  },
  gridColumn: {
    auto: "auto",
    "span-1": "span 1 / span 1",
    "span-2": "span 2 / span 2",
    "span-3": "span 3 / span 3",
    "span-4": "span 4 / span 4",
    "span-5": "span 5 / span 5",
    "span-6": "span 6 / span 6",
    "span-7": "span 7 / span 7",
    "span-8": "span 8 / span 8",
    "span-9": "span 9 / span 9",
    "span-10": "span 10 / span 10",
    "span-11": "span 11 / span 11",
    "span-12": "span 12 / span 12",
    "span-full": "1 / -1"
  },
  gridColumnEnd: {
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "10",
    "11": "11",
    "12": "12",
    "13": "13",
    auto: "auto"
  },
  gridColumnStart: {
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "10",
    "11": "11",
    "12": "12",
    "13": "13",
    auto: "auto"
  },
  gridRow: {
    auto: "auto",
    "span-1": "span 1 / span 1",
    "span-2": "span 2 / span 2",
    "span-3": "span 3 / span 3",
    "span-4": "span 4 / span 4",
    "span-5": "span 5 / span 5",
    "span-6": "span 6 / span 6",
    "span-7": "span 7 / span 7",
    "span-8": "span 8 / span 8",
    "span-9": "span 9 / span 9",
    "span-10": "span 10 / span 10",
    "span-11": "span 11 / span 11",
    "span-12": "span 12 / span 12",
    "span-full": "1 / -1"
  },
  gridRowEnd: {
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "10",
    "11": "11",
    "12": "12",
    "13": "13",
    auto: "auto"
  },
  gridRowStart: {
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "10",
    "11": "11",
    "12": "12",
    "13": "13",
    auto: "auto"
  },
  gridTemplateColumns: {
    "1": "repeat(1, minmax(0, 1fr))",
    "2": "repeat(2, minmax(0, 1fr))",
    "3": "repeat(3, minmax(0, 1fr))",
    "4": "repeat(4, minmax(0, 1fr))",
    "5": "repeat(5, minmax(0, 1fr))",
    "6": "repeat(6, minmax(0, 1fr))",
    "7": "repeat(7, minmax(0, 1fr))",
    "8": "repeat(8, minmax(0, 1fr))",
    "9": "repeat(9, minmax(0, 1fr))",
    "10": "repeat(10, minmax(0, 1fr))",
    "11": "repeat(11, minmax(0, 1fr))",
    "12": "repeat(12, minmax(0, 1fr))",
    none: "none",
    subgrid: "subgrid"
  },
  gridTemplateRows: {
    "1": "repeat(1, minmax(0, 1fr))",
    "2": "repeat(2, minmax(0, 1fr))",
    "3": "repeat(3, minmax(0, 1fr))",
    "4": "repeat(4, minmax(0, 1fr))",
    "5": "repeat(5, minmax(0, 1fr))",
    "6": "repeat(6, minmax(0, 1fr))",
    "7": "repeat(7, minmax(0, 1fr))",
    "8": "repeat(8, minmax(0, 1fr))",
    "9": "repeat(9, minmax(0, 1fr))",
    "10": "repeat(10, minmax(0, 1fr))",
    "11": "repeat(11, minmax(0, 1fr))",
    "12": "repeat(12, minmax(0, 1fr))",
    none: "none",
    subgrid: "subgrid"
  },
  hueRotate: {
    "0": "0deg",
    "15": "15deg",
    "30": "30deg",
    "60": "60deg",
    "90": "90deg",
    "180": "180deg"
  },
  invert: {
    "0": "0",
    DEFAULT: "100%"
  },
  keyframes: {
    spin: {
      to: {
        transform: "rotate(360deg)"
      }
    },
    ping: {
      "75%, 100%": {
        transform: "scale(2)",
        opacity: "0"
      }
    },
    pulse: {
      "50%": {
        opacity: ".5"
      }
    },
    bounce: {
      "0%, 100%": {
        transform: "translateY(-25%)",
        animationTimingFunction: "cubic-bezier(0.8,0,1,1)"
      },
      "50%": {
        transform: "none",
        animationTimingFunction: "cubic-bezier(0,0,0.2,1)"
      }
    }
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em"
  },
  lineHeight: {
    "3": ".75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "7": "1.75rem",
    "8": "2rem",
    "9": "2.25rem",
    "10": "2.5rem",
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2"
  },
  listStyleType: {
    none: "none",
    disc: "disc",
    decimal: "decimal"
  },
  objectPosition: {
    bottom: "bottom",
    center: "center",
    left: "left",
    "left-bottom": "left bottom",
    "left-top": "left top",
    right: "right",
    "right-bottom": "right bottom",
    "right-top": "right top",
    top: "top"
  },
  opacity: {
    "0": "0",
    "5": "0.05",
    "10": "0.1",
    "15": "0.15",
    "20": "0.2",
    "25": "0.25",
    "30": "0.3",
    "35": "0.35",
    "40": "0.4",
    "45": "0.45",
    "50": "0.5",
    "55": "0.55",
    "60": "0.6",
    "65": "0.65",
    "70": "0.7",
    "75": "0.75",
    "80": "0.8",
    "85": "0.85",
    "90": "0.9",
    "95": "0.95",
    "100": "1"
  },
  order: {
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "10",
    "11": "11",
    "12": "12",
    first: "-9999",
    last: "9999",
    none: "0"
  },
  outlineOffset: {
    "0": "0px",
    "1": "1px",
    "2": "2px",
    "4": "4px",
    "8": "8px"
  },
  outlineWidth: {
    "0": "0px",
    "1": "1px",
    "2": "2px",
    "4": "4px",
    "8": "8px"
  },
  ringWidth: {
    "0": "0px",
    "1": "1px",
    "2": "2px",
    "4": "4px",
    "8": "8px",
    DEFAULT: "3px"
  },
  rotate: {
    "0": "0deg",
    "1": "1deg",
    "2": "2deg",
    "3": "3deg",
    "6": "6deg",
    "12": "12deg",
    "45": "45deg",
    "90": "90deg",
    "180": "180deg"
  },
  saturate: {
    "0": "0",
    "50": ".5",
    "100": "1",
    "150": "1.5",
    "200": "2"
  },
  scale: {
    "0": "0",
    "50": ".5",
    "75": ".75",
    "90": ".9",
    "95": ".95",
    "100": "1",
    "105": "1.05",
    "110": "1.1",
    "125": "1.25",
    "150": "1.5"
  },
  sepia: {
    "0": "0",
    DEFAULT: "100%"
  },
  skew: {
    "0": "0deg",
    "1": "1deg",
    "2": "2deg",
    "3": "3deg",
    "6": "6deg",
    "12": "12deg"
  },
  spacing: {
    "0": "0px",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "7": "1.75rem",
    "8": "2rem",
    "9": "2.25rem",
    "10": "2.5rem",
    "11": "2.75rem",
    "12": "3rem",
    "14": "3.5rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem",
    "28": "7rem",
    "32": "8rem",
    "36": "9rem",
    "40": "10rem",
    "44": "11rem",
    "48": "12rem",
    "52": "13rem",
    "56": "14rem",
    "60": "15rem",
    "64": "16rem",
    "72": "18rem",
    "80": "20rem",
    "96": "24rem",
    px: "1px",
    "0.5": "0.125rem",
    "1.5": "0.375rem",
    "2.5": "0.625rem",
    "3.5": "0.875rem"
  },
  textDecorationThickness: {
    "0": "0px",
    "1": "1px",
    "2": "2px",
    "4": "4px",
    "8": "8px",
    auto: "auto",
    "from-font": "from-font"
  },
  transformOrigin: {
    center: "center",
    top: "top",
    "top-right": "top right",
    right: "right",
    "bottom-right": "bottom right",
    bottom: "bottom",
    "bottom-left": "bottom left",
    left: "left",
    "top-left": "top left"
  },
  transitionDuration: {
    "0": "0s",
    "75": "75ms",
    "100": "100ms",
    "150": "150ms",
    "200": "200ms",
    "300": "300ms",
    "500": "500ms",
    "700": "700ms",
    "1000": "1000ms",
    DEFAULT: "150ms"
  },
  transitionProperty: {
    none: "none",
    all: "all",
    DEFAULT: "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
    colors: "color, background-color, border-color, text-decoration-color, fill, stroke",
    opacity: "opacity",
    shadow: "box-shadow",
    transform: "transform"
  },
  transitionTimingFunction: {
    DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
  },
  willChange: {
    auto: "auto",
    scroll: "scroll-position",
    contents: "contents",
    transform: "transform"
  },
  zIndex: {
    "0": "0",
    "10": "10",
    "20": "20",
    "30": "30",
    "40": "40",
    "50": "50",
    auto: "auto"
  }
};
var DEFAULT_SCREENS = {
  xxs: "200px",
  xs: "400px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
  "3xl": "1920px",
  "4xl": "2560px",
  "5xl": "5000px"
};
var DEFAULT_CONTAINER_MIN_SCREEN = "sm";
var DEFAULT_CONTAINER_MAX_SCREEN = "2xl";
var FRACTIONS = {
  "1/2": "50%",
  "1/3": "33.333333%",
  "2/3": "66.666667%",
  "1/4": "25%",
  "2/4": "50%",
  "3/4": "75%",
  "1/5": "20%",
  "2/5": "40%",
  "3/5": "60%",
  "4/5": "80%",
  "1/6": "16.666667%",
  "2/6": "33.333333%",
  "3/6": "50%",
  "4/6": "66.666667%",
  "5/6": "83.333333%",
  "1/12": "8.333333%",
  "2/12": "16.666667%",
  "3/12": "25%",
  "4/12": "33.333333%",
  "5/12": "41.666667%",
  "6/12": "50%",
  "7/12": "58.333333%",
  "8/12": "66.666667%",
  "9/12": "75%",
  "10/12": "83.333333%",
  "11/12": "91.666667%"
};
var FRACTIONS_SMALL = Object.fromEntries(
  Object.entries(FRACTIONS).filter(
    ([k]) => !k.endsWith("/5") && !k.endsWith("/6") && !k.endsWith("/12")
  )
);
var FRACTIONS_SIXTHS = Object.fromEntries(
  Object.entries(FRACTIONS).filter(([k]) => !k.endsWith("/12"))
);
var NAKSHORA_EXTRAS = {
  boxShadow: { glow: "0 0 20px 0 rgba(59, 130, 246, 0.5)" },
  borderRadius: { xs: "0.125rem" },
  zIndex: { hide: "-1" },
  transitionTimingFunction: { back: "cubic-bezier(0.68, -0.55, 0.265, 1.55)" },
  animation: {
    fade: "fade 300ms ease-out",
    slide: "slide 300ms ease-out",
    shimmer: "shimmer 1.5s linear infinite"
  },
  keyframes: {
    fade: { from: { opacity: "0" }, to: { opacity: "1" } },
    slide: {
      from: { transform: "translateY(1rem)", opacity: "0" },
      to: { transform: "translateY(0)", opacity: "1" }
    },
    shimmer: {
      from: { "background-position": "200% 0" },
      to: { "background-position": "-200% 0" }
    }
  },
  lineHeight: { base: "1.5" },
  scale: { 175: "1.75", 200: "2" },
  rotate: { 135: "135deg", 225: "225deg", 270: "270deg", 315: "315deg", 360: "360deg" },
  textDecorationThickness: { thin: "1px" }
};
function isObj(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}
function mergeScale(base, override) {
  if (!isObj(base) || !isObj(override)) {
    return override === void 0 ? base : override;
  }
  const out = { ...base };
  for (const [k, v] of Object.entries(override)) {
    if (v === void 0) continue;
    if (v === null) {
      delete out[k];
      continue;
    }
    const cur = out[k];
    out[k] = isObj(cur) && isObj(v) ? mergeScale(cur, v) : v;
  }
  return out;
}
function normalizeFontSize(value) {
  if (Array.isArray(value)) {
    const [size, rest] = value;
    if (isObj(rest)) {
      return {
        size,
        lineHeight: rest.lineHeight,
        letterSpacing: rest.letterSpacing,
        fontWeight: rest.fontWeight === void 0 ? void 0 : String(rest.fontWeight)
      };
    }
    return { size, lineHeight: rest };
  }
  return { size: String(value) };
}
function fontFamilyToString(value) {
  if (Array.isArray(value)) return value.join(", ");
  if (isObj(value) && "fontFamily" in value) return String(value.fontFamily);
  return String(value);
}
function spacingDerived(spacing, extra) {
  return { ...spacing, ...extra };
}
function normalizeUserTheme(user) {
  const out = { ...user };
  const typography = user.typography;
  if (typography) {
    delete out.typography;
    const nakKeys = ["fontSize", "fontWeight", "lineHeight", "letterSpacing"];
    if (nakKeys.some((k) => k in typography)) {
      for (const k of nakKeys) if (typography[k] !== void 0) out[k] = typography[k];
      const rest = Object.fromEntries(
        Object.entries(typography).filter(([k]) => !nakKeys.includes(k))
      );
      if (Object.keys(rest).length) out.typography = rest;
    } else {
      out.typography = typography;
    }
  }
  if (user.breakpoints !== void 0) {
    delete out.breakpoints;
    const bp = {};
    for (const [k, v] of Object.entries(user.breakpoints)) {
      if (v === void 0) continue;
      bp[k] = v === null ? null : typeof v === "number" ? v <= 0 ? null : `${v}px` : v;
    }
    out.breakpointsMerge = bp;
  }
  if (user.shadows !== void 0) {
    delete out.shadows;
    out.boxShadow = mergeScale(out.boxShadow ?? {}, user.shadows);
  }
  if (user.duration !== void 0) {
    delete out.duration;
    out.transitionDuration = mergeScale(out.transitionDuration ?? {}, user.duration);
  }
  if (user.easing !== void 0) {
    delete out.easing;
    out.transitionTimingFunction = mergeScale(
      out.transitionTimingFunction ?? {},
      user.easing
    );
  }
  return out;
}
function parseKeyframeString(body) {
  const out = {};
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    const sel = m[1].trim();
    const decls = {};
    for (const part of m[2].split(";")) {
      const idx = part.indexOf(":");
      if (idx === -1) continue;
      decls[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
    }
    out[sel] = decls;
  }
  return out;
}
function resolveTheme(userTheme = {}, options = {}) {
  let merged = {};
  for (const [k, v] of Object.entries(tailwindDefaults)) merged[k] = v;
  merged.colors = defaultColors;
  merged.screens = { ...DEFAULT_SCREENS };
  merged.container = {};
  merged.containers = {
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
    "7xl": "80rem"
  };
  merged.aria = tailwindDefaults.aria ?? {
    busy: 'busy="true"',
    checked: 'checked="true"',
    disabled: 'disabled="true"',
    expanded: 'expanded="true"',
    hidden: 'hidden="true"',
    pressed: 'pressed="true"',
    readonly: 'readonly="true"',
    required: 'required="true"',
    selected: 'selected="true"'
  };
  merged.supports = {};
  merged.data = {};
  for (const [k, v] of Object.entries(NAKSHORA_EXTRAS)) {
    merged[k] = mergeScale(merged[k] ?? {}, v);
  }
  for (const pt of options.pluginTheme ?? []) {
    const { extend: extend2, ...rest2 } = pt;
    for (const [k, v] of Object.entries(rest2)) {
      merged[k] = typeof v === "function" ? v : mergeScale(merged[k] ?? {}, v);
    }
    if (extend2)
      for (const [k, v] of Object.entries(extend2))
        merged[k] = mergeScale(merged[k] ?? {}, v);
  }
  const user = normalizeUserTheme({ ...userTheme });
  const { extend, breakpointsMerge, ...rest } = user;
  for (const [k, v] of Object.entries(rest)) {
    if (v === void 0) continue;
    if (k === "screens" || k === "container") {
      merged[k] = typeof v === "function" ? v : normaliseScreens(v);
      continue;
    }
    if (k === "keyframes" && isObj(v)) {
      const kf = {};
      for (const [name, body] of Object.entries(v))
        kf[name] = typeof body === "string" ? parseKeyframeString(body) : body;
      merged[k] = mergeScale(merged[k] ?? {}, kf);
      continue;
    }
    merged[k] = typeof v === "function" ? v : mergeScale(merged[k] ?? {}, v);
  }
  if (breakpointsMerge)
    merged.screens = sortScreens(
      normaliseScreens(mergeScale(merged.screens, breakpointsMerge))
    );
  if (extend) {
    for (const [k, v] of Object.entries(extend)) {
      if (v === void 0) continue;
      merged[k] = typeof v === "function" ? v : mergeScale(merged[k] ?? {}, v);
    }
  }
  const resolved = {};
  const resolving = /* @__PURE__ */ new Set();
  const themeFn = (path, fallback) => {
    const value = lookup2(path);
    return value === void 0 ? fallback : value;
  };
  const getScale = (key) => {
    if (key in resolved) return resolved[key];
    let value = merged[key];
    if (typeof value === "function") {
      if (resolving.has(key)) return {};
      resolving.add(key);
      value = value({
        theme: themeFn,
        colors: defaultColors,
        breakpoints: (screens2) => Object.fromEntries(Object.entries(screens2).map(([k, v]) => [`screen-${k}`, v]))
      });
      resolving.delete(key);
    }
    resolved[key] = value;
    return value;
  };
  const lookup2 = (path) => {
    const [head, ...tail] = splitPath(path);
    let cur = getScale(head);
    for (const key of tail) {
      if (!isObj(cur)) return void 0;
      cur = cur[key];
    }
    return cur;
  };
  for (const key of Object.keys(merged)) getScale(key);
  merged = resolved;
  const spacing = merged.spacing;
  const derive = (key, extra) => {
    merged[key] = spacingDerived(spacing, {
      ...extra,
      ...merged[key] ?? {}
    });
  };
  derive("inset", { auto: "auto", ...FRACTIONS_SMALL, full: "100%" });
  derive("margin", { auto: "auto" });
  derive("padding", {});
  derive("gap", {});
  derive("space", {});
  derive("scrollMargin", {});
  derive("scrollPadding", {});
  derive("borderSpacing", {});
  derive("textIndent", {});
  derive("translate", { ...FRACTIONS_SMALL, full: "100%" });
  derive("width", {
    auto: "auto",
    ...FRACTIONS,
    full: "100%",
    screen: "100vw",
    svw: "100svw",
    lvw: "100lvw",
    dvw: "100dvw",
    min: "min-content",
    max: "max-content",
    fit: "fit-content"
  });
  derive("height", {
    auto: "auto",
    ...FRACTIONS_SIXTHS,
    full: "100%",
    screen: "100vh",
    svh: "100svh",
    lvh: "100lvh",
    dvh: "100dvh",
    min: "min-content",
    max: "max-content",
    fit: "fit-content"
  });
  derive("size", {
    auto: "auto",
    ...FRACTIONS,
    full: "100%",
    min: "min-content",
    max: "max-content",
    fit: "fit-content"
  });
  derive("minWidth", { full: "100%", min: "min-content", max: "max-content", fit: "fit-content" });
  derive("minHeight", {
    full: "100%",
    screen: "100vh",
    svh: "100svh",
    lvh: "100lvh",
    dvh: "100dvh",
    min: "min-content",
    max: "max-content",
    fit: "fit-content"
  });
  derive("maxHeight", {
    none: "none",
    full: "100%",
    screen: "100vh",
    svh: "100svh",
    lvh: "100lvh",
    dvh: "100dvh",
    min: "min-content",
    max: "max-content",
    fit: "fit-content"
  });
  derive("flexBasis", { auto: "auto", ...FRACTIONS, full: "100%" });
  const screens = merged.screens;
  const screenMax = Object.fromEntries(Object.entries(screens).map(([k, v]) => [`screen-${k}`, v]));
  derive("maxWidth", {
    none: "none",
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
    full: "100%",
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
    prose: "65ch",
    ...screenMax
  });
  merged.columns = {
    auto: "auto",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "11",
    12: "12",
    "3xs": "16rem",
    "2xs": "18rem",
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
    ...merged.columns ?? {}
  };
  merged.lineClamp = merged.lineClamp ?? { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6" };
  merged.divideWidth = {
    ...merged.borderWidth ?? {},
    ...merged.divideWidth ?? {}
  };
  merged.ringOffsetWidth = merged.ringOffsetWidth ?? {
    0: "0px",
    1: "1px",
    2: "2px",
    4: "4px",
    8: "8px"
  };
  merged.strokeWidth = merged.strokeWidth ?? { 0: "0", 1: "1", 2: "2" };
  merged.textUnderlineOffset = merged.textUnderlineOffset ?? {
    0: "0px",
    1: "1px",
    2: "2px",
    4: "4px",
    8: "8px",
    auto: "auto"
  };
  merged.transitionDelay = merged.transitionDelay ?? {
    0: "0s",
    75: "75ms",
    100: "100ms",
    150: "150ms",
    200: "200ms",
    300: "300ms",
    500: "500ms",
    700: "700ms",
    1e3: "1000ms"
  };
  merged.listStyleImage = merged.listStyleImage ?? { none: "none" };
  merged.content = merged.content ?? { none: "none" };
  const colors = merged.colors;
  const colorScale = (key, extra = {}) => {
    merged[key] = { ...colors, ...extra, ...merged[key] ?? {} };
  };
  colorScale("accentColor", { auto: "auto" });
  colorScale("backgroundColor");
  colorScale("borderColor", {
    DEFAULT: colors.gray?.[200] ?? "currentColor"
  });
  colorScale("boxShadowColor");
  colorScale("caretColor");
  colorScale("divideColor", { DEFAULT: merged.borderColor.DEFAULT });
  colorScale("fill", { none: "none" });
  colorScale("gradientColorStops");
  colorScale("outlineColor");
  colorScale("placeholderColor");
  colorScale("ringColor", { DEFAULT: colors.blue?.[500] ?? "#3b82f6" });
  colorScale("ringOffsetColor");
  colorScale("stroke", { none: "none" });
  colorScale("textColor");
  colorScale("textDecorationColor");
  const opacity = merged.opacity;
  for (const key of [
    "backgroundOpacity",
    "borderOpacity",
    "divideOpacity",
    "placeholderOpacity",
    "ringOpacity",
    "textOpacity",
    "backdropOpacity"
  ]) {
    merged[key] = { ...opacity, ...merged[key] ?? {} };
  }
  merged.ringOpacity.DEFAULT ??= "0.5";
  for (const [k, src] of [
    ["backdropBlur", "blur"],
    ["backdropBrightness", "brightness"],
    ["backdropContrast", "contrast"],
    ["backdropGrayscale", "grayscale"],
    ["backdropHueRotate", "hueRotate"],
    ["backdropInvert", "invert"],
    ["backdropSaturate", "saturate"],
    ["backdropSepia", "sepia"]
  ]) {
    merged[k] = { ...merged[src] ?? {}, ...merged[k] ?? {} };
  }
  return merged;
}
function sortScreens(screens) {
  const px = (v) => {
    const n = screenToPx(v);
    return Number.isNaN(n) ? Infinity : n;
  };
  return Object.fromEntries(Object.entries(screens).sort((a, b) => px(a[1]) - px(b[1])));
}
function normaliseScreens(v) {
  const out = {};
  for (const [k, val] of Object.entries(v)) {
    if (val === null || val === void 0) continue;
    if (typeof val === "number") {
      if (val > 0) out[k] = `${val}px`;
      continue;
    }
    if (isObj(val)) {
      if (typeof val.min === "string") out[k] = val.min;
      else if (typeof val.raw === "string") out[k] = val.raw;
      continue;
    }
    out[k] = String(val);
  }
  return out;
}
function splitPath(path) {
  const keys = [];
  let cur = "";
  let i = 0;
  while (i < path.length) {
    const ch = path[i];
    if (ch === "[") {
      const end = path.indexOf("]", i);
      if (cur) {
        keys.push(cur);
        cur = "";
      }
      keys.push(path.slice(i + 1, end === -1 ? void 0 : end).replace(/^['"]|['"]$/g, ""));
      i = end === -1 ? path.length : end + 1;
      if (path[i] === ".") i++;
      continue;
    }
    if (ch === ".") {
      keys.push(cur);
      cur = "";
    } else cur += ch;
    i++;
  }
  if (cur) keys.push(cur);
  return keys.filter((k) => k !== "");
}
function screenToPx(value) {
  const m = /^(\d+(?:\.\d+)?)(px|rem|em)?$/.exec(value.trim());
  if (!m) return NaN;
  const n = parseFloat(m[1]);
  return m[2] === "rem" || m[2] === "em" ? n * 16 : n;
}
var STATIC_UTILITIES = [
  {
    p: "accessibility",
    c: "sr-only",
    d: [
      ["position", "absolute"],
      ["width", "1px"],
      ["height", "1px"],
      ["padding", "0"],
      ["margin", "-1px"],
      ["overflow", "hidden"],
      ["clip", "rect(0, 0, 0, 0)"],
      ["white-space", "nowrap"],
      ["border-width", "0"]
    ]
  },
  {
    p: "accessibility",
    c: "not-sr-only",
    d: [
      ["position", "static"],
      ["width", "auto"],
      ["height", "auto"],
      ["padding", "0"],
      ["margin", "0"],
      ["overflow", "visible"],
      ["clip", "auto"],
      ["white-space", "normal"]
    ]
  },
  { p: "pointerEvents", c: "pointer-events-none", d: [["pointer-events", "none"]] },
  { p: "pointerEvents", c: "pointer-events-auto", d: [["pointer-events", "auto"]] },
  { p: "visibility", c: "visible", d: [["visibility", "visible"]] },
  { p: "visibility", c: "invisible", d: [["visibility", "hidden"]] },
  { p: "visibility", c: "collapse", d: [["visibility", "collapse"]] },
  { p: "position", c: "static", d: [["position", "static"]] },
  { p: "position", c: "fixed", d: [["position", "fixed"]] },
  { p: "position", c: "absolute", d: [["position", "absolute"]] },
  { p: "position", c: "relative", d: [["position", "relative"]] },
  { p: "position", c: "sticky", d: [["position", "sticky"]] },
  { p: "isolation", c: "isolate", d: [["isolation", "isolate"]] },
  { p: "isolation", c: "isolation-auto", d: [["isolation", "auto"]] },
  { p: "float", c: "float-start", d: [["float", "inline-start"]] },
  { p: "float", c: "float-end", d: [["float", "inline-end"]] },
  { p: "float", c: "float-right", d: [["float", "right"]] },
  { p: "float", c: "float-left", d: [["float", "left"]] },
  { p: "float", c: "float-none", d: [["float", "none"]] },
  { p: "clear", c: "clear-start", d: [["clear", "inline-start"]] },
  { p: "clear", c: "clear-end", d: [["clear", "inline-end"]] },
  { p: "clear", c: "clear-left", d: [["clear", "left"]] },
  { p: "clear", c: "clear-right", d: [["clear", "right"]] },
  { p: "clear", c: "clear-both", d: [["clear", "both"]] },
  { p: "clear", c: "clear-none", d: [["clear", "none"]] },
  { p: "boxSizing", c: "box-border", d: [["box-sizing", "border-box"]] },
  { p: "boxSizing", c: "box-content", d: [["box-sizing", "content-box"]] },
  {
    p: "lineClamp",
    c: "line-clamp-none",
    d: [
      ["overflow", "visible"],
      ["display", "block"],
      ["-webkit-box-orient", "horizontal"],
      ["-webkit-line-clamp", "none"]
    ]
  },
  { p: "display", c: "block", d: [["display", "block"]] },
  { p: "display", c: "inline-block", d: [["display", "inline-block"]] },
  { p: "display", c: "inline", d: [["display", "inline"]] },
  { p: "display", c: "flex", d: [["display", "flex"]] },
  { p: "display", c: "inline-flex", d: [["display", "inline-flex"]] },
  { p: "display", c: "table", d: [["display", "table"]] },
  { p: "display", c: "inline-table", d: [["display", "inline-table"]] },
  { p: "display", c: "table-caption", d: [["display", "table-caption"]] },
  { p: "display", c: "table-cell", d: [["display", "table-cell"]] },
  { p: "display", c: "table-column", d: [["display", "table-column"]] },
  { p: "display", c: "table-column-group", d: [["display", "table-column-group"]] },
  { p: "display", c: "table-footer-group", d: [["display", "table-footer-group"]] },
  { p: "display", c: "table-header-group", d: [["display", "table-header-group"]] },
  { p: "display", c: "table-row-group", d: [["display", "table-row-group"]] },
  { p: "display", c: "table-row", d: [["display", "table-row"]] },
  { p: "display", c: "flow-root", d: [["display", "flow-root"]] },
  { p: "display", c: "grid", d: [["display", "grid"]] },
  { p: "display", c: "inline-grid", d: [["display", "inline-grid"]] },
  { p: "display", c: "contents", d: [["display", "contents"]] },
  { p: "display", c: "list-item", d: [["display", "list-item"]] },
  { p: "display", c: "hidden", d: [["display", "none"]] },
  { p: "tableLayout", c: "table-auto", d: [["table-layout", "auto"]] },
  { p: "tableLayout", c: "table-fixed", d: [["table-layout", "fixed"]] },
  { p: "captionSide", c: "caption-top", d: [["caption-side", "top"]] },
  { p: "captionSide", c: "caption-bottom", d: [["caption-side", "bottom"]] },
  { p: "borderCollapse", c: "border-collapse", d: [["border-collapse", "collapse"]] },
  { p: "borderCollapse", c: "border-separate", d: [["border-collapse", "separate"]] },
  {
    p: "transform",
    c: "transform",
    d: [
      [
        "transform",
        "translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))"
      ]
    ],
    df: "transform"
  },
  {
    p: "transform",
    c: "transform-cpu",
    d: [
      [
        "transform",
        "translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))"
      ]
    ]
  },
  {
    p: "transform",
    c: "transform-gpu",
    d: [
      [
        "transform",
        "translate3d(var(--tw-translate-x), var(--tw-translate-y), 0) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))"
      ]
    ]
  },
  { p: "transform", c: "transform-none", d: [["transform", "none"]] },
  { p: "touchAction", c: "touch-auto", d: [["touch-action", "auto"]] },
  { p: "touchAction", c: "touch-none", d: [["touch-action", "none"]] },
  {
    p: "touchAction",
    c: "touch-pan-x",
    d: [
      ["--tw-pan-x", "pan-x"],
      ["touch-action", "var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)"]
    ],
    df: "touch-action"
  },
  {
    p: "touchAction",
    c: "touch-pan-left",
    d: [
      ["--tw-pan-x", "pan-left"],
      ["touch-action", "var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)"]
    ],
    df: "touch-action"
  },
  {
    p: "touchAction",
    c: "touch-pan-right",
    d: [
      ["--tw-pan-x", "pan-right"],
      ["touch-action", "var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)"]
    ],
    df: "touch-action"
  },
  {
    p: "touchAction",
    c: "touch-pan-y",
    d: [
      ["--tw-pan-y", "pan-y"],
      ["touch-action", "var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)"]
    ],
    df: "touch-action"
  },
  {
    p: "touchAction",
    c: "touch-pan-up",
    d: [
      ["--tw-pan-y", "pan-up"],
      ["touch-action", "var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)"]
    ],
    df: "touch-action"
  },
  {
    p: "touchAction",
    c: "touch-pan-down",
    d: [
      ["--tw-pan-y", "pan-down"],
      ["touch-action", "var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)"]
    ],
    df: "touch-action"
  },
  {
    p: "touchAction",
    c: "touch-pinch-zoom",
    d: [
      ["--tw-pinch-zoom", "pinch-zoom"],
      ["touch-action", "var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)"]
    ],
    df: "touch-action"
  },
  { p: "touchAction", c: "touch-manipulation", d: [["touch-action", "manipulation"]] },
  { p: "userSelect", c: "select-none", d: [["user-select", "none"]] },
  { p: "userSelect", c: "select-text", d: [["user-select", "text"]] },
  { p: "userSelect", c: "select-all", d: [["user-select", "all"]] },
  { p: "userSelect", c: "select-auto", d: [["user-select", "auto"]] },
  { p: "resize", c: "resize-none", d: [["resize", "none"]] },
  { p: "resize", c: "resize-y", d: [["resize", "vertical"]] },
  { p: "resize", c: "resize-x", d: [["resize", "horizontal"]] },
  { p: "resize", c: "resize", d: [["resize", "both"]] },
  { p: "scrollSnapType", c: "snap-none", d: [["scroll-snap-type", "none"]] },
  {
    p: "scrollSnapType",
    c: "snap-x",
    d: [["scroll-snap-type", "x var(--tw-scroll-snap-strictness)"]],
    df: "scroll-snap-type"
  },
  {
    p: "scrollSnapType",
    c: "snap-y",
    d: [["scroll-snap-type", "y var(--tw-scroll-snap-strictness)"]],
    df: "scroll-snap-type"
  },
  {
    p: "scrollSnapType",
    c: "snap-both",
    d: [["scroll-snap-type", "both var(--tw-scroll-snap-strictness)"]],
    df: "scroll-snap-type"
  },
  { p: "scrollSnapType", c: "snap-mandatory", d: [["--tw-scroll-snap-strictness", "mandatory"]] },
  { p: "scrollSnapType", c: "snap-proximity", d: [["--tw-scroll-snap-strictness", "proximity"]] },
  { p: "scrollSnapAlign", c: "snap-start", d: [["scroll-snap-align", "start"]] },
  { p: "scrollSnapAlign", c: "snap-end", d: [["scroll-snap-align", "end"]] },
  { p: "scrollSnapAlign", c: "snap-center", d: [["scroll-snap-align", "center"]] },
  { p: "scrollSnapAlign", c: "snap-align-none", d: [["scroll-snap-align", "none"]] },
  { p: "scrollSnapStop", c: "snap-normal", d: [["scroll-snap-stop", "normal"]] },
  { p: "scrollSnapStop", c: "snap-always", d: [["scroll-snap-stop", "always"]] },
  { p: "listStylePosition", c: "list-inside", d: [["list-style-position", "inside"]] },
  { p: "listStylePosition", c: "list-outside", d: [["list-style-position", "outside"]] },
  { p: "appearance", c: "appearance-none", d: [["appearance", "none"]] },
  { p: "appearance", c: "appearance-auto", d: [["appearance", "auto"]] },
  { p: "breakBefore", c: "break-before-auto", d: [["break-before", "auto"]] },
  { p: "breakBefore", c: "break-before-avoid", d: [["break-before", "avoid"]] },
  { p: "breakBefore", c: "break-before-all", d: [["break-before", "all"]] },
  { p: "breakBefore", c: "break-before-avoid-page", d: [["break-before", "avoid-page"]] },
  { p: "breakBefore", c: "break-before-page", d: [["break-before", "page"]] },
  { p: "breakBefore", c: "break-before-left", d: [["break-before", "left"]] },
  { p: "breakBefore", c: "break-before-right", d: [["break-before", "right"]] },
  { p: "breakBefore", c: "break-before-column", d: [["break-before", "column"]] },
  { p: "breakInside", c: "break-inside-auto", d: [["break-inside", "auto"]] },
  { p: "breakInside", c: "break-inside-avoid", d: [["break-inside", "avoid"]] },
  { p: "breakInside", c: "break-inside-avoid-page", d: [["break-inside", "avoid-page"]] },
  { p: "breakInside", c: "break-inside-avoid-column", d: [["break-inside", "avoid-column"]] },
  { p: "breakAfter", c: "break-after-auto", d: [["break-after", "auto"]] },
  { p: "breakAfter", c: "break-after-avoid", d: [["break-after", "avoid"]] },
  { p: "breakAfter", c: "break-after-all", d: [["break-after", "all"]] },
  { p: "breakAfter", c: "break-after-avoid-page", d: [["break-after", "avoid-page"]] },
  { p: "breakAfter", c: "break-after-page", d: [["break-after", "page"]] },
  { p: "breakAfter", c: "break-after-left", d: [["break-after", "left"]] },
  { p: "breakAfter", c: "break-after-right", d: [["break-after", "right"]] },
  { p: "breakAfter", c: "break-after-column", d: [["break-after", "column"]] },
  { p: "gridAutoFlow", c: "grid-flow-row", d: [["grid-auto-flow", "row"]] },
  { p: "gridAutoFlow", c: "grid-flow-col", d: [["grid-auto-flow", "column"]] },
  { p: "gridAutoFlow", c: "grid-flow-dense", d: [["grid-auto-flow", "dense"]] },
  { p: "gridAutoFlow", c: "grid-flow-row-dense", d: [["grid-auto-flow", "row dense"]] },
  { p: "gridAutoFlow", c: "grid-flow-col-dense", d: [["grid-auto-flow", "column dense"]] },
  { p: "flexDirection", c: "flex-row", d: [["flex-direction", "row"]] },
  { p: "flexDirection", c: "flex-row-reverse", d: [["flex-direction", "row-reverse"]] },
  { p: "flexDirection", c: "flex-col", d: [["flex-direction", "column"]] },
  { p: "flexDirection", c: "flex-col-reverse", d: [["flex-direction", "column-reverse"]] },
  { p: "flexWrap", c: "flex-wrap", d: [["flex-wrap", "wrap"]] },
  { p: "flexWrap", c: "flex-wrap-reverse", d: [["flex-wrap", "wrap-reverse"]] },
  { p: "flexWrap", c: "flex-nowrap", d: [["flex-wrap", "nowrap"]] },
  { p: "placeContent", c: "place-content-center", d: [["place-content", "center"]] },
  { p: "placeContent", c: "place-content-start", d: [["place-content", "start"]] },
  { p: "placeContent", c: "place-content-end", d: [["place-content", "end"]] },
  { p: "placeContent", c: "place-content-between", d: [["place-content", "space-between"]] },
  { p: "placeContent", c: "place-content-around", d: [["place-content", "space-around"]] },
  { p: "placeContent", c: "place-content-evenly", d: [["place-content", "space-evenly"]] },
  { p: "placeContent", c: "place-content-baseline", d: [["place-content", "baseline"]] },
  { p: "placeContent", c: "place-content-stretch", d: [["place-content", "stretch"]] },
  { p: "placeItems", c: "place-items-start", d: [["place-items", "start"]] },
  { p: "placeItems", c: "place-items-end", d: [["place-items", "end"]] },
  { p: "placeItems", c: "place-items-center", d: [["place-items", "center"]] },
  { p: "placeItems", c: "place-items-baseline", d: [["place-items", "baseline"]] },
  { p: "placeItems", c: "place-items-stretch", d: [["place-items", "stretch"]] },
  { p: "alignContent", c: "content-normal", d: [["align-content", "normal"]] },
  { p: "alignContent", c: "content-center", d: [["align-content", "center"]] },
  { p: "alignContent", c: "content-start", d: [["align-content", "flex-start"]] },
  { p: "alignContent", c: "content-end", d: [["align-content", "flex-end"]] },
  { p: "alignContent", c: "content-between", d: [["align-content", "space-between"]] },
  { p: "alignContent", c: "content-around", d: [["align-content", "space-around"]] },
  { p: "alignContent", c: "content-evenly", d: [["align-content", "space-evenly"]] },
  { p: "alignContent", c: "content-baseline", d: [["align-content", "baseline"]] },
  { p: "alignContent", c: "content-stretch", d: [["align-content", "stretch"]] },
  { p: "alignItems", c: "items-start", d: [["align-items", "flex-start"]] },
  { p: "alignItems", c: "items-end", d: [["align-items", "flex-end"]] },
  { p: "alignItems", c: "items-center", d: [["align-items", "center"]] },
  { p: "alignItems", c: "items-baseline", d: [["align-items", "baseline"]] },
  { p: "alignItems", c: "items-stretch", d: [["align-items", "stretch"]] },
  { p: "justifyContent", c: "justify-normal", d: [["justify-content", "normal"]] },
  { p: "justifyContent", c: "justify-start", d: [["justify-content", "flex-start"]] },
  { p: "justifyContent", c: "justify-end", d: [["justify-content", "flex-end"]] },
  { p: "justifyContent", c: "justify-center", d: [["justify-content", "center"]] },
  { p: "justifyContent", c: "justify-between", d: [["justify-content", "space-between"]] },
  { p: "justifyContent", c: "justify-around", d: [["justify-content", "space-around"]] },
  { p: "justifyContent", c: "justify-evenly", d: [["justify-content", "space-evenly"]] },
  { p: "justifyContent", c: "justify-stretch", d: [["justify-content", "stretch"]] },
  { p: "justifyItems", c: "justify-items-start", d: [["justify-items", "start"]] },
  { p: "justifyItems", c: "justify-items-end", d: [["justify-items", "end"]] },
  { p: "justifyItems", c: "justify-items-center", d: [["justify-items", "center"]] },
  { p: "justifyItems", c: "justify-items-stretch", d: [["justify-items", "stretch"]] },
  {
    p: "space",
    c: "space-y-reverse",
    s: " > :not([hidden]) ~ :not([hidden])",
    d: [["--tw-space-y-reverse", "1"]]
  },
  {
    p: "space",
    c: "space-x-reverse",
    s: " > :not([hidden]) ~ :not([hidden])",
    d: [["--tw-space-x-reverse", "1"]]
  },
  {
    p: "divideWidth",
    c: "divide-y-reverse",
    s: " > :not([hidden]) ~ :not([hidden])",
    d: [["--tw-divide-y-reverse", "1"]],
    df: "border-width"
  },
  {
    p: "divideWidth",
    c: "divide-x-reverse",
    s: " > :not([hidden]) ~ :not([hidden])",
    d: [["--tw-divide-x-reverse", "1"]],
    df: "border-width"
  },
  {
    p: "divideStyle",
    c: "divide-solid",
    s: " > :not([hidden]) ~ :not([hidden])",
    d: [["border-style", "solid"]]
  },
  {
    p: "divideStyle",
    c: "divide-dashed",
    s: " > :not([hidden]) ~ :not([hidden])",
    d: [["border-style", "dashed"]]
  },
  {
    p: "divideStyle",
    c: "divide-dotted",
    s: " > :not([hidden]) ~ :not([hidden])",
    d: [["border-style", "dotted"]]
  },
  {
    p: "divideStyle",
    c: "divide-double",
    s: " > :not([hidden]) ~ :not([hidden])",
    d: [["border-style", "double"]]
  },
  {
    p: "divideStyle",
    c: "divide-none",
    s: " > :not([hidden]) ~ :not([hidden])",
    d: [["border-style", "none"]]
  },
  { p: "placeSelf", c: "place-self-auto", d: [["place-self", "auto"]] },
  { p: "placeSelf", c: "place-self-start", d: [["place-self", "start"]] },
  { p: "placeSelf", c: "place-self-end", d: [["place-self", "end"]] },
  { p: "placeSelf", c: "place-self-center", d: [["place-self", "center"]] },
  { p: "placeSelf", c: "place-self-stretch", d: [["place-self", "stretch"]] },
  { p: "alignSelf", c: "self-auto", d: [["align-self", "auto"]] },
  { p: "alignSelf", c: "self-start", d: [["align-self", "flex-start"]] },
  { p: "alignSelf", c: "self-end", d: [["align-self", "flex-end"]] },
  { p: "alignSelf", c: "self-center", d: [["align-self", "center"]] },
  { p: "alignSelf", c: "self-stretch", d: [["align-self", "stretch"]] },
  { p: "alignSelf", c: "self-baseline", d: [["align-self", "baseline"]] },
  { p: "justifySelf", c: "justify-self-auto", d: [["justify-self", "auto"]] },
  { p: "justifySelf", c: "justify-self-start", d: [["justify-self", "start"]] },
  { p: "justifySelf", c: "justify-self-end", d: [["justify-self", "end"]] },
  { p: "justifySelf", c: "justify-self-center", d: [["justify-self", "center"]] },
  { p: "justifySelf", c: "justify-self-stretch", d: [["justify-self", "stretch"]] },
  { p: "overflow", c: "overflow-auto", d: [["overflow", "auto"]] },
  { p: "overflow", c: "overflow-hidden", d: [["overflow", "hidden"]] },
  { p: "overflow", c: "overflow-clip", d: [["overflow", "clip"]] },
  { p: "overflow", c: "overflow-visible", d: [["overflow", "visible"]] },
  { p: "overflow", c: "overflow-scroll", d: [["overflow", "scroll"]] },
  { p: "overflow", c: "overflow-x-auto", d: [["overflow-x", "auto"]] },
  { p: "overflow", c: "overflow-y-auto", d: [["overflow-y", "auto"]] },
  { p: "overflow", c: "overflow-x-hidden", d: [["overflow-x", "hidden"]] },
  { p: "overflow", c: "overflow-y-hidden", d: [["overflow-y", "hidden"]] },
  { p: "overflow", c: "overflow-x-clip", d: [["overflow-x", "clip"]] },
  { p: "overflow", c: "overflow-y-clip", d: [["overflow-y", "clip"]] },
  { p: "overflow", c: "overflow-x-visible", d: [["overflow-x", "visible"]] },
  { p: "overflow", c: "overflow-y-visible", d: [["overflow-y", "visible"]] },
  { p: "overflow", c: "overflow-x-scroll", d: [["overflow-x", "scroll"]] },
  { p: "overflow", c: "overflow-y-scroll", d: [["overflow-y", "scroll"]] },
  { p: "overscrollBehavior", c: "overscroll-auto", d: [["overscroll-behavior", "auto"]] },
  { p: "overscrollBehavior", c: "overscroll-contain", d: [["overscroll-behavior", "contain"]] },
  { p: "overscrollBehavior", c: "overscroll-none", d: [["overscroll-behavior", "none"]] },
  { p: "overscrollBehavior", c: "overscroll-y-auto", d: [["overscroll-behavior-y", "auto"]] },
  { p: "overscrollBehavior", c: "overscroll-y-contain", d: [["overscroll-behavior-y", "contain"]] },
  { p: "overscrollBehavior", c: "overscroll-y-none", d: [["overscroll-behavior-y", "none"]] },
  { p: "overscrollBehavior", c: "overscroll-x-auto", d: [["overscroll-behavior-x", "auto"]] },
  { p: "overscrollBehavior", c: "overscroll-x-contain", d: [["overscroll-behavior-x", "contain"]] },
  { p: "overscrollBehavior", c: "overscroll-x-none", d: [["overscroll-behavior-x", "none"]] },
  { p: "scrollBehavior", c: "scroll-auto", d: [["scroll-behavior", "auto"]] },
  { p: "scrollBehavior", c: "scroll-smooth", d: [["scroll-behavior", "smooth"]] },
  {
    p: "textOverflow",
    c: "truncate",
    d: [
      ["overflow", "hidden"],
      ["text-overflow", "ellipsis"],
      ["white-space", "nowrap"]
    ]
  },
  { p: "textOverflow", c: "overflow-ellipsis", d: [["text-overflow", "ellipsis"]] },
  { p: "textOverflow", c: "text-ellipsis", d: [["text-overflow", "ellipsis"]] },
  { p: "textOverflow", c: "text-clip", d: [["text-overflow", "clip"]] },
  { p: "hyphens", c: "hyphens-none", d: [["hyphens", "none"]] },
  { p: "hyphens", c: "hyphens-manual", d: [["hyphens", "manual"]] },
  { p: "hyphens", c: "hyphens-auto", d: [["hyphens", "auto"]] },
  { p: "whitespace", c: "whitespace-normal", d: [["white-space", "normal"]] },
  { p: "whitespace", c: "whitespace-nowrap", d: [["white-space", "nowrap"]] },
  { p: "whitespace", c: "whitespace-pre", d: [["white-space", "pre"]] },
  { p: "whitespace", c: "whitespace-pre-line", d: [["white-space", "pre-line"]] },
  { p: "whitespace", c: "whitespace-pre-wrap", d: [["white-space", "pre-wrap"]] },
  { p: "whitespace", c: "whitespace-break-spaces", d: [["white-space", "break-spaces"]] },
  { p: "textWrap", c: "text-wrap", d: [["text-wrap", "wrap"]] },
  { p: "textWrap", c: "text-nowrap", d: [["text-wrap", "nowrap"]] },
  { p: "textWrap", c: "text-balance", d: [["text-wrap", "balance"]] },
  { p: "textWrap", c: "text-pretty", d: [["text-wrap", "pretty"]] },
  {
    p: "wordBreak",
    c: "break-normal",
    d: [
      ["overflow-wrap", "normal"],
      ["word-break", "normal"]
    ]
  },
  { p: "wordBreak", c: "break-words", d: [["overflow-wrap", "break-word"]] },
  { p: "wordBreak", c: "break-all", d: [["word-break", "break-all"]] },
  { p: "wordBreak", c: "break-keep", d: [["word-break", "keep-all"]] },
  { p: "borderStyle", c: "border-solid", d: [["border-style", "solid"]] },
  { p: "borderStyle", c: "border-dashed", d: [["border-style", "dashed"]] },
  { p: "borderStyle", c: "border-dotted", d: [["border-style", "dotted"]] },
  { p: "borderStyle", c: "border-double", d: [["border-style", "double"]] },
  { p: "borderStyle", c: "border-hidden", d: [["border-style", "hidden"]] },
  { p: "borderStyle", c: "border-none", d: [["border-style", "none"]] },
  { p: "boxDecorationBreak", c: "decoration-slice", d: [["box-decoration-break", "slice"]] },
  { p: "boxDecorationBreak", c: "decoration-clone", d: [["box-decoration-break", "clone"]] },
  { p: "boxDecorationBreak", c: "box-decoration-slice", d: [["box-decoration-break", "slice"]] },
  { p: "boxDecorationBreak", c: "box-decoration-clone", d: [["box-decoration-break", "clone"]] },
  { p: "backgroundAttachment", c: "bg-fixed", d: [["background-attachment", "fixed"]] },
  { p: "backgroundAttachment", c: "bg-local", d: [["background-attachment", "local"]] },
  { p: "backgroundAttachment", c: "bg-scroll", d: [["background-attachment", "scroll"]] },
  { p: "backgroundClip", c: "bg-clip-border", d: [["background-clip", "border-box"]] },
  { p: "backgroundClip", c: "bg-clip-padding", d: [["background-clip", "padding-box"]] },
  { p: "backgroundClip", c: "bg-clip-content", d: [["background-clip", "content-box"]] },
  { p: "backgroundClip", c: "bg-clip-text", d: [["background-clip", "text"]] },
  { p: "backgroundRepeat", c: "bg-repeat", d: [["background-repeat", "repeat"]] },
  { p: "backgroundRepeat", c: "bg-no-repeat", d: [["background-repeat", "no-repeat"]] },
  { p: "backgroundRepeat", c: "bg-repeat-x", d: [["background-repeat", "repeat-x"]] },
  { p: "backgroundRepeat", c: "bg-repeat-y", d: [["background-repeat", "repeat-y"]] },
  { p: "backgroundRepeat", c: "bg-repeat-round", d: [["background-repeat", "round"]] },
  { p: "backgroundRepeat", c: "bg-repeat-space", d: [["background-repeat", "space"]] },
  { p: "backgroundOrigin", c: "bg-origin-border", d: [["background-origin", "border-box"]] },
  { p: "backgroundOrigin", c: "bg-origin-padding", d: [["background-origin", "padding-box"]] },
  { p: "backgroundOrigin", c: "bg-origin-content", d: [["background-origin", "content-box"]] },
  { p: "objectFit", c: "object-contain", d: [["object-fit", "contain"]] },
  { p: "objectFit", c: "object-cover", d: [["object-fit", "cover"]] },
  { p: "objectFit", c: "object-fill", d: [["object-fit", "fill"]] },
  { p: "objectFit", c: "object-none", d: [["object-fit", "none"]] },
  { p: "objectFit", c: "object-scale-down", d: [["object-fit", "scale-down"]] },
  { p: "textAlign", c: "text-left", d: [["text-align", "left"]] },
  { p: "textAlign", c: "text-center", d: [["text-align", "center"]] },
  { p: "textAlign", c: "text-right", d: [["text-align", "right"]] },
  { p: "textAlign", c: "text-justify", d: [["text-align", "justify"]] },
  { p: "textAlign", c: "text-start", d: [["text-align", "start"]] },
  { p: "textAlign", c: "text-end", d: [["text-align", "end"]] },
  { p: "verticalAlign", c: "align-baseline", d: [["vertical-align", "baseline"]] },
  { p: "verticalAlign", c: "align-top", d: [["vertical-align", "top"]] },
  { p: "verticalAlign", c: "align-middle", d: [["vertical-align", "middle"]] },
  { p: "verticalAlign", c: "align-bottom", d: [["vertical-align", "bottom"]] },
  { p: "verticalAlign", c: "align-text-top", d: [["vertical-align", "text-top"]] },
  { p: "verticalAlign", c: "align-text-bottom", d: [["vertical-align", "text-bottom"]] },
  { p: "verticalAlign", c: "align-sub", d: [["vertical-align", "sub"]] },
  { p: "verticalAlign", c: "align-super", d: [["vertical-align", "super"]] },
  { p: "textTransform", c: "uppercase", d: [["text-transform", "uppercase"]] },
  { p: "textTransform", c: "lowercase", d: [["text-transform", "lowercase"]] },
  { p: "textTransform", c: "capitalize", d: [["text-transform", "capitalize"]] },
  { p: "textTransform", c: "normal-case", d: [["text-transform", "none"]] },
  { p: "fontStyle", c: "italic", d: [["font-style", "italic"]] },
  { p: "fontStyle", c: "not-italic", d: [["font-style", "normal"]] },
  { p: "fontVariantNumeric", c: "normal-nums", d: [["font-variant-numeric", "normal"]] },
  {
    p: "fontVariantNumeric",
    c: "ordinal",
    d: [
      ["--tw-ordinal", "ordinal"],
      [
        "font-variant-numeric",
        "var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)"
      ]
    ],
    df: "font-variant-numeric"
  },
  {
    p: "fontVariantNumeric",
    c: "slashed-zero",
    d: [
      ["--tw-slashed-zero", "slashed-zero"],
      [
        "font-variant-numeric",
        "var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)"
      ]
    ],
    df: "font-variant-numeric"
  },
  {
    p: "fontVariantNumeric",
    c: "lining-nums",
    d: [
      ["--tw-numeric-figure", "lining-nums"],
      [
        "font-variant-numeric",
        "var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)"
      ]
    ],
    df: "font-variant-numeric"
  },
  {
    p: "fontVariantNumeric",
    c: "oldstyle-nums",
    d: [
      ["--tw-numeric-figure", "oldstyle-nums"],
      [
        "font-variant-numeric",
        "var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)"
      ]
    ],
    df: "font-variant-numeric"
  },
  {
    p: "fontVariantNumeric",
    c: "proportional-nums",
    d: [
      ["--tw-numeric-spacing", "proportional-nums"],
      [
        "font-variant-numeric",
        "var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)"
      ]
    ],
    df: "font-variant-numeric"
  },
  {
    p: "fontVariantNumeric",
    c: "tabular-nums",
    d: [
      ["--tw-numeric-spacing", "tabular-nums"],
      [
        "font-variant-numeric",
        "var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)"
      ]
    ],
    df: "font-variant-numeric"
  },
  {
    p: "fontVariantNumeric",
    c: "diagonal-fractions",
    d: [
      ["--tw-numeric-fraction", "diagonal-fractions"],
      [
        "font-variant-numeric",
        "var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)"
      ]
    ],
    df: "font-variant-numeric"
  },
  {
    p: "fontVariantNumeric",
    c: "stacked-fractions",
    d: [
      ["--tw-numeric-fraction", "stacked-fractions"],
      [
        "font-variant-numeric",
        "var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)"
      ]
    ],
    df: "font-variant-numeric"
  },
  { p: "textDecoration", c: "underline", d: [["text-decoration-line", "underline"]] },
  { p: "textDecoration", c: "overline", d: [["text-decoration-line", "overline"]] },
  { p: "textDecoration", c: "line-through", d: [["text-decoration-line", "line-through"]] },
  { p: "textDecoration", c: "no-underline", d: [["text-decoration-line", "none"]] },
  { p: "textDecorationStyle", c: "decoration-solid", d: [["text-decoration-style", "solid"]] },
  { p: "textDecorationStyle", c: "decoration-double", d: [["text-decoration-style", "double"]] },
  { p: "textDecorationStyle", c: "decoration-dotted", d: [["text-decoration-style", "dotted"]] },
  { p: "textDecorationStyle", c: "decoration-dashed", d: [["text-decoration-style", "dashed"]] },
  { p: "textDecorationStyle", c: "decoration-wavy", d: [["text-decoration-style", "wavy"]] },
  {
    p: "fontSmoothing",
    c: "antialiased",
    d: [
      ["-webkit-font-smoothing", "antialiased"],
      ["-moz-osx-font-smoothing", "grayscale"]
    ]
  },
  {
    p: "fontSmoothing",
    c: "subpixel-antialiased",
    d: [
      ["-webkit-font-smoothing", "auto"],
      ["-moz-osx-font-smoothing", "auto"]
    ]
  },
  { p: "backgroundBlendMode", c: "bg-blend-normal", d: [["background-blend-mode", "normal"]] },
  { p: "backgroundBlendMode", c: "bg-blend-multiply", d: [["background-blend-mode", "multiply"]] },
  { p: "backgroundBlendMode", c: "bg-blend-screen", d: [["background-blend-mode", "screen"]] },
  { p: "backgroundBlendMode", c: "bg-blend-overlay", d: [["background-blend-mode", "overlay"]] },
  { p: "backgroundBlendMode", c: "bg-blend-darken", d: [["background-blend-mode", "darken"]] },
  { p: "backgroundBlendMode", c: "bg-blend-lighten", d: [["background-blend-mode", "lighten"]] },
  {
    p: "backgroundBlendMode",
    c: "bg-blend-color-dodge",
    d: [["background-blend-mode", "color-dodge"]]
  },
  {
    p: "backgroundBlendMode",
    c: "bg-blend-color-burn",
    d: [["background-blend-mode", "color-burn"]]
  },
  {
    p: "backgroundBlendMode",
    c: "bg-blend-hard-light",
    d: [["background-blend-mode", "hard-light"]]
  },
  {
    p: "backgroundBlendMode",
    c: "bg-blend-soft-light",
    d: [["background-blend-mode", "soft-light"]]
  },
  {
    p: "backgroundBlendMode",
    c: "bg-blend-difference",
    d: [["background-blend-mode", "difference"]]
  },
  {
    p: "backgroundBlendMode",
    c: "bg-blend-exclusion",
    d: [["background-blend-mode", "exclusion"]]
  },
  { p: "backgroundBlendMode", c: "bg-blend-hue", d: [["background-blend-mode", "hue"]] },
  {
    p: "backgroundBlendMode",
    c: "bg-blend-saturation",
    d: [["background-blend-mode", "saturation"]]
  },
  { p: "backgroundBlendMode", c: "bg-blend-color", d: [["background-blend-mode", "color"]] },
  {
    p: "backgroundBlendMode",
    c: "bg-blend-luminosity",
    d: [["background-blend-mode", "luminosity"]]
  },
  { p: "mixBlendMode", c: "mix-blend-normal", d: [["mix-blend-mode", "normal"]] },
  { p: "mixBlendMode", c: "mix-blend-multiply", d: [["mix-blend-mode", "multiply"]] },
  { p: "mixBlendMode", c: "mix-blend-screen", d: [["mix-blend-mode", "screen"]] },
  { p: "mixBlendMode", c: "mix-blend-overlay", d: [["mix-blend-mode", "overlay"]] },
  { p: "mixBlendMode", c: "mix-blend-darken", d: [["mix-blend-mode", "darken"]] },
  { p: "mixBlendMode", c: "mix-blend-lighten", d: [["mix-blend-mode", "lighten"]] },
  { p: "mixBlendMode", c: "mix-blend-color-dodge", d: [["mix-blend-mode", "color-dodge"]] },
  { p: "mixBlendMode", c: "mix-blend-color-burn", d: [["mix-blend-mode", "color-burn"]] },
  { p: "mixBlendMode", c: "mix-blend-hard-light", d: [["mix-blend-mode", "hard-light"]] },
  { p: "mixBlendMode", c: "mix-blend-soft-light", d: [["mix-blend-mode", "soft-light"]] },
  { p: "mixBlendMode", c: "mix-blend-difference", d: [["mix-blend-mode", "difference"]] },
  { p: "mixBlendMode", c: "mix-blend-exclusion", d: [["mix-blend-mode", "exclusion"]] },
  { p: "mixBlendMode", c: "mix-blend-hue", d: [["mix-blend-mode", "hue"]] },
  { p: "mixBlendMode", c: "mix-blend-saturation", d: [["mix-blend-mode", "saturation"]] },
  { p: "mixBlendMode", c: "mix-blend-color", d: [["mix-blend-mode", "color"]] },
  { p: "mixBlendMode", c: "mix-blend-luminosity", d: [["mix-blend-mode", "luminosity"]] },
  { p: "mixBlendMode", c: "mix-blend-plus-darker", d: [["mix-blend-mode", "plus-darker"]] },
  { p: "mixBlendMode", c: "mix-blend-plus-lighter", d: [["mix-blend-mode", "plus-lighter"]] },
  {
    p: "outlineStyle",
    c: "outline-none",
    d: [
      ["outline", "2px solid transparent"],
      ["outline-offset", "2px"]
    ]
  },
  { p: "outlineStyle", c: "outline", d: [["outline-style", "solid"]] },
  { p: "outlineStyle", c: "outline-dashed", d: [["outline-style", "dashed"]] },
  { p: "outlineStyle", c: "outline-dotted", d: [["outline-style", "dotted"]] },
  { p: "outlineStyle", c: "outline-double", d: [["outline-style", "double"]] },
  { p: "ringWidth", c: "ring-inset", d: [["--tw-ring-inset", "inset"]], df: "ring-width" },
  {
    p: "filter",
    c: "filter",
    d: [
      [
        "filter",
        "var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)"
      ]
    ],
    df: "filter"
  },
  { p: "filter", c: "filter-none", d: [["filter", "none"]] },
  {
    p: "backdropFilter",
    c: "backdrop-filter",
    d: [
      [
        "-webkit-backdrop-filter",
        "var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)"
      ],
      [
        "backdrop-filter",
        "var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)"
      ]
    ],
    df: "backdrop-filter"
  },
  {
    p: "backdropFilter",
    c: "backdrop-filter-none",
    d: [
      ["-webkit-backdrop-filter", "none"],
      ["backdrop-filter", "none"]
    ]
  },
  { p: "contain", c: "contain-none", d: [["contain", "none"]] },
  { p: "contain", c: "contain-content", d: [["contain", "content"]] },
  { p: "contain", c: "contain-strict", d: [["contain", "strict"]] },
  {
    p: "contain",
    c: "contain-size",
    d: [
      ["--tw-contain-size", "size"],
      [
        "contain",
        "var(--tw-contain-size) var(--tw-contain-layout) var(--tw-contain-paint) var(--tw-contain-style)"
      ]
    ],
    df: "contain"
  },
  {
    p: "contain",
    c: "contain-inline-size",
    d: [
      ["--tw-contain-size", "inline-size"],
      [
        "contain",
        "var(--tw-contain-size) var(--tw-contain-layout) var(--tw-contain-paint) var(--tw-contain-style)"
      ]
    ],
    df: "contain"
  },
  {
    p: "contain",
    c: "contain-layout",
    d: [
      ["--tw-contain-layout", "layout"],
      [
        "contain",
        "var(--tw-contain-size) var(--tw-contain-layout) var(--tw-contain-paint) var(--tw-contain-style)"
      ]
    ],
    df: "contain"
  },
  {
    p: "contain",
    c: "contain-paint",
    d: [
      ["--tw-contain-paint", "paint"],
      [
        "contain",
        "var(--tw-contain-size) var(--tw-contain-layout) var(--tw-contain-paint) var(--tw-contain-style)"
      ]
    ],
    df: "contain"
  },
  {
    p: "contain",
    c: "contain-style",
    d: [
      ["--tw-contain-style", "style"],
      [
        "contain",
        "var(--tw-contain-size) var(--tw-contain-layout) var(--tw-contain-paint) var(--tw-contain-style)"
      ]
    ],
    df: "contain"
  },
  { p: "forcedColorAdjust", c: "forced-color-adjust-auto", d: [["forced-color-adjust", "auto"]] },
  { p: "forcedColorAdjust", c: "forced-color-adjust-none", d: [["forced-color-adjust", "none"]] }
];
var TRANSFORM_VALUE = "translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))";
var FILTER_VALUE = "var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)";
var BACKDROP_VALUE = "var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)";
var CHILD_SELECTOR = " > :not([hidden]) ~ :not([hidden])";
function transformThemeValue(themeKey, value) {
  if (typeof value === "function") value = value({});
  if (themeKey === "fontSize" || themeKey === "outline") {
    return String(Array.isArray(value) ? value[0] : value);
  }
  if (themeKey === "fontFamily") return fontFamilyToString(value);
  if ([
    "boxShadow",
    "transitionProperty",
    "transitionDuration",
    "transitionDelay",
    "transitionTimingFunction",
    "backgroundImage",
    "backgroundSize",
    "backgroundColor",
    "cursor",
    "animation"
  ].includes(themeKey)) {
    return String(Array.isArray(value) ? value.join(", ") : value);
  }
  if (["gridTemplateColumns", "gridTemplateRows", "objectPosition"].includes(themeKey)) {
    return typeof value === "string" ? splitComma(value).join(" ") : String(value);
  }
  return String(value);
}
function splitComma(value) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const ch of value) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function flattenColorPalette(colors) {
  const out = {};
  for (const [name, value] of Object.entries(colors ?? {})) {
    if (value && typeof value === "object") {
      for (const [shade, v] of Object.entries(
        flattenColorPalette(value)
      )) {
        out[shade === "DEFAULT" ? name : `${name}-${shade}`] = v;
      }
    } else if (value !== void 0 && value !== null) {
      out[name] = String(value);
    }
  }
  return out;
}
function toColorValue(value) {
  return typeof value === "function" ? String(value({})) : String(value);
}
function transparentTo(value) {
  return withAlphaValue(value, "0", "rgb(255 255 255 / 0)");
}
function buildFunctionalUtilities(theme, options) {
  const t = theme;
  const list = [];
  const scale = (key) => t[key] ?? {};
  const withoutDefault = (v) => {
    const { DEFAULT: _d, ...rest } = v;
    return rest;
  };
  const simple = (plugin2, prefix, themeKey, props, opts = {}) => {
    const { filterDefault, ...rest } = opts;
    let values = scale(themeKey);
    if (filterDefault) values = withoutDefault(values);
    list.push({
      plugin: plugin2,
      prefix,
      values,
      types: [],
      describe: opts.describe ?? `${props.join(" / ")}: {value}`,
      build: (value) => {
        const v = transformThemeValue(themeKey, value);
        return Object.fromEntries(props.map((p) => [p, v]));
      },
      ...rest
    });
  };
  const colorUtility = (plugin2, prefix, themeKey, props, opacityVar, opacityPlugin, extra = {}) => {
    const useVar = opacityVar !== null && (opacityPlugin === null || options.pluginEnabled(opacityPlugin));
    list.push({
      plugin: plugin2,
      prefix,
      values: withoutDefault(flattenColorPalette(scale(themeKey))),
      types: ["color", "any"],
      modifier: "color",
      describe: `${props.join(" / ")}: {value}`,
      build: (value, { modifier }) => {
        const color = toColorValue(value);
        if (!useVar || modifier !== null) return Object.fromEntries(props.map((p) => [p, color]));
        return withAlphaVariable(color, props, opacityVar);
      },
      ...extra
    });
  };
  const opacityUtility = (plugin2, prefix, themeKey, variable, extra = {}) => {
    list.push({
      plugin: plugin2,
      prefix,
      values: scale(themeKey),
      types: [],
      describe: `${variable}: {value}`,
      build: (value) => ({ [variable]: String(value) }),
      ...extra
    });
  };
  const transformUtility = (plugin2, prefix, themeKey, vars, negative = true) => {
    list.push({
      plugin: plugin2,
      prefix,
      values: scale(themeKey),
      types: [],
      negative,
      defaults: "transform",
      describe: `${vars.join(" / ")}: {value}`,
      build: (value) => ({
        ...Object.fromEntries(vars.map((v) => [v, String(value)])),
        transform: TRANSFORM_VALUE
      })
    });
  };
  const filterUtility = (plugin2, prefix, themeKey, variable, fn, negative = false) => {
    list.push({
      plugin: plugin2,
      prefix,
      values: scale(themeKey),
      types: [],
      negative,
      defaults: "filter",
      describe: `${variable}: ${fn}({value})`,
      build: (value) => ({
        [variable]: value === "" ? " " : `${fn}(${String(value)})`,
        filter: FILTER_VALUE
      })
    });
  };
  const backdropUtility = (plugin2, prefix, themeKey, variable, fn, negative = false) => {
    list.push({
      plugin: plugin2,
      prefix,
      values: scale(themeKey),
      types: [],
      negative,
      defaults: "backdrop-filter",
      describe: `${variable}: ${fn}({value})`,
      build: (value) => ({
        [variable]: value === "" ? " " : `${fn}(${String(value)})`,
        "-webkit-backdrop-filter": BACKDROP_VALUE,
        "backdrop-filter": BACKDROP_VALUE
      })
    });
  };
  simple("inset", "inset", "inset", ["inset"], { negative: true });
  simple("inset", "inset-x", "inset", ["left", "right"], { negative: true });
  simple("inset", "inset-y", "inset", ["top", "bottom"], { negative: true });
  simple("inset", "start", "inset", ["inset-inline-start"], { negative: true });
  simple("inset", "end", "inset", ["inset-inline-end"], { negative: true });
  for (const side of ["top", "right", "bottom", "left"])
    simple("inset", side, "inset", [side], { negative: true });
  simple("zIndex", "z", "zIndex", ["z-index"], { negative: true });
  simple("order", "order", "order", ["order"], { negative: true });
  simple("gridColumn", "col", "gridColumn", ["grid-column"]);
  simple("gridColumnStart", "col-start", "gridColumnStart", ["grid-column-start"], {
    negative: true
  });
  simple("gridColumnEnd", "col-end", "gridColumnEnd", ["grid-column-end"], { negative: true });
  simple("gridRow", "row", "gridRow", ["grid-row"]);
  simple("gridRowStart", "row-start", "gridRowStart", ["grid-row-start"], { negative: true });
  simple("gridRowEnd", "row-end", "gridRowEnd", ["grid-row-end"], { negative: true });
  simple("margin", "m", "margin", ["margin"], { negative: true });
  simple("margin", "mx", "margin", ["margin-left", "margin-right"], { negative: true });
  simple("margin", "my", "margin", ["margin-top", "margin-bottom"], { negative: true });
  simple("margin", "ms", "margin", ["margin-inline-start"], { negative: true });
  simple("margin", "me", "margin", ["margin-inline-end"], { negative: true });
  simple("margin", "mt", "margin", ["margin-top"], { negative: true });
  simple("margin", "mr", "margin", ["margin-right"], { negative: true });
  simple("margin", "mb", "margin", ["margin-bottom"], { negative: true });
  simple("margin", "ml", "margin", ["margin-left"], { negative: true });
  list.push({
    plugin: "lineClamp",
    prefix: "line-clamp",
    values: scale("lineClamp"),
    types: [],
    describe: "clamp text to {value} lines",
    build: (value) => ({
      overflow: "hidden",
      display: "-webkit-box",
      "-webkit-box-orient": "vertical",
      "-webkit-line-clamp": String(value)
    })
  });
  simple("aspectRatio", "aspect", "aspectRatio", ["aspect-ratio"]);
  simple("size", "size", "size", ["width", "height"]);
  simple("height", "h", "height", ["height"]);
  simple("maxHeight", "max-h", "maxHeight", ["max-height"]);
  simple("minHeight", "min-h", "minHeight", ["min-height"]);
  simple("width", "w", "width", ["width"]);
  simple("minWidth", "min-w", "minWidth", ["min-width"]);
  simple("maxWidth", "max-w", "maxWidth", ["max-width"]);
  simple("flex", "flex", "flex", ["flex"]);
  simple("flexShrink", "flex-shrink", "flexShrink", ["flex-shrink"]);
  simple("flexShrink", "shrink", "flexShrink", ["flex-shrink"]);
  simple("flexGrow", "flex-grow", "flexGrow", ["flex-grow"]);
  simple("flexGrow", "grow", "flexGrow", ["flex-grow"]);
  simple("flexBasis", "basis", "flexBasis", ["flex-basis"]);
  for (const [prefix, vars] of [
    ["border-spacing", ["--tw-border-spacing-x", "--tw-border-spacing-y"]],
    ["border-spacing-x", ["--tw-border-spacing-x"]],
    ["border-spacing-y", ["--tw-border-spacing-y"]]
  ]) {
    list.push({
      plugin: "borderSpacing",
      prefix,
      values: scale("borderSpacing"),
      types: [],
      defaults: "border-spacing",
      describe: "border-spacing: {value}",
      build: (value) => ({
        ...Object.fromEntries(vars.map((v) => [v, String(value)])),
        "border-spacing": "var(--tw-border-spacing-x) var(--tw-border-spacing-y)"
      })
    });
  }
  simple("transformOrigin", "origin", "transformOrigin", ["transform-origin"]);
  transformUtility("translate", "translate-x", "translate", ["--tw-translate-x"]);
  transformUtility("translate", "translate-y", "translate", ["--tw-translate-y"]);
  transformUtility("rotate", "rotate", "rotate", ["--tw-rotate"]);
  transformUtility("skew", "skew-x", "skew", ["--tw-skew-x"]);
  transformUtility("skew", "skew-y", "skew", ["--tw-skew-y"]);
  transformUtility("scale", "scale", "scale", ["--tw-scale-x", "--tw-scale-y"]);
  transformUtility("scale", "scale-x", "scale", ["--tw-scale-x"]);
  transformUtility("scale", "scale-y", "scale", ["--tw-scale-y"]);
  simple("animation", "animate", "animation", ["animation"]);
  simple("cursor", "cursor", "cursor", ["cursor"]);
  simple("scrollMargin", "scroll-m", "scrollMargin", ["scroll-margin"], { negative: true });
  simple(
    "scrollMargin",
    "scroll-mx",
    "scrollMargin",
    ["scroll-margin-left", "scroll-margin-right"],
    { negative: true }
  );
  simple(
    "scrollMargin",
    "scroll-my",
    "scrollMargin",
    ["scroll-margin-top", "scroll-margin-bottom"],
    { negative: true }
  );
  simple("scrollMargin", "scroll-ms", "scrollMargin", ["scroll-margin-inline-start"], {
    negative: true
  });
  simple("scrollMargin", "scroll-me", "scrollMargin", ["scroll-margin-inline-end"], {
    negative: true
  });
  simple("scrollMargin", "scroll-mt", "scrollMargin", ["scroll-margin-top"], { negative: true });
  simple("scrollMargin", "scroll-mr", "scrollMargin", ["scroll-margin-right"], { negative: true });
  simple("scrollMargin", "scroll-mb", "scrollMargin", ["scroll-margin-bottom"], { negative: true });
  simple("scrollMargin", "scroll-ml", "scrollMargin", ["scroll-margin-left"], { negative: true });
  simple("scrollPadding", "scroll-p", "scrollPadding", ["scroll-padding"]);
  simple("scrollPadding", "scroll-px", "scrollPadding", [
    "scroll-padding-left",
    "scroll-padding-right"
  ]);
  simple("scrollPadding", "scroll-py", "scrollPadding", [
    "scroll-padding-top",
    "scroll-padding-bottom"
  ]);
  simple("scrollPadding", "scroll-ps", "scrollPadding", ["scroll-padding-inline-start"]);
  simple("scrollPadding", "scroll-pe", "scrollPadding", ["scroll-padding-inline-end"]);
  simple("scrollPadding", "scroll-pt", "scrollPadding", ["scroll-padding-top"]);
  simple("scrollPadding", "scroll-pr", "scrollPadding", ["scroll-padding-right"]);
  simple("scrollPadding", "scroll-pb", "scrollPadding", ["scroll-padding-bottom"]);
  simple("scrollPadding", "scroll-pl", "scrollPadding", ["scroll-padding-left"]);
  simple("listStyleType", "list", "listStyleType", ["list-style-type"]);
  simple("listStyleImage", "list-image", "listStyleImage", ["list-style-image"]);
  simple("columns", "columns", "columns", ["columns"]);
  simple("gridAutoColumns", "auto-cols", "gridAutoColumns", ["grid-auto-columns"]);
  simple("gridAutoRows", "auto-rows", "gridAutoRows", ["grid-auto-rows"]);
  simple("gridTemplateColumns", "grid-cols", "gridTemplateColumns", ["grid-template-columns"]);
  simple("gridTemplateRows", "grid-rows", "gridTemplateRows", ["grid-template-rows"]);
  simple("gap", "gap", "gap", ["gap"]);
  simple("gap", "gap-x", "gap", ["column-gap"]);
  simple("gap", "gap-y", "gap", ["row-gap"]);
  list.push({
    plugin: "space",
    prefix: "space-x",
    values: scale("space"),
    types: [],
    negative: true,
    selector: CHILD_SELECTOR,
    describe: "horizontal space between children: {value}",
    build: (value) => ({
      "--tw-space-x-reverse": "0",
      "margin-right": `calc(${String(value)} * var(--tw-space-x-reverse))`,
      "margin-left": `calc(${String(value)} * calc(1 - var(--tw-space-x-reverse)))`
    })
  });
  list.push({
    plugin: "space",
    prefix: "space-y",
    values: scale("space"),
    types: [],
    negative: true,
    selector: CHILD_SELECTOR,
    describe: "vertical space between children: {value}",
    build: (value) => ({
      "--tw-space-y-reverse": "0",
      "margin-top": `calc(${String(value)} * calc(1 - var(--tw-space-y-reverse)))`,
      "margin-bottom": `calc(${String(value)} * var(--tw-space-y-reverse))`
    })
  });
  list.push({
    plugin: "divideWidth",
    prefix: "divide-x",
    values: scale("divideWidth"),
    types: ["line-width", "length", "any"],
    selector: CHILD_SELECTOR,
    defaults: "border-width",
    describe: "vertical divider width between children: {value}",
    build: (value) => ({
      "--tw-divide-x-reverse": "0",
      "border-right-width": `calc(${String(value)} * var(--tw-divide-x-reverse))`,
      "border-left-width": `calc(${String(value)} * calc(1 - var(--tw-divide-x-reverse)))`
    })
  });
  list.push({
    plugin: "divideWidth",
    prefix: "divide-y",
    values: scale("divideWidth"),
    types: ["line-width", "length", "any"],
    selector: CHILD_SELECTOR,
    defaults: "border-width",
    describe: "horizontal divider width between children: {value}",
    build: (value) => ({
      "--tw-divide-y-reverse": "0",
      "border-top-width": `calc(${String(value)} * calc(1 - var(--tw-divide-y-reverse)))`,
      "border-bottom-width": `calc(${String(value)} * var(--tw-divide-y-reverse))`
    })
  });
  colorUtility(
    "divideColor",
    "divide",
    "divideColor",
    ["border-color"],
    "--tw-divide-opacity",
    "divideOpacity",
    {
      selector: CHILD_SELECTOR
    }
  );
  opacityUtility("divideOpacity", "divide-opacity", "divideOpacity", "--tw-divide-opacity", {
    selector: CHILD_SELECTOR
  });
  simple("borderRadius", "rounded", "borderRadius", ["border-radius"]);
  simple("borderRadius", "rounded-s", "borderRadius", [
    "border-start-start-radius",
    "border-end-start-radius"
  ]);
  simple("borderRadius", "rounded-e", "borderRadius", [
    "border-start-end-radius",
    "border-end-end-radius"
  ]);
  simple("borderRadius", "rounded-t", "borderRadius", [
    "border-top-left-radius",
    "border-top-right-radius"
  ]);
  simple("borderRadius", "rounded-r", "borderRadius", [
    "border-top-right-radius",
    "border-bottom-right-radius"
  ]);
  simple("borderRadius", "rounded-b", "borderRadius", [
    "border-bottom-right-radius",
    "border-bottom-left-radius"
  ]);
  simple("borderRadius", "rounded-l", "borderRadius", [
    "border-top-left-radius",
    "border-bottom-left-radius"
  ]);
  simple("borderRadius", "rounded-ss", "borderRadius", ["border-start-start-radius"]);
  simple("borderRadius", "rounded-se", "borderRadius", ["border-start-end-radius"]);
  simple("borderRadius", "rounded-ee", "borderRadius", ["border-end-end-radius"]);
  simple("borderRadius", "rounded-es", "borderRadius", ["border-end-start-radius"]);
  simple("borderRadius", "rounded-tl", "borderRadius", ["border-top-left-radius"]);
  simple("borderRadius", "rounded-tr", "borderRadius", ["border-top-right-radius"]);
  simple("borderRadius", "rounded-br", "borderRadius", ["border-bottom-right-radius"]);
  simple("borderRadius", "rounded-bl", "borderRadius", ["border-bottom-left-radius"]);
  const lw = { types: ["line-width", "length"] };
  simple("borderWidth", "border", "borderWidth", ["border-width"], lw);
  simple("borderWidth", "border-x", "borderWidth", ["border-left-width", "border-right-width"], lw);
  simple("borderWidth", "border-y", "borderWidth", ["border-top-width", "border-bottom-width"], lw);
  simple("borderWidth", "border-s", "borderWidth", ["border-inline-start-width"], lw);
  simple("borderWidth", "border-e", "borderWidth", ["border-inline-end-width"], lw);
  simple("borderWidth", "border-t", "borderWidth", ["border-top-width"], lw);
  simple("borderWidth", "border-r", "borderWidth", ["border-right-width"], lw);
  simple("borderWidth", "border-b", "borderWidth", ["border-bottom-width"], lw);
  simple("borderWidth", "border-l", "borderWidth", ["border-left-width"], lw);
  colorUtility(
    "borderColor",
    "border",
    "borderColor",
    ["border-color"],
    "--tw-border-opacity",
    "borderOpacity"
  );
  colorUtility(
    "borderColor",
    "border-x",
    "borderColor",
    ["border-left-color", "border-right-color"],
    "--tw-border-opacity",
    "borderOpacity"
  );
  colorUtility(
    "borderColor",
    "border-y",
    "borderColor",
    ["border-top-color", "border-bottom-color"],
    "--tw-border-opacity",
    "borderOpacity"
  );
  colorUtility(
    "borderColor",
    "border-s",
    "borderColor",
    ["border-inline-start-color"],
    "--tw-border-opacity",
    "borderOpacity"
  );
  colorUtility(
    "borderColor",
    "border-e",
    "borderColor",
    ["border-inline-end-color"],
    "--tw-border-opacity",
    "borderOpacity"
  );
  colorUtility(
    "borderColor",
    "border-t",
    "borderColor",
    ["border-top-color"],
    "--tw-border-opacity",
    "borderOpacity"
  );
  colorUtility(
    "borderColor",
    "border-r",
    "borderColor",
    ["border-right-color"],
    "--tw-border-opacity",
    "borderOpacity"
  );
  colorUtility(
    "borderColor",
    "border-b",
    "borderColor",
    ["border-bottom-color"],
    "--tw-border-opacity",
    "borderOpacity"
  );
  colorUtility(
    "borderColor",
    "border-l",
    "borderColor",
    ["border-left-color"],
    "--tw-border-opacity",
    "borderOpacity"
  );
  opacityUtility("borderOpacity", "border-opacity", "borderOpacity", "--tw-border-opacity");
  colorUtility(
    "backgroundColor",
    "bg",
    "backgroundColor",
    ["background-color"],
    "--tw-bg-opacity",
    "backgroundOpacity"
  );
  opacityUtility("backgroundOpacity", "bg-opacity", "backgroundOpacity", "--tw-bg-opacity");
  simple("backgroundImage", "bg", "backgroundImage", ["background-image"], {
    types: ["lookup", "image", "url"]
  });
  const stops = flattenColorPalette(scale("gradientColorStops"));
  list.push({
    plugin: "gradientColorStops",
    prefix: "from",
    values: stops,
    types: ["color", "any"],
    modifier: "color",
    defaults: "gradient-color-stops",
    describe: "gradient start colour: {value}",
    build: (value) => {
      const color = toColorValue(value);
      return {
        "--tw-gradient-from": `${color} var(--tw-gradient-from-position)`,
        "--tw-gradient-to": `${transparentTo(color)} var(--tw-gradient-to-position)`,
        "--tw-gradient-stops": "var(--tw-gradient-from), var(--tw-gradient-to)"
      };
    }
  });
  list.push({
    plugin: "gradientColorStops",
    prefix: "from",
    values: scale("gradientColorStopPositions"),
    types: ["length", "percentage"],
    defaults: "gradient-color-stops",
    describe: "gradient start position: {value}",
    build: (value) => ({ "--tw-gradient-from-position": String(value) })
  });
  list.push({
    plugin: "gradientColorStops",
    prefix: "via",
    values: stops,
    types: ["color", "any"],
    modifier: "color",
    defaults: "gradient-color-stops",
    describe: "gradient middle colour: {value}",
    build: (value) => {
      const color = toColorValue(value);
      return {
        "--tw-gradient-to": `${transparentTo(color)}  var(--tw-gradient-to-position)`,
        "--tw-gradient-stops": `var(--tw-gradient-from), ${color} var(--tw-gradient-via-position), var(--tw-gradient-to)`
      };
    }
  });
  list.push({
    plugin: "gradientColorStops",
    prefix: "via",
    values: scale("gradientColorStopPositions"),
    types: ["length", "percentage"],
    defaults: "gradient-color-stops",
    describe: "gradient middle position: {value}",
    build: (value) => ({ "--tw-gradient-via-position": String(value) })
  });
  list.push({
    plugin: "gradientColorStops",
    prefix: "to",
    values: stops,
    types: ["color", "any"],
    modifier: "color",
    defaults: "gradient-color-stops",
    describe: "gradient end colour: {value}",
    build: (value) => ({
      "--tw-gradient-to": `${toColorValue(value)} var(--tw-gradient-to-position)`
    })
  });
  list.push({
    plugin: "gradientColorStops",
    prefix: "to",
    values: scale("gradientColorStopPositions"),
    types: ["length", "percentage"],
    defaults: "gradient-color-stops",
    describe: "gradient end position: {value}",
    build: (value) => ({ "--tw-gradient-to-position": String(value) })
  });
  simple("backgroundSize", "bg", "backgroundSize", ["background-size"], {
    types: ["lookup", "length", "percentage", "size"]
  });
  simple("backgroundPosition", "bg", "backgroundPosition", ["background-position"], {
    types: ["lookup", "position"],
    preferOnConflict: true
  });
  colorUtility("fill", "fill", "fill", ["fill"], null, null);
  colorUtility("stroke", "stroke", "stroke", ["stroke"], null, null, {
    types: ["color", "url", "any"]
  });
  simple("strokeWidth", "stroke", "strokeWidth", ["stroke-width"], {
    types: ["length", "number", "percentage"]
  });
  simple("objectPosition", "object", "objectPosition", ["object-position"]);
  simple("padding", "p", "padding", ["padding"]);
  simple("padding", "px", "padding", ["padding-left", "padding-right"]);
  simple("padding", "py", "padding", ["padding-top", "padding-bottom"]);
  simple("padding", "ps", "padding", ["padding-inline-start"]);
  simple("padding", "pe", "padding", ["padding-inline-end"]);
  simple("padding", "pt", "padding", ["padding-top"]);
  simple("padding", "pr", "padding", ["padding-right"]);
  simple("padding", "pb", "padding", ["padding-bottom"]);
  simple("padding", "pl", "padding", ["padding-left"]);
  simple("textIndent", "indent", "textIndent", ["text-indent"], { negative: true });
  list.push({
    plugin: "verticalAlign",
    prefix: "align",
    values: {},
    types: [],
    describe: "vertical-align: {value}",
    build: (value) => ({ "vertical-align": String(value) })
  });
  simple("fontFamily", "font", "fontFamily", ["font-family"], {
    types: ["lookup", "generic-name", "family-name"]
  });
  list.push({
    plugin: "fontSize",
    prefix: "text",
    values: scale("fontSize"),
    types: ["absolute-size", "relative-size", "length", "percentage"],
    modifier: "lineHeight",
    describe: "font-size: {value}",
    build: (value, { modifier }) => {
      const f = normalizeFontSize(value);
      if (modifier !== null) return { "font-size": f.size, "line-height": modifier };
      const out = { "font-size": f.size };
      if (f.lineHeight !== void 0) out["line-height"] = f.lineHeight;
      if (f.letterSpacing !== void 0) out["letter-spacing"] = f.letterSpacing;
      if (f.fontWeight !== void 0) out["font-weight"] = f.fontWeight;
      return out;
    }
  });
  simple("fontWeight", "font", "fontWeight", ["font-weight"], {
    types: ["lookup", "number", "any"]
  });
  simple("lineHeight", "leading", "lineHeight", ["line-height"]);
  simple("letterSpacing", "tracking", "letterSpacing", ["letter-spacing"], { negative: true });
  colorUtility("textColor", "text", "textColor", ["color"], "--tw-text-opacity", "textOpacity");
  opacityUtility("textOpacity", "text-opacity", "textOpacity", "--tw-text-opacity");
  colorUtility(
    "textDecorationColor",
    "decoration",
    "textDecorationColor",
    ["text-decoration-color"],
    null,
    null
  );
  simple(
    "textDecorationThickness",
    "decoration",
    "textDecorationThickness",
    ["text-decoration-thickness"],
    {
      types: ["length", "percentage"]
    }
  );
  simple(
    "textUnderlineOffset",
    "underline-offset",
    "textUnderlineOffset",
    ["text-underline-offset"],
    {
      types: ["length", "percentage", "any"]
    }
  );
  colorUtility(
    "placeholderColor",
    "placeholder",
    "placeholderColor",
    ["color"],
    "--tw-placeholder-opacity",
    "placeholderOpacity",
    {
      selector: "::placeholder"
    }
  );
  opacityUtility(
    "placeholderOpacity",
    "placeholder-opacity",
    "placeholderOpacity",
    "--tw-placeholder-opacity",
    {
      selector: "::placeholder"
    }
  );
  colorUtility("caretColor", "caret", "caretColor", ["caret-color"], null, null);
  colorUtility("accentColor", "accent", "accentColor", ["accent-color"], null, null);
  simple("opacity", "opacity", "opacity", ["opacity"]);
  list.push({
    plugin: "boxShadow",
    prefix: "shadow",
    values: scale("boxShadow"),
    types: ["shadow"],
    defaults: "box-shadow",
    describe: "box-shadow: {value}",
    build: (value) => {
      const v = transformThemeValue("boxShadow", value);
      return {
        "--tw-shadow": v === "none" ? "0 0 #0000" : v,
        "--tw-shadow-colored": v === "none" ? "0 0 #0000" : colorizeShadow(v),
        "box-shadow": "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)"
      };
    }
  });
  list.push({
    plugin: "boxShadowColor",
    prefix: "shadow",
    values: withoutDefault(flattenColorPalette(scale("boxShadowColor"))),
    types: ["color", "any"],
    modifier: "color",
    describe: "shadow colour: {value}",
    build: (value) => ({
      "--tw-shadow-color": toColorValue(value),
      "--tw-shadow": "var(--tw-shadow-colored)"
    })
  });
  simple("outlineWidth", "outline", "outlineWidth", ["outline-width"], {
    types: ["length", "number", "percentage"]
  });
  simple("outlineOffset", "outline-offset", "outlineOffset", ["outline-offset"], {
    types: ["length", "number", "percentage", "any"],
    negative: true
  });
  colorUtility("outlineColor", "outline", "outlineColor", ["outline-color"], null, null);
  list.push({
    plugin: "ringWidth",
    prefix: "ring",
    values: scale("ringWidth"),
    types: ["length"],
    defaults: "ring-width",
    describe: "ring width: {value}",
    build: (value) => ({
      "--tw-ring-offset-shadow": "var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
      "--tw-ring-shadow": `var(--tw-ring-inset) 0 0 0 calc(${String(value)} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
      "box-shadow": "var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)"
    })
  });
  colorUtility(
    "ringColor",
    "ring",
    "ringColor",
    ["--tw-ring-color"],
    "--tw-ring-opacity",
    "ringOpacity"
  );
  opacityUtility("ringOpacity", "ring-opacity", "ringOpacity", "--tw-ring-opacity", {
    values: withoutDefault(scale("ringOpacity"))
  });
  simple("ringOffsetWidth", "ring-offset", "ringOffsetWidth", ["--tw-ring-offset-width"], {
    types: ["length"]
  });
  colorUtility(
    "ringOffsetColor",
    "ring-offset",
    "ringOffsetColor",
    ["--tw-ring-offset-color"],
    null,
    null
  );
  filterUtility("blur", "blur", "blur", "--tw-blur", "blur");
  filterUtility("brightness", "brightness", "brightness", "--tw-brightness", "brightness");
  filterUtility("contrast", "contrast", "contrast", "--tw-contrast", "contrast");
  list.push({
    plugin: "dropShadow",
    prefix: "drop-shadow",
    values: scale("dropShadow"),
    types: [],
    defaults: "filter",
    describe: "drop-shadow filter: {value}",
    build: (value) => ({
      "--tw-drop-shadow": Array.isArray(value) ? value.map((v) => `drop-shadow(${v})`).join(" ") : `drop-shadow(${String(value)})`,
      filter: FILTER_VALUE
    })
  });
  filterUtility("grayscale", "grayscale", "grayscale", "--tw-grayscale", "grayscale");
  filterUtility("hueRotate", "hue-rotate", "hueRotate", "--tw-hue-rotate", "hue-rotate", true);
  filterUtility("invert", "invert", "invert", "--tw-invert", "invert");
  filterUtility("saturate", "saturate", "saturate", "--tw-saturate", "saturate");
  filterUtility("sepia", "sepia", "sepia", "--tw-sepia", "sepia");
  backdropUtility("backdropBlur", "backdrop-blur", "backdropBlur", "--tw-backdrop-blur", "blur");
  backdropUtility(
    "backdropBrightness",
    "backdrop-brightness",
    "backdropBrightness",
    "--tw-backdrop-brightness",
    "brightness"
  );
  backdropUtility(
    "backdropContrast",
    "backdrop-contrast",
    "backdropContrast",
    "--tw-backdrop-contrast",
    "contrast"
  );
  backdropUtility(
    "backdropGrayscale",
    "backdrop-grayscale",
    "backdropGrayscale",
    "--tw-backdrop-grayscale",
    "grayscale"
  );
  backdropUtility(
    "backdropHueRotate",
    "backdrop-hue-rotate",
    "backdropHueRotate",
    "--tw-backdrop-hue-rotate",
    "hue-rotate",
    true
  );
  backdropUtility(
    "backdropInvert",
    "backdrop-invert",
    "backdropInvert",
    "--tw-backdrop-invert",
    "invert"
  );
  backdropUtility(
    "backdropOpacity",
    "backdrop-opacity",
    "backdropOpacity",
    "--tw-backdrop-opacity",
    "opacity"
  );
  backdropUtility(
    "backdropSaturate",
    "backdrop-saturate",
    "backdropSaturate",
    "--tw-backdrop-saturate",
    "saturate"
  );
  backdropUtility(
    "backdropSepia",
    "backdrop-sepia",
    "backdropSepia",
    "--tw-backdrop-sepia",
    "sepia"
  );
  list.push({
    plugin: "transitionProperty",
    prefix: "transition",
    values: scale("transitionProperty"),
    types: [],
    describe: "transition-property: {value}",
    build: (value) => {
      const v = transformThemeValue("transitionProperty", value);
      if (v === "none") return { "transition-property": "none" };
      const duration = scale("transitionDuration").DEFAULT;
      const timing = scale("transitionTimingFunction").DEFAULT;
      return {
        "transition-property": v,
        ...timing === void 0 ? {} : {
          "transition-timing-function": transformThemeValue("transitionTimingFunction", timing)
        },
        ...duration === void 0 ? {} : { "transition-duration": transformThemeValue("transitionDuration", duration) }
      };
    }
  });
  simple("transitionDelay", "delay", "transitionDelay", ["transition-delay"]);
  simple("transitionDuration", "duration", "transitionDuration", ["transition-duration"], {
    filterDefault: true
  });
  simple(
    "transitionTimingFunction",
    "ease",
    "transitionTimingFunction",
    ["transition-timing-function"],
    { filterDefault: true }
  );
  simple("willChange", "will-change", "willChange", ["will-change"]);
  list.push({
    plugin: "content",
    prefix: "content",
    values: scale("content"),
    types: [],
    describe: "content: {value}",
    build: (value) => ({ "--tw-content": String(value), content: "var(--tw-content)" })
  });
  list.push({
    plugin: "containerQueries",
    prefix: "@container",
    values: { DEFAULT: "inline-size", normal: "normal" },
    types: [],
    modifier: "any",
    describe: "container-type: {value}",
    build: (value, { modifier }) => ({
      "container-type": String(value),
      ...modifier ? { "container-name": modifier } : {}
    })
  });
  return list;
}
var SHADOW_KEYWORDS = /* @__PURE__ */ new Set(["inset", "inherit", "initial", "revert", "unset"]);
var SHADOW_LENGTH = /^-?(\d+|\.\d+)(.*?)$/;
function parseBoxShadowValue(input) {
  return splitComma(input).map((shadow) => {
    const value = shadow.trim();
    const result = { raw: value, valid: false };
    const parts = value.split(/ +(?![^(]*\))/g);
    const seen = /* @__PURE__ */ new Set();
    for (const part of parts) {
      if (!seen.has("KEYWORD") && SHADOW_KEYWORDS.has(part)) {
        result.keyword = part;
        seen.add("KEYWORD");
      } else if (SHADOW_LENGTH.test(part)) {
        if (!seen.has("X")) {
          result.x = part;
          seen.add("X");
        } else if (!seen.has("Y")) {
          result.y = part;
          seen.add("Y");
        } else if (!seen.has("BLUR")) {
          result.blur = part;
          seen.add("BLUR");
        } else if (!seen.has("SPREAD")) {
          result.spread = part;
          seen.add("SPREAD");
        }
      } else if (!result.color) {
        result.color = part;
      } else {
        (result.unknown ??= []).push(part);
      }
    }
    result.valid = result.x !== void 0 && result.y !== void 0;
    return result;
  });
}
function colorizeShadow(value) {
  return parseBoxShadowValue(value).map((s) => {
    if (!s.valid) return s.raw;
    return [s.keyword, s.x, s.y, s.blur, s.spread, "var(--tw-shadow-color)", ...s.unknown ?? []].filter(Boolean).join(" ");
  }).join(", ");
}
var CORE_PLUGIN_ORDER = [
  "preflight",
  "container",
  "accessibility",
  "pointerEvents",
  "visibility",
  "position",
  "inset",
  "isolation",
  "zIndex",
  "order",
  "gridColumn",
  "gridColumnStart",
  "gridColumnEnd",
  "gridRow",
  "gridRowStart",
  "gridRowEnd",
  "float",
  "clear",
  "margin",
  "boxSizing",
  "lineClamp",
  "display",
  "aspectRatio",
  "size",
  "height",
  "maxHeight",
  "minHeight",
  "width",
  "minWidth",
  "maxWidth",
  "flex",
  "flexShrink",
  "flexGrow",
  "flexBasis",
  "tableLayout",
  "captionSide",
  "borderCollapse",
  "borderSpacing",
  "transformOrigin",
  "translate",
  "rotate",
  "skew",
  "scale",
  "transform",
  "animation",
  "cursor",
  "touchAction",
  "userSelect",
  "resize",
  "scrollSnapType",
  "scrollSnapAlign",
  "scrollSnapStop",
  "scrollMargin",
  "scrollPadding",
  "listStylePosition",
  "listStyleType",
  "listStyleImage",
  "appearance",
  "columns",
  "breakBefore",
  "breakInside",
  "breakAfter",
  "gridAutoColumns",
  "gridAutoFlow",
  "gridAutoRows",
  "gridTemplateColumns",
  "gridTemplateRows",
  "flexDirection",
  "flexWrap",
  "placeContent",
  "placeItems",
  "alignContent",
  "alignItems",
  "justifyContent",
  "justifyItems",
  "gap",
  "space",
  "divideWidth",
  "divideStyle",
  "divideColor",
  "divideOpacity",
  "placeSelf",
  "alignSelf",
  "justifySelf",
  "overflow",
  "overscrollBehavior",
  "scrollBehavior",
  "textOverflow",
  "hyphens",
  "whitespace",
  "textWrap",
  "wordBreak",
  "borderRadius",
  "borderWidth",
  "borderStyle",
  "borderColor",
  "borderOpacity",
  "backgroundColor",
  "backgroundOpacity",
  "backgroundImage",
  "gradientColorStops",
  "boxDecorationBreak",
  "backgroundSize",
  "backgroundAttachment",
  "backgroundClip",
  "backgroundPosition",
  "backgroundRepeat",
  "backgroundOrigin",
  "fill",
  "stroke",
  "strokeWidth",
  "objectFit",
  "objectPosition",
  "padding",
  "textAlign",
  "textIndent",
  "verticalAlign",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "textTransform",
  "fontStyle",
  "fontVariantNumeric",
  "lineHeight",
  "letterSpacing",
  "textColor",
  "textOpacity",
  "textDecoration",
  "textDecorationColor",
  "textDecorationStyle",
  "textDecorationThickness",
  "textUnderlineOffset",
  "fontSmoothing",
  "placeholderColor",
  "placeholderOpacity",
  "caretColor",
  "accentColor",
  "opacity",
  "backgroundBlendMode",
  "mixBlendMode",
  "boxShadow",
  "boxShadowColor",
  "outlineStyle",
  "outlineWidth",
  "outlineOffset",
  "outlineColor",
  "ringWidth",
  "ringColor",
  "ringOpacity",
  "ringOffsetWidth",
  "ringOffsetColor",
  "blur",
  "brightness",
  "contrast",
  "dropShadow",
  "grayscale",
  "hueRotate",
  "invert",
  "saturate",
  "sepia",
  "filter",
  "backdropBlur",
  "backdropBrightness",
  "backdropContrast",
  "backdropGrayscale",
  "backdropHueRotate",
  "backdropInvert",
  "backdropOpacity",
  "backdropSaturate",
  "backdropSepia",
  "backdropFilter",
  "transitionProperty",
  "transitionDelay",
  "transitionDuration",
  "transitionTimingFunction",
  "willChange",
  "contain",
  "content",
  "forcedColorAdjust",
  // Nakshora built-ins that Tailwind ships as plugins
  "containerQueries"
];
var DEFAULTS_GROUPS = {
  "border-spacing": { "--tw-border-spacing-x": "0", "--tw-border-spacing-y": "0" },
  transform: {
    "--tw-translate-x": "0",
    "--tw-translate-y": "0",
    "--tw-rotate": "0",
    "--tw-skew-x": "0",
    "--tw-skew-y": "0",
    "--tw-scale-x": "1",
    "--tw-scale-y": "1"
  },
  "touch-action": { "--tw-pan-x": " ", "--tw-pan-y": " ", "--tw-pinch-zoom": " " },
  "scroll-snap-type": { "--tw-scroll-snap-strictness": "proximity" },
  "gradient-color-stops": {
    "--tw-gradient-from-position": " ",
    "--tw-gradient-via-position": " ",
    "--tw-gradient-to-position": " "
  },
  "font-variant-numeric": {
    "--tw-ordinal": " ",
    "--tw-slashed-zero": " ",
    "--tw-numeric-figure": " ",
    "--tw-numeric-spacing": " ",
    "--tw-numeric-fraction": " "
  },
  "box-shadow": {
    "--tw-ring-offset-shadow": "0 0 #0000",
    "--tw-ring-shadow": "0 0 #0000",
    "--tw-shadow": "0 0 #0000",
    "--tw-shadow-colored": "0 0 #0000"
  },
  "ring-width": {
    "--tw-ring-inset": " ",
    "--tw-ring-offset-width": "0px",
    "--tw-ring-offset-color": "#fff",
    "--tw-ring-color": "rgb(59 130 246 / 0.5)",
    "--tw-ring-offset-shadow": "0 0 #0000",
    "--tw-ring-shadow": "0 0 #0000",
    "--tw-shadow": "0 0 #0000",
    "--tw-shadow-colored": "0 0 #0000"
  },
  filter: {
    "--tw-blur": " ",
    "--tw-brightness": " ",
    "--tw-contrast": " ",
    "--tw-grayscale": " ",
    "--tw-hue-rotate": " ",
    "--tw-invert": " ",
    "--tw-saturate": " ",
    "--tw-sepia": " ",
    "--tw-drop-shadow": " "
  },
  "backdrop-filter": {
    "--tw-backdrop-blur": " ",
    "--tw-backdrop-brightness": " ",
    "--tw-backdrop-contrast": " ",
    "--tw-backdrop-grayscale": " ",
    "--tw-backdrop-hue-rotate": " ",
    "--tw-backdrop-invert": " ",
    "--tw-backdrop-opacity": " ",
    "--tw-backdrop-saturate": " ",
    "--tw-backdrop-sepia": " "
  },
  contain: {
    "--tw-contain-size": " ",
    "--tw-contain-layout": " ",
    "--tw-contain-paint": " ",
    "--tw-contain-style": " "
  },
  "border-width": {}
};
var BARE_VALUE = {
  integer: /^\d+$/,
  number: /^\d+(?:\.\d+)?$/,
  percentage: /^\d+(?:\.\d+)?%$/
};
var CATALOG_CACHE = /* @__PURE__ */ new Map();
var CATALOG_CACHE_MAX = 4;
var PSEUDO_ELEMENTS = [
  ["first-letter", "&::first-letter"],
  ["first-line", "&::first-line"],
  ["marker", ["& *::marker", "&::marker"], void 0, ["--tw-text-opacity"]],
  ["selection", ["& *::selection", "&::selection"]],
  ["file", "&::file-selector-button"],
  ["placeholder", "&::placeholder"],
  ["backdrop", "&::backdrop"],
  ["before", "&::before", { content: "var(--tw-content)" }],
  ["after", "&::after", { content: "var(--tw-content)" }]
];
var VISITED_STRIP = ["--tw-text-opacity", "--tw-border-opacity", "--tw-bg-opacity"];
var PSEUDO_CLASSES = [
  ["first", "&:first-child"],
  ["last", "&:last-child"],
  ["only", "&:only-child"],
  ["odd", "&:nth-child(odd)"],
  ["even", "&:nth-child(even)"],
  ["first-of-type", "&:first-of-type"],
  ["last-of-type", "&:last-of-type"],
  ["only-of-type", "&:only-of-type"],
  ["visited", "&:visited"],
  ["target", "&:target"],
  ["open", "&[open]"],
  ["default", "&:default"],
  ["checked", "&:checked"],
  ["indeterminate", "&:indeterminate"],
  ["placeholder-shown", "&:placeholder-shown"],
  ["autofill", "&:autofill"],
  ["optional", "&:optional"],
  ["required", "&:required"],
  ["valid", "&:valid"],
  ["invalid", "&:invalid"],
  ["in-range", "&:in-range"],
  ["out-of-range", "&:out-of-range"],
  ["read-only", "&:read-only"],
  ["empty", "&:empty"],
  ["focus-within", "&:focus-within"],
  ["hover", "&:hover"],
  ["focus", "&:focus"],
  ["focus-visible", "&:focus-visible"],
  ["active", "&:active"],
  ["enabled", "&:enabled"],
  ["disabled", "&:disabled"],
  // Nakshora / v4 additions
  ["inert", "&:is([inert], [inert] *)"],
  ["nth-last-child", "&:nth-last-child"]
];
var LEGACY_VARIANT_KEYS = {
  focusVisible: "focus-visible",
  focusWithin: "focus-within",
  firstChild: "first",
  lastChild: "last",
  groupHover: "group-hover",
  groupFocus: "group-focus",
  peerHover: "peer-hover",
  peerFocus: "peer-focus"
};
var MEDIA_SORT = {
  supports: 100,
  motion: 200,
  contrast: 300,
  screen: 1e3,
  container: 5e3,
  orientation: 6e3,
  dark: 6200,
  forcedColors: 6300,
  print: 6400,
  starting: 6500,
  arbitrary: 7e3
};
function minWidthCond(value, sortBase = MEDIA_SORT.screen) {
  const px = screenToPx(value);
  return {
    kind: "media",
    params: `(min-width: ${value})`,
    sort: sortBase + (Number.isNaN(px) ? 0 : px / 10),
    min: px
  };
}
function maxWidthCond(value, sortBase = MEDIA_SORT.screen + 3e3) {
  const px = screenToPx(value);
  return {
    kind: "media",
    params: `(max-width: ${value})`,
    sort: sortBase - (Number.isNaN(px) ? 0 : px / 10),
    max: px
  };
}
function maxWidthValue(minValue) {
  const m = /^(\d+(?:\.\d+)?)(px|rem|em)$/.exec(minValue.trim());
  if (!m) return minValue;
  const n = parseFloat(m[1]);
  const unit = m[2];
  const step = unit === "px" ? 0.02 : 0.02 / 16;
  const v = n - step;
  return `${Number.isInteger(v) ? v : parseFloat(v.toFixed(4))}${unit}`;
}
var Engine = class {
  theme;
  options;
  /** static class → defs (later wins for duplicates) */
  /**
   * class → every static rule registered for it. Core classes map to one rule;
   * plugin components (e.g. typography's `.prose`) register dozens of rules
   * for the same class (different selector suffixes / at-rules), all of which
   * must be emitted.
   */
  staticMap = /* @__PURE__ */ new Map();
  /** prefix → functional utilities */
  functionalMap = /* @__PURE__ */ new Map();
  functional;
  statics;
  variants = /* @__PURE__ */ new Map();
  functionalVariants = [];
  pluginIndex = /* @__PURE__ */ new Map();
  screens;
  cache = /* @__PURE__ */ new Map();
  seq = 0;
  constructor(options) {
    this.options = options;
    this.theme = options.theme;
    CORE_PLUGIN_ORDER.forEach((p, i) => this.pluginIndex.set(p, i));
    this.screens = Object.entries(this.theme.screens).sort(
      (a, b) => screenToPx(a[1]) - screenToPx(b[1])
    );
    this.statics = [...STATIC_UTILITIES, ...NAKSHORA_STATIC, ...options.extraStatic ?? []].map(
      (s, index) => ({ ...s, index })
    );
    for (const s of this.statics) {
      if (!this.pluginIndex.has(s.p)) this.pluginIndex.set(s.p, this.pluginIndex.size + 1e3);
      const list = this.staticMap.get(s.c);
      if (list) list.push(s);
      else this.staticMap.set(s.c, [s]);
    }
    this.functional = [
      ...buildFunctionalUtilities(this.theme, { pluginEnabled: options.pluginEnabled }),
      ...options.extraFunctional ?? []
    ].map((f, index) => ({ ...f, index }));
    for (const f of this.functional) {
      if (!this.pluginIndex.has(f.plugin))
        this.pluginIndex.set(f.plugin, this.pluginIndex.size + 1e3);
      const list = this.functionalMap.get(f.prefix) ?? [];
      list.push(f);
      this.functionalMap.set(f.prefix, list);
    }
    this.buildVariants(options.extraVariants ?? []);
  }
  /** next free cascade weight (Tailwind variant bit) */
  nextBit = 1;
  /**
   * Register a variant and reserve its cascade weights: one per static branch
   * (`marker` → 2, `dark` with two formats → 2), or `slots + 1` for a
   * functional variant (one per themed value, the last one for arbitrary
   * values) — exactly what Tailwind's `Offsets.recordVariant` does.
   */
  registerVariant(input) {
    const bit = this.nextBit;
    const width = input.match ? (input.slots ?? 0) + 1 : input.branches?.length ?? 1;
    this.nextBit += width;
    const v = { ...input, sort: bit };
    if (v.branches) v.branches = v.branches.map((b, i) => ({ ...b, bit: bit + i }));
    this.variants.set(v.name, v);
    if (v.match) this.functionalVariants.push(v);
    this.functionalVariants.sort((a, b) => b.name.length - a.name.length);
  }
  // ───────────────────────── variant table ─────────────────────────
  /**
   * Variants in Tailwind 3.4's registration order — the order *is* the
   * cascade: child → pseudo-elements → pseudo-classes → group-* → peer-* →
   * has/aria/data → plugin variants (built-in `@container` first) → supports →
   * motion/contrast → [dark when `class`] → screens (max-*, then min) →
   * orientation → direction → [dark otherwise] → forced-colors → print.
   * Nakshora extras (`inert`, `not-*`, `starting`) sit next to their
   * closest relatives.
   */
  buildVariants(extra) {
    const push = (v) => this.registerVariant(v);
    push({
      name: "*",
      key: "child",
      branches: [{ format: "& > *" }],
      description: "direct children"
    });
    for (const [name, fmt, decls, stripAlpha] of PSEUDO_ELEMENTS) {
      const formats = Array.isArray(fmt) ? fmt : [fmt];
      push({
        name,
        key: name,
        branches: formats.map((format) => ({ format, decls, stripAlpha })),
        description: `::${name} pseudo-element`
      });
    }
    const pseudoBranches = /* @__PURE__ */ new Map();
    for (const [name, fmt] of PSEUDO_CLASSES) {
      if (name === "nth-last-child") continue;
      pseudoBranches.set(name, fmt);
      push({
        name,
        key: name,
        branches: [{ format: fmt, stripAlpha: name === "visited" ? VISITED_STRIP : void 0 }],
        description: `${fmt.slice(1)} state`
      });
    }
    push({
      name: "not",
      key: "not",
      functional: true,
      match: (value) => {
        if (value.startsWith("[") && value.endsWith("]"))
          return [{ format: `&:not(${normalizeValue(value.slice(1, -1))})` }];
        const fmt = pseudoBranches.get(value);
        if (!fmt) return null;
        return [{ format: `&:not(${fmt.slice(1)})` }];
      },
      description: "negated state (`not-hover:`, `not-[\u2026]:`)"
    });
    for (const kind of ["group", "peer"]) {
      const combinator = kind === "group" ? " &" : " ~ &";
      for (const [name, fmt] of PSEUDO_CLASSES) {
        if (name === "nth-last-child") continue;
        const sel = fmt.slice(1);
        push({
          name: `${kind}-${name}`,
          key: `${kind}-${name}`,
          match: (_v, modifier) => [
            { format: `:merge(.${kind}${modifier ? `\\/${modifier}` : ""})${sel}${combinator}` }
          ],
          description: `${kind === "group" ? "parent .group" : "preceding .peer sibling"} ${sel}`
        });
      }
      push({
        name: kind,
        key: kind,
        functional: true,
        match: (value, modifier) => {
          if (!(value.startsWith("[") && value.endsWith("]"))) return null;
          const base = `:merge(.${kind}${modifier ? `\\/${modifier}` : ""})`;
          const sel = normalizeValue(value.slice(1, -1));
          if (sel.includes("&")) return [{ format: sel.replace(/&/g, base) + combinator }];
          return [{ format: `${base}${sel}${combinator}` }];
        },
        description: `${kind} arbitrary state (\`${kind}-[\u2026]:\`)`
      });
    }
    const hasFamily = (kind) => {
      const name = kind ? `${kind}-has` : "has";
      push({
        name,
        key: name,
        functional: true,
        match: (value, modifier) => {
          if (!(value.startsWith("[") && value.endsWith("]"))) return null;
          const has = `:has(${normalizeValue(value.slice(1, -1))})`;
          if (!kind) return [{ format: `&${has}` }];
          const base = `:merge(.${kind}${modifier ? `\\/${modifier}` : ""})`;
          return [{ format: `${base}${has}${kind === "group" ? " &" : " ~ &"}` }];
        },
        description: kind ? `${kind} :has() relational state` : ":has() relational state"
      });
    };
    hasFamily("");
    hasFamily("group");
    hasFamily("peer");
    for (const attr of ["aria", "data"]) {
      const themed = Object.keys(this.theme[attr] ?? {});
      for (const kind of ["", "group", "peer"]) {
        const name = kind ? `${kind}-${attr}` : attr;
        push({
          name,
          key: name,
          functional: true,
          slots: themed.length,
          match: (value, modifier) => {
            const selector = this.attrSelector(attr, value);
            if (!selector) return null;
            const slot = themed.indexOf(value);
            const format = kind ? `:merge(.${kind}${modifier ? `\\/${modifier}` : ""})${selector}${kind === "group" ? " &" : " ~ &"}` : `&${selector}`;
            return { branches: [{ format }], slot: slot === -1 ? themed.length : slot };
          },
          description: `${kind ? `${kind} ` : ""}${attr} attribute state`
        });
      }
    }
    const containers = this.theme.containers;
    const containerKeys = Object.keys(containers);
    const containerHook = (value, modifier) => ({
      id: "@container",
      value,
      modifier,
      compare: compareContainers
    });
    const containerSize = (value) => {
      if (value.startsWith("[") && value.endsWith("]")) return normalizeValue(value.slice(1, -1));
      return containers[value] ?? null;
    };
    push({
      name: "@max",
      key: "containerQueries",
      functional: true,
      slots: containerKeys.length,
      match: (value, modifier) => {
        const size = containerSize(value);
        if (size === null) return null;
        const px = screenToPx(size);
        const slot = containerKeys.indexOf(value);
        return {
          branches: [
            {
              atrules: [
                {
                  kind: "container",
                  params: `${modifier ? `${modifier} ` : ""}(width < ${size})`,
                  sort: MEDIA_SORT.container - (Number.isNaN(px) ? 0 : px / 10),
                  max: px
                }
              ]
            }
          ],
          slot: slot === -1 ? containerKeys.length : slot,
          fn: {
            ...containerHook(size, modifier),
            id: "@container-max",
            compare: (a, b) => -compareContainers(a, b)
          }
        };
      },
      description: "@container max-size query"
    });
    push({
      name: "@",
      key: "containerQueries",
      functional: true,
      slots: containerKeys.length,
      match: (raw, modifier) => {
        const value = raw.startsWith("min-") ? raw.slice(4) : raw;
        const size = containerSize(value);
        if (size === null) return null;
        const px = screenToPx(size);
        const slot = containerKeys.indexOf(value);
        return {
          branches: [
            {
              atrules: [
                {
                  kind: "container",
                  params: `${modifier ? `${modifier} ` : ""}(min-width: ${size})`,
                  sort: MEDIA_SORT.container + (Number.isNaN(px) ? 0 : px / 10),
                  min: px
                }
              ]
            }
          ],
          slot: slot === -1 ? containerKeys.length : slot,
          fn: containerHook(size, modifier)
        };
      },
      description: "@container size query"
    });
    for (const v of extra) push(v);
    const media = (name, params, sort, description) => push({
      name,
      key: name,
      branches: [{ atrules: [{ kind: "media", params, sort }] }],
      description
    });
    const supportsThemed = Object.keys(this.theme.supports ?? {});
    push({
      name: "supports",
      key: "supports",
      functional: true,
      slots: supportsThemed.length,
      match: (value) => {
        let check;
        if (value.startsWith("[") && value.endsWith("]")) {
          check = normalizeValue(value.slice(1, -1));
        } else {
          const themed = this.theme.supports[value];
          if (themed === void 0) return null;
          check = themed;
        }
        const isRaw = /^\w*\s*\(/.test(check);
        if (isRaw)
          check = check.replace(/\b(and|or|not)\b/g, " $1 ").replace(/\s+/g, " ").trim();
        else check = check.includes(":") ? `(${check})` : `(${check}: var(--tw))`;
        const slot = supportsThemed.indexOf(value);
        return {
          branches: [{ atrules: [{ kind: "supports", params: check, sort: MEDIA_SORT.supports }] }],
          slot: slot === -1 ? supportsThemed.length : slot
        };
      },
      description: "@supports feature query"
    });
    media(
      "motion-safe",
      "(prefers-reduced-motion: no-preference)",
      MEDIA_SORT.motion,
      "user allows motion"
    );
    media(
      "motion-reduce",
      "(prefers-reduced-motion: reduce)",
      MEDIA_SORT.motion + 1,
      "user prefers reduced motion"
    );
    media(
      "contrast-more",
      "(prefers-contrast: more)",
      MEDIA_SORT.contrast,
      "user prefers more contrast"
    );
    media(
      "contrast-less",
      "(prefers-contrast: less)",
      MEDIA_SORT.contrast + 1,
      "user prefers less contrast"
    );
    const dark = this.options.darkMode;
    const legacyDark = dark === "class" || Array.isArray(dark) && dark[0] === "class";
    const pushDark = () => {
      if (dark === false) return;
      const [mode, selector] = Array.isArray(dark) ? dark : [dark, void 0];
      let branches;
      if (mode === "media") {
        branches = [
          {
            atrules: [
              { kind: "media", params: "(prefers-color-scheme: dark)", sort: MEDIA_SORT.dark }
            ]
          }
        ];
      } else if (mode === "variant") {
        const formats = Array.isArray(selector) ? selector : [selector ?? "&:is(.dark *)"];
        branches = formats.map((format) => this.formatToBranch(format, MEDIA_SORT.dark));
      } else if (mode === "selector") {
        const sel = selector ?? ".dark";
        branches = [{ format: `&:where(${sel}, ${sel} *)` }];
      } else {
        const sel = selector ?? ".dark";
        branches = [{ format: `&:is(${sel} *)` }];
      }
      push({ name: "dark", key: "dark", branches, description: "dark mode" });
    };
    if (legacyDark) pushDark();
    const minHook = (px) => ({
      id: "min-screens",
      value: px,
      modifier: null,
      compare: (a, b) => a.value - b.value
    });
    const maxHook = (px) => ({
      id: "max-screens",
      value: px,
      modifier: null,
      compare: (a, b) => b.value - a.value
    });
    for (const [name, value] of this.screens) {
      push({
        name: `max-${name}`,
        key: "maxResponsive",
        branches: [{ atrules: [maxWidthCond(maxWidthValue(value))] }],
        fn: maxHook(screenToPx(value)),
        description: `max-width ${maxWidthValue(value)}`
      });
    }
    push({
      name: "max",
      key: "maxResponsive",
      functional: true,
      match: (value) => {
        if (!(value.startsWith("[") && value.endsWith("]"))) return null;
        const v = normalizeValue(value.slice(1, -1));
        if (!typeCheckers.length(v)) return null;
        return { branches: [{ atrules: [maxWidthCond(v)] }], fn: maxHook(screenToPx(v)) };
      },
      description: "arbitrary max-width"
    });
    for (const [name, value] of this.screens) {
      push({
        name,
        key: "responsive",
        branches: [{ atrules: [minWidthCond(value)] }],
        fn: minHook(screenToPx(value)),
        description: `min-width ${value}`
      });
    }
    push({
      name: "min",
      key: "responsive",
      functional: true,
      match: (value) => {
        if (!(value.startsWith("[") && value.endsWith("]"))) return null;
        const v = normalizeValue(value.slice(1, -1));
        if (!typeCheckers.length(v)) return null;
        return { branches: [{ atrules: [minWidthCond(v)] }], fn: minHook(screenToPx(v)) };
      },
      description: "arbitrary min-width"
    });
    media("portrait", "(orientation: portrait)", MEDIA_SORT.orientation, "portrait orientation");
    media(
      "landscape",
      "(orientation: landscape)",
      MEDIA_SORT.orientation + 1,
      "landscape orientation"
    );
    push({
      name: "ltr",
      key: "ltr",
      branches: [{ format: '&:where([dir="ltr"], [dir="ltr"] *)' }],
      description: "left-to-right documents"
    });
    push({
      name: "rtl",
      key: "rtl",
      branches: [{ format: '&:where([dir="rtl"], [dir="rtl"] *)' }],
      description: "right-to-left documents"
    });
    if (!legacyDark) pushDark();
    media(
      "forced-colors",
      "(forced-colors: active)",
      MEDIA_SORT.forcedColors,
      "forced colours mode"
    );
    media("print", "print", MEDIA_SORT.print, "print media");
    push({
      name: "starting",
      key: "starting",
      branches: [{ atrules: [{ kind: "starting", params: "", sort: MEDIA_SORT.starting }] }],
      description: "@starting-style (entry transitions)"
    });
  }
  /** `@media (…) { &:not(.light *) }` / `&:is(.dark *)` / `@media (…)` → branch */
  formatToBranch(format, sort) {
    const f = format.trim();
    const m = /^@([\w-]+)\s*([^{]*?)\s*(?:\{\s*(.*?)\s*\})?$/.exec(f);
    if (!m) return { format: f };
    const kind = m[1] === "media" ? "media" : m[1] === "supports" ? "supports" : m[1] === "container" ? "container" : "raw";
    const inner = m[3];
    return {
      atrules: [{ kind, params: kind === "raw" ? `${m[1]} ${m[2]}` : m[2], sort }],
      format: inner && inner !== "&" ? inner : void 0
    };
  }
  attrSelector(kind, value) {
    if (value.startsWith("[") && value.endsWith("]")) {
      return `[${kind}-${normalizeAttributeSelectors(normalizeValue(value.slice(1, -1)))}]`;
    }
    const themed = this.theme[kind]?.[value];
    if (themed === void 0) return null;
    return `[${kind}-${themed}]`;
  }
  /** Public: variant definitions (docs / IntelliSense). */
  getVariants() {
    return [...this.variants.values()];
  }
  getScreens() {
    return this.screens;
  }
  // ───────────────────────── catalog ─────────────────────────
  /** Every value-bearing utility class the theme defines (no variants, no arbitrary values). */
  /**
   * Full catalog (one entry per value-bearing class). Memoised per *resolved
   * theme + enabled core plugins* across Engine instances: the Vite/PostCSS
   * plugins create a fresh generator per build, and the catalog (11k entries,
   * ~35 ms) only depends on those inputs. Engines with plugin-added utilities
   * are not shared (their extras are per instance). Entries are shared by
   * reference — callers must treat them as read-only.
   */
  buildCatalog() {
    if (this.catalogMemo) return this.catalogMemo;
    const hasExtras = (this.options.extraStatic?.length ?? 0) > 0 || (this.options.extraFunctional?.length ?? 0) > 0;
    const key = hasExtras ? null : this.catalogKey();
    if (key !== null) {
      const hit = CATALOG_CACHE.get(key);
      if (hit) {
        CATALOG_CACHE.delete(key);
        CATALOG_CACHE.set(key, hit);
        this.catalogMemo = hit;
        return hit;
      }
    }
    const built = this.buildCatalogUncached();
    if (key !== null) {
      CATALOG_CACHE.set(key, built);
      if (CATALOG_CACHE.size > CATALOG_CACHE_MAX)
        CATALOG_CACHE.delete(CATALOG_CACHE.keys().next().value);
    }
    this.catalogMemo = built;
    return built;
  }
  catalogMemo = null;
  /** Cache key: theme JSON + which core plugins are enabled. */
  catalogKey() {
    const plugins = /* @__PURE__ */ new Set();
    for (const s of this.statics) plugins.add(s.p);
    for (const f of this.functional) plugins.add(f.plugin);
    plugins.add("container");
    const enabled = [...plugins].sort().filter((p) => this.options.pluginEnabled(p));
    return `${enabled.join(",")}\0${JSON.stringify(this.theme)}`;
  }
  buildCatalogUncached() {
    const out = [];
    const seenStatic = /* @__PURE__ */ new Set();
    for (const s of this.statics) {
      if (!this.options.pluginEnabled(s.p)) continue;
      if (seenStatic.has(s.c)) continue;
      seenStatic.add(s.c);
      out.push({
        class: s.c,
        plugin: s.p,
        decls: Object.fromEntries(s.d),
        selector: s.s,
        defaults: s.df,
        description: s.d.map(([k, v]) => `${k}: ${v}`).join("; "),
        sort: { plugin: this.pluginIndex.get(s.p) ?? 9999, utility: s.index, value: 0 }
      });
    }
    for (const f of this.functional) {
      if (!this.options.pluginEnabled(f.plugin)) continue;
      let vi = 0;
      for (const [key, raw] of Object.entries(f.values)) {
        vi++;
        const cls = key === "DEFAULT" ? f.prefix : `${f.prefix}-${key}`;
        const decls = f.build(raw, { modifier: null, key });
        if (!decls) continue;
        out.push({
          class: cls,
          plugin: f.plugin,
          decls,
          selector: f.selector,
          defaults: f.defaults,
          description: f.describe.replace("{value}", String(Array.isArray(raw) ? raw[0] : raw)),
          sort: { plugin: this.pluginIndex.get(f.plugin) ?? 9999, utility: f.index, value: vi }
        });
        if (f.negative) {
          const neg = this.negate(raw);
          if (neg !== null) {
            const nd = f.build(neg, { modifier: null, key });
            if (nd)
              out.push({
                class: `-${cls}`,
                plugin: f.plugin,
                decls: nd,
                selector: f.selector,
                defaults: f.defaults,
                description: f.describe.replace("{value}", neg),
                sort: {
                  plugin: this.pluginIndex.get(f.plugin) ?? 9999,
                  utility: f.index,
                  value: vi + 0.5
                }
              });
          }
        }
      }
    }
    if (this.options.pluginEnabled("container")) {
      out.push({
        class: "container",
        plugin: "container",
        decls: { width: "100%" },
        description: "responsive fixed-width container",
        sort: { plugin: this.pluginIndex.get("container") ?? 1, utility: 0, value: 0 }
      });
    }
    const seen = /* @__PURE__ */ new Map();
    const result = [];
    for (const e of out) {
      const idx = seen.get(e.class);
      if (idx !== void 0) result[idx] = e;
      else {
        seen.set(e.class, result.length);
        result.push(e);
      }
    }
    return result;
  }
  negate(raw) {
    return negateValue(Array.isArray(raw) ? raw[0] : raw);
  }
  // ───────────────────────── compile ─────────────────────────
  /** Compile one candidate into rules (empty when unknown). Cached. */
  compile(candidate) {
    const cached = this.cache.get(candidate);
    if (cached) return cached;
    const rules = this.compileUncached(candidate);
    this.cache.set(candidate, rules);
    return rules;
  }
  compileUncached(candidate) {
    if (!candidate || candidate.length > 256) return [];
    const parts = splitAtTopLevelOnly(candidate, ":");
    let base = parts[parts.length - 1];
    const variantNames = parts.slice(0, -1);
    if (!base) return [];
    let important = false;
    if (base.startsWith("!")) {
      important = true;
      base = base.slice(1);
    } else if (base.endsWith("!") && this.options.trailingImportant !== false) {
      important = true;
      base = base.slice(0, -1);
    }
    let negative = false;
    if (base.startsWith("-")) {
      negative = true;
      base = base.slice(1);
    }
    if (!base || base.startsWith("-") || base.startsWith("!")) return [];
    const resolved = this.resolveUtility(base, negative);
    if (resolved.length === 0) return [];
    const variantMatches = [];
    for (let i = variantNames.length - 1; i >= 0; i--) {
      const m = this.resolveVariant(variantNames[i]);
      if (!m) return [];
      variantMatches.push(m);
    }
    const rules = [];
    const escaped = `.${escapeClassName(candidate)}`;
    for (const u of resolved) {
      const suffix = u.selector ?? "";
      const isTemplate = suffix.includes("&");
      let branches = [{ selector: escaped, atrules: [...u.atrules ?? []], decls: { ...u.decls } }];
      const weights = [];
      const hooks = [];
      let parallel = 0;
      for (const vm of variantMatches) {
        if (vm.arbitrary) weights.push(vm.arbitrary);
        else if (vm.functional || vm.branches.length === 1) weights.push(vm.sort);
        if (vm.fn) hooks.push({ ...vm.fn, bit: vm.sort });
        const next = [];
        for (const b of branches) {
          vm.branches.forEach((vb, bi) => {
            if (!vm.arbitrary && !vm.functional && vm.branches.length > 1)
              b.weights = [...b.weights ?? [], vb.bit ?? vm.sort + bi];
            if (vm.functional && vm.branches.length > 1) parallel = Math.max(parallel, bi);
            const selector = vb.format ? applyFormat(b.selector, vb.format) : b.selector;
            let decls = vb.decls && !Object.keys(vb.decls).some((k) => k in b.decls) ? { ...vb.decls, ...b.decls } : b.decls;
            if (vb.stripAlpha) decls = removeAlphaVariables(decls, vb.stripAlpha);
            next.push({
              selector,
              atrules: [...b.atrules, ...vb.atrules ?? []],
              decls,
              weights: b.weights,
              parallel: Math.max(b.parallel ?? 0, vm.functional ? bi : 0)
            });
          });
        }
        branches = next;
      }
      for (const b of branches) {
        const withSuffix = suffix ? isTemplate ? suffix.replace(/&/g, b.selector) : splitAtTopLevelOnly(b.selector, ",").map((part) => part.trim() + suffix).join(", ") : b.selector;
        let selector = finalizeSelector(withSuffix);
        if (u.siblings?.length && variantMatches.length === 0) {
          const ownParts = splitAtTopLevelOnly(selector, ",").map((p) => p.trim());
          let i = 0;
          selector = u.siblings.map((part) => part === "&" ? ownParts[i++] ?? "" : part).filter(Boolean).join(", ");
        }
        selector = this.wrapImportant(selector);
        const bang = important || this.options.important === true;
        const decls = bang ? Object.fromEntries(
          Object.entries(b.decls).map(([k, v]) => [
            k,
            v.endsWith("!important") ? v : `${v} !important`
          ])
        ) : b.decls;
        rules.push({
          selector,
          decls,
          atrules: this.mergeAtRules(b.atrules),
          sort: {
            variant: variantMatches.length ? 1 : 0,
            layer: u.component || u.plugin === "container" ? 0 : 1,
            // a bit mask: the same variant applied twice (`hover:hover:x`) sets one bit
            variants: [.../* @__PURE__ */ new Set([...weights, ...b.weights ?? []])].sort(compareWeights),
            // outermost variant first — the order Tailwind walks `options`
            hooks: hooks.length ? [...hooks].reverse() : void 0,
            parallel: Math.max(parallel, b.parallel ?? 0),
            plugin: u.sort.plugin,
            utility: u.sort.utility,
            value: u.sort.value,
            property: u.sort.property,
            seq: this.seq++
          },
          candidate,
          plugin: u.plugin,
          defaults: u.defaults,
          animations: u.animations,
          component: u.component
        });
      }
    }
    return dedupeRules(rules);
  }
  wrapImportant(selector) {
    const imp = this.options.important;
    if (typeof imp === "string" && imp.trim()) {
      const scopes = imp.trim().split(",").map((s) => s.trim()).filter(Boolean);
      return splitAtTopLevelOnly(selector, ",").map((s) => s.trim()).flatMap((sel) => scopes.map((scope) => sel.includes(scope) ? sel : `${scope} ${sel}`)).join(", ");
    }
    return selector;
  }
  /**
   * Order at-rules outermost-first (the leftmost variant is the outermost
   * wrapper, as in Tailwind) and — Nakshora policy — collapse every
   * non-arbitrary `@media` condition into a single combined query
   * (`print:md:` → `@media print and (min-width: 768px)`). Nested min-widths
   * keep the largest, max-widths the smallest; the combined query sits where
   * the outermost media query was. Arbitrary (`[@media(...)]:`) queries are
   * never rewritten.
   */
  mergeAtRules(accumulated) {
    if (accumulated.length <= 1) return accumulated;
    const outerFirst = [...accumulated].reverse();
    if (this.options.combineMedia === false) return outerFirst;
    const mergeable = outerFirst.filter((a) => a.kind === "media" && !a.raw);
    if (mergeable.length <= 1) return outerFirst;
    const types = [];
    const features = [];
    let minCond;
    let maxCond;
    for (const m of mergeable) {
      for (const part of m.params.split(/\s+and\s+/)) {
        const p = part.trim();
        if (/^(not\s+|only\s+)?(all|print|screen|speech)$/.test(p)) {
          if (!types.includes(p)) types.push(p);
        } else if (m.min !== void 0 && !Number.isNaN(m.min) && /^\(min-width: [^)]+\)$/.test(p)) {
          if (!minCond || m.min > minCond.min) minCond = m;
        } else if (m.max !== void 0 && !Number.isNaN(m.max) && /^\(max-width: [^)]+\)$/.test(p)) {
          if (!maxCond || m.max < maxCond.max) maxCond = m;
        } else if (!features.includes(p)) features.push(p);
      }
    }
    const parts = [
      ...types,
      ...minCond ? [minCond.params] : [],
      ...maxCond ? [maxCond.params] : [],
      ...features
    ];
    const combined = {
      kind: "media",
      params: parts.join(" and "),
      sort: Math.max(...mergeable.map((m) => m.sort)),
      min: minCond?.min,
      max: maxCond?.max
    };
    const out = [];
    let placed = false;
    for (const a of outerFirst) {
      if (a.kind === "media" && !a.raw) {
        if (!placed) {
          out.push(combined);
          placed = true;
        }
        continue;
      }
      out.push(a);
    }
    return out;
  }
  // ───────────────────────── variants ─────────────────────────
  variantCache = /* @__PURE__ */ new Map();
  resolveVariant(name) {
    const cached = this.variantCache.get(name);
    if (cached !== void 0) return cached;
    const result = this.resolveVariantUncached(name);
    this.variantCache.set(name, result);
    return result;
  }
  variantAllowed(def) {
    if (!this.options.variantEnabled(def.key)) return false;
    if (def.key === "maxResponsive" && !this.options.variantEnabled("responsive")) return false;
    if (def.name !== def.key && !this.options.variantEnabled(def.name)) return false;
    if ((def.name.startsWith("group-") || def.name === "group") && !this.options.variantEnabled("group"))
      return false;
    if ((def.name.startsWith("peer-") || def.name === "peer") && !this.options.variantEnabled("peer"))
      return false;
    return true;
  }
  resolveVariantUncached(name) {
    if (!name) return null;
    if (name.startsWith("[") && name.endsWith("]")) {
      if (!this.options.variantEnabled("arbitraryVariants")) return null;
      const inner = normalizeValue(name.slice(1, -1));
      if (inner.startsWith("@")) {
        const m = /^@([a-zA-Z-]+)\s*(.*)$/.exec(inner);
        if (!m) return null;
        const kindName = m[1];
        const params = m[2].trim();
        const kind = kindName === "media" ? "media" : kindName === "supports" ? "supports" : kindName === "container" ? "container" : "raw";
        const cond = {
          kind,
          params: kind === "raw" ? `${kindName} ${params}` : params,
          sort: MEDIA_SORT.arbitrary,
          raw: true
        };
        const mm = /^\((min|max)-width:\s*([^)]+)\)$/.exec(params);
        if (mm && kind === "media") {
          const px = screenToPx(mm[2]);
          if (mm[1] === "min") cond.min = px;
          else cond.max = px;
        }
        return {
          branches: [{ atrules: [cond] }],
          sort: 0,
          arbitrary: name,
          key: "arbitraryVariants"
        };
      }
      if (!inner.includes("&")) return null;
      return {
        branches: [{ format: inner }],
        sort: 0,
        arbitrary: name,
        key: "arbitraryVariants"
      };
    }
    const def = this.variants.get(name);
    if (def && def.branches && !def.functional) {
      if (!this.variantAllowed(def)) return null;
      return { branches: def.branches, sort: def.sort, key: def.key, fn: def.fn };
    }
    for (const fv of this.functionalVariants) {
      let rest = null;
      if (fv.name === "@max") {
        if (name.startsWith("@max-")) rest = name.slice(5);
      } else if (fv.name === "@") {
        if (name.startsWith("@") && !name.startsWith("@max-")) rest = name.slice(1);
      } else if (name === fv.name && !fv.functional) rest = "";
      else if (name.startsWith(`${fv.name}-`)) rest = name.slice(fv.name.length + 1);
      else if (name.startsWith(`${fv.name}/`)) rest = name.slice(fv.name.length);
      if (rest === null) continue;
      if (!this.variantAllowed(fv)) continue;
      const slashSplit = splitModifier(rest);
      const value = slashSplit.value;
      let modifier = slashSplit.modifier;
      if (modifier !== null && modifier.startsWith("[") && modifier.endsWith("]"))
        modifier = normalizeValue(modifier.slice(1, -1));
      const result = fv.match(value, modifier, { theme: this.theme });
      if (!result) continue;
      const r = Array.isArray(result) ? { branches: result } : result;
      if (r.branches.length === 0) continue;
      return {
        branches: r.branches,
        sort: fv.sort + Math.min(r.slot ?? fv.slots ?? 0, fv.slots ?? 0),
        key: fv.key,
        functional: true,
        fn: r.fn
      };
    }
    return null;
  }
  // ───────────────────────── utilities ─────────────────────────
  resolveUtility(base, negative) {
    const out = [];
    if (base.startsWith("[") && base.endsWith("]") && !negative) {
      if (this.options.arbitraryProperties === false) return [];
      const inner = base.slice(1, -1);
      const idx = inner.indexOf(":");
      if (idx <= 0) return [];
      const prop = inner.slice(0, idx).trim();
      const value = normalizeValue(this.resolveThemeFn(inner.slice(idx + 1)), { property: prop });
      if (!/^(--[\w-]+|[a-zA-Z][\w-]*)$/.test(prop) || !value || !isValidArbitraryValue(value))
        return [];
      return [
        {
          decls: { [prop]: value },
          plugin: "arbitraryProperties",
          sort: { plugin: 99999, utility: 0, value: 0, property: prop }
        }
      ];
    }
    if (!negative) {
      for (const s of this.staticMap.get(base) ?? []) {
        if (!this.options.pluginEnabled(s.p)) continue;
        const decls = Object.fromEntries(s.d);
        const animations = s.pc ? animationNames(decls.animation ?? decls["animation-name"]) : void 0;
        out.push({
          decls,
          selector: s.s,
          siblings: s.sl,
          component: s.pc,
          plugin: s.p,
          defaults: s.df,
          atrules: s.at?.map(parseAtRule),
          animations: animations?.length ? animations : void 0,
          sort: { plugin: this.pluginIndex.get(s.p) ?? 9999, utility: s.index, value: 0 }
        });
      }
      if (base === "container" && this.options.pluginEnabled("container"))
        out.push(...this.containerRules());
    }
    const tryPrefix = (prefix, modifier) => {
      const list = this.functionalMap.get(prefix);
      if (!list) return;
      const matches = [];
      for (const u of list) {
        if (!this.options.pluginEnabled(u.plugin)) continue;
        const r = this.resolveFunctional(u, modifier, negative);
        if (r) matches.push({ u, r: r.rules, types: r.types, arbitrary: r.arbitrary });
      }
      if (matches.length === 0) return;
      const arbitrary = matches.filter((m) => m.arbitrary);
      if (arbitrary.length > 1) {
        const withoutAny = arbitrary.filter((m) => !m.types.includes("any"));
        const pick = (ms) => {
          if (ms.length === 1) return ms[0];
          return ms.find((m) => m.u.preferOnConflict);
        };
        const chosen = pick(withoutAny) ?? pick(arbitrary);
        if (!chosen) return;
        out.push(...chosen.r);
        for (const m of matches) if (!m.arbitrary) out.push(...m.r);
        return;
      }
      for (const m of matches) out.push(...m.r);
    };
    tryPrefix(base, "DEFAULT");
    for (const [prefix, modifier] of candidatePermutations(base)) tryPrefix(prefix, modifier);
    return out;
  }
  resolveFunctional(u, modifier, negative) {
    const sortBase = { plugin: this.pluginIndex.get(u.plugin) ?? 9999, utility: u.index };
    let lastArgs = null;
    const build = (value2, ctx) => {
      lastArgs = [value2, ctx.modifier];
      return u.build(value2, ctx);
    };
    const make = (decls2, value2, types2, arbitrary, animations2) => {
      if (!decls2) return null;
      const common = {
        plugin: u.plugin,
        defaults: u.defaults,
        sort: { ...sortBase, value: value2 },
        animations: animations2
      };
      if (u.buildAll && lastArgs) {
        const shapes = u.buildAll(lastArgs[0], lastArgs[1]);
        if (!shapes || shapes.length === 0) return null;
        return {
          rules: shapes.map((sh) => ({
            ...common,
            decls: sh.decls,
            selector: sh.selector,
            atrules: sh.atrules?.map(parseAtRule)
          })),
          types: types2,
          arbitrary
        };
      }
      const selector = u.selectorFor && lastArgs ? u.selectorFor(lastArgs[0], lastArgs[1]) ?? u.selector : u.selector;
      return { rules: [{ ...common, decls: decls2, selector }], types: types2, arbitrary };
    };
    const keys = Object.keys(u.values);
    let valueKey = modifier;
    let mod = null;
    if (u.modifier) {
      const split = splitModifier(modifier);
      if (split.modifier !== null) {
        valueKey = split.value;
        mod = split.modifier;
      }
    }
    if (valueKey === "" && mod !== null) valueKey = "DEFAULT";
    const direct = (key) => Object.prototype.hasOwnProperty.call(u.values, key) ? u.values[key] : void 0;
    let themeValue = direct(modifier);
    let usedKey = modifier;
    if (themeValue === void 0 && mod !== null) {
      themeValue = direct(valueKey);
      usedKey = valueKey;
    } else if (themeValue !== void 0) {
      mod = null;
    }
    if (themeValue !== void 0) {
      const idx = keys.indexOf(usedKey) + 1;
      if (negative) {
        if (!u.negative) return null;
        const neg = this.negate(themeValue);
        if (neg === null) return null;
        return make(build(neg, { modifier: null, key: usedKey }), idx + 0.5, [], false);
      }
      const modValue2 = mod === null ? null : this.resolveModifier(u, mod);
      if (mod !== null && modValue2 === null) return null;
      if (u.modifier === "color" && modValue2 !== null) {
        const color = String(
          typeof themeValue === "function" ? themeValue({}) : themeValue
        );
        const withAlpha = withAlphaValue(color, modValue2, "");
        if (withAlpha === "") return null;
        return make(
          build(withAlpha, { modifier: modValue2, key: usedKey }),
          idx,
          [],
          false,
          void 0
        );
      }
      const decls2 = build(themeValue, { modifier: modValue2, key: usedKey });
      const animations2 = u.plugin === "animation" && decls2 ? animationNames(decls2.animation) : void 0;
      return make(decls2, idx, [], false, animations2);
    }
    const arb = mod !== null ? valueKey : modifier;
    if (u.bare && !arb.startsWith("[") && BARE_VALUE[u.bare].test(arb)) {
      const modValue2 = mod === null ? null : this.resolveModifier(u, mod);
      if (mod !== null && modValue2 === null) return null;
      const value2 = negative ? `-${arb}` : arb;
      if (negative && !u.negative) return null;
      return make(build(value2, { modifier: modValue2, key: arb }), keys.length + 0.5, [], true);
    }
    if (!(arb.startsWith("[") && arb.endsWith("]"))) return null;
    const raw = arb.slice(1, -1);
    if (!raw) return null;
    const { hint } = splitTypeHint(raw);
    const types = u.types.length ? u.types : ["any"];
    if (hint && !types.includes(hint)) return null;
    const coerced = coerceValue(
      this.resolveThemeFn(raw),
      types.filter((t) => t !== "lookup"),
      {}
    );
    if (!coerced) return null;
    const value = coerced.value;
    if (!isValidArbitraryValue(value)) return null;
    if (negative) {
      if (!u.negative) return null;
      const neg = negateValue(value);
      if (neg === null) return null;
      return make(build(neg, { modifier: null, key: arb }), 1e6, types, true);
    }
    const modValue = mod === null ? null : this.resolveModifier(u, mod);
    if (mod !== null && modValue === null) return null;
    if (u.modifier === "color" && modValue !== null) {
      const withAlpha = withAlphaValue(value, modValue, "");
      if (withAlpha === "") return null;
      return make(build(withAlpha, { modifier: modValue, key: arb }), 1e6, types, true);
    }
    const decls = build(value, { modifier: modValue, key: arb });
    const animations = u.plugin === "animation" && decls ? animationNames(decls.animation) : void 0;
    return make(decls, 1e6, types, true, animations);
  }
  /** `/50` → `0.5` (opacity scale), `/[.3]` → `.3`; fontSize modifier → lineHeight */
  resolveModifier(u, mod) {
    if (mod.startsWith("[") && mod.endsWith("]")) return normalizeValue(mod.slice(1, -1)) || null;
    if (u.modifier === "lineHeight") {
      const lh = this.theme.lineHeight[mod];
      return lh === void 0 ? null : String(lh);
    }
    if (u.modifier === "any") return mod;
    if (u.modifier && typeof u.modifier === "object") {
      const v = u.modifier[mod];
      return v === void 0 ? null : String(v);
    }
    const op = this.theme.opacity[mod];
    return op === void 0 ? null : String(op);
  }
  /** Replace `theme(path)` / `theme(path/alpha)` inside an arbitrary value. */
  resolveThemeFn(value) {
    if (!value.includes("theme(")) return value;
    return value.replace(/theme\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, (whole, inner) => {
      const path = inner.trim().replace(/^['"]|['"]$/g, "");
      const resolved = this.options.themeFn ? this.options.themeFn(path) : this.lookupTheme(path);
      return resolved === void 0 ? whole : resolved;
    });
  }
  /** Resolve `colors.red.500`, `spacing[2.5]`, `colors.red.500/50%` against the theme. */
  lookupTheme(path) {
    let alpha;
    const slash = path.lastIndexOf("/");
    if (slash !== -1 && !path.slice(slash).includes("]")) {
      alpha = path.slice(slash + 1).trim();
      path = path.slice(0, slash).trim();
    }
    const keys = splitPath(path);
    let cur = this.theme;
    for (const key of keys) {
      if (cur === null || typeof cur !== "object") return void 0;
      cur = cur[key];
    }
    if (cur === void 0) return void 0;
    if (typeof cur === "function") cur = cur({});
    if (Array.isArray(cur)) cur = keys[0] === "fontSize" ? cur[0] : cur.join(", ");
    if (cur && typeof cur === "object") {
      const d = cur.DEFAULT;
      if (d === void 0) return void 0;
      cur = d;
    }
    const str = String(cur);
    return alpha !== void 0 ? withAlphaValue(str, alpha) : str;
  }
  /** `.container` rules (width + per-screen max-width up to `theme.container.maxScreen`). */
  containerRules() {
    const container = this.theme.container ?? {};
    const plugin2 = this.pluginIndex.get("container") ?? 1;
    const screens = container.screens ? Object.entries(container.screens).sort((a, b) => screenToPx(a[1]) - screenToPx(b[1])) : this.screens;
    const minScreen = container.minScreen === void 0 ? DEFAULT_CONTAINER_MIN_SCREEN : container.minScreen;
    const maxScreen = container.maxScreen === void 0 ? DEFAULT_CONTAINER_MAX_SCREEN : container.maxScreen;
    const lower = minScreen === false || container.screens || this.theme.screens[minScreen] === void 0 ? 0 : screenToPx(this.theme.screens[minScreen]);
    const limit = maxScreen === false || container.screens || this.theme.screens[maxScreen] === void 0 ? Infinity : screenToPx(this.theme.screens[maxScreen]);
    const paddingFor = (screen) => {
      const p = container.padding;
      if (p === void 0) return {};
      if (typeof p === "string")
        return screen === "DEFAULT" ? { "padding-right": p, "padding-left": p } : {};
      const v = p[screen];
      return v === void 0 ? {} : { "padding-right": v, "padding-left": v };
    };
    const rules = [
      {
        decls: {
          width: "100%",
          ...container.center ? { "margin-right": "auto", "margin-left": "auto" } : {},
          ...paddingFor("DEFAULT")
        },
        plugin: "container",
        sort: { plugin: plugin2, utility: 0, value: 0 }
      }
    ];
    if (!this.options.variantEnabled("responsive")) return rules;
    let i = 1;
    for (const [name, value] of screens) {
      const px = screenToPx(value);
      if (Number.isNaN(px) || px <= 0) continue;
      if (px < lower || px > limit) continue;
      rules.push({
        decls: { "max-width": value, ...paddingFor(name) },
        plugin: "container",
        atrules: [minWidthCond(value)],
        sort: { plugin: plugin2, utility: 0, value: i++ }
      });
    }
    return rules;
  }
};
function compareWeights(a, b) {
  if (typeof a === "number" && typeof b === "number") return b - a;
  if (typeof a === "number") return 1;
  if (typeof b === "number") return -1;
  return b < a ? -1 : b > a ? 1 : 0;
}
function compareVariantMask(a, b) {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const c = compareWeights(a[i], b[i]);
    if (c !== 0) return -c;
  }
  return a.length - b.length;
}
function compareRules(a, b) {
  if (a.sort.variant !== b.sort.variant) return a.sort.variant - b.sort.variant;
  if (a.sort.layer !== b.sort.layer) return a.sort.layer - b.sort.layer;
  if (a.sort.hooks && b.sort.hooks) {
    for (const ah of a.sort.hooks) {
      for (const bh of b.sort.hooks) {
        if (ah.id !== bh.id) continue;
        if (a.sort.hooks.filter((h) => h.id === ah.id).length > 1 && b.sort.hooks.filter((h) => h.id === bh.id).length > 1 && (a.sort.hooks.find((h) => h.id === ah.id) !== ah || b.sort.hooks.find((h) => h.id === bh.id) !== bh))
          continue;
        const cut = Math.max(ah.bit, bh.bit);
        const after = (r) => r.sort.variants.filter((w) => typeof w === "string" || w > cut);
        if (compareVariantMask(after(a), after(b)) !== 0) continue;
        const c = ah.compare(
          { value: ah.value, modifier: ah.modifier },
          { value: bh.value, modifier: bh.modifier }
        );
        if (c !== 0) return c;
      }
    }
  }
  const mask = compareVariantMask(a.sort.variants, b.sort.variants);
  if (mask !== 0) return mask;
  if (a.sort.parallel !== b.sort.parallel) return a.sort.parallel - b.sort.parallel;
  const ap = a.sort.property !== void 0 ? 1 : 0;
  const bp = b.sort.property !== void 0 ? 1 : 0;
  if (ap !== bp) return ap - bp;
  if (ap && a.sort.property !== b.sort.property)
    return a.sort.property < b.sort.property ? -1 : 1;
  if (a.sort.plugin !== b.sort.plugin) return a.sort.plugin - b.sort.plugin;
  if (a.sort.utility !== b.sort.utility) return a.sort.utility - b.sort.utility;
  if (a.candidate !== b.candidate) return a.candidate < b.candidate ? -1 : 1;
  return a.sort.seq - b.sort.seq;
}
function compareContainers(a, b) {
  const av = parseFloat(String(a.value));
  const bv = parseFloat(String(b.value));
  if (Number.isNaN(av) || Number.isNaN(bv)) return 0;
  if (av - bv !== 0) return av - bv;
  const al = a.modifier ?? "";
  const bl = b.modifier ?? "";
  if (al === "" && bl !== "") return 1;
  if (al !== "" && bl === "") return -1;
  return al.localeCompare(bl, "en", { numeric: true });
}
function dedupeRules(rules) {
  if (rules.length < 2) return rules;
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  const atKey = (r) => r.atrules.map((a) => `${a.kind} ${a.params}`).join("|");
  for (const r of rules) {
    const key = `${r.selector}\0${atKey(r)}\0${JSON.stringify(r.decls)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const prev = out[out.length - 1];
    if (prev && r.component && prev.component && prev.selector === r.selector && atKey(prev) === atKey(r) && prev.plugin === r.plugin && !Object.keys(r.decls).some((k) => k in prev.decls)) {
      prev.decls = { ...prev.decls, ...r.decls };
      continue;
    }
    out.push(r);
  }
  return out;
}
function removeAlphaVariables(decls, toRemove) {
  const out = {};
  for (const [prop, raw] of Object.entries(decls)) {
    if (toRemove.includes(prop)) continue;
    let value = raw;
    for (const name of toRemove) {
      if (value.includes(`/ var(${name})`)) value = value.replace(`/ var(${name})`, "");
      else if (value.includes(`/ var(${name}, 1)`)) value = value.replace(`/ var(${name}, 1)`, "");
    }
    out[prop] = value;
  }
  return out;
}
function parseAtRule(text) {
  const m = /^@([\w-]+)\s*(.*)$/.exec(text.trim());
  const name = m ? m[1] : "media";
  const params = m ? m[2].trim() : "";
  const kind = name === "media" ? "media" : name === "supports" ? "supports" : name === "container" ? "container" : "raw";
  return { kind, params: kind === "raw" ? `${name} ${params}` : params, sort: 9e3, raw: true };
}
function animationNames(value) {
  if (!value) return [];
  return splitAtTopLevelOnly(value, ",").map((part) => part.trim().split(/\s+/)[0]).filter(
    (n) => n && !/^(none|inherit|initial|unset|revert)$/.test(n) && !/^\d/.test(n) && !/^(infinite|linear|ease|normal|reverse|alternate|forwards|backwards|both|running|paused)$/.test(
      n
    )
  );
}
function* candidatePermutations(candidate) {
  let lastIndex = Infinity;
  while (lastIndex >= 0) {
    let dashIdx;
    let wasSlash = false;
    if (lastIndex === Infinity && candidate.endsWith("]")) {
      const bracketIdx = candidate.indexOf("[");
      if (candidate[bracketIdx - 1] === "-") dashIdx = bracketIdx - 1;
      else if (candidate[bracketIdx - 1] === "/") {
        dashIdx = bracketIdx - 1;
        wasSlash = true;
      } else dashIdx = -1;
    } else if (lastIndex === Infinity && candidate.includes("/")) {
      dashIdx = candidate.lastIndexOf("/");
      wasSlash = true;
    } else {
      dashIdx = candidate.lastIndexOf("-", lastIndex);
    }
    if (dashIdx < 0) break;
    const prefix = candidate.slice(0, dashIdx);
    const modifier = wasSlash ? candidate.slice(dashIdx) : candidate.slice(dashIdx + 1);
    lastIndex = dashIdx - 1;
    if (prefix === "" || modifier === "/") continue;
    yield [prefix, modifier];
  }
}
function splitModifier(input) {
  const slashIdx = input.lastIndexOf("/");
  if (slashIdx === -1) return { value: input, modifier: null };
  const arbitraryStart = input.lastIndexOf("[", slashIdx);
  const arbitraryEnd = input.indexOf("]", slashIdx);
  const nextToArbitrary = input[slashIdx - 1] === "]" || input[slashIdx + 1] === "[";
  if (!nextToArbitrary && arbitraryStart !== -1 && arbitraryEnd !== -1) {
    const prev = input.lastIndexOf("/", arbitraryStart);
    if (prev === -1) return { value: input, modifier: null };
    return { value: input.slice(0, prev), modifier: input.slice(prev + 1) };
  }
  if (input.startsWith("[") && input.endsWith("]") && !input.includes("]/[") && !input.includes("]/")) {
    return { value: input, modifier: null };
  }
  return { value: input.slice(0, slashIdx), modifier: input.slice(slashIdx + 1) };
}
function isValidArbitraryValue(value) {
  let depthParen = 0;
  let depthBracket = 0;
  let quote = null;
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "(") depthParen++;
    else if (ch === ")") {
      if (--depthParen < 0) return false;
    } else if (ch === "[") depthBracket++;
    else if (ch === "]") {
      if (--depthBracket < 0) return false;
    } else if (ch === ";" || ch === "{" || ch === "}") return false;
  }
  return depthParen === 0 && depthBracket === 0 && quote === null;
}
var MERGE_RE = /:merge\(((?:[^()]|\([^()]*\))*)\)/g;
function applyFormat(current, format) {
  const merges = [...current.matchAll(MERGE_RE)];
  if (merges.length) {
    let fmt = format;
    for (const m of [...format.matchAll(MERGE_RE)]) {
      const existing = merges.find((e) => e[1] === m[1]);
      if (!existing) continue;
      const after = format.slice((m.index ?? 0) + m[0].length);
      const attMatch = /^((?:[^\s>+~&])*)(\s*[>+~]?\s*)?/.exec(after);
      const attachments = attMatch?.[1] ?? "";
      const combinator = attMatch?.[2] ?? "";
      const insertAt = (existing.index ?? 0) + existing[0].length;
      current = current.slice(0, insertAt) + attachments + current.slice(insertAt);
      fmt = fmt.replace(m[0] + attachments + combinator, "");
    }
    format = fmt;
  }
  return format.replace(/&/g, current);
}
var PSEUDO_ELEMENT_PROPS = {
  "::after": ["terminal", "jumpable"],
  "::backdrop": ["terminal", "jumpable"],
  "::before": ["terminal", "jumpable"],
  "::cue": ["terminal"],
  "::cue-region": ["terminal"],
  "::first-letter": ["terminal", "jumpable"],
  "::first-line": ["terminal", "jumpable"],
  "::grammar-error": ["terminal"],
  "::marker": ["terminal", "jumpable"],
  "::part": ["terminal", "actionable"],
  "::placeholder": ["terminal", "jumpable"],
  "::selection": ["terminal", "jumpable"],
  "::slotted": ["terminal"],
  "::spelling-error": ["terminal"],
  "::target-text": ["terminal"],
  "::file-selector-button": ["terminal", "actionable"],
  "::deep": ["actionable"],
  "::v-deep": ["actionable"],
  "::ng-deep": ["actionable"],
  ":after": ["terminal", "jumpable"],
  ":before": ["terminal", "jumpable"],
  ":first-letter": ["terminal", "jumpable"],
  ":first-line": ["terminal", "jumpable"]
};
var DEFAULT_PSEUDO_PROPS = ["terminal", "actionable"];
function tokenizeSelector(sel) {
  const tokens = [];
  let i = 0;
  const n = sel.length;
  const readBalanced = (open, close) => {
    let depth = 0;
    let quote = null;
    const start = i;
    while (i < n) {
      const ch = sel[i];
      if (quote) {
        if (ch === "\\") i++;
        else if (ch === quote) quote = null;
      } else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === open) depth++;
      else if (ch === close) {
        depth--;
        if (depth === 0) {
          i++;
          break;
        }
      }
      i++;
    }
    return sel.slice(start, i);
  };
  while (i < n) {
    const ch = sel[i];
    if (ch === " " || ch === ">" || ch === "~" || ch === "+") {
      let j2 = i;
      while (j2 < n && (sel[j2] === " " || sel[j2] === ">" || sel[j2] === "~" || sel[j2] === "+")) j2++;
      tokens.push({ text: sel.slice(i, j2), kind: "combinator" });
      i = j2;
      continue;
    }
    if (ch === ":") {
      let j2 = i + 1;
      if (sel[j2] === ":") j2++;
      while (j2 < n && /[\w-]/.test(sel[j2])) j2++;
      const name = sel.slice(i, j2);
      i = j2;
      let args = "";
      if (sel[i] === "(") args = readBalanced("(", ")");
      tokens.push({ text: name + args, kind: "pseudo", name });
      continue;
    }
    if (ch === "[") {
      tokens.push({ text: readBalanced("[", "]"), kind: "other" });
      continue;
    }
    let j = i;
    while (j < n) {
      const c = sel[j];
      if (c === "\\") {
        j += 2;
        continue;
      }
      if (c === ":" || c === "[" || c === " " || c === ">" || c === "~" || c === "+") break;
      if ((c === "." || c === "#") && j > i) break;
      j++;
    }
    tokens.push({ text: sel.slice(i, j), kind: "other" });
    i = j;
  }
  return tokens;
}
function pseudoProps(name) {
  return PSEUDO_ELEMENT_PROPS[name] ?? DEFAULT_PSEUDO_PROPS;
}
function isPseudoElement(tok) {
  return tok.kind === "pseudo" && (tok.name.startsWith("::") || PSEUDO_ELEMENT_PROPS[tok.name] !== void 0);
}
function finalizeSelector(selector) {
  const out = selector.replace(/:merge\(((?:[^()]|\([^()]*\))*)\)/g, "$1");
  if (!out.includes(":")) return out;
  return splitAtTopLevelOnly(out, ",").map((sel) => {
    const tokens = tokenizeSelector(sel.trim());
    let buffer = [];
    let lastSeen = null;
    const keep = [];
    for (const tok of tokens) {
      if (tok.kind === "combinator") {
        const stay = buffer.filter((b) => !pseudoProps(b.name).includes("jumpable"));
        buffer = buffer.filter((b) => !stay.includes(b));
        for (const s of stay) keep.push(s);
        keep.push(tok);
        lastSeen = null;
        continue;
      }
      if (tok.kind === "pseudo") {
        if (isPseudoElement(tok) && pseudoProps(tok.name).includes("terminal")) {
          lastSeen = tok;
          buffer.push(tok);
          continue;
        }
        if (lastSeen && pseudoProps(lastSeen.name).includes("actionable")) {
          buffer.push(tok);
          continue;
        }
        lastSeen = null;
      }
      keep.push(tok);
    }
    return [...keep, ...buffer].map((t) => t.text).join("").trim();
  }).join(", ");
}
var NAKSHORA_STATIC = [
  { p: "animation", c: "animation-paused", d: [["animation-play-state", "paused"]] },
  { p: "animation", c: "animation-running", d: [["animation-play-state", "running"]] },
  { p: "whitespace", c: "break-spaces", d: [["white-space", "break-spaces"]] },
  { p: "fontStretch", c: "font-stretch-normal", d: [["font-stretch", "normal"]] },
  { p: "fontStretch", c: "font-stretch-ultra-condensed", d: [["font-stretch", "ultra-condensed"]] },
  { p: "fontStretch", c: "font-stretch-extra-condensed", d: [["font-stretch", "extra-condensed"]] },
  { p: "fontStretch", c: "font-stretch-condensed", d: [["font-stretch", "condensed"]] },
  { p: "fontStretch", c: "font-stretch-semi-condensed", d: [["font-stretch", "semi-condensed"]] },
  { p: "fontStretch", c: "font-stretch-semi-expanded", d: [["font-stretch", "semi-expanded"]] },
  { p: "fontStretch", c: "font-stretch-expanded", d: [["font-stretch", "expanded"]] },
  { p: "fontStretch", c: "font-stretch-extra-expanded", d: [["font-stretch", "extra-expanded"]] },
  { p: "fontStretch", c: "font-stretch-ultra-expanded", d: [["font-stretch", "ultra-expanded"]] },
  { p: "fieldSizing", c: "field-sizing-content", d: [["field-sizing", "content"]] },
  { p: "fieldSizing", c: "field-sizing-fixed", d: [["field-sizing", "fixed"]] },
  { p: "colorScheme", c: "scheme-normal", d: [["color-scheme", "normal"]] },
  { p: "colorScheme", c: "scheme-dark", d: [["color-scheme", "dark"]] },
  { p: "colorScheme", c: "scheme-light", d: [["color-scheme", "light"]] },
  { p: "colorScheme", c: "scheme-light-dark", d: [["color-scheme", "light dark"]] },
  { p: "colorScheme", c: "scheme-only-dark", d: [["color-scheme", "only dark"]] },
  { p: "colorScheme", c: "scheme-only-light", d: [["color-scheme", "only light"]] }
];
var GROUP_CATEGORIES = {
  layout: "Layout",
  display: "Display",
  position: "Position",
  inset: "Inset (Offset)",
  zIndex: "Stacking (Z-Index)",
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
  interactivity: "Interactivity",
  svg: "SVG",
  tables: "Tables",
  accessibility: "Accessibility",
  effects: "Effects",
  whitespace: "Whitespace & Misc",
  components: "Components",
  plugin: "Plugins"
};
var PLUGIN_CATEGORY = {
  container: "layout",
  accessibility: "accessibility",
  pointerEvents: "interactivity",
  visibility: "visibility",
  position: "position",
  inset: "inset",
  isolation: "layout",
  zIndex: "zIndex",
  order: "flex",
  gridColumn: "grid",
  gridColumnStart: "grid",
  gridColumnEnd: "grid",
  gridRow: "grid",
  gridRowStart: "grid",
  gridRowEnd: "grid",
  float: "layout",
  clear: "layout",
  margin: "margin",
  boxSizing: "layout",
  lineClamp: "typography",
  display: "display",
  aspectRatio: "sizing",
  size: "sizing",
  height: "sizing",
  maxHeight: "sizing",
  minHeight: "sizing",
  width: "sizing",
  minWidth: "sizing",
  maxWidth: "sizing",
  flex: "flex",
  flexShrink: "flex",
  flexGrow: "flex",
  flexBasis: "flex",
  tableLayout: "tables",
  captionSide: "tables",
  borderCollapse: "tables",
  borderSpacing: "tables",
  transformOrigin: "transforms",
  translate: "transforms",
  rotate: "transforms",
  skew: "transforms",
  scale: "transforms",
  transform: "transforms",
  animation: "animations",
  cursor: "cursors",
  touchAction: "interactivity",
  userSelect: "interactivity",
  resize: "interactivity",
  scrollSnapType: "interactivity",
  scrollSnapAlign: "interactivity",
  scrollSnapStop: "interactivity",
  scrollMargin: "interactivity",
  scrollPadding: "interactivity",
  listStylePosition: "typography",
  listStyleType: "typography",
  listStyleImage: "typography",
  appearance: "interactivity",
  columns: "layout",
  breakBefore: "layout",
  breakInside: "layout",
  breakAfter: "layout",
  gridAutoColumns: "grid",
  gridAutoFlow: "grid",
  gridAutoRows: "grid",
  gridTemplateColumns: "grid",
  gridTemplateRows: "grid",
  flexDirection: "flex",
  flexWrap: "flex",
  placeContent: "flex",
  placeItems: "flex",
  alignContent: "flex",
  alignItems: "flex",
  justifyContent: "flex",
  justifyItems: "flex",
  gap: "gap",
  space: "margin",
  divideWidth: "borders",
  divideStyle: "borders",
  divideColor: "borderColor",
  divideOpacity: "borderColor",
  placeSelf: "flex",
  alignSelf: "flex",
  justifySelf: "flex",
  overflow: "overflow",
  overscrollBehavior: "overflow",
  scrollBehavior: "interactivity",
  textOverflow: "typography",
  hyphens: "typography",
  whitespace: "whitespace",
  textWrap: "typography",
  wordBreak: "typography",
  borderRadius: "borderRadius",
  borderWidth: "borders",
  borderStyle: "borders",
  borderColor: "borderColor",
  borderOpacity: "borderColor",
  backgroundColor: "backgroundColor",
  backgroundOpacity: "backgroundColor",
  backgroundImage: "backgrounds",
  gradientColorStops: "gradients",
  boxDecorationBreak: "backgrounds",
  backgroundSize: "backgrounds",
  backgroundAttachment: "backgrounds",
  backgroundClip: "backgrounds",
  backgroundPosition: "backgrounds",
  backgroundRepeat: "backgrounds",
  backgroundOrigin: "backgrounds",
  fill: "svg",
  stroke: "svg",
  strokeWidth: "svg",
  objectFit: "sizing",
  objectPosition: "sizing",
  padding: "padding",
  textAlign: "typography",
  textIndent: "typography",
  verticalAlign: "typography",
  fontFamily: "typography",
  fontSize: "typography",
  fontWeight: "typography",
  textTransform: "typography",
  fontStyle: "typography",
  fontVariantNumeric: "typography",
  lineHeight: "typography",
  letterSpacing: "typography",
  textColor: "textColor",
  textOpacity: "textColor",
  textDecoration: "textDecoration",
  textDecorationColor: "textDecoration",
  textDecorationStyle: "textDecoration",
  textDecorationThickness: "textDecoration",
  textUnderlineOffset: "textDecoration",
  fontSmoothing: "typography",
  placeholderColor: "textColor",
  placeholderOpacity: "textColor",
  caretColor: "interactivity",
  accentColor: "interactivity",
  opacity: "opacity",
  backgroundBlendMode: "effects",
  mixBlendMode: "effects",
  boxShadow: "shadows",
  boxShadowColor: "shadows",
  outlineStyle: "borders",
  outlineWidth: "borders",
  outlineOffset: "borders",
  outlineColor: "borderColor",
  ringWidth: "borders",
  ringColor: "borderColor",
  ringOpacity: "borderColor",
  ringOffsetWidth: "borders",
  ringOffsetColor: "borderColor",
  blur: "filters",
  brightness: "filters",
  contrast: "filters",
  dropShadow: "filters",
  grayscale: "filters",
  hueRotate: "filters",
  invert: "filters",
  saturate: "filters",
  sepia: "filters",
  filter: "filters",
  backdropBlur: "filters",
  backdropBrightness: "filters",
  backdropContrast: "filters",
  backdropGrayscale: "filters",
  backdropHueRotate: "filters",
  backdropInvert: "filters",
  backdropOpacity: "filters",
  backdropSaturate: "filters",
  backdropSepia: "filters",
  backdropFilter: "filters",
  transitionProperty: "transitions",
  transitionDelay: "transitions",
  transitionDuration: "transitions",
  transitionTimingFunction: "transitions",
  willChange: "interactivity",
  contain: "layout",
  content: "typography",
  containerQueries: "layout",
  forcedColorAdjust: "accessibility",
  fontStretch: "typography",
  fieldSizing: "interactivity",
  colorScheme: "interactivity",
  arbitraryProperties: "plugin",
  components: "components",
  "plugin-components": "components"
};
function categoryForPlugin(plugin2) {
  return PLUGIN_CATEGORY[plugin2] ?? (GROUP_CATEGORIES[plugin2] ? plugin2 : "plugin");
}
var PLUGIN_COMPONENTS_GROUP = "plugin-components";
function normalizePlugin(plugin2) {
  if (typeof plugin2 === "function") {
    if (plugin2.__isOptionsFunction) {
      const resolved = plugin2();
      return { handler: resolved.handler, config: resolved.config };
    }
    return { handler: plugin2 };
  }
  if (plugin2 && typeof plugin2 === "object") {
    const p = plugin2;
    return {
      handler: p.handler,
      config: typeof p.config === "object" && p.config !== null ? p.config : void 0,
      legacyConfig: typeof p.config === "function" ? p.config : void 0
    };
  }
  return {};
}
function plugin(handler, config) {
  return { handler, config };
}
plugin.withOptions = function withOptions(pluginFunction, configFunction = () => ({})) {
  const optionsFunction = (options) => ({
    handler: pluginFunction(options),
    config: configFunction(options)
  });
  optionsFunction.__isOptionsFunction = true;
  return optionsFunction;
};
function cssInJsToRules(input) {
  const nodes = flattenNodes(cssInJsToNodes(input));
  const rules = [];
  const looseDecls = {};
  const walk = (list, atrules) => {
    for (const node of list) {
      if (node.type === "rule") {
        const decls = {};
        for (const d of node.nodes)
          if (d.type === "decl") decls[d.prop] = d.important ? `${d.value} !important` : d.value;
        rules.push({ selector: node.selector, decls, atrules });
      } else if (node.type === "atrule" && node.nodes) {
        walk(node.nodes, [...atrules, `@${node.name} ${node.params}`.trim()]);
      } else if (node.type === "decl") {
        looseDecls[node.prop] = node.important ? `${node.value} !important` : node.value;
      }
    }
  };
  walk(nodes, []);
  return { rules, looseDecls };
}
function selectorSuffix(selector) {
  const sel = selector.trim();
  if (sel === "&") return void 0;
  if (sel.startsWith("&") && sel.indexOf("&", 1) === -1 && !sel.includes(",")) return sel.slice(1);
  return sel;
}
function rulesToStatics(pluginName, rules) {
  const out = [];
  for (const rule of rules) {
    const parts = splitSelectorList(rule.selector);
    const classes = [];
    for (const part of parts) {
      const m = /\.((?:\\.|[\w-])+)/.exec(part);
      if (!m) continue;
      const cls = m[1].replace(/\\(.)/g, "$1");
      if (!classes.includes(cls)) classes.push(cls);
    }
    if (classes.length === 0) continue;
    for (const cls of classes) {
      const escaped = `.${escapeClassName(cls)}`;
      const own = [];
      const ordered = [];
      for (const part of parts) {
        if (part.includes(escaped) || part.includes(`.${cls}`)) {
          own.push(part.split(escaped).join("&").split(`.${cls}`).join("&"));
          ordered.push(null);
        } else ordered.push(part);
      }
      const template = own.join(", ");
      const hasSiblings = ordered.some((x) => x !== null);
      out.push({
        p: pluginName,
        c: cls,
        s: template === "&" ? void 0 : template,
        sl: hasSiblings ? ordered.map((x) => x ?? "&") : void 0,
        pc: true,
        d: Object.entries(rule.decls),
        at: rule.atrules.length ? rule.atrules : void 0
      });
    }
  }
  return out;
}
function normalizeTypes(type) {
  if (!type) return { types: [], preferOnConflict: false };
  const list = Array.isArray(type) ? type : [type];
  let prefer = false;
  const types = list.map((t) => {
    if (Array.isArray(t)) {
      if (t[1]?.preferOnConflict) prefer = true;
      return t[0];
    }
    return t;
  });
  return { types, preferOnConflict: prefer };
}
function createPluginAPI(collector, ctx) {
  const addStatic = (kind, input, options) => {
    const normalised = (Array.isArray(input) ? input : [input]).map(
      (obj) => Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          /^[a-zA-Z][\w-]*$/.test(k) && v && typeof v === "object" ? `.${k}` : k,
          v
        ])
      )
    );
    const group = typeof options === "string" ? options : kind === "components" ? PLUGIN_COMPONENTS_GROUP : ctx.pluginName;
    const { rules } = cssInJsToRules(normalised);
    collector.statics.push(...rulesToStatics(group, rules));
  };
  const addMatch = (kind, utilities, options = {}) => {
    const { types, preferOnConflict } = normalizeTypes(options.type);
    for (const [prefix, fn] of Object.entries(utilities)) {
      const shapesFor = (value, modifier) => {
        const out = fn(value, { modifier });
        if (!out) return null;
        const { rules } = cssInJsToRules({ "&": out });
        if (rules.length === 0) return null;
        return rules.map((r) => ({
          selector: selectorSuffix(r.selector),
          decls: r.decls,
          atrules: r.atrules.length ? r.atrules : void 0
        }));
      };
      collector.functional.push({
        plugin: kind === "components" ? PLUGIN_COMPONENTS_GROUP : ctx.pluginName,
        prefix,
        values: options.values ?? {},
        types,
        preferOnConflict: preferOnConflict || void 0,
        negative: options.supportsNegativeValues,
        bare: options.bare,
        modifier: options.modifiers === "any" ? "any" : options.modifiers ? options.modifiers : void 0,
        describe: `${prefix}-{value}`,
        build: (value, { modifier }) => {
          const shapes = shapesFor(value, modifier);
          if (!shapes) return null;
          return shapes.find((sh) => sh.selector === void 0)?.decls ?? {};
        },
        buildAll: shapesFor
      });
    }
  };
  return {
    addUtilities: (u, o) => addStatic("utilities", u, o),
    matchUtilities: (u, o) => addMatch("utilities", u, o),
    addComponents: (c) => addStatic("components", c),
    matchComponents: (c, o) => addMatch("components", c, o),
    addBase: (base) => {
      collector.base.push(...collapseAdjacentRules(flattenNodes(cssInJsToNodes(base))));
    },
    addVariant: (name, definition) => {
      let formats;
      if (typeof definition === "function") {
        const result = definition({ separator: ":" });
        formats = result === void 0 ? [] : Array.isArray(result) ? result : [result];
      } else formats = Array.isArray(definition) ? definition : [definition];
      const branches = formats.map(formatToBranch);
      collector.variants.push({
        name,
        key: name,
        sort: 0,
        // assigned by the engine (registration order)
        branches,
        description: `plugin variant ${name}`
      });
    },
    matchVariant: (name, fn, options = {}) => {
      const values = options.values ?? {};
      const keys = Object.keys(values).filter((k) => k !== "DEFAULT");
      const sortFn = typeof options.sort === "function" ? options.sort : void 0;
      const id = `plugin:${name}`;
      collector.variants.push({
        name,
        key: name,
        sort: 0,
        // assigned by the engine (registration order)
        functional: true,
        slots: keys.length,
        description: `plugin variant ${name}-*`,
        match: (value, modifier) => {
          let resolved;
          if (value.startsWith("[") && value.endsWith("]"))
            resolved = value.slice(1, -1).replace(/_/g, " ");
          else if (values[value] !== void 0) resolved = values[value];
          else if (value === "" && values.DEFAULT !== void 0) resolved = values.DEFAULT;
          else return null;
          const result = fn(resolved, { modifier });
          const formats = Array.isArray(result) ? result : [result];
          const slot = keys.indexOf(value);
          return {
            branches: formats.map(formatToBranch),
            slot: slot === -1 ? keys.length : slot,
            fn: sortFn ? {
              id,
              value: resolved,
              modifier,
              compare: (a, b) => sortFn(a, b)
            } : void 0
          };
        }
      });
    },
    theme: ctx.themeFn,
    config: ctx.configFn,
    corePlugins: ctx.corePluginEnabled,
    e: escapeClassName,
    prefix: (selector) => ctx.prefix ? selector.replace(/\.([\w-])/g, `.${ctx.prefix}$1`) : selector,
    variants: () => [],
    addCss: (css) => collector.rawCss.push(css)
  };
  function formatToBranch(format) {
    const f = format.trim();
    if (f.startsWith("@")) {
      const m = /^@([\w-]+)\s*(.*)$/.exec(f);
      const name = m ? m[1] : "media";
      const params = m ? m[2].trim() : "";
      const kind = name === "media" ? "media" : name === "supports" ? "supports" : name === "container" ? "container" : "raw";
      return {
        atrules: [
          { kind, params: kind === "raw" ? `${name} ${params}` : params, sort: 9e3, raw: true }
        ]
      };
    }
    return { format: f.includes("&") ? f : `${f} &` };
  }
}
var ApplyError = class extends Error {
  constructor(message, candidate) {
    super(message);
    this.candidate = candidate;
    this.name = "ApplyError";
  }
  candidate;
};
function replaceThemeFunctions(value, engine) {
  if (!value.includes("theme(") && !value.includes("screen(")) return value;
  let out = value.replace(/theme\(((?:[^()]|\([^()]*\))*)\)/g, (_whole, inner) => {
    const path = inner.trim().replace(/^['"]|['"]$/g, "").replace(/\s*\/\s*/g, "/");
    const resolved = engine.lookupTheme(path);
    if (resolved === void 0)
      throw new ApplyError(`'${path}' does not exist in your theme config.`);
    return resolved;
  });
  out = out.replace(/screen\(([^)]+)\)/g, (_whole, name) => {
    const key = name.trim().replace(/^['"]|['"]$/g, "");
    const px = engine.theme.screens[key];
    if (px === void 0) throw new ApplyError(`The '${key}' screen does not exist in your theme.`);
    return `(min-width: ${px})`;
  });
  return out;
}
function processAuthorCss(css, engine, options = {}) {
  const root = parseCss(css);
  processNodes(root.nodes, engine, options);
  return serializeCss(root);
}
function processNodes(nodes, engine, options, parent, insideAtRule, directChildren = false) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type === "decl") {
      node.value = replaceThemeFunctions(node.value, engine);
      continue;
    }
    if (node.type === "atrule") {
      if (node.name === "apply" && directChildren) continue;
      if (node.name === "screen") {
        const key = node.params.trim();
        const px = engine.theme.screens[key];
        if (px === void 0)
          throw new ApplyError(`The '${key}' screen does not exist in your theme.`);
        node.name = "media";
        node.params = `(min-width: ${px})`;
      } else if (node.name === "apply") {
        if (!parent) throw new ApplyError("`@apply` must be used inside a rule.");
        const list = node.params.replace(/\s!important$/, "").trim().split(/\s+/);
        throw new ApplyError(
          insideAtRule === "screen" ? `@apply is not supported within nested at-rules like @screen. We suggest you write this as @apply ${list.map((c) => `${node.params.trim()}:${c}`).join(" ")} instead.` : `@apply is not supported within nested at-rules like @${insideAtRule}. You can fix this by un-nesting @${insideAtRule}.`
        );
      }
      if (node.params) node.params = replaceThemeFunctions(node.params, engine);
      if (node.nodes) processNodes(node.nodes, engine, options, parent, node.name);
      continue;
    }
    if (node.type === "rule") {
      processNodes(node.nodes, engine, options, node, void 0, true);
      if (!node.nodes.some((n) => n.type === "atrule" && n.name === "apply")) continue;
      const out = expandRule(node, engine, options);
      nodes.splice(i, 1, ...out);
      i += out.length - 1;
    }
  }
}
function expandRule(rule, engine, options) {
  const groups = [];
  let current = [];
  for (const child of rule.nodes) {
    if (child.type === "atrule" && child.name === "apply") {
      if (current.length) groups.push(current);
      current = [];
      groups.push([child]);
    } else current.push(child);
  }
  if (current.length) groups.push(current);
  const out = [];
  for (const group of groups) {
    const first = group[0];
    if (group.length === 1 && first.type === "atrule" && first.name === "apply") {
      const { decls, extraRules } = expandApply(first.params, engine, rule, options);
      if (decls.length) out.push({ ...rule, nodes: decls });
      extraRules.sort((a, b) => compareRules(a.rule, b.rule) || a.seq - b.seq);
      for (const r of extraRules) out.push(r.node);
    } else out.push({ ...rule, nodes: group });
  }
  return collapseAdjacentRules(out);
}
var siblingSeq = 0;
function expandApply(params, engine, parent, options) {
  let important = false;
  let list = params.trim();
  if (/\s!important$/.test(list)) {
    important = true;
    list = list.replace(/\s!important$/, "");
  }
  const candidates = list.split(/\s+/).filter(Boolean);
  const decls = [];
  const extraRules = [];
  const compiled = [];
  const parentClasses = [...parent.selector.matchAll(/\.((?:\\.|[\w-])+)/g)].map(
    (m) => m[1].replace(/\\(.)/g, "$1")
  );
  for (const candidate of candidates) {
    if (candidate === "group" || candidate === "peer")
      throw new ApplyError(`@apply should not be used with the '${candidate}' utility`, candidate);
    const rules = engine.compile(candidate);
    if (rules.length === 0) {
      if (options.strict === false) continue;
      throw new ApplyError(
        `The \`${candidate}\` class does not exist. If \`${candidate}\` is a custom class, make sure it is defined within a \`@layer\` directive or a plugin.`,
        candidate
      );
    }
    const base = candidate.slice(candidate.lastIndexOf(":") + 1).replace(/^!/, "");
    if (parentClasses.includes(candidate) || parentClasses.includes(base))
      throw new ApplyError(
        `You cannot \`@apply\` the \`${candidate}\` utility here because it creates a circular dependency.`,
        candidate
      );
    for (const rule of rules) compiled.push({ candidate, rule });
  }
  compiled.sort((a, b) => compareRules(a.rule, b.rule));
  for (const { candidate, rule } of compiled) {
    const bang = important || rule.candidate.startsWith("!");
    const ruleDecls = Object.entries(rule.decls).map(([prop, value]) => {
      const isImp = bang || / !important$/.test(value);
      return {
        type: "decl",
        prop,
        value: value.replace(/ !important$/, ""),
        important: isImp || void 0
      };
    });
    const escaped = `.${escapeClassName(candidate)}`;
    const isPlain = rule.atrules.length === 0 && rule.selector === escaped;
    if (isPlain) {
      decls.push(...ruleDecls);
      continue;
    }
    const selectors = splitAtTopLevelOnly(parent.selector, ",").map((s) => s.trim());
    const newSelector = selectors.map((ps) => {
      if (rule.selector === escaped) return ps;
      return rule.selector.split(escaped).join(ps);
    }).join(", ");
    let node = { type: "rule", selector: newSelector, nodes: ruleDecls };
    for (let a = rule.atrules.length - 1; a >= 0; a--) {
      const at = rule.atrules[a];
      node = {
        type: "atrule",
        name: atName(at.kind, at.params),
        params: atParams(at.kind, at.params),
        nodes: [node]
      };
    }
    extraRules.push({ node, rule, seq: siblingSeq++ });
  }
  return { decls, extraRules };
}
function atName(kind, params) {
  if (kind === "raw") return params.split(/\s+/)[0];
  if (kind === "starting") return "starting-style";
  return kind;
}
function atParams(kind, params) {
  if (kind === "raw") return params.slice(params.indexOf(" ") + 1);
  if (kind === "starting") return "";
  return params;
}
var version = "3.0.0";
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
    description: "keyboard focus"
  },
  {
    prefix: "focus-within",
    suffix: ":focus-within",
    ancestor: "",
    configKey: "focusWithin",
    description: "a descendant has focus"
  },
  {
    prefix: "active",
    suffix: ":active",
    ancestor: "",
    configKey: "active",
    description: "while pressed"
  },
  {
    prefix: "visited",
    suffix: ":visited",
    ancestor: "",
    configKey: "visited",
    description: "visited links"
  },
  {
    prefix: "disabled",
    suffix: ":disabled",
    ancestor: "",
    configKey: "disabled",
    description: "disabled controls"
  },
  {
    prefix: "first",
    suffix: ":first-child",
    ancestor: "",
    configKey: "firstChild",
    description: "first child"
  },
  {
    prefix: "last",
    suffix: ":last-child",
    ancestor: "",
    configKey: "lastChild",
    description: "last child"
  },
  {
    prefix: "group-hover",
    suffix: "",
    ancestor: ".group:hover",
    configKey: "groupHover",
    description: "parent .group hovered"
  },
  {
    prefix: "group-focus",
    suffix: "",
    ancestor: ".group:focus",
    configKey: "groupFocus",
    description: "parent .group focused"
  },
  {
    prefix: "peer-hover",
    suffix: "",
    ancestor: ".peer:hover ~",
    configKey: "peerHover",
    description: "preceding .peer hovered"
  },
  {
    prefix: "peer-focus",
    suffix: "",
    ancestor: ".peer:focus ~",
    configKey: "peerFocus",
    description: "preceding .peer focused"
  },
  {
    prefix: "dark",
    suffix: "",
    ancestor: ":is(.dark *)",
    configKey: "dark",
    description: "dark mode"
  }
];
var VERSION = version;
var CORE_SCREENS = ["sm", "md", "lg", "xl", "2xl"];
var CSSGenerator = class {
  config;
  /** the fully resolved theme (Tailwind-shaped scales) */
  theme;
  engine;
  variantCfg;
  breakpoints;
  catalog = null;
  catalogByClass = null;
  pluginBase;
  pluginRawCss;
  corePluginsEnabled;
  constructor(config = {}) {
    let draft = {};
    for (const preset of config.presets ?? []) draft = mergePreset(draft, preset);
    draft = mergePreset(draft, config);
    const plugins = (draft.plugins ?? []).map((p) => normalizePlugin(p));
    const pluginThemes = [];
    for (const p of plugins) {
      if (p.legacyConfig) p.legacyConfig(draft);
      if (p.config) {
        const { theme, ...rest } = p.config;
        if (theme) pluginThemes.push(theme);
        for (const [k, v] of Object.entries(rest))
          if (draft[k] === void 0)
            draft[k] = v;
      }
    }
    const corePlugins = draft.corePlugins ?? {};
    this.corePluginsEnabled = Array.isArray(corePlugins) ? (name) => corePlugins.includes(name) || ["base", "variables", "components", "animations"].includes(name) : (name) => corePlugins[name] !== false;
    this.config = {
      ...draft,
      theme: draft.theme ?? {},
      variants: { ...defaultVariants, ...draft.variants },
      darkMode: draft.darkMode ?? "class",
      content: draft.content,
      purge: draft.purge ?? [],
      safelist: draft.safelist ?? [],
      blocklist: draft.blocklist ?? [],
      plugins: draft.plugins ?? [],
      important: draft.important ?? false,
      corePlugins,
      prefix: draft.prefix ?? "",
      extractorPattern: draft.extractorPattern,
      layers: draft.layers ?? false,
      preflight: draft.preflight ?? true
    };
    this.variantCfg = this.config.variants;
    this.theme = resolveTheme(this.config.theme, { pluginTheme: pluginThemes });
    this.breakpoints = Object.entries(this.theme.screens).map(([name, value]) => ({ name, value, px: screenPx(value) })).filter((b) => !Number.isNaN(b.px) && b.px > 0).sort((a, b) => a.px - b.px);
    const collector = {
      statics: [],
      functional: [],
      variants: [],
      base: [],
      rawCss: []
    };
    const themeFn = (path, fallback) => {
      if (path === void 0) return this.theme;
      const v = lookup(this.theme, path);
      return v === void 0 ? fallback : v;
    };
    for (const p of plugins) {
      if (!p.handler) continue;
      const api = createPluginAPI(collector, {
        theme: this.theme,
        themeFn,
        configFn: (path, fallback) => {
          if (path === void 0) return { ...this.config, theme: this.theme };
          if (path === "prefix") return this.config.prefix;
          if (path === "separator") return ":";
          if (path === "darkMode") return this.config.darkMode;
          const v = lookup({ ...this.config, theme: this.theme }, path);
          return v === void 0 ? fallback : v;
        },
        corePluginEnabled: this.corePluginsEnabled,
        prefix: this.config.prefix ?? "",
        pluginName: "plugin"
      });
      p.handler(api);
    }
    this.pluginBase = collector.base;
    this.pluginRawCss = collector.rawCss;
    this.engine = new Engine({
      theme: this.theme,
      darkMode: this.variantCfg.dark === false ? false : this.config.darkMode ?? "class",
      pluginEnabled: this.corePluginsEnabled,
      variantEnabled: (key) => this.isVariantEnabled(key),
      important: this.config.important ?? false,
      extraStatic: collector.statics,
      extraFunctional: collector.functional,
      extraVariants: collector.variants,
      combineMedia: this.config.combineMedia !== false
    });
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
    if (mode === "jit")
      return this.generateJIT(options.content ?? this.getContentFromConfig(), options);
    const css = this.generateFull(options);
    return options.minify ? minifyCss(css) : css;
  }
  /** Generate JIT CSS from explicit content */
  generateFromContent(content, options = {}) {
    return this.generateJIT(content, options);
  }
  /** All utility rules in catalog order (value-bearing classes, no variants) */
  getUtilities() {
    return [...this.buildCatalog()];
  }
  /** Look up a single utility by (base) class name */
  getUtility(className) {
    this.buildCatalog();
    const hit = this.catalogByClass.get(className);
    if (hit) return hit;
    const rules = this.engine.compile(className);
    if (rules.length === 0) return void 0;
    return {
      class: className,
      group: rules[0].plugin,
      category: categoryForPlugin(rules[0].plugin),
      decls: Object.assign({}, ...rules.map((r) => r.decls)),
      description: `${className} (computed)`
    };
  }
  /** Every variant name the engine knows (static + functional prefixes) */
  getVariantNames() {
    return this.engine.getVariants().map((v) => v.name);
  }
  /** Variant definitions (docs / IntelliSense) */
  getVariantDefinitions() {
    return this.engine.getVariants();
  }
  /** Resolved breakpoints, ascending */
  getBreakpoints() {
    return this.variantCfg.responsive !== false ? [...this.breakpoints] : [];
  }
  /** Compile a single candidate to CSS (empty string when unknown) */
  compileClass(candidate) {
    return this.serializeRules(this.engine.compile(candidate));
  }
  /** Statistics about a generated stylesheet */
  /**
   * Statistics for a stylesheet (default: the full build). Computed on the
   * parsed CSS, not with regexes: a "rule" is a style rule with a selector,
   * "responsive" means it sits inside a `@media`/`@container` at-rule,
   * "variant" means at least one selector in the list carries a variant
   * prefix (an escaped `\:` in the class part), and keyframe steps
   * (`from`, `to`, `50%`) are excluded from all three.
   */
  getStats(css) {
    const generated = css ?? this.generate();
    const minified = minifyCss(generated);
    let totalRules = 0;
    let responsiveRules = 0;
    let variantRules = 0;
    for (const { rule, ancestors } of walkRules(parseCss(generated).nodes)) {
      if (ancestors.some((a) => a.name === "keyframes")) continue;
      totalRules++;
      if (ancestors.some((a) => a.name === "media" || a.name === "container")) responsiveRules++;
      if (splitSelectorList(rule.selector).some((sel) => /\\:/.test(sel))) variantRules++;
    }
    return {
      utilities: this.buildCatalog().length,
      responsiveRules,
      variantRules,
      totalRules,
      sizeBytes: byteLength(generated),
      minifiedSizeBytes: byteLength(minified)
    };
  }
  minify(css) {
    return minifyCss(css);
  }
  /** Expand `@apply`, `theme()`, `screen()` and `@screen` in author CSS */
  processCss(css, options = {}) {
    return processAuthorCss(css, this.engine, options);
  }
  /** Resolve a theme path (`colors.blue.500`, `spacing[2.5]`) */
  themeValue(path) {
    return this.engine.lookupTheme(path);
  }
  // ───────────────────────────── layer accessors ─────────────────────────────
  /** Base styles (reset, `--tw-*` defaults, plugin base) */
  getBase() {
    return this.baseStyles();
  }
  /** `:root` CSS variables */
  getVariables() {
    return this.variables();
  }
  /** `@keyframes` for the referenced animations (all when `names` is omitted) */
  getKeyframes(names) {
    return this.keyframes(names);
  }
  /**
   * Full utility set.
   * @param includeVariants when true (default) the classic state variants
   *   (`STATE_VARIANTS`) are included — the standard full build omits them.
   */
  getUtilitiesFull(includeVariants = true, options = {}) {
    const catalog = this.buildCatalog();
    const prefix = this.config.prefix ?? "";
    const base = [];
    for (const r of catalog) {
      const cls = r.class.slice(prefix.length);
      for (const c of this.engine.compile(cls))
        base.push(prefix ? this.reprefix(c, cls, r.class) : c);
    }
    let css = this.serializeRules(base);
    for (const bp of this.fullBuildScreens(options.screens)) {
      const wrapped = [];
      const vm = this.engine.resolveVariant(bp.name);
      if (!vm) continue;
      const at = vm.branches[0]?.atrules?.[0];
      if (!at) continue;
      for (const rule of base) {
        const from = `.${escapeClass(rule.candidate)}`;
        const to = `.${escapeClass(`${bp.name}:${rule.candidate}`)}`;
        wrapped.push({
          ...rule,
          selector: rule.selector.split(from).join(to),
          atrules: [at, ...rule.atrules],
          sort: {
            ...rule.sort,
            variant: 1,
            variants: [vm.sort],
            hooks: vm.fn ? [{ ...vm.fn, bit: vm.sort }] : void 0
          }
        });
      }
      css += this.serializeRules(wrapped);
    }
    if (includeVariants) {
      const candidates = [];
      for (const v of STATE_VARIANTS) {
        if (!this.isVariantEnabled(v.configKey)) continue;
        for (const r of catalog) candidates.push(`${v.prefix}:${r.class}`);
      }
      css += this.compileCandidates(candidates).css;
    }
    return css;
  }
  /**
   * Screens that get responsive variants in the *full* build. Default
   * (`'core'`): the classic `sm`–`2xl` set, so the extended 10-step scale
   * does not multiply the CDN bundle (every screen is always available in
   * JIT mode). `'all'` or an explicit list opt in.
   */
  fullBuildScreens(screens = "core") {
    const all = this.getBreakpoints();
    if (screens === "all") return all;
    const wanted = new Set(screens === "core" ? CORE_SCREENS : screens);
    const picked = all.filter((b) => wanted.has(b.name));
    return screens === "core" && picked.length === 0 ? all : picked;
  }
  reprefix(rule, from, to) {
    return {
      ...rule,
      selector: rule.selector.split(`.${escapeClass(from)}`).join(`.${escapeClass(to)}`)
    };
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
  isVariantEnabled(key) {
    const cfg = this.variantCfg;
    if (cfg[key] === false) return false;
    for (const [legacy, name] of Object.entries(LEGACY_VARIANT_KEYS)) {
      if (name === key && cfg[legacy] === false) return false;
    }
    const camel2 = key.replace(/-([a-z])/g, (_m, c) => c.toUpperCase());
    if (camel2 !== key && cfg[camel2] === false) return false;
    return true;
  }
  buildCatalog() {
    if (this.catalog) return this.catalog;
    const prefix = this.config.prefix ?? "";
    const entries = this.engine.buildCatalog();
    this.catalog = entries.map((e) => ({
      class: prefix + e.class,
      group: e.plugin,
      category: categoryForPlugin(e.plugin),
      decls: e.decls,
      description: e.description
    }));
    this.catalogByClass = new Map(this.catalog.map((r) => [r.class, r]));
    return this.catalog;
  }
  /** Compile candidates → ordered CSS text plus bookkeeping */
  compileCandidates(candidates) {
    const prefix = this.config.prefix ?? "";
    const block = new Set(this.config.blocklist ?? []);
    const rules = [];
    const emitted = /* @__PURE__ */ new Set();
    const animations = /* @__PURE__ */ new Set();
    const defaults = /* @__PURE__ */ new Set();
    const seenRules = /* @__PURE__ */ new Set();
    const ordered = [...new Set(candidates)].sort((x, y) => x < y ? -1 : x > y ? 1 : 0);
    for (const raw of ordered) {
      if (emitted.has(raw) || block.has(raw)) continue;
      let candidate = raw;
      if (prefix) {
        const idx = raw.lastIndexOf(":");
        const base = raw.slice(idx + 1);
        const neg = base.startsWith("-") ? "-" : "";
        const bang = base.startsWith("!") ? "!" : "";
        const core = base.slice(neg.length + bang.length);
        if (!core.startsWith(prefix)) continue;
        candidate = raw.slice(0, idx + 1) + neg + bang + core.slice(prefix.length);
      }
      const compiled = this.engine.compile(candidate);
      if (compiled.length === 0) continue;
      emitted.add(raw);
      for (const r of compiled) {
        const rule = prefix ? {
          ...r,
          selector: r.selector.split(`.${escapeClass(candidate)}`).join(`.${escapeClass(raw)}`)
        } : r;
        const identity = `${rule.selector}\0${rule.atrules.map((a) => `${a.kind} ${a.params}`).join("|")}\0${JSON.stringify(rule.decls)}`;
        if (seenRules.has(identity)) continue;
        seenRules.add(identity);
        rules.push(rule);
        if (r.defaults) defaults.add(r.defaults);
        for (const a of r.animations ?? []) animations.add(a);
      }
    }
    return { css: this.serializeRules(rules), emitted, animations, defaults };
  }
  /** Sort rules (variant weight → plugin → utility → value) and serialise with grouped at-rules. */
  serializeRules(rules) {
    const sorted = [...rules].sort(compareRules);
    let out = "";
    let openKey = "";
    let openDepth = 0;
    const closeAll = () => {
      while (openDepth > 0) {
        openDepth--;
        out += `${"  ".repeat(openDepth)}}
`;
      }
      openKey = "";
    };
    for (const rule of sorted) {
      const key = rule.atrules.map(atRuleText).join("\0");
      if (key !== openKey) {
        closeAll();
        for (const at of rule.atrules) {
          out += `${"  ".repeat(openDepth)}${atRuleText(at)} {
`;
          openDepth++;
        }
        openKey = key;
      }
      out += `${"  ".repeat(openDepth)}${rule.selector} { ${stringifyDecls(rule.decls)}; }
`;
    }
    closeAll();
    return out;
  }
  // ─────────────────────────────── layers ───────────────────────────────
  baseStyles() {
    if (!this.corePluginsEnabled("base")) return "";
    let css = "";
    if (this.config.preflight !== false && this.corePluginsEnabled("preflight"))
      css += preflight(this.theme);
    css += this.twDefaults();
    if (this.pluginBase.length) css += serializeCss(this.pluginBase);
    return css;
  }
  /** `*, ::before, ::after { --tw-… }` defaults required by composed utilities */
  twDefaults(groups) {
    const wanted = groups ?? new Set(Object.keys(DEFAULTS_GROUPS));
    const decls = {};
    for (const g of Object.keys(DEFAULTS_GROUPS)) {
      if (!wanted.has(g)) continue;
      Object.assign(decls, DEFAULTS_GROUPS[g]);
    }
    if (Object.keys(decls).length === 0) return "";
    const body = Object.entries(decls).map(([k, v]) => `  ${k}: ${v};`).join("\n");
    return `
*, ::before, ::after {
${body}
}

::backdrop {
${body}
}
`;
  }
  variables() {
    if (!this.corePluginsEnabled("variables")) return "";
    let css = "\n/* Nakshora v3 \u2014 CSS Variables */\n:root {\n";
    for (const [name, scale] of Object.entries(this.theme.colors ?? {})) {
      if (typeof scale === "string") css += `  --color-${name}: ${scale};
`;
      else if (scale && typeof scale === "object") {
        for (const [shade, value] of Object.entries(scale)) {
          if (typeof value === "string")
            css += `  --color-${name}${shade === "DEFAULT" ? "" : `-${shade}`}: ${value};
`;
        }
      }
    }
    for (const [key, value] of Object.entries(this.theme.spacing ?? {}))
      css += `  --spacing-${cssIdent(key)}: ${value};
`;
    for (const [size, value] of Object.entries(this.theme.fontSize ?? {}))
      css += `  --text-${size}: ${Array.isArray(value) ? value[0] : String(value)};
`;
    for (const [name, value] of Object.entries(this.theme.fontFamily ?? {}))
      css += `  --font-${name}: ${Array.isArray(value) ? value.join(", ") : String(value)};
`;
    for (const [name, value] of Object.entries(this.theme.screens ?? {}))
      css += `  --breakpoint-${name}: ${value};
`;
    css += "}\n";
    return css;
  }
  keyframes(names) {
    if (!this.corePluginsEnabled("animations") && !this.corePluginsEnabled("animation")) return "";
    const keyframes = this.theme.keyframes ?? {};
    const animations = this.theme.animation ?? {};
    const needed = names ?? new Set(Object.values(animations).map((v) => String(v).split(/\s+/)[0]));
    let css = "";
    for (const [name, body] of Object.entries(keyframes)) {
      if (!needed.has(name)) continue;
      css += `@keyframes ${name} {
`;
      for (const [step, decls] of Object.entries(body)) {
        css += `  ${step} { ${Object.entries(decls).map(([k, v]) => `${kebabCase(k)}: ${v};`).join(" ")} }
`;
      }
      css += "}\n";
    }
    return css ? `
/* Nakshora v3 \u2014 Keyframes */
${css}` : "";
  }
  components() {
    if (!this.corePluginsEnabled("components")) return "";
    let css = "\n/* Nakshora v3 \u2014 Components */\n";
    for (const block of Object.values(componentCss)) css += block;
    if (this.pluginRawCss.length) css += `${this.pluginRawCss.join("\n")}
`;
    return css;
  }
  wrapLayer(name, css) {
    if (!css.trim()) return "";
    if (!this.config.layers) return css;
    return `@layer ${name} {
${css}}
`;
  }
  // ─────────────────────────────── full mode ───────────────────────────────
  generateFull(options) {
    let css = `/*! Nakshora v${VERSION} \u2014 utility-first CSS framework (full build) */
`;
    if (this.config.layers) css += "@layer base, components, utilities;\n";
    css += this.wrapLayer("base", this.baseStyles() + this.variables() + this.keyframes());
    css += this.wrapLayer("components", this.components());
    css += "\n/* \u2500\u2500\u2500 Utilities \u2500\u2500\u2500 */\n";
    css += this.wrapLayer("utilities", this.getUtilitiesFull(false, { screens: options.screens }));
    return css;
  }
  // ─────────────────────────────── JIT mode ───────────────────────────────
  /**
   * Compile a JIT build from content.
   * @param internal.utilitiesOnly emit only the utilities section (no base/variables/keyframes/components)
   */
  generateJIT(content, options = {}, internal) {
    const css = this.generateJITPretty(content, options, internal);
    return options.minify ? minifyCss(css) : css;
  }
  /**
   * JIT build from an already-extracted candidate set (see `ContentCache`):
   * skips the extractor entirely, otherwise identical to `generateJIT`.
   */
  generateJITFromCandidates(candidates, options = {}, internal) {
    const css = this.generateJITPretty(void 0, options, internal, new Set(candidates));
    return options.minify ? minifyCss(css) : css;
  }
  generateJITPretty(content, _options, internal, candidates) {
    const utilitiesOnly = internal?.utilitiesOnly ?? false;
    const chunks = typeof content === "string" ? [content] : content ?? [];
    const found = candidates ?? extractClasses(chunks, this.config.extractorPattern);
    for (const safe of this.config.safelist ?? []) found.add(safe);
    const { css: utilities, emitted, animations, defaults } = this.compileCandidates(found);
    let css = "";
    if (!utilitiesOnly) {
      css += `/*! Nakshora v${VERSION} \u2014 JIT build \xB7 ${emitted.size} classes */
`;
      if (this.config.layers) css += "@layer base, components, utilities;\n";
      let base = "";
      if (this.corePluginsEnabled("base")) {
        if (this.config.preflight !== false && this.corePluginsEnabled("preflight"))
          base += preflight(this.theme);
        base += this.twDefaults(defaults);
        if (this.pluginBase.length) base += serializeCss(this.pluginBase);
      }
      css += this.wrapLayer("base", base + this.variables() + this.keyframes(animations));
      css += this.wrapLayer("components", this.componentsFor(found));
    }
    css += "\n/* \u2500\u2500\u2500 Utilities (JIT) \u2500\u2500\u2500 */\n";
    css += this.wrapLayer("utilities", utilities);
    return css;
  }
  /** Components layer — only the built-in blocks whose classes appear in `candidates`. */
  componentsFor(candidates) {
    if (!this.corePluginsEnabled("components")) return "";
    const used = /* @__PURE__ */ new Set();
    for (const c of candidates) {
      const base = c.slice(c.lastIndexOf(":") + 1);
      used.add(base);
    }
    let css = "";
    for (const block of Object.values(componentCss)) {
      const classes = [...block.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]);
      if (classes.some((c) => used.has(c))) css += block;
    }
    if (this.pluginRawCss.length) css += `${this.pluginRawCss.join("\n")}
`;
    return css ? `
/* Nakshora v3 \u2014 Components */
${css}` : "";
  }
};
function mergePreset(base, preset) {
  if ("colors" in preset && !("theme" in preset)) {
    const p = preset;
    const { name: _n, description: _d, ...themeBits } = p;
    return { ...base, theme: deepMerge(base.theme ?? {}, themeBits) };
  }
  const cfg = preset;
  return {
    ...base,
    ...cfg,
    theme: deepMerge(base.theme ?? {}, cfg.theme ?? {}),
    variants: { ...base.variants, ...cfg.variants },
    corePlugins: Array.isArray(cfg.corePlugins) ? cfg.corePlugins : { ...Array.isArray(base.corePlugins) ? {} : base.corePlugins, ...cfg.corePlugins },
    plugins: [...base.plugins ?? [], ...cfg.plugins ?? []],
    safelist: [...base.safelist ?? [], ...cfg.safelist ?? []]
  };
}
function lookup(obj, path) {
  let cur = obj;
  for (const key of splitPath(path)) {
    if (cur === null || typeof cur !== "object") return void 0;
    cur = cur[key];
  }
  return cur;
}
function screenPx(value) {
  const m = /^(\d+(?:\.\d+)?)(px|rem|em)?$/.exec(String(value).trim());
  if (!m) return NaN;
  return m[2] === "rem" || m[2] === "em" ? parseFloat(m[1]) * 16 : parseFloat(m[1]);
}
function cssIdent(key) {
  return key.replace(/[^a-zA-Z0-9_-]/g, "_");
}
function kebabCase(prop) {
  return prop.startsWith("--") ? prop : prop.replace(/([a-z\d])([A-Z])/g, "$1-$2").toLowerCase();
}
function atRuleText(at) {
  switch (at.kind) {
    case "media":
      return `@media ${at.params}`;
    case "supports":
      return `@supports ${at.params}`;
    case "container":
      return `@container ${at.params}`;
    case "starting":
      return "@starting-style";
    default:
      return `@${at.params}`;
  }
}
function preflight(theme) {
  const sans = fontStack(theme.fontFamily?.sans) || 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
  const mono = fontStack(theme.fontFamily?.mono) || 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
  const border = theme.borderColor?.DEFAULT ?? "#e5e7eb";
  const placeholder = (theme.colors.gray ?? {})[400] ?? "#9ca3af";
  return `/* Nakshora v3 \u2014 Base (preflight) */
*, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: ${String(border)}; }
::before, ::after { --tw-content: ''; }
html, :host { line-height: 1.5; -webkit-text-size-adjust: 100%; -moz-tab-size: 4; tab-size: 4; font-family: ${sans}; font-feature-settings: normal; font-variation-settings: normal; -webkit-tap-highlight-color: transparent; }
body { margin: 0; line-height: inherit; }
hr { height: 0; color: inherit; border-top-width: 1px; }
abbr:where([title]) { text-decoration: underline dotted; }
h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
a { color: inherit; text-decoration: inherit; }
b, strong { font-weight: bolder; }
code, kbd, samp, pre { font-family: ${mono}; font-feature-settings: normal; font-variation-settings: normal; font-size: 1em; }
small { font-size: 80%; }
sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-align: baseline; }
sub { bottom: -0.25em; }
sup { top: -0.5em; }
table { text-indent: 0; border-color: inherit; border-collapse: collapse; }
button, input, optgroup, select, textarea { font-family: inherit; font-feature-settings: inherit; font-variation-settings: inherit; font-size: 100%; font-weight: inherit; line-height: inherit; letter-spacing: inherit; color: inherit; margin: 0; padding: 0; }
button, select { text-transform: none; }
button, input:where([type='button']), input:where([type='reset']), input:where([type='submit']) { -webkit-appearance: button; background-color: transparent; background-image: none; }
:-moz-focusring { outline: auto; }
:-moz-ui-invalid { box-shadow: none; }
progress { vertical-align: baseline; }
::-webkit-inner-spin-button, ::-webkit-outer-spin-button { height: auto; }
[type='search'] { -webkit-appearance: textfield; outline-offset: -2px; }
::-webkit-search-decoration { -webkit-appearance: none; }
::-webkit-file-upload-button { -webkit-appearance: button; font: inherit; }
summary { display: list-item; }
blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre { margin: 0; }
fieldset { margin: 0; padding: 0; }
legend { padding: 0; }
ol, ul, menu { list-style: none; margin: 0; padding: 0; }
dialog { padding: 0; }
textarea { resize: vertical; }
input::placeholder, textarea::placeholder { opacity: 1; color: ${placeholder}; }
button, [role="button"] { cursor: pointer; }
:disabled { cursor: default; }
img, svg, video, canvas, audio, iframe, embed, object { display: block; vertical-align: middle; }
img, video { max-width: 100%; height: auto; }
[hidden]:where(:not([hidden="until-found"])) { display: none; }
`;
}
function fontStack(value) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string") return value;
  return "";
}
function contentHash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `${text.length}:${(h >>> 0).toString(36)}`;
}
var ContentCache = class {
  constructor(pattern2) {
    this.pattern = pattern2;
  }
  pattern;
  entries = /* @__PURE__ */ new Map();
  hits = 0;
  misses = 0;
  /**
   * Candidates for one source. `key` identifies the source (file path or
   * `raw:<n>`), `stamp` its version (`${mtimeMs}:${size}` for files, a hash
   * for strings). `read` is only called on a miss.
   */
  candidatesFor(key, stamp, read) {
    const hit = this.entries.get(key);
    if (hit && hit.stamp === stamp) {
      this.hits++;
      return hit.candidates;
    }
    this.misses++;
    const candidates = extractCandidates([read()], { pattern: this.pattern });
    this.entries.set(key, { stamp, candidates });
    return candidates;
  }
  /** Raw content chunk (no path): stamped by hash. */
  candidatesForText(text, key) {
    const stamp = contentHash(text);
    return this.candidatesFor(key ?? `raw:${stamp}`, stamp, () => text);
  }
  /** Drop sources that no longer exist (call after a glob pass with the live key set). */
  retain(keys) {
    const keep = new Set(keys);
    for (const k of this.entries.keys())
      if (!keep.has(k) && !k.startsWith("raw:")) this.entries.delete(k);
  }
  /** Union of several candidate sets, in a deterministic (sorted) order. */
  static union(sets) {
    const all = /* @__PURE__ */ new Set();
    for (const s of sets) for (const c of s) all.add(c);
    return new Set([...all].sort());
  }
  stats() {
    return { hits: this.hits, misses: this.misses, entries: this.entries.size };
  }
  clear() {
    this.entries.clear();
    this.hits = 0;
    this.misses = 0;
  }
};
function scanSources(cache2, fs, files, raw = []) {
  const sets = [];
  const live = [];
  for (const file of files) {
    const st = fs.stat(file);
    if (!st) continue;
    live.push(file);
    sets.push(cache2.candidatesFor(file, `${st.mtimeMs}:${st.size}`, () => fs.read(file)));
  }
  for (const text of raw) sets.push(cache2.candidatesForText(text));
  cache2.retain(live);
  return ContentCache.union(sets);
}
var THEME_NAMESPACES = {
  color: "colors",
  font: "fontFamily",
  text: "fontSize",
  "font-weight": "fontWeight",
  tracking: "letterSpacing",
  leading: "lineHeight",
  breakpoint: "screens",
  container: "containers",
  spacing: "spacing",
  radius: "borderRadius",
  shadow: "boxShadow",
  "inset-shadow": null,
  "drop-shadow": "dropShadow",
  blur: "blur",
  perspective: null,
  aspect: "aspectRatio",
  ease: "transitionTimingFunction",
  animate: "animation",
  default: null
};
var CONFIG_AT_RULES = /* @__PURE__ */ new Set(["theme", "utility", "custom-variant"]);
function hasCssConfig(css) {
  return /@(?:theme|utility|custom-variant)\b/.test(css);
}
function extractCssConfig(css) {
  const notes = [];
  if (!hasCssConfig(css)) return { css, config: {}, rootVars: "", found: false, notes };
  const root = parseCss(css);
  const themeVars = /* @__PURE__ */ new Map();
  const rootVarList = [];
  const keyframes = {};
  const staticUtilities = {};
  const functionalUtilities = [];
  const variants = [];
  let found = false;
  const remaining = [];
  for (const node of root.nodes) {
    if (node.type !== "atrule" || !CONFIG_AT_RULES.has(node.name)) {
      remaining.push(node);
      continue;
    }
    found = true;
    if (node.name === "theme") {
      const flags = node.params.trim().split(/\s+/).filter(Boolean);
      const reference = flags.includes("reference");
      for (const child of node.nodes ?? []) {
        if (child.type === "decl" && child.prop.startsWith("--")) {
          const name = child.prop.slice(2);
          if (name === "*" || child.value === "initial") {
            const ns = splitNamespace(name.replace(/-\*$/, "")).namespace ?? name;
            const key = THEME_NAMESPACES[ns] ?? ns;
            notes.push(
              `@theme: \`${child.prop}: initial\` (namespace reset) is not supported \u2014 set \`theme.${key}\` in the config to replace the scale`
            );
            continue;
          }
          themeVars.set(name, child.value);
          if (!reference) rootVarList.push([child.prop, child.value]);
        } else if (child.type === "atrule" && child.name === "keyframes") {
          const frames = {};
          for (const step of child.nodes ?? [])
            if (step.type === "rule")
              frames[step.selector] = Object.fromEntries(
                step.nodes.filter((n) => n.type === "decl").map((d) => [d.prop, d.value])
              );
          keyframes[child.params.trim()] = frames;
        }
      }
    } else if (node.name === "utility") {
      const name = node.params.trim();
      const decls = (node.nodes ?? []).filter((n) => n.type === "decl");
      const nested = (node.nodes ?? []).filter((n) => n.type !== "decl");
      if (name.endsWith("-*")) functionalUtilities.push({ name: name.slice(0, -2), decls, nested });
      else staticUtilities[`.${name}`] = nodesToCssInJs(node.nodes ?? []);
    } else {
      const m = /^([\w@-]+)\s*(?:\((.*)\))?$/s.exec(node.params.trim());
      if (!m) {
        notes.push(`@custom-variant: cannot parse \`${node.params}\``);
        continue;
      }
      const name = m[1];
      if (m[2] !== void 0) variants.push({ name, formats: splitTopLevel(m[2]) });
      else variants.push({ name, formats: blockVariantFormats(node) });
    }
  }
  const extend = {};
  const fontSizeMeta = {};
  for (const [name, value] of themeVars) {
    const { namespace, key } = splitNamespace(name);
    if (!namespace || !(namespace in THEME_NAMESPACES)) {
      if (namespace !== null && namespace !== void 0 && !(namespace in THEME_NAMESPACES))
        notes.push(`@theme: \`--${name}\` has no utility namespace \u2014 kept as a CSS variable only`);
      continue;
    }
    const themeKey = THEME_NAMESPACES[namespace];
    if (themeKey === null) {
      notes.push(
        `@theme: \`--${name}\` (${namespace}) maps to a v4-only utility \u2014 kept as a CSS variable only`
      );
      continue;
    }
    const meta = /^(.*?)--(line-height|letter-spacing|font-weight)$/.exec(key);
    if (themeKey === "fontSize" && meta) {
      (fontSizeMeta[meta[1]] ??= {})[camel(meta[2])] = value;
      continue;
    }
    if (themeKey === "colors") setColor(extend, key, resolveVarRefs(value, themeVars));
    else (extend[themeKey] ??= {})[key] = resolveVarRefs(value, themeVars);
  }
  for (const [k, meta] of Object.entries(fontSizeMeta)) {
    const size = (extend.fontSize ??= {})[k];
    if (size !== void 0) extend.fontSize[k] = [size, meta];
  }
  if (Object.keys(keyframes).length) extend.keyframes = keyframes;
  const plugin2 = Object.keys(staticUtilities).length || functionalUtilities.length || variants.length ? (api) => {
    if (Object.keys(staticUtilities).length) api.addUtilities(staticUtilities);
    for (const fu of functionalUtilities) {
      const { values, kinds } = functionalValues(fu.decls, api, themeVars);
      api.matchUtilities(
        {
          [fu.name]: (value) => {
            const v = String(value);
            const out = {};
            for (const d of fu.decls) out[d.prop] = substituteValue(d.value, v);
            for (const n of fu.nested) Object.assign(out, nodesToCssInJs([n]));
            return out;
          }
        },
        { values, type: matchType(kinds), bare: bareKind(kinds) }
      );
    }
    for (const v of variants) api.addVariant(v.name, v.formats);
  } : void 0;
  const config = {};
  if (Object.keys(extend).length) config.theme = { extend };
  if (plugin2) config.plugins = [plugin2];
  const rootVars = rootVarList.length ? `:root {
${rootVarList.map(([p, v]) => `  ${p}: ${v};`).join("\n")}
}
` : "";
  return { css: serializeCss({ type: "root", nodes: remaining }), config, rootVars, found, notes };
}
function mergeCssConfig(base, fragment) {
  const out = { ...base };
  if (fragment.theme?.extend) {
    const baseExtend = base.theme?.extend ?? {};
    const fragExtend = fragment.theme.extend;
    const extend = { ...baseExtend };
    for (const [k, v] of Object.entries(fragExtend)) {
      const existing = baseExtend[k];
      extend[k] = existing && typeof existing === "object" && !Array.isArray(existing) ? { ...existing, ...v } : v;
    }
    out.theme = { ...base.theme ?? {}, extend };
  }
  if (fragment.plugins?.length) out.plugins = [...base.plugins ?? [], ...fragment.plugins];
  return out;
}
function splitNamespace(name) {
  const candidates = Object.keys(THEME_NAMESPACES).sort((a, b) => b.length - a.length);
  for (const ns of candidates) {
    if (name === ns) return { namespace: ns, key: "DEFAULT" };
    if (name.startsWith(`${ns}-`)) return { namespace: ns, key: name.slice(ns.length + 1) };
  }
  return { namespace: name.split("-")[0] ?? null, key: name };
}
function setColor(extend, key, value) {
  const colors = extend.colors ??= {};
  const m = /^(.*)-(\d{2,4}|DEFAULT)$/.exec(key);
  if (m) {
    const existing = colors[m[1]];
    const palette = existing && typeof existing === "object" ? existing : {};
    if (typeof existing === "string") palette.DEFAULT = existing;
    palette[m[2]] = value;
    colors[m[1]] = palette;
  } else {
    const existing = colors[key];
    if (existing && typeof existing === "object")
      existing.DEFAULT = value;
    else colors[key] = value;
  }
}
function resolveVarRefs(value, vars, depth = 0) {
  if (depth > 8) return value;
  return value.replace(
    /var\(--([\w-]+)\)/g,
    (m, name) => vars.has(name) ? resolveVarRefs(vars.get(name), vars, depth + 1) : m
  );
}
function camel(s) {
  return s.replace(/-(\w)/g, (_, c) => c.toUpperCase());
}
function splitTopLevel(list) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const ch of list) {
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function blockVariantFormats(node) {
  const formats = [];
  const walk = (nodes, prefix) => {
    for (const n of nodes) {
      if (n.type === "atrule" && n.name === "slot")
        formats.push(...prefix.length ? prefix : ["&"]);
      else if (n.type === "atrule" && n.nodes)
        walk(n.nodes, [...prefix, `@${n.name} ${n.params}`.trim()]);
      else if (n.type === "rule") walk(n.nodes, [...prefix, n.selector]);
    }
  };
  walk(node.nodes ?? [], []);
  return formats;
}
function nodesToCssInJs(nodes) {
  const out = {};
  for (const n of nodes) {
    if (n.type === "decl") out[n.prop] = n.important ? `${n.value} !important` : n.value;
    else if (n.type === "rule") out[n.selector] = nodesToCssInJs(n.nodes);
    else if (n.type === "atrule" && n.nodes)
      out[`@${n.name} ${n.params}`.trim()] = nodesToCssInJs(n.nodes);
  }
  return out;
}
var VALUE_FN = /--value\(([^)]*)\)/g;
function functionalValues(decls, api, themeVars) {
  const kinds = { namespaces: [], bare: [], arbitrary: false };
  for (const d of decls)
    for (const m of d.value.matchAll(VALUE_FN))
      for (const arg of splitTopLevel(m[1])) {
        if (arg.startsWith("--") && arg.endsWith("-*")) kinds.namespaces.push(arg.slice(2, -2));
        else if (arg.startsWith("[")) kinds.arbitrary = true;
        else if (/^[a-z]+$/.test(arg)) kinds.bare.push(arg);
      }
  const values = {};
  for (const ns of kinds.namespaces) {
    for (const [name, value] of themeVars)
      if (name.startsWith(`${ns}-`)) values[name.slice(ns.length + 1)] = value;
    const themeKey = THEME_NAMESPACES[ns];
    const scale = themeKey ? api.theme(themeKey) : void 0;
    if (scale) {
      for (const [k, v] of Object.entries(scale)) if (typeof v === "string") values[k] ??= v;
    }
  }
  return { values, kinds };
}
function substituteValue(template, value) {
  return template.replace(VALUE_FN, () => value);
}
function bareKind(kinds) {
  if (kinds.bare.includes("percentage")) return "percentage";
  if (kinds.bare.includes("number") || kinds.bare.includes("ratio")) return "number";
  if (kinds.bare.includes("integer")) return "integer";
  return void 0;
}
function matchType(kinds) {
  const map = {
    integer: "number",
    number: "number",
    percentage: "percentage",
    ratio: "any"
  };
  if (!kinds.arbitrary)
    return kinds.bare.length ? [...new Set(kinds.bare.map((k) => map[k] ?? "any"))] : void 0;
  return void 0;
}

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
async function resolveSources(content, cwd = process.cwd()) {
  if (!content) return { files: [], raw: [] };
  const entries = Array.isArray(content) ? content : [content];
  const globs = [];
  const files = [];
  const raw = [];
  for (const entry of entries) {
    if (!entry) continue;
    if (entry.includes("*") || entry.includes("{") || entry.includes("[")) globs.push(entry);
    else if (existsSync(resolve(cwd, entry)) && statSync(resolve(cwd, entry)).isFile())
      files.push(resolve(cwd, entry));
    else raw.push(entry);
  }
  if (globs.length > 0) files.push(...(await globby(globs, { cwd, absolute: true })).sort());
  return { files, raw };
}

// src/build.ts
var contentCache = new ContentCache();
var scanFs = {
  stat: (p) => {
    try {
      const st = statSync2(p);
      return { mtimeMs: st.mtimeMs, size: st.size };
    } catch {
      return null;
    }
  },
  read: (p) => readFileSync2(p, "utf-8")
};
var SOURCE_RE = /@nakshora\s+source\s*;?/g;
var UTILITIES_RE = /@nakshora\s+utilities\s*;?/g;
var AUTHOR_RE = /@apply\b|@screen\b|\b(?:theme|screen)\(/;
async function runBuild(input) {
  const started = performance.now();
  const cwd = input.cwd ?? process.cwd();
  const absInput = input.input && input.input !== "-" ? isAbsolute(input.input) ? input.input : resolve2(cwd, input.input) : void 0;
  let source = input.inputCss ?? (absInput && existsSync2(absInput) ? readFileSync2(absInput, "utf-8") : void 0);
  let config = input.config;
  let rootVars = "";
  if (source !== void 0 && hasCssConfig(source)) {
    const extracted = extractCssConfig(source);
    source = extracted.css;
    rootVars = extracted.rootVars;
    config = mergeCssConfig(config, extracted.config);
  }
  const generator = new CSSGenerator(config);
  const { files, raw } = await resolveSources(config.content ?? config.purge, cwd);
  const hasContent = files.length + raw.length > 0;
  const mode = input.mode ?? (hasContent ? "jit" : "full");
  const options = { minify: input.minify, mode };
  const candidates = hasContent ? scanSources(contentCache, scanFs, files, raw) : /* @__PURE__ */ new Set();
  let css;
  let classes;
  if (mode === "jit") {
    css = generator.generateJITFromCandidates(candidates, options);
    classes = countClasses(css);
  } else {
    css = generator.generate({ ...options, mode: "full" });
    classes = countClasses(css);
  }
  if (source !== void 0) {
    {
      const authorPass = AUTHOR_RE.test(source);
      if (authorPass) {
        try {
          source = generator.processCss(source);
        } catch (err) {
          if (err instanceof ApplyError)
            throw new Error(
              `${input.input && input.input !== "-" ? input.input : "<stdin>"}: ${err.message}`
            );
          throw err;
        }
      }
      if (authorPass || SOURCE_RE.test(source) || UTILITIES_RE.test(source)) {
        const hasJitContent = hasContent;
        const sourceCss = hasJitContent ? css : generator.generate({ minify: false, mode: "full" });
        const utilCss = hasJitContent ? generator.generateJITFromCandidates(
          candidates,
          { minify: false },
          { utilitiesOnly: true }
        ) : generator.getUtilitiesFull(false);
        const out = source.replace(SOURCE_RE, () => sourceCss).replace(UTILITIES_RE, () => utilCss);
        css = input.minify ? minifyCss(out) : out;
      } else if (rootVars) {
        css = input.minify ? minifyCss(source) : source;
      }
      if (rootVars) css = (input.minify ? minifyCss(rootVars) : rootVars) + css;
    }
  }
  let mapFile;
  if (input.output) {
    const outPath = isAbsolute(input.output) ? input.output : resolve2(cwd, input.output);
    if (input.sourceMap) {
      mapFile = `${outPath}.map`;
      const map = generatedSourceMap(
        css,
        basename(outPath),
        input.input && input.input !== "-" ? input.input : void 0
      );
      css += `
/*# sourceMappingURL=${basename(mapFile)} */
`;
      if (!input.dryRun) {
        mkdirSync(dirname(outPath), { recursive: true });
        writeFileSync(mapFile, JSON.stringify(map), "utf-8");
      }
    }
    if (!input.dryRun) {
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, css, "utf-8");
    }
  } else if (!input.dryRun) {
    process.stdout.write(css);
  }
  const unknown = mode === "jit" ? [...candidates].filter(
    (c) => generator.engine.compile(c).length === 0 && !isComponentClass(generator, c)
  ) : [];
  return {
    css,
    classes,
    sizeBytes: Buffer.byteLength(css, "utf-8"),
    minifiedSizeBytes: Buffer.byteLength(minifyCss(css), "utf-8"),
    candidates: candidates.size,
    unknown,
    durationMs: performance.now() - started,
    mapFile
  };
}
function isComponentClass(generator, cls) {
  return generator.getComponents().includes(`.${cls.replace(/[^\w-]/g, "")}`);
}
function generatedSourceMap(css, file, inputFile) {
  const lines = css.split("\n").length;
  const mappings = Array.from({ length: lines }, () => "AAAA").join(";");
  return {
    version: 3,
    file,
    sources: [inputFile ?? "nakshora:generated"],
    names: [],
    mappings
  };
}
function countClasses(css) {
  return (css.match(/\.([a-zA-Z0-9\\\-_]+)/g) ?? []).length;
}
function summarize(result, output) {
  const size = output === "memory" ? `${formatBytes(result.sizeBytes)} in memory` : output ? formatBytes(result.sizeBytes) : "stdout";
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

// src/doctor.ts
import { existsSync as existsSync4, readFileSync as readFileSync4, statSync as statSync3 } from "fs";
import { dirname as dirname3, isAbsolute as isAbsolute3, join as join3, resolve as resolve4 } from "path";
import { globby as globby2 } from "globby";

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

// src/doctor.ts
var CSS_AT_RULES = /@nakshora\s+(source|utilities|utils|base|variables|vars|keyframes|components)\s*;?/;
async function diagnose(cwd = process.cwd(), explicitConfig) {
  const findings = [];
  const push = (level, check, message, hint) => {
    findings.push({ level, check, message, hint });
  };
  const major = Number(process.versions.node.split(".")[0]);
  if (major >= 18) push("ok", "node", `Node ${process.version}`);
  else push("error", "node", `Node ${process.version} is too old`, "Nakshora needs Node >= 18");
  push("ok", "version", `@nakshora/core ${version}`);
  const file = explicitConfig ? isAbsolute3(explicitConfig) ? explicitConfig : resolve4(cwd, explicitConfig) : findConfigFile(cwd);
  let config = null;
  if (!file) {
    push(
      "warn",
      "config",
      "no nakshora.config.{js,mjs,cjs,ts,json} found (walking up from the current directory)",
      "run `nakshora init`, or pass --content to build in JIT mode without a config"
    );
  } else if (!existsSync4(file)) {
    push("error", "config", `config file not found: ${file}`);
  } else {
    try {
      config = await loadConfigFile(file);
      push("ok", "config", `loaded ${file}`);
    } catch (err) {
      push("error", "config", `failed to load ${file}: ${err.message}`);
    }
  }
  if (config) {
    const content = config.content ?? config.purge;
    if (!content || Array.isArray(content) && content.length === 0) {
      push(
        "warn",
        "content",
        "no `content` configured \u2014 builds run in FULL mode (every utility, ~6 MB)",
        "add content: ['./src/**/*.{html,js,ts,jsx,tsx,vue,svelte}'] for JIT output"
      );
    } else {
      const entries = Array.isArray(content) ? content : [content];
      const base = file ? dirname3(file) : cwd;
      let total = 0;
      for (const entry of entries) {
        if (/[*{[]/.test(entry)) {
          const files = await globby2(entry, { cwd: base, absolute: true });
          total += files.length;
          if (files.length === 0)
            push(
              "warn",
              "content",
              `glob matches no files: ${entry}`,
              `resolved relative to ${base}`
            );
          else if (!/node_modules/.test(entry) && files.some((f) => f.includes("/node_modules/")))
            push(
              "warn",
              "content",
              `glob reaches into node_modules: ${entry}`,
              "this scans thousands of files on every build; narrow it"
            );
          else push("ok", "content", `${entry} \u2192 ${files.length} file(s)`);
        } else if (existsSync4(resolve4(base, entry)) && statSync3(resolve4(base, entry)).isFile()) {
          total++;
          push("ok", "content", `${entry} (file)`);
        } else {
          push(
            "warn",
            "content",
            `"${entry.slice(0, 40)}${entry.length > 40 ? "\u2026" : ""}" is neither a glob nor an existing file \u2014 treated as raw template text`
          );
        }
      }
      if (total > 5e3)
        push(
          "warn",
          "content",
          `${total} files matched \u2014 large content sets slow down every rebuild`,
          "exclude build output / vendored directories"
        );
      if (config.purge && !config.content)
        push(
          "warn",
          "config",
          "`purge` is the legacy name",
          "rename it to `content` (identical semantics)"
        );
    }
    try {
      const gen = new CSSGenerator(config);
      const screens = Object.keys(gen.theme.screens);
      push(
        "ok",
        "theme",
        `${gen.getUtilities().length} utilities, ${screens.length} screens (${screens.join(" ")})`
      );
      const safelist = config.safelist ?? [];
      const badSafe = safelist.filter(
        (s) => typeof s === "string" && gen.engine.compile(s).length === 0
      );
      if (badSafe.length)
        push("warn", "safelist", `safelist entries that produce no CSS: ${badSafe.join(" ")}`);
      if (config.important === true)
        push(
          "warn",
          "config",
          "`important: true` marks every declaration !important",
          "prefer important: '#app' (selector strategy) when you only need to win over third-party CSS"
        );
      const unknownVariantKeys = Object.keys(config.variants ?? {}).filter(
        (k) => ![
          "hover",
          "focus",
          "focusVisible",
          "focusWithin",
          "active",
          "visited",
          "disabled",
          "firstChild",
          "lastChild",
          "group",
          "groupHover",
          "groupFocus",
          "peer",
          "peerHover",
          "peerFocus",
          "dark",
          "responsive",
          "maxResponsive",
          "containerQueries"
        ].includes(k)
      );
      if (unknownVariantKeys.length)
        push(
          "warn",
          "variants",
          `unknown variants keys are ignored: ${unknownVariantKeys.join(", ")}`
        );
    } catch (err) {
      push("error", "config", `config rejected by the compiler: ${err.message}`);
    }
  }
  const cssFiles = await globby2(
    ["**/*.css", "!node_modules/**", "!dist/**", "!build/**", "!**/*.min.css"],
    {
      cwd,
      absolute: true
    }
  );
  const withAtRule = cssFiles.filter((f) => CSS_AT_RULES.test(readFileSync4(f, "utf-8")));
  if (cssFiles.length && withAtRule.length === 0 && config)
    push(
      "warn",
      "css",
      `none of ${cssFiles.length} stylesheet(s) contain \`@nakshora source;\``,
      'add `@nakshora source;` to your entry CSS (or import "virtual:nakshora" with the Vite plugin)'
    );
  else if (withAtRule.length)
    push(
      "ok",
      "css",
      `@nakshora at-rules in ${withAtRule.map((f) => f.replace(cwd + "/", "")).join(", ")}`
    );
  if (config) {
    let effective = config;
    const cssConfigFiles = [];
    for (const f of cssFiles.slice(0, 200)) {
      const css = readFileSync4(f, "utf-8");
      if (!hasCssConfig(css)) continue;
      const extracted = extractCssConfig(css);
      effective = mergeCssConfig(effective, extracted.config);
      cssConfigFiles.push(f.replace(cwd + "/", ""));
      for (const note of extracted.notes)
        push("warn", "css-config", `${f.replace(cwd + "/", "")}: ${note}`);
      for (const m of css.matchAll(/--(modifier|alpha|spacing)\(/g))
        push(
          "warn",
          "css-config",
          `${f.replace(cwd + "/", "")}: \`--${m[1]}()\` is not implemented \u2014 the literal text stays in the output`,
          "use theme values or a plugin `matchUtilities` callback instead"
        );
    }
    if (cssConfigFiles.length)
      push(
        "ok",
        "css-config",
        `@theme / @utility / @custom-variant in ${cssConfigFiles.join(", ")}`
      );
    const gen = new CSSGenerator(effective);
    for (const f of cssFiles.slice(0, 200)) {
      let css = readFileSync4(f, "utf-8");
      if (hasCssConfig(css)) css = extractCssConfig(css).css;
      if (!/@apply\b|theme\(|@screen\b/.test(css)) continue;
      try {
        gen.processCss(css);
        push("ok", "apply", `${f.replace(cwd + "/", "")}: @apply / theme() resolve`);
      } catch (err) {
        if (err instanceof ApplyError)
          push("error", "apply", `${f.replace(cwd + "/", "")}: ${err.message}`);
      }
    }
  }
  const pkgPath = join3(cwd, "package.json");
  if (existsSync4(pkgPath)) {
    const pkg = JSON.parse(readFileSync4(pkgPath, "utf-8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const has = (n) => n in deps;
    if (has("@nakshora/vite-plugin") && !has("vite"))
      push("warn", "deps", "@nakshora/vite-plugin is installed but vite is not");
    if (has("@nakshora/postcss") && !has("postcss"))
      push(
        "warn",
        "deps",
        "@nakshora/postcss needs the postcss peer dependency",
        "npm i -D postcss"
      );
    if (has("tailwindcss") && (has("@nakshora/cli") || has("@nakshora/postcss") || has("@nakshora/vite-plugin")))
      push(
        "warn",
        "deps",
        "both tailwindcss and Nakshora are installed",
        "run `nakshora migrate` to port tailwind.config.* and remove tailwindcss to avoid double-processing"
      );
    if (!Object.keys(deps).some((d) => d.startsWith("@nakshora/")))
      push(
        "warn",
        "deps",
        "no @nakshora/* package in package.json",
        "npm i -D @nakshora/cli (or @nakshora/vite-plugin / @nakshora/postcss)"
      );
  }
  return { findings, config, configFile: file ?? null };
}
function formatFindings(findings) {
  const icon = { ok: "\u2714", warn: "\u25B2", error: "\u2716" };
  return findings.map(
    (f) => `${icon[f.level]} ${f.check.padEnd(9)} ${f.message}${f.hint ? `
            \u21B3 ${f.hint}` : ""}`
  ).join("\n");
}

// src/migrate.ts
import { readFileSync as readFileSync5, writeFileSync as writeFileSync2, existsSync as existsSync5 } from "fs";
import { join as join4 } from "path";
import { globby as globby3 } from "globby";
var V1_RENAMES = {
  "card-neon": "neon-card",
  "btn-neon": "neon-btn",
  "animate-neonGlow": "animate-neon-glow",
  uhd: "4xl",
  k8: "5xl"
};
var TAILWIND_RENAMES = {
  "flex-grow": "grow",
  "flex-grow-0": "grow-0",
  "flex-shrink": "shrink",
  "flex-shrink-0": "shrink-0",
  "overflow-ellipsis": "text-ellipsis",
  "decoration-slice": "box-decoration-slice",
  "decoration-clone": "box-decoration-clone"
};
function migrateSource(text, from) {
  const table = from === "v1" ? V1_RENAMES : TAILWIND_RENAMES;
  const counts = /* @__PURE__ */ new Map();
  const out = text.replace(
    /(class(?:Name)?\s*=\s*)(["'`])([\s\S]*?)\2/g,
    (_m, attr, q, body) => {
      const rewritten = body.split(/(\s+)/).map((tok) => {
        if (!tok.trim()) return tok;
        const parts = tok.split(":");
        const mapped = parts.map((p, i) => {
          const bare = p.replace(/^!/, "").replace(/!$/, "");
          const isVariant = i < parts.length - 1;
          const to = table[bare];
          if (!to) return p;
          if (isVariant && from !== "v1") return p;
          counts.set(bare, (counts.get(bare) ?? 0) + 1);
          return p.replace(bare, to);
        });
        return mapped.join(":");
      }).join("");
      return `${attr}${q}${rewritten}${q}`;
    }
  );
  return {
    text: out,
    changes: [...counts].map(([f, count]) => ({ from: f, to: table[f], count }))
  };
}
function migrateTailwindConfig(source) {
  const notes = [];
  let text = source;
  text = text.replace(
    /\/\*\*\s*@type\s*\{import\(['"]tailwindcss['"]\)\.Config\}\s*\*\//,
    "/** @type {import('@nakshora/core').NakshoraConfig} */"
  );
  text = text.replace(
    /import\s+type\s+\{\s*Config\s*\}\s+from\s+['"]tailwindcss['"];?/g,
    "import type { NakshoraConfig } from '@nakshora/core';"
  );
  text = text.replace(/satisfies\s+Config\b/g, "satisfies NakshoraConfig").replace(/:\s*Config\b/g, ": NakshoraConfig");
  if (/tailwindcss\/defaultTheme/.test(text)) {
    text = text.replace(
      /const\s+defaultTheme\s*=\s*require\(['"]tailwindcss\/defaultTheme['"]\);?/g,
      "const { defaultTheme } = require('@nakshora/core');"
    ).replace(
      /import\s+defaultTheme\s+from\s+['"]tailwindcss\/defaultTheme['"];?/g,
      "import { defaultTheme } from '@nakshora/core';"
    );
    notes.push(
      "`tailwindcss/defaultTheme` \u2192 `defaultTheme` from @nakshora/core (same keys, Tailwind values)"
    );
  }
  if (/tailwindcss\/colors/.test(text)) {
    text = text.replace(
      /const\s+colors\s*=\s*require\(['"]tailwindcss\/colors['"]\);?/g,
      "const { defaultColors: colors } = require('@nakshora/core');"
    ).replace(
      /import\s+colors\s+from\s+['"]tailwindcss\/colors['"];?/g,
      "import { defaultColors as colors } from '@nakshora/core';"
    );
    notes.push("`tailwindcss/colors` \u2192 `defaultColors` from @nakshora/core");
  }
  if (/tailwindcss\/plugin/.test(text)) {
    text = text.replace(
      /const\s+plugin\s*=\s*require\(['"]tailwindcss\/plugin['"]\);?/g,
      "const { plugin } = require('@nakshora/core');"
    ).replace(
      /import\s+plugin\s+from\s+['"]tailwindcss\/plugin['"];?/g,
      "import { plugin } from '@nakshora/core';"
    );
    notes.push("`tailwindcss/plugin` \u2192 `plugin` from @nakshora/core (same API incl. withOptions)");
  }
  for (const p of ["typography", "forms", "aspect-ratio", "container-queries"])
    if (text.includes(`@tailwindcss/${p}`))
      notes.push(
        `@tailwindcss/${p} works unchanged through the plugin adapter (keep the dependency)`
      );
  if (/\bpresets\s*:/.test(text))
    notes.push("`presets` accepted: Tailwind preset objects and Nakshora theme presets both work");
  if (/screens\s*:\s*\{/.test(text))
    notes.push(
      "`theme.screens` REPLACES the 10-step scale (Tailwind semantics); use `theme.breakpoints` to extend it instead"
    );
  if (/darkMode\s*:\s*['"]media['"]/.test(text))
    notes.push("darkMode: 'media' kept \u2014 Nakshora's default is 'class' (`:is(.dark *)`)");
  if (!/darkMode\s*:/.test(text))
    notes.push(
      "no darkMode key: Tailwind defaults to 'media', Nakshora to 'class' \u2014 add darkMode: 'media' to keep behaviour"
    );
  if (/future\s*:|experimental\s*:/.test(text))
    notes.push("`future` / `experimental` keys are ignored");
  if (/separator\s*:/.test(text))
    notes.push("`separator` is not configurable (always `:`) \u2014 the key is ignored");
  return { text, notes };
}
async function runMigrate(o) {
  const out = [];
  const files = await globby3(o.globs, {
    cwd: o.cwd,
    absolute: true,
    ignore: ["**/node_modules/**", "**/dist/**"]
  });
  for (const f of files) {
    const src = readFileSync5(f, "utf-8");
    const res = migrateSource(src, o.from);
    if (res.changes.length === 0) continue;
    out.push({ file: f, changes: res.changes });
    if (o.write) writeFileSync2(f, res.text);
  }
  let config;
  if (o.from === "tailwind") {
    const candidates = [
      "tailwind.config.js",
      "tailwind.config.cjs",
      "tailwind.config.mjs",
      "tailwind.config.ts"
    ];
    const found = candidates.find((c) => existsSync5(join4(o.cwd, c)));
    if (found) {
      const ext = found.endsWith(".ts") ? ".ts" : found.endsWith(".cjs") ? ".cjs" : found.endsWith(".mjs") ? ".mjs" : ".js";
      const to = join4(o.cwd, `nakshora.config${ext}`);
      const res = migrateTailwindConfig(readFileSync5(join4(o.cwd, found), "utf-8"));
      if (o.write && !existsSync5(to)) writeFileSync2(to, res.text);
      config = { from: found, to: `nakshora.config${ext}`, notes: res.notes };
    }
  }
  return { files: out, config };
}

// src/watch.ts
import { readdirSync, statSync as statSync4, watch } from "fs";
import { dirname as dirname4, join as join5, resolve as resolve5 } from "path";
function createWatcher(paths, onChange) {
  const dirs = /* @__PURE__ */ new Set();
  for (const p of paths) {
    try {
      const abs = resolve5(p);
      if (statSync4(abs).isDirectory()) dirs.add(abs);
      else dirs.add(dirname4(abs));
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
          const full = join5(dir, name);
          let st;
          try {
            st = statSync4(full);
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

// src/language-service.ts
var DEFAULT_ATTRIBUTES = ["class", "className", "class:list"];
var DEFAULT_FUNCTIONS = ["clsx", "cn", "cva", "classNames", "twMerge", "tw", "cx"];
var TOKEN_CHARS = /[^\s"'`<>{}]/;
var MARKER_CLASSES = /^(?:group|peer)(?:\/[\w-]+)?$/;
var escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var LanguageService = class {
  generator;
  catalog = [];
  catalogIndex = /* @__PURE__ */ new Map();
  components = [];
  variants = [];
  attributes;
  functions;
  limit;
  attributeRe;
  callRe;
  constructor(options = {}) {
    this.attributes = [...DEFAULT_ATTRIBUTES, ...options.classAttributes ?? []];
    this.functions = [...DEFAULT_FUNCTIONS, ...options.classFunctions ?? []];
    this.limit = options.completionLimit ?? 300;
    this.attributeRe = new RegExp(
      `(?:^|[\\s(,{])(?:${this.attributes.map(escapeRe).join("|")})\\s*=\\s*(["'\`])`,
      "g"
    );
    this.callRe = new RegExp(`\\b(?:${this.functions.map(escapeRe).join("|")})\\s*(\\(|\`)`, "g");
    this.generator = new CSSGenerator(options.config ?? {});
    this.index();
  }
  /** Swap the configuration (config file changed). */
  reload(config = {}) {
    this.generator = new CSSGenerator(config);
    this.index();
  }
  index() {
    this.catalog = this.generator.getUtilities();
    this.catalogIndex = new Map(this.catalog.map((u) => [u.class, u]));
    const componentCss2 = this.generator.getComponents();
    this.components = [
      ...new Set([...componentCss2.matchAll(/\.((?:\\.|[\w-])+)/g)].map((m) => m[1]))
    ].filter((c) => !this.catalogIndex.has(c)).sort();
    this.variants = this.generator.getVariantDefinitions().map((v) => ({
      name: v.name,
      functional: v.functional === true,
      description: v.description
    }));
  }
  // ───────────────────────────── regions / tokens ─────────────────────────────
  /** Class-list regions of a document. `languageId` selects the scanners. */
  regions(text, languageId = "html") {
    const out = [];
    const isCss = /^(?:css|scss|less|postcss)$/.test(languageId);
    if (!isCss) {
      this.attributeRe.lastIndex = 0;
      for (const m of text.matchAll(this.attributeRe)) {
        const quote = m[1];
        const start = m.index + m[0].length;
        let end = text.indexOf(quote, start);
        if (end === -1) {
          const nl = text.indexOf("\n", start);
          end = nl === -1 ? text.length : nl;
        }
        out.push({ start, end, kind: "attribute" });
      }
      for (const m of text.matchAll(this.callRe)) {
        const open = m.index + m[0].length - 1;
        if (m[1] === "`") {
          const end = text.indexOf("`", open + 1);
          if (end !== -1) out.push({ start: open + 1, end, kind: "call" });
          continue;
        }
        const close = matchParen(text, open);
        if (close === -1) continue;
        const body = text.slice(open + 1, close);
        for (const s of body.matchAll(/(["'`])((?:\\.|(?!\1)[^\\])*)\1/g))
          out.push({
            start: open + 1 + s.index + 1,
            end: open + 1 + s.index + 1 + s[2].length,
            kind: "call"
          });
      }
    }
    for (const m of text.matchAll(/@apply\s+([^;{}]*)/g)) {
      const start = m.index + m[0].length - m[1].length;
      out.push({ start, end: start + m[1].trimEnd().length, kind: "apply" });
    }
    return out.sort((a, b) => a.start - b.start);
  }
  /** Every class token of every region. */
  tokens(text, languageId = "html") {
    const out = [];
    for (const region of this.regions(text, languageId)) {
      const slice = text.slice(region.start, region.end);
      for (const m of slice.matchAll(/\S+/g)) {
        const raw = m[0];
        if (raw.includes("${")) continue;
        out.push({
          text: raw,
          start: region.start + m.index,
          end: region.start + m.index + raw.length,
          region
        });
      }
    }
    return out;
  }
  /** The token under `offset` (or the empty token at the caret inside a region). */
  tokenAt(text, offset, languageId = "html") {
    const region = this.regions(text, languageId).find((r) => offset >= r.start && offset <= r.end);
    if (!region) return null;
    let start = offset;
    while (start > region.start && TOKEN_CHARS.test(text[start - 1])) start--;
    let end = offset;
    while (end < region.end && TOKEN_CHARS.test(text[end])) end++;
    return { text: text.slice(start, end), start, end, region };
  }
  // ───────────────────────────── features ─────────────────────────────
  complete(text, offset, languageId = "html") {
    const token = this.tokenAt(text, offset, languageId);
    if (!token) return { items: [], incomplete: false };
    const typed = text.slice(token.start, offset);
    const lastColon = typed.lastIndexOf(":");
    const segStart = token.start + lastColon + 1;
    const segment = typed.slice(lastColon + 1);
    const important = segment.startsWith("!");
    const needle = important ? segment.slice(1) : segment;
    const items = [];
    const range = { start: segStart + (important ? 1 : 0), end: token.end };
    if (token.region.kind !== "apply") {
      for (const v of this.variants) {
        if (!v.name.startsWith(needle) || v.name.startsWith("@") && !needle.startsWith("@"))
          continue;
        items.push({
          label: v.functional ? `${v.name}-` : `${v.name}:`,
          kind: "variant",
          detail: v.description,
          ...range
        });
      }
    }
    const whole = text.slice(range.start, token.end);
    const matches = this.catalog.filter((u) => u.class.startsWith(needle));
    if (whole.length > needle.length)
      matches.sort((a, b) => Number(b.class.startsWith(whole)) - Number(a.class.startsWith(whole)));
    const incomplete = matches.length > this.limit;
    for (const u of matches.slice(0, this.limit))
      items.push({ label: u.class, kind: "class", detail: u.description, ...range });
    if (token.region.kind !== "apply") {
      for (const c of this.components)
        if (c.startsWith(needle)) items.push({ label: c, kind: "component", ...range });
    }
    return { items, incomplete };
  }
  /** CSS of the candidate under `offset` (null when unknown). */
  hover(text, offset, languageId = "html") {
    const token = this.tokenAt(text, offset, languageId);
    if (!token || !token.text) return null;
    const css = this.compile(token.text);
    if (!css) return null;
    return { css, start: token.start, end: token.end };
  }
  compile(candidate) {
    const css = this.generator.compileClass(candidate);
    if (css.trim()) return css.trimEnd();
    if (this.isComponent(candidate))
      return componentRule(this.generator.getComponents(), candidate);
    return "";
  }
  diagnostics(text, languageId = "html") {
    const out = [];
    const byRegion = /* @__PURE__ */ new Map();
    for (const t of this.tokens(text, languageId)) {
      const list = byRegion.get(t.region) ?? [];
      list.push(t);
      byRegion.set(t.region, list);
    }
    for (const [region, tokens] of byRegion) {
      const conflictKeys = /* @__PURE__ */ new Map();
      for (const t of tokens) {
        const rules = this.generator.engine.compile(t.text);
        const known = rules.length > 0 || MARKER_CLASSES.test(t.text) || this.isComponent(t.text);
        if (!known) {
          if (region.kind === "apply")
            out.push({
              code: "invalidApply",
              severity: "error",
              message: `\`${t.text}\` is not a Nakshora utility or component \u2014 @apply would fail`,
              start: t.start,
              end: t.end
            });
          else if (t.text.includes(":") && !t.text.startsWith("["))
            out.push({
              code: "unknownClass",
              severity: "warning",
              message: `\`${t.text}\` is not a Nakshora class (unknown variant or utility)`,
              start: t.start,
              end: t.end
            });
          continue;
        }
        if (rules.length === 0) continue;
        const rule = rules[0];
        const props = Object.keys(rule.decls).filter((p) => !p.startsWith("--"));
        if (props.length === 0) continue;
        const key = JSON.stringify([
          rule.atrules.map((a) => `${a.kind}:${a.params}`),
          rule.selector.replace(/\.(?:\\.|[\w-])+/, ".X"),
          props.sort()
        ]);
        const list = conflictKeys.get(key) ?? [];
        list.push(t);
        conflictKeys.set(key, list);
      }
      for (const list of conflictKeys.values()) {
        const distinct = [...new Set(list.map((t) => t.text))];
        if (distinct.length < 2) continue;
        for (const t of list)
          out.push({
            code: "cssConflict",
            severity: "warning",
            message: `\`${t.text}\` applies the same CSS properties as ${distinct.filter((d) => d !== t.text).map((d) => `\`${d}\``).join(", ")}`,
            start: t.start,
            end: t.end
          });
      }
    }
    return out.sort((a, b) => a.start - b.start);
  }
  colors(text, languageId = "html") {
    const out = [];
    for (const t of this.tokens(text, languageId)) {
      const rules = this.generator.engine.compile(t.text);
      if (rules.length === 0) continue;
      for (const value of Object.values(rules[0].decls)) {
        const color = extractColor(String(value));
        if (!color) continue;
        out.push({ start: t.start, end: t.end, ...color });
        break;
      }
    }
    return out;
  }
  isComponent(candidate) {
    const base = candidate.slice(candidate.lastIndexOf(":") + 1).replace(/^!/, "");
    return this.components.includes(base);
  }
};
function matchParen(text, open) {
  let depth = 0;
  let quote = null;
  for (let i = open; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "(") depth++;
    else if (ch === ")" && --depth === 0) return i;
  }
  return -1;
}
function componentRule(css, candidate) {
  const base = candidate.slice(candidate.lastIndexOf(":") + 1).replace(/^!/, "");
  const re = new RegExp(`\\.${escapeRe(base)}(?![\\w-])`);
  const out = [];
  for (const { rule, ancestors } of walkRules(parseCss(css).nodes))
    if (re.test(rule.selector) && ancestors.every((a) => a.name !== "keyframes")) out.push(rule);
  return serializeCss(out).trimEnd();
}
function extractColor(value) {
  const cleaned = value.replace(/\/\s*var\([^)]*\)/g, "").trim();
  const m = cleaned.match(/#[0-9a-f]{3,8}\b|(?:rgba?|hsla?)\([^)]*\)|\btransparent\b/i);
  if (!m) return null;
  const parsed = parseColor(m[0]);
  if (!parsed) return null;
  const alpha = parsed.alpha === void 0 ? 1 : parseFloat(parsed.alpha);
  if (Number.isNaN(alpha)) return null;
  const n = parsed.color.map(parseFloat);
  if (n.some(Number.isNaN)) return null;
  if (parsed.mode === "hsl") {
    const [r, g, b] = hslToRgb(n[0], n[1] / 100, n[2] / 100);
    return { red: r, green: g, blue: b, alpha };
  }
  return { red: n[0] / 255, green: n[1] / 255, blue: n[2] / 255, alpha };
}
function hslToRgb(h, s, l) {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)];
}

// src/language-server.ts
import { fileURLToPath } from "url";
import { dirname as dirname5 } from "path";
import {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
  CompletionItemKind,
  DiagnosticSeverity,
  MarkupKind
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
var KIND = {
  class: CompletionItemKind.Constant,
  variant: CompletionItemKind.Module,
  component: CompletionItemKind.Class
};
var SEVERITY = {
  error: DiagnosticSeverity.Error,
  warning: DiagnosticSeverity.Warning,
  information: DiagnosticSeverity.Information
};
function startLanguageServer(options = {}) {
  const connection = options.connection ?? createConnection(ProposedFeatures.all, process.stdin, process.stdout);
  const documents = new TextDocuments(TextDocument);
  let service = new LanguageService();
  let rootDir = process.cwd();
  let configFile = null;
  async function loadConfig() {
    try {
      const resolved = await resolveConfig(options.config, rootDir);
      configFile = resolved.file;
      service.reload(resolved.config);
      connection.console.log(`nakshora: config ${configFile ?? "(defaults)"}`);
    } catch (err) {
      connection.console.error(`nakshora: config error \u2014 ${err.message}`);
      service = new LanguageService();
    }
    for (const doc of documents.all()) validate(doc);
  }
  function validate(doc) {
    const diagnostics = service.diagnostics(doc.getText(), doc.languageId).map((d) => ({
      range: { start: doc.positionAt(d.start), end: doc.positionAt(d.end) },
      severity: SEVERITY[d.severity],
      code: d.code,
      source: "nakshora",
      message: d.message
    }));
    void connection.sendDiagnostics({ uri: doc.uri, diagnostics });
  }
  connection.onInitialize((params) => {
    const root = params.workspaceFolders?.[0]?.uri ?? params.rootUri;
    if (root) rootDir = fileURLToPath(root);
    const init = params.initializationOptions;
    if (init?.config && !options.config) options.config = init.config;
    return {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        completionProvider: { triggerCharacters: [":", "-", '"', "'", " ", "["] },
        hoverProvider: true,
        colorProvider: true
      },
      serverInfo: { name: "nakshora-language-server" }
    };
  });
  connection.onInitialized(() => void loadConfig());
  connection.onDidChangeWatchedFiles((e) => {
    if (e.changes.some((c) => /nakshora\.config\.\w+$/.test(c.uri))) void loadConfig();
  });
  documents.onDidChangeContent((e) => {
    if (configFile && fileURLToPath(e.document.uri) === configFile) return;
    validate(e.document);
  });
  documents.onDidSave((e) => {
    const path = fileURLToPath(e.document.uri);
    if (path === configFile || !configFile && dirname5(path) === rootDir && /nakshora\.config\./.test(path))
      void loadConfig();
  });
  documents.onDidClose(
    (e) => void connection.sendDiagnostics({ uri: e.document.uri, diagnostics: [] })
  );
  connection.onCompletion((params) => {
    const doc = documents.get(params.textDocument.uri);
    if (!doc) return null;
    const { items, incomplete } = service.complete(
      doc.getText(),
      doc.offsetAt(params.position),
      doc.languageId
    );
    return {
      isIncomplete: incomplete,
      items: items.map((item, i) => ({
        label: item.label,
        kind: KIND[item.kind],
        detail: item.detail,
        sortText: String(i).padStart(5, "0"),
        textEdit: {
          range: { start: doc.positionAt(item.start), end: doc.positionAt(item.end) },
          newText: item.label
        },
        command: item.kind === "variant" ? { title: "suggest", command: "editor.action.triggerSuggest" } : void 0
      }))
    };
  });
  connection.onCompletionResolve((item) => {
    if (item.kind === KIND.class || item.kind === KIND.component) {
      const css = service.compile(item.label);
      if (css)
        item.documentation = { kind: MarkupKind.Markdown, value: "```css\n" + css + "\n```" };
    }
    return item;
  });
  connection.onHover((params) => {
    const doc = documents.get(params.textDocument.uri);
    if (!doc) return null;
    const h = service.hover(doc.getText(), doc.offsetAt(params.position), doc.languageId);
    if (!h) return null;
    return {
      contents: { kind: MarkupKind.Markdown, value: "```css\n" + h.css + "\n```" },
      range: { start: doc.positionAt(h.start), end: doc.positionAt(h.end) }
    };
  });
  connection.onDocumentColor((params) => {
    const doc = documents.get(params.textDocument.uri);
    if (!doc) return [];
    return service.colors(doc.getText(), doc.languageId).map((c) => ({
      range: { start: doc.positionAt(c.start), end: doc.positionAt(c.end) },
      color: { red: c.red, green: c.green, blue: c.blue, alpha: c.alpha }
    }));
  });
  connection.onColorPresentation(() => []);
  documents.listen(connection);
  connection.listen();
  return connection;
}

// src/serve.ts
import { createServer } from "http";
import { createReadStream, existsSync as existsSync6, statSync as statSync5 } from "fs";
import { extname, join as join6, normalize, relative, resolve as resolve6, sep } from "path";
var TYPES = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".wasm": "application/wasm"
};
var CLIENT_PATH = "/__nakshora/client.js";
var EVENTS_PATH = "/__nakshora/events";
function clientScript(cssPath) {
  return `// nakshora dev client
(function () {
  var css = ${JSON.stringify(cssPath)};
  var es = new EventSource(${JSON.stringify(EVENTS_PATH)});
  es.addEventListener('css', function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    var swapped = false;
    for (var i = 0; i < links.length; i++) {
      var l = links[i];
      var href = l.getAttribute('href') || '';
      if (href.split('?')[0] === css || href.split('?')[0].endsWith(css)) {
        var next = l.cloneNode();
        next.href = css + '?t=' + Date.now();
        next.onload = function () { l.remove(); };
        l.parentNode.insertBefore(next, l.nextSibling);
        swapped = true;
      }
    }
    if (!swapped) location.reload();
  });
  es.addEventListener('reload', function () { location.reload(); });
  es.onerror = function () { setTimeout(function () { location.reload(); }, 1000); es.close(); };
})();
`;
}
function injectClient(html) {
  const tag = `<script src="${CLIENT_PATH}"></script>`;
  if (html.includes(CLIENT_PATH)) return html;
  const i = html.search(/<\/body\s*>/i);
  if (i !== -1) return `${html.slice(0, i)}${tag}
${html.slice(i)}`;
  const j = html.search(/<\/html\s*>/i);
  if (j !== -1) return `${html.slice(0, j)}${tag}
${html.slice(j)}`;
  return `${html}
${tag}
`;
}
function startDevServer(options = {}) {
  const root = resolve6(options.root ?? process.cwd());
  const host = options.host ?? "0.0.0.0";
  const cssPath = normalizeCssPath(options.cssPath ?? "/nakshora.css");
  let css = options.css ?? "";
  const clients = /* @__PURE__ */ new Set();
  const broadcast = (event, data = "{}") => {
    for (const res of clients) res.write(`event: ${event}
data: ${data}

`);
  };
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    if (pathname === EVENTS_PATH) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*"
      });
      res.write("retry: 1000\n\n");
      clients.add(res);
      req.on("close", () => clients.delete(res));
      return;
    }
    if (pathname === CLIENT_PATH) {
      res.writeHead(200, { "Content-Type": TYPES[".js"], "Cache-Control": "no-cache" });
      res.end(clientScript(cssPath));
      return;
    }
    if (pathname === cssPath) {
      res.writeHead(200, {
        "Content-Type": TYPES[".css"],
        "Cache-Control": "no-cache",
        "Content-Length": Buffer.byteLength(css)
      });
      res.end(css);
      return;
    }
    let file = normalize(join6(root, pathname));
    const rel = relative(root, file);
    if (rel.startsWith("..") || rel.startsWith(sep + "..")) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    try {
      if (statSync5(file).isDirectory()) file = join6(file, "index.html");
    } catch {
    }
    if (!existsSync6(file) || !statSync5(file).isFile()) {
      res.writeHead(404, { "Content-Type": TYPES[".txt"] }).end(`Not found: ${pathname}`);
      return;
    }
    const type = TYPES[extname(file).toLowerCase()] ?? "application/octet-stream";
    if (type.startsWith("text/html")) {
      let html = "";
      createReadStream(file, "utf-8").on("data", (chunk) => html += chunk).on("end", () => {
        const body = injectClient(html);
        res.writeHead(200, {
          "Content-Type": type,
          "Cache-Control": "no-cache",
          "Content-Length": Buffer.byteLength(body)
        });
        res.end(body);
      }).on("error", () => res.writeHead(500).end());
      return;
    }
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache" });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolvePromise, reject) => {
    server.once("error", reject);
    server.listen(options.port ?? 0, host, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : options.port ?? 0;
      const shownHost = host === "0.0.0.0" || host === "::" ? "localhost" : host;
      resolvePromise({
        server,
        port,
        host,
        url: `http://${shownHost}:${port}/`,
        updateCss(next) {
          if (next === css) return;
          css = next;
          broadcast("css", JSON.stringify({ bytes: Buffer.byteLength(css) }));
        },
        reload() {
          broadcast("reload");
        },
        clients: () => clients.size,
        close: () => new Promise((done) => {
          for (const c of clients) c.end();
          clients.clear();
          server.close(() => done());
        })
      });
    });
  });
}
function normalizeCssPath(p) {
  const clean = p.replace(/\\/g, "/").replace(/^\.\//, "");
  return clean.startsWith("/") ? clean : `/${clean}`;
}
export {
  CLIENT_PATH,
  EVENTS_PATH,
  LanguageService,
  TAILWIND_RENAMES,
  V1_RENAMES,
  clientScript,
  collectWatchPaths,
  createWatcher,
  diagnose,
  extractColor,
  findConfigFile,
  formatFindings,
  generatedSourceMap,
  injectClient,
  loadConfigFile,
  migrateSource,
  migrateTailwindConfig,
  resolveConfig,
  resolveContent,
  resolveSources,
  runBuild,
  runMigrate,
  startDevServer,
  startLanguageServer,
  summarize,
  version
};
//# sourceMappingURL=index.js.map