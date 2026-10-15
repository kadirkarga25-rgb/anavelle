import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, supabaseRequest } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!verifyAdminSession(request)) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  try {
    const rows = await supabaseRequest("/rest/v1/anavelle_products?select=id,data,is_active,updated_at&order=updated_at.desc") as { id:string; data:Record<string,unknown>; is_active:boolean }[];
    return NextResponse.json({ products: rows.map(row => ({ ...row.data, id: row.id, inStock: row.is_active })) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Ürünler alınamadı." }, { status: 503 });
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminSession(request)) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  let body: { products?: unknown };
  try { body = await request.json() as { products?: unknown }; } catch { return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 }); }
  if (!Array.isArray(body.products) || body.products.some((p) => !p || typeof p !== "object" || typeof (p as {id?:unknown}).id !== "string" || typeof (p as {name?:unknown}).name !== "string" || typeof (p as {price?:unknown}).price !== "number")) {
    return NextResponse.json({ error: "Ürün kataloğu doğrulanamadı." }, { status: 400 });
  }
  const products = body.products as Record<string, unknown>[];
  const rows = products.map(product => ({ id: product.id, data: product, is_active: Boolean(product.inStock), updated_at: new Date().toISOString() }));
  try {
    if (rows.length) {
      await supabaseRequest("/rest/v1/anavelle_products?on_conflict=id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(rows) });
      const ids = rows.map(row => String(row.id).replace(/[^a-zA-Z0-9_-]/g, "")).filter(Boolean);
      if (ids.length) {
        const filter = ids.map(id => '"' + id + '"').join(",");
        await supabaseRequest("/rest/v1/anavelle_products?id=not.in.(" + encodeURIComponent(filter) + ")", { method: "DELETE", headers: { Prefer: "return=minimal" } });
      }
    } else {
      await supabaseRequest("/rest/v1/anavelle_products?id=not.is.null", { method: "DELETE", headers: { Prefer: "return=minimal" } });
    }
    return NextResponse.json({ ok: true, count: rows.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Ürün kataloğu kaydedilemedi." }, { status: 503 });
  }
}
