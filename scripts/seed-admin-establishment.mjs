// Seeds the admin's establishment (Etablissement Principal) with teachers,
// students, classes, subjects, sessions, grades, attendance, pending
// enrollments and companies. Idempotent: wipes & re-seeds on every run.
// Admin profile is preserved.

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const ESTAB = '5a49c1aa-36bd-445f-9915-e02e4109db25';
const ADMIN_EMAIL = env.ADMIN_EMAIL;
const PASSWORD = 'berliner2024';

const die = (label, err) => { if (err) { console.error(`[${label}] ${err.message}`); process.exit(1); } };

// ------------------------------------------------------------------
// 1) Lookup admin profile (preserved) and list existing profiles
// ------------------------------------------------------------------
const { data: adminProfile, error: adminErr } = await sb
  .from('profiles').select('id').eq('email', ADMIN_EMAIL).single();
die('lookup admin', adminErr);
const ADMIN_ID = adminProfile.id;
console.log('Admin:', ADMIN_ID);

const { data: existingProfiles, error: listErr } = await sb
  .from('profiles').select('id,email').eq('establishment_id', ESTAB);
die('list profiles', listErr);

// ------------------------------------------------------------------
// 2) Wipe dependent data (FK order matters). Service role bypasses RLS.
// ------------------------------------------------------------------
const purgeOrder = [
  'grades','attendance_records','evaluations','sessions','class_subjects',
  'enrollments','student_records','documents','subjects','classes','programs',
];
for (const t of purgeOrder) {
  const { error } = await sb.from(t).delete().eq('establishment_id', ESTAB);
  die(`purge ${t}`, error);
}
console.log('purged all dependent tables');

const toDelete = existingProfiles.filter((p) => p.id !== ADMIN_ID);
if (toDelete.length) {
  const { error } = await sb.from('profiles').delete()
    .eq('establishment_id', ESTAB).in('id', toDelete.map((p) => p.id));
  die('purge profiles', error);
  for (const p of toDelete) {
    const { error: dErr } = await sb.auth.admin.deleteUser(p.id);
    if (dErr && !/not.*found/i.test(dErr.message)) console.warn(`  del auth ${p.email}: ${dErr.message}`);
  }
  console.log(`purged ${toDelete.length} profiles (+ auth users)`);
}

// ------------------------------------------------------------------
// 3) Users + profiles
// ------------------------------------------------------------------
async function makeUser(email, role, first, last) {
  const { data, error } = await sb.auth.admin.createUser({
    email, password: PASSWORD, email_confirm: true,
    user_metadata: { first_name: first, last_name: last, role },
  });
  die(`createUser ${email}`, error);
  const { error: pErr } = await sb.from('profiles').insert({
    id: data.user.id, establishment_id: ESTAB, email, role,
    first_name: first, last_name: last,
  });
  die(`insert profile ${email}`, pErr);
  return data.user.id;
}

console.log('\nCreating users...');
const registrarId = await makeUser('scolarite@berliner-principal.test', 'registrar', 'Hélène', 'Bernard');

const companies = [
  { email: 'contact@acme-tech.test',    first: 'ACME',       last: 'Tech'     },
  { email: 'rh@startup-lab.test',       first: 'Startup',    last: 'Lab'      },
];
for (const c of companies) c.id = await makeUser(c.email, 'company', c.first, c.last);

const teachers = [
  { email: 'm.laurent@berliner-principal.test',  first: 'Marie',  last: 'Laurent'  },
  { email: 'p.dubois@berliner-principal.test',   first: 'Paul',   last: 'Dubois'   },
  { email: 'c.martin@berliner-principal.test',   first: 'Claire', last: 'Martin'   },
  { email: 'j.rousseau@berliner-principal.test', first: 'Julien', last: 'Rousseau' },
];
for (const t of teachers) t.id = await makeUser(t.email, 'teacher', t.first, t.last);

const students = [
  { email: 'a.petit@berliner-principal.test',    first: 'Alice',    last: 'Petit',    birth: '2004-03-12' },
  { email: 'b.moreau@berliner-principal.test',   first: 'Baptiste', last: 'Moreau',   birth: '2003-07-21' },
  { email: 'c.garnier@berliner-principal.test',  first: 'Chloé',    last: 'Garnier',  birth: '2004-01-05' },
  { email: 'd.lefevre@berliner-principal.test',  first: 'David',    last: 'Lefèvre',  birth: '2003-09-19' },
  { email: 'e.noir@berliner-principal.test',     first: 'Emma',     last: 'Noir',     birth: '2004-05-30' },
  { email: 'f.blanc@berliner-principal.test',    first: 'Florian',  last: 'Blanc',    birth: '2003-11-02' },
  { email: 'g.chen@berliner-principal.test',     first: 'Grace',    last: 'Chen',     birth: '2002-02-14' },
  { email: 'h.dubreuil@berliner-principal.test', first: 'Hugo',     last: 'Dubreuil', birth: '2002-08-08' },
  { email: 'i.roche@berliner-principal.test',    first: 'Inès',     last: 'Roche',    birth: '2001-04-17' },
  { email: 'j.dupont@berliner-principal.test',   first: 'Jules',    last: 'Dupont',   birth: '2001-12-23' },
  { email: 'k.ngo@berliner-principal.test',      first: 'Kim',      last: 'Ngo',      birth: '2001-06-11' },
  { email: 'l.silva@berliner-principal.test',    first: 'Lea',      last: 'Silva',    birth: '2002-10-28' },
];
for (const s of students) s.id = await makeUser(s.email, 'student', s.first, s.last);

// 3 candidates with pending enrollments (not enrolled yet)
const pendingStudents = [
  { email: 'm.candidat@berliner-principal.test', first: 'Marc',     last: 'Candidat', birth: '2005-02-10' },
  { email: 'n.attente@berliner-principal.test',  first: 'Nina',     last: 'Attente',  birth: '2005-06-24' },
  { email: 'o.postule@berliner-principal.test',  first: 'Omar',     last: 'Postule',  birth: '2005-11-09' },
];
for (const s of pendingStudents) s.id = await makeUser(s.email, 'student', s.first, s.last);

console.log(`✓ ${companies.length} companies, ${teachers.length} teachers, ${students.length + pendingStudents.length} students (${pendingStudents.length} pending)`);

// ------------------------------------------------------------------
// 4) Programs, classes, subjects
// ------------------------------------------------------------------
const { data: progs, error: progErr } = await sb.from('programs').insert([
  { establishment_id: ESTAB, name: 'BTS Services Informatiques aux Organisations', code: 'BTS-SIO', level: 'BTS', duration_years: 2 },
  { establishment_id: ESTAB, name: 'Bachelor Développement Web',                  code: 'BACH-DEV', level: 'Bachelor', duration_years: 3 },
]).select();
die('programs', progErr);
const [bts, bach] = progs;

const { data: classes, error: cErr } = await sb.from('classes').insert([
  { establishment_id: ESTAB, program_id: bts.id,  name: 'BTS SIO — Année 1',      academic_year: '2025-2026' },
  { establishment_id: ESTAB, program_id: bts.id,  name: 'BTS SIO — Année 2',      academic_year: '2025-2026' },
  { establishment_id: ESTAB, program_id: bach.id, name: 'Bachelor Dev — Année 1', academic_year: '2025-2026' },
  { establishment_id: ESTAB, program_id: bach.id, name: 'Bachelor Dev — Année 2', academic_year: '2025-2026' },
]).select();
die('classes', cErr);
const [btsA1, btsA2, bachA1, bachA2] = classes;

const btsSubjects = [
  { name: 'Développement Web',     code: 'SIO-DEV', credits: 6 },
  { name: 'Réseaux & Systèmes',    code: 'SIO-NET', credits: 5 },
  { name: 'Mathématiques',         code: 'SIO-MAT', credits: 3 },
  { name: 'Anglais Professionnel', code: 'SIO-ENG', credits: 2 },
  { name: 'Culture Générale',      code: 'SIO-CUL', credits: 2 },
];
const bachSubjects = [
  { name: 'Frontend avancé',   code: 'BACH-FE', credits: 6 },
  { name: 'Backend Node',      code: 'BACH-BE', credits: 6 },
  { name: 'Bases de données',  code: 'BACH-DB', credits: 5 },
  { name: 'Anglais Technique', code: 'BACH-EN', credits: 2 },
];
const { data: subjects, error: sErr } = await sb.from('subjects').insert([
  ...btsSubjects.map((s) => ({ ...s, establishment_id: ESTAB, program_id: bts.id  })),
  ...bachSubjects.map((s) => ({ ...s, establishment_id: ESTAB, program_id: bach.id })),
]).select();
die('subjects', sErr);

const btsSubs  = subjects.filter((s) => s.program_id === bts.id);
const bachSubs = subjects.filter((s) => s.program_id === bach.id);

// ------------------------------------------------------------------
// 5) Class-subject assignments
// ------------------------------------------------------------------
const [T1, T2, T3, T4] = teachers;
const csRows = [
  { class_id: btsA1.id, subject: btsSubs[0], teacher_id: T1.id },
  { class_id: btsA1.id, subject: btsSubs[1], teacher_id: T2.id },
  { class_id: btsA1.id, subject: btsSubs[2], teacher_id: T3.id },
  { class_id: btsA1.id, subject: btsSubs[3], teacher_id: T4.id },
  { class_id: btsA1.id, subject: btsSubs[4], teacher_id: T3.id },
  { class_id: btsA2.id, subject: btsSubs[0], teacher_id: T1.id },
  { class_id: btsA2.id, subject: btsSubs[1], teacher_id: T2.id },
  { class_id: btsA2.id, subject: btsSubs[2], teacher_id: T3.id },
  { class_id: btsA2.id, subject: btsSubs[3], teacher_id: T4.id },
  { class_id: btsA2.id, subject: btsSubs[4], teacher_id: T3.id },
  { class_id: bachA1.id, subject: bachSubs[0], teacher_id: T1.id },
  { class_id: bachA1.id, subject: bachSubs[1], teacher_id: T2.id },
  { class_id: bachA1.id, subject: bachSubs[2], teacher_id: T2.id },
  { class_id: bachA1.id, subject: bachSubs[3], teacher_id: T4.id },
  { class_id: bachA2.id, subject: bachSubs[0], teacher_id: T1.id },
  { class_id: bachA2.id, subject: bachSubs[1], teacher_id: T2.id },
  { class_id: bachA2.id, subject: bachSubs[2], teacher_id: T2.id },
  { class_id: bachA2.id, subject: bachSubs[3], teacher_id: T4.id },
];

const { data: classSubjects, error: csErr } = await sb.from('class_subjects').insert(
  csRows.map((r) => ({
    establishment_id: ESTAB, class_id: r.class_id, subject_id: r.subject.id, teacher_id: r.teacher_id,
  }))
).select();
die('class_subjects', csErr);

// ------------------------------------------------------------------
// 6) Enrollments (active) + pending applications + student records
// ------------------------------------------------------------------
const enroll = [
  ...[0,1,2,3].map((i) => ({ student_id: students[i].id, class_id: btsA1.id,  number: `SIO-A1-${100+i}` })),
  ...[4,5,6].map((i)   => ({ student_id: students[i].id, class_id: btsA2.id,  number: `SIO-A2-${200+i}` })),
  ...[7,8,9].map((i)   => ({ student_id: students[i].id, class_id: bachA1.id, number: `BD-A1-${300+i}`  })),
  ...[10,11].map((i)   => ({ student_id: students[i].id, class_id: bachA2.id, number: `BD-A2-${400+i}`  })),
];

const { error: enErr } = await sb.from('enrollments').insert(
  enroll.map((e) => ({
    establishment_id: ESTAB, student_id: e.student_id, class_id: e.class_id,
    status: 'active', start_date: '2025-09-01',
  }))
);
die('enrollments', enErr);

// 3 pending enrollments from the candidates — staggered created_at for "recent"
const nowIso = new Date().toISOString();
const daysAgo = (n) => new Date(Date.now() - n * 24 * 3600 * 1000).toISOString();
const pendingRows = [
  { student_id: pendingStudents[0].id, class_id: btsA1.id,  created_at: daysAgo(1) },
  { student_id: pendingStudents[1].id, class_id: bachA1.id, created_at: daysAgo(3) },
  { student_id: pendingStudents[2].id, class_id: btsA2.id,  created_at: daysAgo(6) },
];
const { error: pendErr } = await sb.from('enrollments').insert(
  pendingRows.map((e) => ({
    establishment_id: ESTAB, student_id: e.student_id, class_id: e.class_id,
    status: 'pending', start_date: '2026-09-01', created_at: e.created_at, updated_at: e.created_at,
  }))
);
die('pending enrollments', pendErr);

const { error: srErr } = await sb.from('student_records').insert(
  enroll.map((e) => ({
    establishment_id: ESTAB, student_id: e.student_id, student_number: e.number,
    admission_date: '2025-09-01', birth_date: students.find((s) => s.id === e.student_id).birth,
  }))
);
die('student_records', srErr);

const studentsByClass = new Map();
for (const e of enroll) {
  if (!studentsByClass.has(e.class_id)) studentsByClass.set(e.class_id, []);
  studentsByClass.get(e.class_id).push(e.student_id);
}

// ------------------------------------------------------------------
// 7) Sessions across last ~2 months (for month-over-month trend)
//    Schedule per class_subject at a fixed weekday slot.
// ------------------------------------------------------------------
const iso = (y, m, d, hh, mm) => new Date(Date.UTC(y, m - 1, d, hh, mm)).toISOString();
const sessionRows = [];

// Dates: spans from 2026-02-23 to 2026-05-01 (today is 2026-04-20 Mon)
// Each class_subject gets 8 sessions spread across those weeks.
const weekStarts = [
  '2026-02-23','2026-03-02','2026-03-09','2026-03-16','2026-03-23','2026-03-30',
  '2026-04-06','2026-04-13','2026-04-20','2026-04-27',
];
classSubjects.forEach((cs, idx) => {
  const slotHours = [9, 11, 14, 16][idx % 4];
  const weekdayOffset = idx % 5; // 0=Mon,...,4=Fri
  weekStarts.forEach((ws) => {
    const [y, m, d] = ws.split('-').map(Number);
    const base = new Date(Date.UTC(y, m - 1, d));
    base.setUTCDate(base.getUTCDate() + weekdayOffset);
    sessionRows.push({
      establishment_id: ESTAB, class_subject_id: cs.id,
      start_time: new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), slotHours, 0)).toISOString(),
      end_time:   new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), slotHours + 1, 30)).toISOString(),
      location: `Salle ${100 + (idx % 10)}`,
    });
  });
});
const { data: sessionsInserted, error: sesErr } = await sb.from('sessions').insert(sessionRows).select();
die('sessions', sesErr);
console.log('sessions:', sessionsInserted.length);

// ------------------------------------------------------------------
// 8) Evaluations (2 per class_subject) + grades (mix of distributions)
// ------------------------------------------------------------------
const evalRows = [];
classSubjects.forEach((cs, idx) => {
  evalRows.push({
    establishment_id: ESTAB, class_subject_id: cs.id,
    name: 'Contrôle continu 1', type: 'quiz', coefficient: 1, date: '2026-03-10',
  });
  evalRows.push({
    establishment_id: ESTAB, class_subject_id: cs.id,
    name: ['DS 1','Projet','Partiel','Oral'][idx % 4],
    type: ['written','project','exam','oral'][idx % 4],
    coefficient: [2, 2, 3, 1][idx % 4],
    date: ['2026-04-02','2026-04-08','2026-04-14','2026-04-17'][idx % 4],
  });
});
const { data: evaluations, error: eErr } = await sb.from('evaluations').insert(evalRows).select();
die('evaluations', eErr);

// Seeded pseudo-random scoring for varied but stable distribution
const pseudo = (a, b, c) => {
  const h = (a.charCodeAt(0) + b.charCodeAt(0) * 3 + c * 7 + a.charCodeAt(5)) % 100;
  // Biased: 5% <10, 20% 10-12, 35% 12-14, 30% 14-16, 10% >=16
  if (h < 5)  return 7 + (h % 3);           // 7..9
  if (h < 25) return 10 + (h % 2);          // 10..11
  if (h < 60) return 12 + (h % 2) + 0.5;    // 12.5..13.5
  if (h < 90) return 14 + (h % 2) + 0.5;    // 14.5..15.5
  return 16 + (h % 3);                      // 16..18
};

const gradeRows = [];
for (const ev of evaluations) {
  const cs = classSubjects.find((c) => c.id === ev.class_subject_id);
  const studentsInClass = studentsByClass.get(cs.class_id) ?? [];
  for (let i = 0; i < studentsInClass.length; i++) {
    gradeRows.push({
      establishment_id: ESTAB, evaluation_id: ev.id, student_id: studentsInClass[i],
      score: pseudo(ev.id, studentsInClass[i], i), max_score: 20,
    });
  }
}
const { error: gErr } = await sb.from('grades').insert(gradeRows);
die('grades', gErr);
console.log('grades:', gradeRows.length);

// ------------------------------------------------------------------
// 9) Attendance records
//    For every past session, assign a status per enrolled student and
//    explicitly set created_at so the month-over-month trend has data.
//    Struggling students (indexes 3 and 7) get more absences → trigger
//    the registrar's <75% attendance alert.
// ------------------------------------------------------------------
const strugglingIds = new Set([students[3].id, students[7].id]);
const pastSessions = sessionsInserted.filter((s) => new Date(s.start_time) < new Date('2026-04-20T00:00:00Z'));

const statusFor = (studentId, sessionId, i) => {
  const h = (studentId.charCodeAt(0) + sessionId.charCodeAt(0) + i) % 100;
  if (strugglingIds.has(studentId)) {
    if (h < 40) return 'absent';
    if (h < 55) return 'late';
    if (h < 65) return 'excused';
    return 'present';
  }
  if (h < 6)  return 'absent';
  if (h < 14) return 'late';
  if (h < 18) return 'excused';
  if (h < 21) return 'pending_justification';
  return 'present';
};

const attendanceRows = [];
for (const ses of pastSessions) {
  const cs = classSubjects.find((c) => c.id === ses.class_subject_id);
  const studentsInClass = studentsByClass.get(cs.class_id) ?? [];
  // Use the session's start_time day as created_at so month-over-month works
  const createdAt = ses.start_time;
  for (let i = 0; i < studentsInClass.length; i++) {
    attendanceRows.push({
      establishment_id: ESTAB, session_id: ses.id, student_id: studentsInClass[i],
      status: statusFor(studentsInClass[i], ses.id, i),
      created_at: createdAt, updated_at: createdAt,
    });
  }
}
// Split insert into chunks (PostgREST has a payload size limit)
const chunkSize = 500;
for (let i = 0; i < attendanceRows.length; i += chunkSize) {
  const { error: aErr } = await sb.from('attendance_records').insert(attendanceRows.slice(i, i + chunkSize));
  die(`attendance chunk ${i}`, aErr);
}
console.log('attendance_records:', attendanceRows.length);

// ------------------------------------------------------------------
// 10) Documents — various types & owners
// ------------------------------------------------------------------
const docs = [
  { owner_id: students[0].id,   type: 'transcript',    title: 'Bulletin S1 - Alice Petit',           file_url: 'https://example.test/docs/bulletin-alice.pdf' },
  { owner_id: students[4].id,   type: 'transcript',    title: 'Bulletin S1 - Emma Noir',             file_url: 'https://example.test/docs/bulletin-emma.pdf' },
  { owner_id: students[7].id,   type: 'certificate',   title: 'Certificat de scolarité - Hugo Dubreuil', file_url: 'https://example.test/docs/cert-hugo.pdf' },
  { owner_id: students[9].id,   type: 'certificate',   title: 'Certificat de scolarité - Jules Dupont',  file_url: 'https://example.test/docs/cert-jules.pdf' },
  { owner_id: students[11].id,  type: 'internship',    title: 'Convention de stage - Lea Silva',         file_url: 'https://example.test/docs/stage-lea.pdf' },
  { owner_id: ADMIN_ID,         type: 'report',        title: 'Rapport pédagogique T1',                  file_url: 'https://example.test/docs/rapport-t1.pdf' },
  { owner_id: ADMIN_ID,         type: 'report',        title: 'Bilan absentéisme mars 2026',             file_url: 'https://example.test/docs/bilan-mars.pdf' },
  { owner_id: registrarId,      type: 'report',        title: 'Suivi assiduité avril 2026',              file_url: 'https://example.test/docs/assiduite-avril.pdf' },
  { owner_id: companies[0].id,  type: 'contract',      title: 'Contrat de partenariat ACME Tech',        file_url: 'https://example.test/docs/contract-acme.pdf' },
  { owner_id: companies[1].id,  type: 'contract',      title: 'Contrat d\'apprentissage Startup Lab',    file_url: 'https://example.test/docs/contract-startup.pdf' },
];
const { error: dErr } = await sb.from('documents').insert(
  docs.map((d) => ({ establishment_id: ESTAB, ...d }))
);
die('documents', dErr);

// ------------------------------------------------------------------
// Summary
// ------------------------------------------------------------------
console.log('\n=== SEED COMPLETE ===');
const counts = ['profiles','programs','classes','subjects','class_subjects','sessions','enrollments','evaluations','grades','attendance_records','documents','student_records'];
for (const t of counts) {
  const { count } = await sb.from(t).select('*', { count: 'exact', head: true }).eq('establishment_id', ESTAB);
  console.log(`  ${t.padEnd(22)} ${count}`);
}
console.log(`\nAll test accounts — password: ${PASSWORD}`);
console.log('  academic_head : swan.dieu@gmail.com (password: see .env)');
console.log('  registrar     : scolarite@berliner-principal.test');
console.log('  teacher       : m.laurent@berliner-principal.test (+ 3 more)');
console.log('  student       : a.petit@berliner-principal.test (+ 11 more, +3 pending)');
console.log('  company       : contact@acme-tech.test, rh@startup-lab.test');
