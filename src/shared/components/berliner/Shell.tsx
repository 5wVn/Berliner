"use client";

import {
  type CSSProperties,
  type ReactNode,
  type MouseEventHandler,
} from "react";
import type { Palette } from "@/shared/design/tokens";
import { ditherGradient } from "@/shared/design/tokens";

// ─────────────────────────────────────────────────────────────────
// AppHeader — kicker (mono uppercase) + title + optional subtitle.
// Gets a soft dither gradient bleed in light mode for depth.
// ─────────────────────────────────────────────────────────────────
type AppHeaderProps = {
  p: Palette;
  kicker?: ReactNode;
  kickerRight?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  tall?: boolean;
  ditherIntensity?: number;
  children?: ReactNode;
};

export function AppHeader({
  p,
  kicker,
  kickerRight,
  title,
  subtitle,
  tall = false,
  ditherIntensity = 0.4,
  children,
}: AppHeaderProps) {
  return (
    <div
      style={{
        padding: tall ? "16px 20px 12px" : "14px 20px 8px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {!p.dark && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: tall ? 200 : 160,
            ...ditherGradient({ fg: p.accent, alpha: ditherIntensity }),
            maskImage:
              "linear-gradient(to bottom, #000 0%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      )}
      <div style={{ position: "relative" }}>
        {(kicker || kickerRight) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: p.font.mono,
              fontSize: 13,
              color: p.ink3,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            <span>{kicker}</span>
            <span>{kickerRight}</span>
          </div>
        )}
        {title && (
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: -0.4,
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>
        )}
        {subtitle && (
          <div
            style={{
              marginTop: 8,
              display: "flex",
              gap: 14,
              fontFamily: p.font.mono,
              fontSize: 13.5,
              color: p.ink3,
              letterSpacing: 0.3,
            }}
          >
            {subtitle}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// AppSectionLabel — mono uppercase row label, with optional action.
// ─────────────────────────────────────────────────────────────────
type AppSectionLabelProps = {
  p: Palette;
  children: ReactNode;
  action?: ReactNode;
  onAction?: MouseEventHandler<HTMLSpanElement>;
};

export function AppSectionLabel({
  p,
  children,
  action,
  onAction,
}: AppSectionLabelProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 18,
        marginBottom: 8,
        padding: "0 4px",
      }}
    >
      <span
        style={{
          fontFamily: p.font.mono,
          fontSize: 12.5,
          color: p.ink3,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {children}
      </span>
      {action && (
        <span
          onClick={onAction}
          style={{
            fontFamily: p.font.mono,
            fontSize: 12.5,
            color: p.accent,
            letterSpacing: 0.4,
            textTransform: "uppercase",
            cursor: onAction ? "pointer" : "default",
            fontWeight: 600,
          }}
        >
          {action} ›
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// AppCard — generic surface card that hosts a stack of rows.
// ─────────────────────────────────────────────────────────────────
type AppCardProps = {
  p: Palette;
  children: ReactNode;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export function AppCard({ p, children, style, onClick }: AppCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: p.surface,
        border: `1px solid ${p.border}`,
        borderRadius: 12,
        marginBottom: 8,
        overflow: "hidden",
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// AppRow — composable list row with leading icon, title, subtitle,
// trailing slot, and an automatic divider.
// ─────────────────────────────────────────────────────────────────
type AppRowProps = {
  p: Palette;
  icon?: ReactNode;
  iconBg?: string;
  title: ReactNode;
  kind?: ReactNode;
  meta?: ReactNode;
  right?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  last?: boolean;
};

export function AppRow({
  p,
  icon,
  iconBg,
  title,
  kind,
  meta,
  right,
  onClick,
  last,
}: AppRowProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 14px",
        cursor: onClick ? "pointer" : undefined,
        borderBottom: last ? "none" : `1px solid ${p.border}`,
      }}
    >
      {icon !== undefined && (
        <div
          style={{
            width: 4,
            height: 28,
            borderRadius: 2,
            background: iconBg ?? p.accent,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {kind && (
          <div
            style={{
              fontFamily: p.font.mono,
              fontSize: 12,
              color: p.ink3,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            {kind}
          </div>
        )}
        <div style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.2 }}>
          {title}
        </div>
        {meta && (
          <div
            style={{
              fontFamily: p.font.mono,
              fontSize: 12.5,
              color: p.ink3,
              letterSpacing: 0.3,
            }}
          >
            {meta}
          </div>
        )}
      </div>
      {right !== undefined ? right : <span style={{ color: p.ink3, fontSize: 20 }}>›</span>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PageShell — outer container for a full-screen role page. Provides
// the dvh frame, palette background, font, and a fixed top spacer
// so content clears the iOS-style status bar / nav.
// ─────────────────────────────────────────────────────────────────
type PageShellProps = {
  p: Palette;
  children: ReactNode;
  topSpacer?: number;
  style?: CSSProperties;
};

export function PageShell({ p, children, topSpacer, style }: PageShellProps) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        background: p.bg,
        color: p.ink,
        fontFamily: p.font.sans,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        ...style,
      }}
    >
      {topSpacer !== undefined && (
        <div style={{ height: topSpacer, flexShrink: 0 }} />
      )}
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SectionEmpty — dashed empty-state placeholder.
// ─────────────────────────────────────────────────────────────────
export function SectionEmpty({
  p,
  children,
}: {
  p: Palette;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        padding: 18,
        textAlign: "center",
        color: p.ink3,
        fontFamily: p.font.mono,
        fontSize: 13,
        letterSpacing: 0.5,
        border: `1px dashed ${p.border}`,
        borderRadius: 12,
        marginBottom: 8,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}
