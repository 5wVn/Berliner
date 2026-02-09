export const mockSessions = [
  {
    id: '1',
    start_time: '2026-02-10T08:00:00',
    end_time: '2026-02-10T10:00:00',
    subject_name: 'Mathématiques',
    teacher_name: 'M. Dubois',
    location: 'Salle A101'
  },
  {
    id: '2',
    start_time: '2026-02-10T10:15:00',
    end_time: '2026-02-10T12:15:00',
    subject_name: 'Physique-Chimie',
    teacher_name: 'Mme. Laurent',
    location: 'Labo 3'
  },
  {
    id: '3',
    start_time: '2026-02-11T14:00:00',
    end_time: '2026-02-11T16:00:00',
    subject_name: 'Anglais',
    teacher_name: 'Mrs. Smith',
    location: 'Salle B204'
  }
];

export const mockGrades = [
  { subjectName: 'Mathématiques', average: 14.5, count: 5 },
  { subjectName: 'Français', average: 16.0, count: 4 },
  { subjectName: 'Histoire', average: 13.2, count: 3 }
];

export const mockAttendance = {
  rate: 92,
  total: 45,
  present: 41
};
