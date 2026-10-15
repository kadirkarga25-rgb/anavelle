import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { supabaseRequest } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ products, source:"demo" }, { headers: { "Cache-Control":"no-store" } });
  }
  try {
    const rows = await supabaseRequest("/rest/v1/anavelle_products?select=id,data,is_active&is_active=eq.true&order=updated_at.desc") as {id:string;data:Record<string,unknown>;is_active:boolean}[];
    return NextResponse.json({ products:rows.map(row=>({...row.data,id:row.id,inStock:row.is_active})), source:"database" }, { headers: { "Cache-Control":"no-store" } });
  } catch {
    return NextResponse.json({ products, source:"demo", warning:"Persistent catalog is not ready." }, { headers: { "Cache-Control":"no-store" } });
  }
}
