import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, supabaseRequest } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!verifyAdminSession(request)) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  try {
    const rows = await supabaseRequest("/rest/v1/anavelle_orders?select=id,data,status,created_at,updated_at&order=created_at.desc") as {id:string;data:Record<string,unknown>;status:string;created_at:string}[];
    return NextResponse.json({ orders: rows.map(row => ({ ...row.data, id:row.id, status:row.status, createdAt:row.created_at })) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Siparişler alınamadı." }, { status: 503 });
  }
}
