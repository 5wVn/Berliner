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
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white/60 backdrop-blur-md">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
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
      <Card className="bg-white/60 backdrop-blur-md">
        <CardContent className="p-6">
          <p className="text-sm text-rose-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  const items = [
    {
      label: "Total Étudiants",
      value: stats?.total_students ?? 0,
      icon: Users,
      color: "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/20",
    },
    {
      label: "Inscriptions (Mois)",
      value: stats?.new_enrollments_month ?? 0,
      icon: UserPlus,
      color: "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/20",
    },
    {
      label: "Taux Assiduité",
      value: `${stats?.global_attendance_rate ?? 0}%`,
      icon: TrendingUp,
      color: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-900/20",
    },
    {
      label: "Demandes",
      value: stats?.pending_document_requests ?? 0,
      icon: AlertCircle,
      color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {items.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="bg-white/60 backdrop-blur-md hover:bg-white transition-colors duration-300">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">{stat.value}</div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
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
