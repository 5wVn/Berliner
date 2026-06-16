"use client";

import { useCallback, useEffect, useState } from "react";
import { getNotificationsAction, type NotifItem } from "@/actions/berliner";

// Read-state for notifications (client-only).
const NOTIF_READ_KEY = "berliner.notifs.read";

function loadReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(NOTIF_READ_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.map(String)) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadIds(set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTIF_READ_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // ignore quota
  }
}

export function useNotificationFeed() {
  const [items, setItems] = useState<NotifItem[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => loadReadIds());
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const r = await getNotificationsAction();
    if (r.ok) setItems(r.data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const unreadCount = items.filter((it) => !readIds.has(it.id)).length;

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      items.forEach((it) => next.add(it.id));
      saveReadIds(next);
      return next;
    });
  }, [items]);

  return { items, readIds, unreadCount, loaded, refresh, markRead, markAllRead };
}
