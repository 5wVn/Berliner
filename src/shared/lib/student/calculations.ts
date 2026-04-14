import type { SubjectGrade, SubjectWithGrades } from "@/shared/lib/studentData";

/**
 * Pure grade-math helpers. Lives in its own file (no Supabase imports) so
 * Server Components can use it without pulling in the browser Supabase
 * client at module load.
 */

export const calculateWeightedAverage = (grades: SubjectGrade[]): number | null => {
  if (!grades || grades.length === 0) return null;

  const totalScore = grades.reduce((acc, grade) => {
    const max = grade.max > 0 ? grade.max : 20;
    const normalizedValue = (grade.value / max) * 20;
    return acc + normalizedValue * grade.coefficient;
  }, 0);

  const totalCoeff = grades.reduce((acc, grade) => acc + grade.coefficient, 0);
  if (totalCoeff === 0) return null;

  return Math.round((totalScore / totalCoeff) * 100) / 100;
};

export const calculateGlobalAverage = (
  subjects: SubjectWithGrades[]
): number | null => {
  if (!subjects || subjects.length === 0) return null;

  let totalAverage = 0;
  let count = 0;

  subjects.forEach((subject) => {
    const subjectAvg = calculateWeightedAverage(subject.grades);
    if (subjectAvg !== null) {
      totalAverage += subjectAvg;
      count += 1;
    }
  });

  if (count === 0) return null;
  return Math.round((totalAverage / count) * 100) / 100;
};
