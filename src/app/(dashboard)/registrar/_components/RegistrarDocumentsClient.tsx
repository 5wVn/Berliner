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
import type { RegistrarDocumentRequest } from "./RegistrarHomeClient";

type Props = {
  requests: RegistrarDocumentRequest[];
  error: string | null;
};

const STATUS_OPTIONS = [
  { key: "all", label: "Tous" },
  { key: "pending", label: "À traiter" },
  { key: "processing", label: "En cours" },
];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function RegistrarDocumentsClient({ requests, error }: Props) {
  const { palette: p } = useTheme();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const processingCount = requests.filter((r) => r.status === "processing").length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      const haystack = `${r.student_name} ${r.document_type}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [requests, query, statusFilter]);

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
            Demandes
          </div>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              gap: 14,
              fontFamily: p.font.mono,
              fontSize: 11.5,
              color: p.ink3,
              letterSpacing: 0.3,
            }}
          >
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {requests.length}
              </Mono>{" "}
              total
            </span>
            <span>
              <Mono style={{ color: p.sem.info, fontWeight: 600 }}>
                {pendingCount}
              </Mono>{" "}
              à traiter
            </span>
            <span>
              <Mono style={{ color: p.sem.warn, fontWeight: 600 }}>
                {processingCount}
              </Mono>{" "}
              en cours
            </span>
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
            placeholder="Rechercher par étudiant ou type…"
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
          <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
            {STATUS_OPTIONS.map((o) => {
              const active = o.key === statusFilter;
              return (
                <span
                  key={o.key}
                  onClick={() => setStatusFilter(o.key)}
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
                  {o.label}
                </span>
              );
            })}
          </div>
        </div>

        <AppSectionLabel p={p}>
          {filtered.length} DEMANDE{filtered.length > 1 ? "S" : ""}
        </AppSectionLabel>

        {error ? (
          <SectionEmpty p={p}>{error}</SectionEmpty>
        ) : filtered.length === 0 ? (
          <SectionEmpty p={p}>AUCUNE DEMANDE EN COURS</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {filtered.map((r, i) => {
              const c = r.status === "processing" ? p.sem.warn : p.sem.info;
              return (
                <div
                  key={r.id}
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
                      background: c,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}
                    >
                      {r.document_type}
                    </div>
                    <Mono
                      style={{
                        fontSize: 10.5,
                        color: p.ink3,
                        letterSpacing: 0.3,
                      }}
                    >
                      {r.student_name} · {formatDate(r.request_date)}
                    </Mono>
                  </div>
                  <Mono
                    style={{
                      fontSize: 10,
                      color: c,
                      fontWeight: 600,
                      letterSpacing: 0.4,
                      textTransform: "uppercase",
                      flexShrink: 0,
                    }}
                  >
                    {r.status === "processing" ? "En cours" : "À traiter"}
                  </Mono>
                </div>
              );
            })}
          </AppCard>
        )}
      </ScrollFade>
    </PageShell>
  );
}
