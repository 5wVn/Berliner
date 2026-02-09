export const mockApprentices = [
  {
    id: '1',
    name: 'Thomas Anderson',
    program: 'B3 Développement Web',
    initials: 'TA',
  },
  {
    id: '2',
    name: 'Sarah Connor',
    program: 'M1 Cybersécurité',
    initials: 'SC',
  },
  {
    id: '3',
    name: 'Ellen Ripley',
    program: 'B2 Systèmes & Réseaux',
    initials: 'ER',
  }
];

export const mockApprenticesAttendance = {
  global_rate: 96,
  apprentices: [
    { id: '1', name: 'Thomas Anderson', rate: 98 },
    { id: '2', name: 'Sarah Connor', rate: 92 },
    { id: '3', name: 'Ellen Ripley', rate: 100 },
  ]
};

export const mockRecentGrades = [
  {
    id: '1',
    apprentice_name: 'Thomas Anderson',
    subject: 'React Avancé',
    grade: 16.5,
    date: '2026-02-05'
  },
  {
    id: '2',
    apprentice_name: 'Sarah Connor',
    subject: 'Pentesting',
    grade: 14.0,
    date: '2026-02-04'
  },
  {
    id: '3',
    apprentice_name: 'Ellen Ripley',
    subject: 'Administration Linux',
    grade: 18.0,
    date: '2026-02-06'
  }
];

export const mockDocuments = [
  {
    id: '1',
    type: 'Convention de stage',
    apprentice_name: 'Thomas Anderson',
    date: '2025-09-01'
  },
  {
    id: '2',
    type: 'Attestation de présence (Janvier)',
    apprentice_name: 'Sarah Connor',
    date: '2026-02-01'
  },
  {
    id: '3',
    type: 'Bulletin S1',
    apprentice_name: 'Ellen Ripley',
    date: '2026-01-15'
  }
];
