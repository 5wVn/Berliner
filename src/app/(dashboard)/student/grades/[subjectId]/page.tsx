import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import { getStudentSubjectsWithGradesAction } from "@/actions/student";
import { calculateWeightedAverage } from "@/shared/lib/student/calculations";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";
import { MobileLayout } from "../../../_berliner/MobileLayout";
import { StudentSubjectGradesClient } from "../../../_berliner/StudentSubjectGradesClient";

interface SubjectGradesPageProps {
  params: Promise<{ subjectId: string }>;
}

export default async function SubjectGradesPage({ params }: SubjectGradesPageProps) {
  const { subjectId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError || !profile) redirect("/");

  const role = profile.role as UserRole;
  if (!canAccessRole(role, "student")) {
    redirect(roleToDashboardPath(role));
  }

  const result = await getStudentSubjectsWithGradesAction();
  const error = result.ok ? null : result.error.message;
  const subject = result.ok
    ? result.data.find((item) => item.id === subjectId) ?? null
    : null;
  const average = subject ? calculateWeightedAverage(subject.grades) : null;

  return (
    <MobileLayout role="student">
      <StudentSubjectGradesClient
        subject={subject}
        average={average}
        error={error}
      />
    </MobileLayout>
  );
}
