"use client";

import { type NotifItem } from "@/actions/berliner";
import { useTheme } from "@/shared/design/ThemeProvider";
import { Mono } from "@/shared/design/primitives";
import { OverlayShell } from "./OverlayShell";
import { useNotificationFeed } from "./useNotificationFeed";

// NotificationsPanel
type NotificationsPanelProps = {
  onClose: () => void;
  onNav?: (target: "home" | "grades" | "planning" | "devoirs") => void;
};

export function NotificationsPanel({ onClose, onNav }: NotificationsPanelProps) {
  const { palette: p } = useTheme();
  const { items, readIds, unreadCount, markRead, markAllRead } =
    useNotificationFeed();

  const groupKind: Record<NotifItem["kind"], { icon: string; label: string; color: string }> = {
    grade: { icon: "●", label: "NOTE", color: p.accent },
    homework: { icon: "✓", label: "DEVOIR", color: p.sem.warn },
    live: { icon: "◐", label: "LIVE", color: p.sem.ok },
  };

  return (
    <OverlayShell
      p={p}
      kicker={`NOTIFS · ${items.length}`}
      title={
        unreadCount > 0 ? (
          <>
            {unreadCount}{" "}
            <span className="font-medium text-ink-3">
              nouveau{unreadCount > 1 ? "x" : ""}
            </span>
          </>
        ) : (
          <>
            Tout est <span className="text-primary">à jour</span>
          </>
        )
      }
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <div
            onClick={markAllRead}
            className="flex-1 cursor-pointer rounded-[9px] border border-border bg-chip py-[11px] text-center font-mono text-[11px] font-semibold tracking-[0.4px] text-ink-2 dark:bg-surface-2"
          >
            TOUT MARQUER LU
          </div>
        </div>
      }
    >
      {items.length === 0 ? (
        <div className="mt-3 rounded-[12px] border border-dashed border-border p-[30px] text-center font-mono text-[11px] tracking-[0.4px] text-ink-3">
          — AUCUNE NOTIFICATION —
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {items.map((n) => {
            const g = groupKind[n.kind] ?? { icon: "◯", label: "—", color: p.ink3 };
            const read = readIds.has(n.id);
            return (
              <div
                key={n.id}
                onClick={() => {
                  markRead(n.id);
                  if (n.nav && onNav) {
                    onClose();
                    onNav(n.nav);
                  }
                }}
                className="relative flex cursor-pointer items-start gap-[11px] rounded-[11px] border border-border bg-surface px-3 py-[11px]"
              >
                {!read && (
                  <div
                    className="absolute left-[-4px] top-[11px] h-1 w-1 rounded-[2px]"
                    style={{ background: p.accent }}
                  />
                )}
                <div
                  className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg text-[14px]"
                  style={{ background: g.color + "22", color: g.color }}
                >
                  {g.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <Mono
                      className="rounded-[3px] px-[5px] py-px text-[9.5px] font-semibold tracking-[0.5px]"
                      style={{ color: g.color, background: g.color + "20" }}
                    >
                      {g.label}
                    </Mono>
                    <Mono className="text-[10px] tracking-[0.3px] text-ink-4">
                      {n.ago}
                    </Mono>
                  </div>
                  <div
                    className={`text-[13.5px] font-medium leading-[1.3] ${
                      read ? "text-ink-2" : "text-ink"
                    }`}
                  >
                    {n.title}
                  </div>
                  {n.meta && (
                    <Mono className="mt-0.5 block text-[10.5px] text-ink-3">
                      {n.meta}
                    </Mono>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </OverlayShell>
  );
}
