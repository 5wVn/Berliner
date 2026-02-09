export const mockPendingEnrollments = [
  {
    id: '1',
    student_name: 'Alice Martin',
    program: 'B1 Informatique',
    request_date: '2026-02-08T10:00:00',
  },
  {
    id: '2',
    student_name: 'Bob Dupont',
    program: 'B2 Design',
    request_date: '2026-02-09T09:30:00',
  },
  {
    id: '3',
    student_name: 'Charlie Durand',
    program: 'M1 Marketing',
    request_date: '2026-02-09T14:15:00',
  }
];

export const mockDocumentRequests = [
  {
    id: '1',
    student_name: 'Thomas Anderson',
    document_type: 'Certificat de scolarité',
    request_date: '2026-02-08T11:00:00',
    status: 'pending'
  },
  {
    id: '2',
    student_name: 'Sophie Marceau',
    document_type: 'Relevé de notes',
    request_date: '2026-02-08T16:00:00',
    status: 'processing'
  },
  {
    id: '3',
    student_name: 'Jean Reno',
    document_type: 'Convention de stage',
    request_date: '2026-02-09T10:30:00',
    status: 'pending'
  }
];

export const mockAttendanceAlerts = [
  {
    id: '1',
    student_name: 'Kevin Smith',
    attendance_rate: 65,
    class_name: 'B1 Informatique'
  },
  {
    id: '2',
    student_name: 'Emma Watson',
    attendance_rate: 72,
    class_name: 'B2 Design'
  },
  {
    id: '3',
    student_name: 'John Doe',
    attendance_rate: 70,
    class_name: 'B3 Commerce'
  }
];

export const mockStats = {
  total_students: 450,
  new_enrollments_month: 23,
  global_attendance_rate: 92,
  pending_requests: 12
};
