"use client";

import { useTheme } from "@/shared/design/ThemeProvider";

const PULSE_KEYFRAMES = `@keyframes berlinerSkeletonPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}`;

function Bar({
  width,
  height,
  bg,
  delay = 0,
}: {
  width: string;
  height: number;
  bg: string;
  delay?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 8,
        background: bg,
        animation: "berlinerSkeletonPulse 1.4s ease-in-out infinite",
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

export function BerlinerSkeleton() {
  const { palette: p } = useTheme();
  const tint = p.chip;
  return (
    <div
      style={{
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <style>{PULSE_KEYFRAMES}</style>
      <Bar width="40%" height={14} bg={tint} />
      <Bar width="70%" height={28} bg={tint} delay={80} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: 92,
              borderRadius: 16,
              background: tint,
              animation: "berlinerSkeletonPulse 1.4s ease-in-out infinite",
              animationDelay: `${120 + i * 60}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
