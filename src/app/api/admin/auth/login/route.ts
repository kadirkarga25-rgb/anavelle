import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminConfiguration, constantTimeEqual, createAdminSession } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const config = adminConfiguration();
  if (!config.passwordConfigured || !config.sessionSecretConfigured) {
    return NextResponse.json({ error: "Admin girişi yapılandırılmamış. Netlify ortam değişkenlerine ANAVELLE_ADMIN_PASSWORD ve ANAVELLE_SESSION_SECRET eklenmeli." }, { status: 503 });
  }
  let body: { password?: string };
  try { body = await request.json() as { password?: string }; } catch { return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 }); }
  if (typeof body.password !== "string" || !constantTimeEqual(body.password, process.env.ANAVELLE_ADMIN_PASSWORD!)) {
    return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
  }
  const session = createAdminSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: session.maxAge
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
