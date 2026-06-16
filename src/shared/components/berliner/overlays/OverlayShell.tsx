"use client";

import { type ReactNode } from "react";
import { type Palette } from "@/shared/design/tokens";
import { Mono, ScrollFade, hapticPing } from "@/shared/design/primitives";

// OverlayShell — full-screen panel base.
type OverlayShellProps = {
  p: Palette;
  title: ReactNode;
  kicker?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function OverlayShell({
  title,
  kicker,
  onClose,
  children,
  footer,
}: OverlayShellProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex flex-col font-sans text-ink animate-berliner-slide-up bg-[#FAFAF7] dark:bg-[#0E0E10]"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <div
          onClick={onClose}
          className="cursor-pointer py-1 font-mono text-xs tracking-[0.4px] text-ink-3"
        >
          ← FERMER
        </div>
        <div className="flex-1" />
        <Mono className="text-[11px] uppercase tracking-[0.5px] text-ink-3">
          {kicker}
        </Mono>
      </div>
      <div className="px-4 pb-1.5 pt-3.5">
        <div className="text-2xl font-semibold leading-[1.15] tracking-[-0.4px]">
          {title}
        </div>
      </div>
      <ScrollFade className="px-4 pb-6 pt-1.5" fadeSize={24}>
        {children}
      </ScrollFade>
      {footer && (
        <div
          className="border-t border-border bg-[rgba(250,250,247,0.88)] px-4 dark:bg-[rgba(14,14,16,0.85)]"
          style={{
            paddingTop: 12,
            paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

// Notification bell (used in page headers).
export function NotifBellPill({
  p,
  unread,
  onClick,
}: {
  p: Palette;
  unread: number;
  onClick: () => void;
}) {
  return (
    <span
      onClick={(e) => {
        hapticPing(e.currentTarget);
        onClick();
      }}
      className="relative inline-flex cursor-pointer items-center gap-1.5 rounded-full py-[5px] pl-2 pr-2.5 font-mono text-[10.5px] font-bold leading-none tracking-[0.5px]"
      style={{
        background: unread > 0 ? p.accent : p.surface,
        color: unread > 0 ? (p.dark ? "#0E0E10" : "#FFFFFF") : p.ink2,
        border: `1px solid ${
          unread > 0 ? "transparent" : p.borderStrong || p.border
        }`,
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        className="block"
      >
        <path
          d="M8 1.5C5.79 1.5 4 3.29 4 5.5V8L2.75 10.5H13.25L12 8V5.5C12 3.29 10.21 1.5 8 1.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M6.5 12.5C6.5 13.33 7.17 14 8 14C8.83 14 9.5 13.33 9.5 12.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span>NOTIF</span>
      {unread > 0 && (
        <span
          className="ml-px -mr-[3px] inline-flex h-4 items-center justify-center rounded-full px-[5px] text-[10px] font-bold tabular-nums tracking-normal"
          style={{
            minWidth: 16,
            background: p.dark ? "#0E0E10" : "#FFFFFF",
            color: p.accent,
          }}
        >
          {unread}
        </span>
      )}
    </span>
  );
}
