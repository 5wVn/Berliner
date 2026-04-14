import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronRight, GraduationCap } from "lucide-react"
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Badge } from "@/shared/components/ui/Badge"
import { createClient } from "@/shared/lib/supabase/server"
import { getStudentGradesAction } from "@/actions/student"
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles"
import type { UserRole } from "@/shared/types/auth"

export default async function StudentGradesPage() {
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

  const result = await getStudentGradesAction()
  const summary = result.ok ? result.data : null
  const error = result.ok ? null : result.error.message

  const subjects = summary?.subjects ?? []
  const globalAverage = summary?.globalAverage ?? null

  return (
    <DashboardLayout
      role="student"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
      backgroundVariant="violet"
    >
      <div className="space-y-6 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Mes Notes
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Suivi de vos résultats et moyennes par matière.
          </p>
        </div>

        {/* Global Average Card */}
        <Card className="border-none bg-linear-to-br from-indigo-500 to-indigo-600 text-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-indigo-100 font-medium text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Moyenne Générale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">
                {globalAverage !== null ? globalAverage.toFixed(2) : "--"}
              </span>
              <span className="text-indigo-200 text-lg">/ 20</span>
            </div>
            <p className="text-indigo-100/80 text-sm mt-2">
              Calculé sur {subjects.length} matières
            </p>
          </CardContent>
        </Card>

        {/* Subjects List */}
        {error ? (
          <div className="text-sm text-rose-500">{error}</div>
        ) : subjects.length === 0 ? (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Aucune note disponible pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => {
              const isPassing = subject.average !== null && subject.average >= 10

              return (
                <Link key={subject.id} href={`/student/grades/${subject.id}`}>
                  <Card className="h-full hover:bg-slate-50 transition-colors cursor-pointer border-slate-200 dark:hover:bg-slate-900/60 dark:border-slate-800">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-50">{subject.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {subject.teacher ?? "Enseignant"}
                        </p>
                        <div className="text-xs text-slate-400 dark:text-slate-400">
                          {subject.count} notes
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                          <Badge
                            variant="secondary"
                            className={
                              isPassing
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/30 dark:hover:bg-emerald-500/30"
                                : "bg-red-100 text-red-700 hover:bg-red-100 border border-red-200 dark:bg-red-500/20 dark:text-red-200 dark:border-red-500/30 dark:hover:bg-red-500/30"
                            }
                          >
                            {subject.average !== null ? subject.average.toFixed(2) : "--"}
                          </Badge>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
