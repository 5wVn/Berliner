"use client"

import {
  IconBuildingCommunity as School,
  IconSchool as GraduationCap,
  IconTrendingUp as TrendingUp,
  IconUsersGroup as Users,
} from "@tabler/icons-react"
import { Card, CardContent } from "@/shared/components/ui/Card"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import type { AcademicHeadKPIs } from "@/shared/lib/academicHeadData"

interface KPIsWidgetProps {
  loading?: boolean
  kpis?: AcademicHeadKPIs | null
  error?: string | null
}

export function KPIsWidget({
  loading = false,
  kpis = null,
  error = null,
}: KPIsWidgetProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="flex h-full flex-col items-start justify-between gap-4 p-6">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  const items = [
    { label: "Total etudiants", value: kpis?.total_students ?? 0, icon: Users, highlight: false },
    { label: "Enseignants", value: kpis?.total_teachers ?? 0, icon: GraduationCap, highlight: false },
    { label: "Classes", value: kpis?.total_classes ?? 0, icon: School, highlight: false },
    {
      label: "Moyenne globale",
      value:
        kpis?.global_average !== null && kpis?.global_average !== undefined
          ? kpis.global_average.toFixed(1)
          : "--",
      icon: TrendingUp,
      highlight: true,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 md:gap-6">
        {items.map((kpi, index) => {
          const Icon = kpi.icon
          return kpi.highlight ? (
            <div key={index} className="card-accent transition-transform duration-300 hover:-translate-y-1">
              <div className="flex h-full min-h-36 flex-col items-start justify-between gap-4 p-6">
                <div className="rounded-2xl border-2 border-current/25 bg-current/10 p-3">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-3xl font-black tracking-tight">{kpi.value}</div>
                  <p className="text-balance text-sm font-semibold opacity-80">{kpi.label}</p>
                </div>
              </div>
            </div>
          ) : (
            <Card key={index} className="transition-colors duration-300 hover:bg-muted">
              <CardContent className="flex h-full min-h-36 flex-col items-start justify-between gap-4 p-6">
                <div className="rounded-2xl border-2 border-border bg-surface-2 p-3 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-3xl font-black tracking-tight text-foreground">{kpi.value}</div>
                  <p className="text-balance text-sm font-semibold text-muted-foreground">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <div className="flex justify-end">
        <DashboardCardLink href="/academic-head/analytics" />
      </div>
    </div>
  )
}
