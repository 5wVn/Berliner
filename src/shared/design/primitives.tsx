"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import type { Palette } from "./tokens";

// ─────────────────────────────────────────────────────────────────
// Tabular-numeral mono span. Used everywhere a number is displayed.
// ─────────────────────────────────────────────────────────────────
export function Mono({
  children,
  style,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { style?: CSSProperties }) {
  return (
    <span
      style={{
        fontFamily:
          '"Geist Mono", ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace',
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────
// Scrollable container with a fade-out top mask that activates only
// once the user has scrolled past 2px. Matches the prototype's
// <ScrollFade> behaviour.
// ─────────────────────────────────────────────────────────────────
type ScrollFadeProps = HTMLAttributes<HTMLDivElement> & {
  fadeSize?: number;
  children: ReactNode;
};

export const ScrollFade = forwardRef<HTMLDivElement, ScrollFadeProps>(
  function ScrollFade({ children, fadeSize = 28, style, ...rest }, ref) {
    const innerRef = useRef<HTMLDivElement | null>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      const onScroll = () => setScrolled(el.scrollTop > 2);
      el.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => el.removeEventListener("scroll", onScroll);
    }, []);

    const mask = scrolled
      ? `linear-gradient(to bottom, transparent 0, #000 ${fadeSize}px)`
      : "none";

    return (
      <div
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        style={{
          flex: 1,
          overflowY: "auto",
          maskImage: mask,
          WebkitMaskImage: mask,
          transition:
            "mask-image 180ms ease-out, -webkit-mask-image 180ms ease-out",
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

// ─────────────────────────────────────────────────────────────────
// 50×24 sparkline used in subject cards and on the dashboard.
// ─────────────────────────────────────────────────────────────────
export function Sparkline({
  data,
  color,
  p,
  width = 56,
  height = 22,
}: {
  data: number[];
  color: string;
  p: Palette;
  width?: number;
  height?: number;
}) {
  if (!data || data.length === 0) return null;
  const yMin = 0;
  const yMax = 20;
  const xStep = data.length > 1 ? width / (data.length - 1) : 0;
  const yFor = (v: number) => height - ((v - yMin) / (yMax - yMin)) * height;
  const points = data.map((v, i) => `${i * xStep},${yFor(v)}`).join(" ");
  const last = data[data.length - 1];
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={{ display: "block" }}
    >
      {data.length > 1 && (
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <circle
        cx={(data.length - 1) * xStep}
        cy={yFor(last)}
        r="2.2"
        fill={p.bg}
        stroke={color}
        strokeWidth="1.2"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────
// Tiny utility: trigger a transient haptic-like opacity flash on
// mobile taps. The prototype uses this everywhere.
// ─────────────────────────────────────────────────────────────────
export function hapticPing(el: HTMLElement | null | undefined) {
  if (!el) return;
  el.style.transition = "opacity 80ms ease-out";
  el.style.opacity = "0.55";
  window.setTimeout(() => {
    if (el) el.style.opacity = "1";
  }, 90);
}

// ─────────────────────────────────────────────────────────────────
// Pulse animation keyframes used by the LIVE indicator. Mounted once
// at the layout root so individual cards don't have to inline it.
// ─────────────────────────────────────────────────────────────────
export function GlobalAnimations() {
  return (
    <style>{`
      @keyframes berliner-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      @keyframes berliner-slide-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes berliner-slide-down {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes berliner-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `}</style>
  );
}
