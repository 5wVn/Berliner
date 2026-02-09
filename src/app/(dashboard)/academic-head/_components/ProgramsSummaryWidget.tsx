"use client"

import { BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { mockProgramsSummary } from "../_data/mock"

export function ProgramsSummaryWidget() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Programmes</CardTitle>
        <BookOpen className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockProgramsSummary.map((program, index) => (
            <div key={index} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-900">{program.name}</p>
                <p className="text-xs text-slate-500">{program.classes} classes ouvertes</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                {program.students} inscrits
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
