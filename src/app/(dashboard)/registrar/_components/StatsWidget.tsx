"use client"

import { Users, UserPlus, TrendingUp, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/Card"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { mockStats } from "../_data/mock"

interface StatsWidgetProps {
  loading?: boolean
}

export function StatsWidget({ loading = false }: StatsWidgetProps) {
  const stats = [
    {
      label: "Total Étudiants",
      value: mockStats.total_students,
      icon: Users,
      change: "+12%",
      changeType: "neutral" as const
    },
    {
      label: "Inscriptions (Mois)",
      value: mockStats.new_enrollments_month,
      icon: UserPlus,
      change: "+4",
      changeType: "positive" as const
    },
    {
      label: "Taux Assiduité",
      value: `${mockStats.global_attendance_rate}%`,
      icon: TrendingUp,
      change: "-1.2%",
      changeType: "negative" as const
    },
    {
      label: "Demandes",
      value: mockStats.pending_requests,
      icon: AlertCircle,
      change: "En cours",
      changeType: "neutral" as const
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
              <Icon className="h-5 w-5 text-slate-400" />
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
