"use client"

import { Users, UserPlus, TrendingUp, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/Card"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import type { RegistrarStats } from "@/shared/lib/registrarData"

interface StatsWidgetProps {
  loading?: boolean
  stats?: RegistrarStats | null
  error?: string | null
}

export function StatsWidget({
  loading = false,
  stats = null,
  error = null,
}: StatsWidgetProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-24" />
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
    { label: "Total etudiants", value: stats?.total_students ?? 0, icon: Users },
    { label: "Inscriptions du mois", value: stats?.new_enrollments_month ?? 0, icon: UserPlus },
    { label: "Taux assiduite", value: `${stats?.global_attendance_rate ?? 0}%`, icon: TrendingUp },
    { label: "Demandes", value: stats?.pending_document_requests ?? 0, icon: AlertCircle },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 md:gap-6">
        {items.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="transition-colors duration-300 hover:bg-muted">
              <CardContent className="flex h-full min-h-36 flex-col items-center justify-center gap-3 p-6 text-center">
                <div className="rounded-full border-2 border-border bg-muted p-3 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-black tracking-tight text-foreground">{stat.value}</div>
                <p className="text-balance text-sm font-semibold text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <div className="flex justify-end">
        <DashboardCardLink href="/registrar/students" />
      </div>
    </div>
  )
}
