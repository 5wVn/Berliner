// Dev hack: makes swan.dieu appear as both a student and a teacher so
// visiting /student/* and /teacher/* dashboards shows populated data
// while logged in as academic_head. Run AFTER seed-admin-establishment.mjs.
// Idempotent: wipes swan.dieu's impersonation data first, then re-inserts.

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync('.env','utf8').split(/\r?\n/).map(l=>l.trim())
    .filter(l=>l&&!l.startsWith('#')&&l.includes('='))
    .map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim()];}),
);

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const ESTAB = '5a49c1aa-36bd-445f-9915-e02e4109db25';
const die = (label, err) => { if (err) { console.error(`[${label}] ${err.message}`); process.exit(1); } };

// -----------------------------------------------------------------------
// 0) Fetch swan.dieu's profile
// -----------------------------------------------------------------------
const { data: admin, error: adminErr } = await sb.from('profiles')
  .select('id').eq('email', env.ADMIN_EMAIL).single();
die('lookup admin', adminErr);
const ADMIN_ID = admin.id;
console.log('Admin id:', ADMIN_ID);

// -----------------------------------------------------------------------
// 1) Purge any previous impersonation data for swan.dieu
// -----------------------------------------------------------------------
await sb.from('grades').delete().eq('student_id', ADMIN_ID);
await sb.from('attendance_records').delete().eq('student_id', ADMIN_ID);
await sb.from('enrollments').delete().eq('student_id', ADMIN_ID);
await sb.from('student_records').delete().eq('student_id', ADMIN_ID);
console.log('purged prior student impersonation data');

// -----------------------------------------------------------------------
// 2) Enroll swan.dieu in BTS SIO — Année 1 (has richest data)
// -----------------------------------------------------------------------
const { data: classes, error: cErr } = await sb.from('classes')
  .select('id, name').eq('establishment_id', ESTAB).order('name');
die('classes', cErr);
const btsA1 = classes.find((c) => c.name.includes('BTS SIO — Année 1'));
if (!btsA1) { console.error('Class not found'); process.exit(1); }

const { error: enErr } = await sb.from('enrollments').insert({
  establishment_id: ESTAB, student_id: ADMIN_ID, class_id: btsA1.id,
  status: 'active', start_date: '2025-09-01',
});
die('enrollment', enErr);

const { error: srErr } = await sb.from('student_records').insert({
  establishment_id: ESTAB, student_id: ADMIN_ID, student_number: 'ADMIN-001',
  admission_date: '2025-09-01', birth_date: '1995-01-01',
});
die('student_record', srErr);
console.log('enrolled swan.dieu in', btsA1.name);

// -----------------------------------------------------------------------
// 3) Generate grades for swan.dieu across all evaluations of that class
// -----------------------------------------------------------------------
const { data: cs } = await sb.from('class_subjects')
  .select('id').eq('establishment_id', ESTAB).eq('class_id', btsA1.id);
const csIds = cs.map((r) => r.id);
const { data: evals } = await sb.from('evaluations')
  .select('id').in('class_subject_id', csIds);

const gradeRows = evals.map((ev, i) => ({
  establishment_id: ESTAB, evaluation_id: ev.id, student_id: ADMIN_ID,
  score: 12 + ((i * 3) % 7) + 0.5, max_score: 20,
}));
const { error: gErr } = await sb.from('grades').insert(gradeRows);
die('grades', gErr);
console.log(`grades for swan.dieu: ${gradeRows.length}`);

// -----------------------------------------------------------------------
// 4) Attendance records for swan.dieu on past sessions of that class
// -----------------------------------------------------------------------
const { data: pastSessions } = await sb.from('sessions')
  .select('id, start_time').in('class_subject_id', csIds)
  .lt('start_time', '2026-04-20T00:00:00Z');

const statuses = ['present','present','present','present','late','present','excused','present','present','absent'];
const attRows = pastSessions.map((s, i) => ({
  establishment_id: ESTAB, session_id: s.id, student_id: ADMIN_ID,
  status: statuses[i % statuses.length],
  created_at: s.start_time, updated_at: s.start_time,
}));
const { error: aErr } = await sb.from('attendance_records').insert(attRows);
die('attendance', aErr);
console.log(`attendance for swan.dieu: ${attRows.length}`);

// -----------------------------------------------------------------------
// 5) Make swan.dieu the teacher of 3 class_subjects (to populate /teacher)
//    Pick: Bachelor Dev — Année 1, all subjects that current teacher != Julien
// -----------------------------------------------------------------------
const bachA1 = classes.find((c) => c.name.includes('Bachelor Dev — Année 1'));
const { data: bachCs } = await sb.from('class_subjects')
  .select('id, subject_id').eq('class_id', bachA1.id);

// Take first 3 subjects of bachelor A1 → reassign to swan.dieu
const targetIds = bachCs.slice(0, 3).map((r) => r.id);
const { error: uErr } = await sb.from('class_subjects')
  .update({ teacher_id: ADMIN_ID }).in('id', targetIds);
die('reassign teacher', uErr);
console.log(`swan.dieu teaches ${targetIds.length} class_subjects in ${bachA1.name}`);

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
const { count: enrollments } = await sb.from('enrollments').select('*',{count:'exact',head:true}).eq('student_id', ADMIN_ID);
const { count: grades    } = await sb.from('grades').select('*',{count:'exact',head:true}).eq('student_id', ADMIN_ID);
const { count: attendance} = await sb.from('attendance_records').select('*',{count:'exact',head:true}).eq('student_id', ADMIN_ID);
const { count: teaching  } = await sb.from('class_subjects').select('*',{count:'exact',head:true}).eq('teacher_id', ADMIN_ID);

console.log('\n=== swan.dieu impersonation data ===');
console.log('  enrollments     :', enrollments);
console.log('  grades          :', grades);
console.log('  attendance      :', attendance);
console.log('  class_subjects  :', teaching, '(as teacher)');
console.log('\nNow /student/* and /teacher/* should show populated data when logged in as swan.dieu.');
