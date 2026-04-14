#!/usr/bin/env node
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const allowDefaults = process.env.ALLOW_DEFAULT_ADMIN === "true";
const email = process.env.ADMIN_EMAIL || (allowDefaults ? "admin@example.com" : null);
const password = process.env.ADMIN_PASSWORD || (allowDefaults ? "admin" : null);
const role = process.env.ADMIN_ROLE || "academic_head";
const firstName = process.env.ADMIN_FIRST_NAME || "Swan";
const lastName = process.env.ADMIN_LAST_NAME || "Dieu";
const establishmentName =
  process.env.ADMIN_ESTABLISHMENT_NAME || "Etablissement Principal";
const establishmentSlug = process.env.ADMIN_ESTABLISHMENT_SLUG || "principal";

if (!email || !password) {
  console.error(
    "Missing ADMIN_EMAIL or ADMIN_PASSWORD. Set ALLOW_DEFAULT_ADMIN=true to use local defaults."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function ensureEstablishment() {
  const { data: existing, error: findError } = await supabase
    .from("establishments")
    .select("id")
    .eq("slug", establishmentSlug)
    .maybeSingle();

  if (findError) {
    throw new Error(`Failed to read establishments: ${findError.message}`);
  }

  if (existing?.id) return existing.id;

  const { data: created, error: createError } = await supabase
    .from("establishments")
    .insert({
      name: establishmentName,
      slug: establishmentSlug,
      type: "campus"
    })
    .select("id")
    .single();

  if (createError || !created?.id) {
    throw new Error(`Failed to create establishment: ${createError?.message}`);
  }

  return created.id;
}

async function findExistingUserId(targetEmail) {
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200
  });

  if (error) {
    throw new Error(`Failed to list users: ${error.message}`);
  }

  const match = data?.users?.find(
    (user) => user.email?.toLowerCase() === targetEmail.toLowerCase()
  );

  return match?.id || null;
}

async function main() {
  const establishmentId = await ensureEstablishment();

  let userId = null;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role,
      establishment_id: establishmentId,
      first_name: firstName,
      last_name: lastName
    }
  });

  if (error) {
    if (error.message?.toLowerCase().includes("already")) {
      userId = await findExistingUserId(email);
    } else {
      throw new Error(`Failed to create auth user: ${error.message}`);
    }
  } else {
    userId = data?.user?.id || null;
  }

  if (!userId) {
    throw new Error("Unable to resolve user id for admin account");
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      establishment_id: establishmentId,
      email,
      role,
      first_name: firstName,
      last_name: lastName
    },
    { onConflict: "id" }
  );

  if (profileError) {
    throw new Error(`Failed to upsert profile: ${profileError.message}`);
  }

  console.log(`Admin user ready: ${email} (${role})`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
