#!/usr/bin/env node
// Passe un compte existant à un rôle donné (par défaut: teacher).
// Lit la clé service depuis .env — rien de sensible en ligne de commande.
//   node scripts/set-role.mjs                  -> ADMIN_EMAIL en teacher
//   node scripts/set-role.mjs autre@mail.fr student
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Manque NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY dans .env");
  process.exit(1);
}

const email = (process.argv[2] || process.env.ADMIN_EMAIL || "").toLowerCase();
const role = process.argv[3] || "teacher";

if (!email) {
  console.error("Aucun email fourni (argument 1 ou ADMIN_EMAIL).");
  process.exit(1);
}
if (!["student", "teacher", "super_admin"].includes(role)) {
  console.error(`Rôle invalide: ${role} (attendu: student | teacher | super_admin)`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserId(targetEmail) {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw new Error(`Lecture des utilisateurs impossible: ${error.message}`);
  return data?.users?.find((u) => u.email?.toLowerCase() === targetEmail)?.id || null;
}

async function main() {
  const userId = await findUserId(email);
  if (!userId) {
    console.error(`Aucun utilisateur auth pour ${email}. Lance d'abord: npm run create-admin`);
    process.exit(1);
  }

  // Le profil existe-t-il déjà ?
  const { data: existing, error: readErr } = await supabase
    .from("profiles")
    .select("id, establishment_id, email, role, first_name, last_name")
    .eq("id", userId)
    .maybeSingle();
  if (readErr) throw new Error(`Lecture du profil impossible: ${readErr.message}`);

  if (existing) {
    const { error: updErr } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId);
    if (updErr) throw new Error(`Mise à jour du rôle impossible: ${updErr.message}`);
    console.log(`OK — ${email} : ${existing.role} -> ${role}`);
    return;
  }

  // Pas de profil : on en crée un (il faut un établissement).
  const slug = process.env.ADMIN_ESTABLISHMENT_SLUG || "principal";
  const { data: est, error: estErr } = await supabase
    .from("establishments")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (estErr) throw new Error(`Lecture établissement impossible: ${estErr.message}`);

  let establishmentId = est?.id;
  if (!establishmentId) {
    const { data: created, error: cErr } = await supabase
      .from("establishments")
      .insert({
        name: process.env.ADMIN_ESTABLISHMENT_NAME || "Etablissement Principal",
        slug,
        type: "campus",
      })
      .select("id")
      .single();
    if (cErr) throw new Error(`Création établissement impossible: ${cErr.message}`);
    establishmentId = created.id;
  }

  const { error: insErr } = await supabase.from("profiles").insert({
    id: userId,
    establishment_id: establishmentId,
    email,
    role,
    first_name: process.env.ADMIN_FIRST_NAME || "Swan",
    last_name: process.env.ADMIN_LAST_NAME || "Dieu",
  });
  if (insErr) throw new Error(`Création du profil impossible: ${insErr.message}`);
  console.log(`OK — profil créé pour ${email} en rôle ${role}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
