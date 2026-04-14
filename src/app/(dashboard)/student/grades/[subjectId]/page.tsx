import { redirect } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ChevronLeft, GraduationCap, Calendar, Trophy } from "lucide-react"

import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
import { Card, CardHeader, CardContent, CardTitle } from "@/shared/components/ui/Card"
import { Badge } from "@/shared/components/ui/Badge"
import { Button } from "@/shared/components/ui/Button"
import { createClient } from "@/shared/lib/supabase/server"
import { getStudentSubjectsWithGradesAction } from "@/actions/student"
import { calculateWeightedAverage } from "@/shared/lib/student/calculations"
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles"
import type { UserRole } from "@/shared/types/auth"

const getGradeBadgeVariant = (value: number, max: number) => {
  const normalized = (value / max) * 20
  if (normalized >= 16) return "success" as const
  if (normalized >= 14) return "info" as const
  if (normalized >= 10) return "warning" as const
  return "destructive" as const
}

interface SubjectGradesPageProps {
  params: Promise<{ subjectId: string }>
}

export default async function SubjectGradesPage({ params }: SubjectGradesPageProps) {
  const { subjectId } = await params

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
  if (!canAccessRole(role, "student")) {
    redirect(roleToDashboardPath(role))
  }

  const userName = `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Utilisateur"

  const result = await getStudentSubjectsWithGradesAction()
  const error = result.ok ? null : result.error.message
  const subject = result.ok
    ? result.data.find((item) => item.id === subjectId) ?? null
    : null

  const average = subject ? calculateWeightedAverage(subject.grades) : null
  const sortedGrades = subject
    ? [...subject.grades].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    : []

  return (
    <DashboardLayout
      role="student"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
      backgroundVariant="violet"
    >
      <div className="space-y-6 pb-6">
        {/* Header & Back Button */}
        <div className="flex flex-col gap-4">
          <Link href="/student/grades" className="w-fit">
            <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent hover:text-indigo-600 text-slate-600 dark:text-slate-400 dark:hover:text-indigo-300">
              <ChevronLeft className="h-5 w-5" />
              Retour aux notes
            </Button>
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 dark:text-slate-50">
              {subject?.name ?? "Matière"}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Enseignant: {subject?.teacher ?? "Enseignant"}
            </p>
          </div>
        </div>

        {error ? (
          <div className="text-sm text-rose-500">{error}</div>
        ) : !subject ? (
          <Card>
            <CardContent className="py-8 text-center text-slate-500 dark:text-slate-400">
              Matière introuvable.
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Subject Stats Card */}
            <Card className="border-none bg-linear-to-br from-indigo-500 to-indigo-600 text-white shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy className="w-32 h-32 transform rotate-12" />
              </div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-indigo-100 font-medium text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Moyenne Matière
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">
                    {average !== null ? average.toFixed(2) : "--"}
                  </span>
                  <span className="text-indigo-200 text-xl">/ 20</span>
                </div>
                <p className="text-indigo-100/80 text-sm mt-2">
                  Sur {subject.grades.length} évaluation{subject.grades.length > 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>

            {/* Grades List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Historique des évaluations
              </h2>

              {sortedGrades.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-slate-500 dark:text-slate-400">
                    Aucune note disponible pour cette matière.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {sortedGrades.map((grade) => (
                    <Card key={grade.id} className="border-slate-200 shadow-sm dark:border-slate-800 dark:shadow-none">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900 dark:text-slate-50">{grade.label}</span>
                            <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm dark:bg-slate-800 dark:text-slate-300">
                              Coeff. {grade.coefficient}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="capitalize">
                              {format(new Date(grade.date), "dd MMMM yyyy", { locale: fr })}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <Badge variant={getGradeBadgeVariant(grade.value, grade.max)} className="text-sm px-2.5 py-1">
                            {grade.value} <span className="text-[0.7em] opacity-80 ml-0.5">/ {grade.max}</span>
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
