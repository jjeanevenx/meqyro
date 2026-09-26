import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getCronSecret } from "@/lib/config/env";
import { runFullReconciliationSuite } from "@/features/commerce/reconciliation-service";

export const dynamic = "force-dynamic";

function authenticateCronRequest(req: NextRequest): boolean {
  let cronSecret: string | undefined;
  try {
    cronSecret = getCronSecret();
  } catch {
    return false;
  }

  if (!cronSecret || cronSecret.length < 16) {
    return false;
  }

  let candidate = req.headers.get("x-cron-secret");
  if (!candidate) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      candidate = authHeader.slice(7).trim();
    }
  }

  if (!candidate) return false;

  const candBuf = Buffer.from(candidate);
  const secBuf = Buffer.from(cronSecret);

  if (candBuf.length !== secBuf.length || !timingSafeEqual(candBuf, secBuf)) {
    return false;
  }

  return true;
}

export async function POST(req: NextRequest) {
  if (!authenticateCronRequest(req)) {
    return NextResponse.json({ error: "Unauthorized cron request." }, { status: 401 });
  }

  const report = await runFullReconciliationSuite("cron_api_post");
  return NextResponse.json(report, { status: report.success ? 200 : 500 });
}

export async function GET(req: NextRequest) {
  if (!authenticateCronRequest(req)) {
    return NextResponse.json({ error: "Unauthorized cron request." }, { status: 401 });
  }

  const report = await runFullReconciliationSuite("cron_api_get");
  return NextResponse.json(report, { status: report.success ? 200 : 500 });
}
