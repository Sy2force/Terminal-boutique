#!/usr/bin/env node
/**
 * Configure le bucket "media" sur Supabase Storage.
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/setup-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error("Failed to list buckets:", listError.message);
    process.exit(1);
  }

  if (!buckets.find((b) => b.name === "media")) {
    const { error } = await supabase.storage.createBucket("media", {
      public: true,
      allowedMimeTypes: ["image/*"],
      fileSizeLimit: 5242880, // 5 MB
    });
    if (error) {
      console.error("Failed to create bucket:", error.message);
      process.exit(1);
    }
    console.log('Bucket "media" created (public).');
  } else {
    console.log('Bucket "media" already exists.');
  }

  console.log("Supabase storage setup complete.");
}

main();
