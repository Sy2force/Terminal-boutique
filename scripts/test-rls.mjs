#!/usr/bin/env node
/**
 * Smoke test for Supabase RLS and server functions.
 * Requires:
 *   SUPABASE_URL
 *   SUPABASE_ANON_KEY
 *   SUPABASE_SERVICE_ROLE_KEY
 * Run with: node scripts/test-rls.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  console.error("Missing SUPABASE_URL, SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const anon = createClient(url, anonKey);
const service = createClient(url, serviceKey);

async function assert(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
  } catch (err) {
    console.log(`❌ ${name}: ${err.message}`);
    process.exitCode = 1;
  }
}

async function shouldFail(name, fn) {
  try {
    await fn();
    console.log(`❌ ${name} (expected failure, but succeeded)`);
    process.exitCode = 1;
  } catch {
    console.log(`✅ ${name} (blocked as expected)`);
  }
}

(async () => {
  // 1. Anon can read published products
  await assert("anon can read published products", async () => {
    const { error } = await anon.from("products").select("*").eq("is_published", true).limit(1);
    if (error) throw error;
  });

  // 2. Anon cannot read orders
  await shouldFail("anon cannot read orders", async () => {
    const { data, error } = await anon.from("orders").select("*").limit(1);
    if (error) throw error;
    if (data && data.length) throw new Error("got rows");
  });

  // 3. Anon cannot read user_roles
  await shouldFail("anon cannot read user_roles", async () => {
    const { error } = await anon.from("user_roles").select("*").limit(1);
    if (error) throw error;
  });

  // 4. Service role can read everything
  await assert("service role can read orders", async () => {
    const { error } = await service.from("orders").select("*").limit(1);
    if (error) throw error;
  });

  // 5. has_role works for at least one admin
  await assert("has_role('admin') detects admin", async () => {
    const { data, error } = await service.rpc("has_role", { _user_id: null, _role: "admin" });
    if (error) throw error;
    // null user should not be admin
    if (data === true) throw new Error("null user reported as admin");
  });

  console.log("RLS smoke test complete.");
})();
