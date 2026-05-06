"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/shared/design/ThemeProvider";
import {
  AppCard,
  AppHeader,
  AppSectionLabel,
  PageShell,
  SectionEmpty,
} from "@/shared/components/berliner/Shell";
import {
  GlobalAnimations,
  Mono,
  ScrollFade,
} from "@/shared/design/primitives";
import {
  NotifBellPill,
  NotificationsPanel,
  useNotificationFeed,
} from "@/shared/components/berliner/Overlays";
import type { CompanyDocument } from "@/shared/lib/companyData";

type Props = {
  documents: CompanyDocument[];
  error: string | null;
};

export function CompanyDocumentsClient({ documents, error }: Props) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const { unreadCount } = useNotificationFeed();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const types = useMemo(() => {
    return Array.from(new Set(documents.map((d) => d.type).filter(Boolean))).sort();
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

      <AppHeader
        p={p}
        kicker="BERLINER · DOCUMENTS"
        kickerRight={
          <NotifBellPill
            p={p}
            unread={unreadCount}
            onClick={() => setShowNotifs(true)}
          />
        }
        title={
          <>
            <span style={{ color: p.accent }}>{documents.length}</span>{" "}
            documents
          </>
        }
        subtitle={
          <span style={{ color: p.ink3 }}>
            Conventions, attestations, pièces apprentis.
          </span>
        }
      />

      <ScrollFade style={{ padding: "4px 16px 110px" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par apprenti ou type..."
          style={{
            width: "100%",
            height: 44,
            background: p.surface,
            border: `1px solid ${p.border}`,
            borderRadius: 12,
            padding: "0 14px",
            fontSize: 15,
            fontFamily: p.font.sans,
            color: p.ink,
            outline: "none",
            marginTop: 4,
          }}
        />

        {types.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 6,
              overflowX: "auto",
              marginTop: 10,
              paddingBottom: 4,
            }}
          >
            <Chip
              p={p}
              active={typeFilter === "all"}
              onClick={() => setTypeFilter("all")}
            >
              Tous types
            </Chip>
            {types.map((t) => (
              <Chip
                key={t}
                p={p}
                active={typeFilter === t}
                onClick={() => setTypeFilter(t)}
              >
                {t}
              </Chip>
            ))}
          </div>
        )}

        <AppSectionLabel p={p}>
          {filtered.length} RÉSULTAT{filtered.length > 1 ? "S" : ""}
        </AppSectionLabel>

        {error ? (
          <SectionEmpty p={p}>ERREUR · {error.toUpperCase()}</SectionEmpty>
        ) : filtered.length === 0 ? (
          <SectionEmpty p={p}>
            {documents.length === 0
              ? "AUCUN DOCUMENT — BIENTÔT DISPONIBLE"
              : "AUCUN RÉSULTAT"}
          </SectionEmpty>
        ) : (
          <AppCard p={p}>
            {filtered.map((d, i) => {
              const date = new Date(d.date);
              const dateValid = !Number.isNaN(date.getTime());
              return (
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
                      height: 32,
                      borderRadius: 2,
                      background: p.sem.info,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        lineHeight: 1.2,
                      }}
                    >
                      {d.type}
                    </div>
                    <Mono
                      style={{
                        fontSize: 12.5,
                        color: p.ink3,
                        letterSpacing: 0.3,
                      }}
                    >
                      {d.apprentice_name}
                      {dateValid
                        ? ` · ${date.toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                          })}`
                        : ""}
                    </Mono>
                  </div>
                  <span style={{ color: p.ink3, fontSize: 20 }}>›</span>
                </div>
              );
            })}
          </AppCard>
        )}
      </ScrollFade>

      {showNotifs && (
        <NotificationsPanel
          onClose={() => setShowNotifs(false)}
          onNav={() => router.push("/company")}
        />
      )}
    </PageShell>
  );
}

function Chip({
  p,
  active,
  onClick,
  children,
}: {
  p: ReturnType<typeof useTheme>["palette"];
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "7px 12px",
        borderRadius: 999,
        background: active ? p.accent : p.surface,
        border: `1px solid ${active ? "transparent" : p.border}`,
        color: active ? (p.dark ? "#0E0E10" : "#FFFFFF") : p.ink2,
        fontFamily: p.font.mono,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.4,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}
