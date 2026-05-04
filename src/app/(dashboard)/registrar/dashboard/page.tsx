import { Suspense } from "react"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
import { PendingEnrollmentsWidget } from "../_components/PendingEnrollmentsWidget"
import { DocumentRequestsWidget } from "../_components/DocumentRequestsWidget"
import { AttendanceAlertsWidget } from "../_components/AttendanceAlertsWidget"
import { StatsWidget } from "../_components/StatsWidget"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { createClient } from "@/shared/lib/supabase/server"
import {
  getRegistrarAttendanceAlertsAction,
  getRegistrarDocumentRequestsAction,
  getRegistrarPendingEnrollmentsAction,
  getRegistrarStatsAction,
} from "@/actions/registrar"
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles"
import type { UserRole } from "@/shared/types/auth"

async function StatsSection() {
  const result = await getRegistrarStatsAction()
  return (
    <StatsWidget
      stats={result.ok ? result.data : null}
      error={result.ok ? null : result.error.message}
    />
  )
}

async function PendingEnrollmentsSection() {
  const result = await getRegistrarPendingEnrollmentsAction(5)
  return (
    <PendingEnrollmentsWidget
      enrollments={result.ok ? result.data : null}
      error={result.ok ? null : result.error.message}
    />
  )
}

async function DocumentRequestsSection() {
  const result = await getRegistrarDocumentRequestsAction()
  return (
    <DocumentRequestsWidget
      requests={result.ok ? result.data : null}
      error={result.ok ? null : result.error.message}
    />
  )
}

async function AttendanceAlertsSection() {
  const result = await getRegistrarAttendanceAlertsAction(5)
  return (
    <AttendanceAlertsWidget
      alerts={result.ok ? result.data : null}
      error={result.ok ? null : result.error.message}
    />
  )
}

function WidgetSkeleton() {
  return <Skeleton className="h-48 w-full" />
}

export default async function RegistrarDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/")

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, first_name, last_name")
    .eq("id", user.id)
    .maybeSingle()

  if (profileError || !profile) redirect("/")

  const role = profile.role as UserRole
  if (!canAccessRole(role, "registrar")) {
    redirect(roleToDashboardPath(role))
  }

  const userName = `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Utilisateur"

  return (
    <DashboardLayout
      role="registrar"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex max-w-3xl flex-col gap-3">
          <h1 className="font-heading text-balance text-3xl font-bold text-foreground">
            Bonjour, <span className="break-words text-primary">{userName}</span>
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Apercu de l&apos;administration scolaire.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-6">
          <Suspense fallback={<WidgetSkeleton />}>
            <StatsSection />
          </Suspense>
          <Suspense fallback={<WidgetSkeleton />}>
            <PendingEnrollmentsSection />
          </Suspense>
          <Suspense fallback={<WidgetSkeleton />}>
            <DocumentRequestsSection />
          </Suspense>
          <Suspense fallback={<WidgetSkeleton />}>
            <AttendanceAlertsSection />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  )
}
