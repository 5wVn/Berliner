"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { useTheme } from "@/shared/design/ThemeProvider";

const PROJECT_ID = "YxfXlIoK9giMIqIf2zJr";
const SCENE_ID = "berliner-unicorn-bg";

// Minimal type for the Unicorn Studio global. We don't ship the full SDK
// types — only the methods we actually call.
type UnicornScene = { destroy?: () => void };
type UnicornStudioGlobal = {
  isInitialized?: boolean;
  scenes?: UnicornScene[];
  addScene?: (opts: {
    elementId: string;
    projectId: string;
    scale?: number;
    dpi?: number;
    fps?: number;
    lazyLoad?: boolean;
  }) => Promise<UnicornScene>;
};

declare global {
  interface Window {
    UnicornStudio?: UnicornStudioGlobal;
  }
}

/**
 * Animated shader background sourced from the design prototype. Renders a
 * fixed full-viewport canvas behind every page. Only mounts in dark mode —
 * light mode keeps the dither-gradient header treatment instead.
 */
export function UnicornBackground() {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<UnicornScene | null>(null);

  useEffect(() => {
    if (theme !== "dark") return;
    let cancelled = false;

    const tryInit = async () => {
      if (cancelled) return;
      const us = window.UnicornStudio;
      if (!us?.addScene || !ref.current) {
        // Script not ready yet; the onLoad handler retries.
        return;
      }
      // If we already have a scene attached, leave it alone.
      if (ref.current.querySelector("canvas")) return;
      try {
        sceneRef.current = await us.addScene({
          elementId: SCENE_ID,
          projectId: PROJECT_ID,
          scale: 1,
          dpi: 1.5,
          fps: 60,
          lazyLoad: false,
        });
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn("UnicornStudio scene failed:", err);
        }
      }
    };

    // Try immediately in case the script was already loaded by a prior mount.
    void tryInit();
    // Also poll briefly (the <Script> onLoad covers most cases, this is the
    // fallback for HMR + back-nav where the script global is already there).
    const interval = window.setInterval(() => {
      if (cancelled || ref.current?.querySelector("canvas")) {
        window.clearInterval(interval);
        return;
      }
      void tryInit();
    }, 400);
    window.setTimeout(() => window.clearInterval(interval), 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      // Tear down the scene so the canvas + GL context are released; without
      // this, switching pages quickly leaks contexts.
      try {
        sceneRef.current?.destroy?.();
      } catch {
        // ignore
      }
      sceneRef.current = null;
    };
  }, [theme]);

  if (theme !== "dark") return null;

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.9/dist/unicornStudio.umd.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Trigger a re-init by toggling a dataset attr; the effect above
          // will see the canvas isn't there yet and call addScene.
          if (ref.current && !ref.current.querySelector("canvas")) {
            ref.current.dataset.usReady = "1";
          }
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
          background: "#0E0E10",
        }}
      >
        <div
          id={SCENE_ID}
          ref={ref}
          data-us-project={PROJECT_ID}
          // Explicit viewport units — UnicornStudio sizes its canvas from
          // the host element's offsetWidth/Height at init time; relying on
          // % requires the parent to be laid out, which isn't guaranteed
          // when addScene() runs immediately after Script onLoad.
          style={{ width: "100vw", height: "100vh" }}
        />
      </div>
    </>
  );
}
