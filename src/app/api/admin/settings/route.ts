import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, supabaseRequest } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!verifyAdminSession(request)) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  try {
    const rows = await supabaseRequest("/rest/v1/anavelle_settings?id=eq.store&select=data") as {data:Record<string,unknown>}[];
    return NextResponse.json({ settings: rows[0]?.data || {} }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Mağaza ayarları alınamadı." }, { status: 503 });
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminSession(request)) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  let body: { settings?: unknown };
  try { body = await request.json() as { settings?: unknown }; } catch { return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 }); }
  if (!body.settings || typeof body.settings !== "object" || Array.isArray(body.settings)) return NextResponse.json({ error: "Ayar verisi doğrulanamadı." }, { status: 400 });
  try {
    await supabaseRequest("/rest/v1/anavelle_settings?on_conflict=id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ id:"store", data:body.settings, updated_at:new Date().toISOString() }) });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Mağaza ayarları kaydedilemedi." }, { status: 503 });
  }
}
