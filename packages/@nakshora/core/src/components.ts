// Nakshora Core — built-in design-paradigm components
// Glassmorphism, neon, brutalist, minimalist, skeletons & helpers.
// These are emitted as-is (no variant expansion) under the `components` group.

export const componentCss: Record<string, string> = {
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
`,
};

export const componentNames = Object.keys(componentCss);

export default componentCss;
