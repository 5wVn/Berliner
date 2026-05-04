"use client";

import { useMemo, useState } from "react";
import { useTheme } from "@/shared/design/ThemeProvider";
import {
  AppCard,
  AppSectionLabel,
  PageShell,
  SectionEmpty,
} from "@/shared/components/berliner/Shell";
import { ditherGradient } from "@/shared/design/tokens";
import { GlobalAnimations, Mono, ScrollFade } from "@/shared/design/primitives";
import type { CompanyDocument } from "./CompanyHomeClient";

type Props = {
  documents: CompanyDocument[];
  error: string | null;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function CompanyDocumentsClient({ documents, error }: Props) {
  const { palette: p } = useTheme();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const types = useMemo(() => {
    const set = new Set<string>();
    documents.forEach((d) => {
      if (d.type) set.add(d.type);
    });
    return ["all", ...Array.from(set)];
  }, [documents]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((d) => {
      if (typeFilter !== "all" && d.type !== typeFilter) return false;
      if (!q) return true;
      return `${d.apprentice_name} ${d.type}`.toLowerCase().includes(q);
    });
  }, [documents, query, typeFilter]);

  return (
    <PageShell p={p}>
      <GlobalAnimations />

      <div
        style={{
          padding: "14px 20px 8px",
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
              height: 160,
              ...ditherGradient({ fg: p.accent, alpha: 0.4 }),
              maskImage: "linear-gradient(to bottom, #000 0%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
        )}
        <div style={{ position: "relative" }}>
          <Mono
            style={{
              fontSize: 11,
              color: p.ink3,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              display: "block",
              marginBottom: 10,
            }}
          >
            BERLINER · DOCUMENTS
          </Mono>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: -0.4,
              lineHeight: 1.15,
            }}
          >
            Documents
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: p.font.mono,
              fontSize: 11.5,
              color: p.ink3,
              letterSpacing: 0.3,
            }}
          >
            <Mono style={{ color: p.ink2, fontWeight: 600 }}>
              {documents.length}
            </Mono>{" "}
            disponible{documents.length > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <ScrollFade style={{ padding: "12px 16px 110px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par apprenti ou type…"
            style={{
              padding: "11px 14px",
              background: p.surface,
              border: `1px solid ${p.border}`,
              borderRadius: 12,
              color: p.ink,
              fontFamily: p.font.sans,
              fontSize: 14,
              outline: "none",
              width: "100%",
            }}
          />
          {types.length > 1 && (
            <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
              {types.map((t) => {
                const active = t === typeFilter;
                return (
                  <span
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      background: active ? p.accent : p.surface,
                      color: active ? (p.dark ? "#0E0E10" : "#FFF") : p.ink2,
                      border: `1px solid ${active ? p.accent : p.border}`,
                      fontFamily: p.font.mono,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 0.4,
                      textTransform: "uppercase",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    {t === "all" ? "Tous" : t}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <AppSectionLabel p={p}>
          {filtered.length} DOCUMENT{filtered.length > 1 ? "S" : ""}
        </AppSectionLabel>

        {error ? (
          <SectionEmpty p={p}>{error}</SectionEmpty>
        ) : filtered.length === 0 ? (
          <SectionEmpty p={p}>AUCUN DOCUMENT DISPONIBLE</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {filtered.map((d, i) => (
              <div
                key={d.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  borderBottom:
                    i === filtered.length - 1
                      ? "none"
                      : `1px solid ${p.border}`,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 38,
                    borderRadius: 2,
                    background: p.sem.info,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}
                  >
                    {d.apprentice_name}
                  </div>
                  <Mono
                    style={{
                      fontSize: 10.5,
                      color: p.ink3,
                      letterSpacing: 0.3,
                    }}
                  >
                    {d.type} · {formatDate(d.date)}
                  </Mono>
                </div>
                <Mono
                  style={{
                    fontSize: 10,
                    color: p.accent,
                    fontWeight: 600,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                    flexShrink: 0,
                  }}
                >
                  Voir
                </Mono>
              </div>
            ))}
          </AppCard>
        )}
      </ScrollFade>
    </PageShell>
  );
}
