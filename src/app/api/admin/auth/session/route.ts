import { NextRequest, NextResponse } from "next/server";
import { adminConfiguration, verifyAdminSession } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const config = adminConfiguration();
  return NextResponse.json({
    authenticated: verifyAdminSession(request),
    configured: config.passwordConfigured && config.sessionSecretConfigured,
    databaseConfigured: config.databaseConfigured,
    mediaConfigured: config.mediaConfigured
  }, { headers: { "Cache-Control": "no-store" } });
}
