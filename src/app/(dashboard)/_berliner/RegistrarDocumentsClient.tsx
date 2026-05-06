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
import type { DocumentRequest } from "@/shared/lib/registrarData";

type Props = {
  requests: DocumentRequest[];
  error: string | null;
};

export function RegistrarDocumentsClient({ requests, error }: Props) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const { unreadCount } = useNotificationFeed();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "processing">(
    "all"
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return `${r.student_name} ${r.document_type}`.toLowerCase().includes(q);
    });
  }, [requests, query, statusFilter]);

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const processingCount = requests.filter((r) => r.status === "processing").length;

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
            <span style={{ color: p.accent }}>{requests.length}</span> demandes
          </>
        }
        subtitle={
          <>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {pendingCount}
              </Mono>{" "}
              en attente
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {processingCount}
              </Mono>{" "}
              en cours
            </span>
          </>
        }
      />

      <ScrollFade style={{ padding: "4px 16px 110px" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un étudiant, un type..."
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
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            Tous
          </Chip>
          <Chip
            p={p}
            active={statusFilter === "pending"}
            onClick={() => setStatusFilter("pending")}
          >
            En attente
          </Chip>
          <Chip
            p={p}
            active={statusFilter === "processing"}
            onClick={() => setStatusFilter("processing")}
          >
            En cours
          </Chip>
        </div>

        <AppSectionLabel p={p}>
          {filtered.length} RÉSULTAT{filtered.length > 1 ? "S" : ""}
        </AppSectionLabel>

        {error ? (
          <SectionEmpty p={p}>ERREUR · {error.toUpperCase()}</SectionEmpty>
        ) : filtered.length === 0 ? (
          <SectionEmpty p={p}>
            {requests.length === 0
              ? "AUCUNE DEMANDE — WORKFLOW BIENTÔT DISPONIBLE"
              : "AUCUN RÉSULTAT"}
          </SectionEmpty>
        ) : (
          <AppCard p={p}>
            {filtered.map((r, i) => {
              const date = new Date(r.request_date);
              const dateValid = !Number.isNaN(date.getTime());
              const statusColor =
                r.status === "processing" ? p.sem.info : p.sem.warn;
              const statusLabel =
                r.status === "processing" ? "EN COURS" : "EN ATTENTE";
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
                      height: 32,
                      borderRadius: 2,
                      background: statusColor,
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
                      {r.document_type}
                    </div>
                    <Mono
                      style={{
                        fontSize: 12.5,
                        color: p.ink3,
                        letterSpacing: 0.3,
                      }}
                    >
                      {r.student_name}
                      {dateValid
                        ? ` · ${date.toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                          })}`
                        : ""}
                    </Mono>
                  </div>
                  <Mono
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: statusColor,
                      letterSpacing: 0.5,
                      flexShrink: 0,
                    }}
                  >
                    {statusLabel}
                  </Mono>
                </div>
              );
            })}
          </AppCard>
        )}
      </ScrollFade>

      {showNotifs && (
        <NotificationsPanel
          onClose={() => setShowNotifs(false)}
          onNav={() => router.push("/registrar")}
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
