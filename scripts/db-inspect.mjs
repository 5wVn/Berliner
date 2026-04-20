import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const tables = [
  'establishments',
  'profiles',
  'programs',
  'classes',
  'subjects',
  'class_subjects',
  'sessions',
  'enrollments',
  'evaluations',
  'grades',
  'attendance_records',
  'documents',
  'student_records',
];

console.log('=== Row counts ===');
for (const t of tables) {
  const { count, error } = await sb.from(t).select('*', { count: 'exact', head: true });
  console.log(`${t.padEnd(22)} ${error ? 'ERR: ' + error.message : count}`);
}

console.log('\n=== establishments ===');
const { data: es } = await sb.from('establishments').select('*').order('name');
console.log(es);

console.log('\n=== admin profile (' + env.ADMIN_EMAIL + ') ===');
const { data: p } = await sb
  .from('profiles')
  .select('id, email, role, first_name, last_name, establishment_id, establishments(name, slug)')
  .eq('email', env.ADMIN_EMAIL);
console.log(p);

console.log('\n=== auth user (admin API) ===');
const { data: users, error: uerr } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 });
if (uerr) console.log('ERR:', uerr.message);
else {
  const adminUser = users.users.find((u) => u.email === env.ADMIN_EMAIL);
  console.log('total users:', users.users.length, '\nadmin found:', !!adminUser);
  if (adminUser)
    console.log({ id: adminUser.id, email: adminUser.email, confirmed_at: adminUser.email_confirmed_at });
}

console.log('\n=== profiles per role ===');
const { data: roles } = await sb.from('profiles').select('role');
const byRole = (roles ?? []).reduce((acc, r) => ((acc[r.role] = (acc[r.role] || 0) + 1), acc), {});
console.log(byRole);
