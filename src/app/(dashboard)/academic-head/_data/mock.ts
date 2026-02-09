export const mockKPIs = {
  total_students: 1250,
  total_teachers: 45,
  total_classes: 32,
  global_average: 13.8,
  students_trend: "+5%",
  average_trend: "+0.2"
};

export const mockAttendanceOverview = {
  rate: 94.5,
  trend: 'up', // 'up' | 'down' | 'stable'
  trend_value: 1.2,
  weekly_data: [92, 93, 91, 94, 95]
};

export const mockGradeDistribution = [
  { range: '≥ 16', count: 150, percentage: 12 },
  { range: '14-16', count: 350, percentage: 28 },
  { range: '12-14', count: 400, percentage: 32 },
  { range: '10-12', count: 250, percentage: 20 },
  { range: '< 10', count: 100, percentage: 8 }
];

export const mockProgramsSummary = [
  { name: 'Bachelor Informatique', students: 350, classes: 12 },
  { name: 'Bachelor Design', students: 280, classes: 10 },
  { name: 'Master Marketing', students: 120, classes: 4 },
  { name: 'Bachelor Commerce', students: 500, classes: 16 }
];
