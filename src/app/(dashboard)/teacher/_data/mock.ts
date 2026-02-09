export const mockTodayClasses = [
  {
    id: '1',
    start_time: '2026-02-10T08:00:00',
    end_time: '2026-02-10T10:00:00',
    class_name: 'B1 Informatique',
    subject: 'Développement Web',
    student_count: 24,
    room: 'Salle 101'
  },
  {
    id: '2',
    start_time: '2026-02-10T14:00:00',
    end_time: '2026-02-10T16:00:00',
    class_name: 'B2 Design',
    subject: 'UX Design',
    student_count: 18,
    room: 'Salle 204'
  }
];

export const mockUpcomingSessions = [
  {
    id: '3',
    start_time: '2026-02-11T09:00:00',
    end_time: '2026-02-11T12:00:00',
    class_name: 'M1 Marketing',
    subject: 'Stratégie Digitale',
    room: 'Amphi B'
  },
  {
    id: '4',
    start_time: '2026-02-12T10:00:00',
    end_time: '2026-02-12T12:00:00',
    class_name: 'B1 Informatique',
    subject: 'Algorithmique',
    room: 'Salle 102'
  },
  {
    id: '5',
    start_time: '2026-02-13T14:00:00',
    end_time: '2026-02-13T16:00:00',
    class_name: 'B3 Commerce',
    subject: 'Négociation',
    room: 'Salle 305'
  }
];

export const mockClassesSummary = [
  { id: 'c1', name: 'B1 Informatique', student_count: 24 },
  { id: 'c2', name: 'B2 Design', student_count: 18 },
  { id: 'c3', name: 'M1 Marketing', student_count: 32 },
  { id: 'c4', name: 'B3 Commerce', student_count: 28 }
];

export const mockPendingAttendance = [
  {
    id: 'p1',
    date: '2026-02-08T14:00:00',
    class_name: 'B1 Informatique',
    subject: 'Développement Web'
  },
  {
    id: 'p2',
    date: '2026-02-09T10:00:00',
    class_name: 'B2 Design',
    subject: 'UX Design'
  }
];
