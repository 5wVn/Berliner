"use client"

import { Users, GraduationCap, School, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/Card"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { mockKPIs } from "../_data/mock"

interface KPIsWidgetProps {
  loading?: boolean
}

export function KPIsWidget({ loading = false }: KPIsWidgetProps) {
  const kpis = [
    {
      label: "Total Étudiants",
      value: mockKPIs.total_students,
      icon: Users,
      trend: mockKPIs.students_trend,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      label: "Enseignants",
      value: mockKPIs.total_teachers,
      icon: GraduationCap,
      trend: null,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      label: "Classes",
      value: mockKPIs.total_classes,
      icon: School,
      trend: null,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Moyenne Globale",
      value: mockKPIs.global_average,
      icon: TrendingUp,
      trend: mockKPIs.average_trend,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4 flex flex-col items-start justify-between h-full space-y-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="w-full space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4 flex flex-col items-start justify-between h-full space-y-3">
              <div className={`rounded-lg p-2 ${kpi.bgColor}`}>
                <Icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
                  {kpi.trend && (
                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {kpi.trend}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
