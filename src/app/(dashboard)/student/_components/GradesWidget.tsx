"use client"

import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { mockGrades } from "../_data/mock"

interface GradesWidgetProps {
  loading?: boolean
}

export function GradesWidget({ loading = false }: GradesWidgetProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center pb-4 space-y-2">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="space-y-3">
             {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-8 rounded-full" />
                </div>
             ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate global average from mock data or just use a derived value if needed.
  const totalWeighted = mockGrades.reduce((acc, curr) => acc + (curr.average * curr.count), 0)
  const totalCount = mockGrades.reduce((acc, curr) => acc + curr.count, 0)
  const globalAverage = totalCount > 0 ? (totalWeighted / totalCount).toFixed(1) : "N/A"

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Notes récentes</CardTitle>
        <TrendingUp className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center pb-4">
          <span className="text-4xl font-bold text-slate-900">{globalAverage}</span>
          <span className="text-xs text-slate-500">Moyenne générale</span>
        </div>
        <div className="space-y-3">
          {mockGrades.map((grade, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">{grade.subjectName}</span>
              <div className="flex items-center space-x-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-900">
                  {grade.average.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
