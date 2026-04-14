"use client"

import { Users, GraduationCap, School, TrendingUp } from "lucide-react"
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
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6 flex flex-col items-start justify-between h-full space-y-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="w-full space-y-2">
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
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <p className="text-sm text-rose-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  const items = [
    {
      label: "Total Étudiants",
      value: kpis?.total_students ?? 0,
      icon: Users,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      label: "Enseignants",
      value: kpis?.total_teachers ?? 0,
      icon: GraduationCap,
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
    },
    {
      label: "Classes",
      value: kpis?.total_classes ?? 0,
      icon: School,
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      label: "Moyenne Globale",
      value: kpis?.global_average !== null && kpis?.global_average !== undefined
        ? kpis.global_average.toFixed(1)
        : "--",
      icon: TrendingUp,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {items.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index} className="overflow-hidden hover:bg-white transition-colors duration-300">
              <CardContent className="p-6 flex flex-col items-start justify-between h-full space-y-4">
                <div className={`rounded-2xl p-3 ${kpi.bgColor}`}>
                  <Icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">{kpi.value}</div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{kpi.label}</p>
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
