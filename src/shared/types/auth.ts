// Mirrors the `user_role` Postgres enum in
// supabase/migrations/20240101_initial_schema.sql. Keep in sync.
export type UserRole = 'super_admin' | 'student' | 'teacher';
