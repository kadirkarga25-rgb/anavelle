import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { verifyAdminSession } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!verifyAdminSession(request)) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Bulut fotoğraf deposu yapılandırılmamış." }, { status: 503 });
  const response = await fetch(url + "/storage/v1/object/list/anavelle-media", {
    method: "POST",
    headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify({ prefix: "", limit: 1000, offset: 0, sortBy: { column: "created_at", order: "desc" } }),
    cache: "no-store"
  });
  if (!response.ok) return NextResponse.json({ error: "Bulut medya listesi alınamadı." }, { status: 502 });
  const rows = await response.json() as {name:string;id?:string;created_at?:string;updated_at?:string;metadata?:{mimetype?:string;size?:number}}[];
  return NextResponse.json({ media: rows.filter(row=>row.name && row.name!=="").map(row=>({
    id: row.name, storageId: row.name, name: row.name, type: row.metadata?.mimetype || "image/*",
    size: row.metadata?.size || 0, createdAt: row.created_at || row.updated_at || new Date().toISOString(),
    url: url + "/storage/v1/object/public/anavelle-media/" + encodeURIComponent(row.name)
  })) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!verifyAdminSession(request)) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Bulut fotoğraf deposu yapılandırılmamış." }, { status: 503 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Fotoğraf dosyası gerekli." }, { status: 400 });
  if (!file.type.startsWith("image/") || file.size > 15 * 1024 * 1024) return NextResponse.json({ error: "Yalnızca görsel dosyaları, en fazla 15 MB yüklenebilir." }, { status: 400 });
  const ext = (file.name.split(".").pop() || "webp").toLowerCase().replace(/[^a-z0-9]/g,"") || "webp";
  const path = randomUUID() + "." + ext;
  const response = await fetch(url + "/storage/v1/object/anavelle-media/" + path, {
    method: "POST",
    headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": file.type, "x-upsert": "false" },
    body: await file.arrayBuffer()
  });
  if (!response.ok) return NextResponse.json({ error: "Fotoğraf buluta yüklenemedi: " + (await response.text()).slice(0,250) }, { status: 502 });
  return NextResponse.json({ id: path, name: file.name, size: file.size, type: file.type, publicUrl: url + "/storage/v1/object/public/anavelle-media/" + path });
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminSession(request)) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Bulut fotoğraf deposu yapılandırılmamış." }, { status: 503 });
  let body: { id?: string };
  try { body = await request.json() as { id?: string }; } catch { return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 }); }
  const id = typeof body.id === "string" ? body.id : "";
  if (!id || id.includes("/") || id.includes("..") || !/^[a-zA-Z0-9._-]+$/.test(id)) return NextResponse.json({ error: "Geçersiz görsel kimliği." }, { status: 400 });
  const response = await fetch(url + "/storage/v1/object/anavelle-media", {
    method: "DELETE",
    headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify({ prefixes: [id] })
  });
  if (!response.ok) return NextResponse.json({ error: "Bulut görseli silinemedi: " + (await response.text()).slice(0,250) }, { status: 502 });
  return NextResponse.json({ ok: true });
}
