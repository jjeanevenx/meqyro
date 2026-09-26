import "server-only";

import { z } from "zod";
import { getPublicSupabaseEnv } from "./env";

const serverSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(20),
});

export function getServerSupabaseEnv() {
  return {
    ...getPublicSupabaseEnv(),
    ...serverSchema.parse({ SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY }),
  };
}
