import type { NextRequest } from "next/server";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import {
  anonymousSessionCookie,
  matchesAnonymousSessionToken,
} from "@/lib/security/anonymous-session";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(anonymousSessionCookie)?.value;
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const { cueId } = await request.json();
    if (!/^MEMORY_0[123]$/.test(cueId))
      return Response.json({ error: "Invalid cue" }, { status: 400 });
    const db = createSupabaseSecretClient();
    const { data: session } = await db
      .from("quiz_sessions")
      .select("access_token_hash,status,expires_at,memory_exposures")
      .eq("id", id)
      .single();
    if (
      !session ||
      !matchesAnonymousSessionToken(token, session.access_token_hash) ||
      !["CREATED", "IN_PROGRESS"].includes(session.status) ||
      new Date(session.expires_at) <= new Date()
    ) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { data: assigned } = await db
      .from("quiz_session_questions")
      .select("questions!inner(stable_key)")
      .eq("session_id", id)
      .eq("questions.stable_key", cueId);
    if (!assigned?.length) return Response.json({ error: "Unassigned exercise" }, { status: 400 });
    const memorySeen = [...new Set([...(session.memory_exposures ?? []), cueId])];
    const { error } = await db
      .from("quiz_sessions")
      .update({ memory_exposures: memorySeen })
      .eq("id", id);
    if (error) throw error;
    return Response.json({ memorySeen }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Unable to save memory step" }, { status: 400 });
  }
}
