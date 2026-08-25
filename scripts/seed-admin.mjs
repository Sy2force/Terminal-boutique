/**
 * One-time admin bootstrap for Terminal 3.
 *
 * Usage:
 *   ADMIN_EMAIL=admin@terminal3.co.il ADMIN_PASSWORD=Bluelabel21 \
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-admin.mjs
 *
 * Security:
 * - The password is read from the ADMIN_PASSWORD environment variable.
 * - It is NEVER stored in the source code.
 * - Change this password after first login and enable 2FA if available.
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL || "admin@terminal3.co.il";
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (!password) {
  console.error("Missing ADMIN_PASSWORD");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: existing } = await supabase
  .from("user_roles")
  .select("user_id")
  .eq("role", "admin")
  .limit(1)
  .single();

if (existing) {
  console.log("Admin role already exists.", existing.user_id);
  process.exit(0);
}

const { data: user, error: createError } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (createError) {
  console.error("Failed to create admin user:", createError.message);
  process.exit(1);
}

const { error: roleError } = await supabase
  .from("user_roles")
  .insert({ user_id: user.user.id, role: "admin" });

if (roleError) {
  console.error("Failed to assign admin role:", roleError.message);
  process.exit(1);
}

console.log(`Admin created: ${email} / ${user.user.id}`);
console.log("IMPORTANT: change this password after first login and enable 2FA.");
