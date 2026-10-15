import { NextResponse } from "next/server";
import { supabaseRequest } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";
const defaults = {
  announcement:"Yeni sezonu keşfet",
  heroTitle:"Her adımda\ndaha iyi bir sen.",
  heroSubtitle:"Zamansız çizgiler, özenli detaylar ve kendi ritmine uyum sağlayan bir stil. Günlük hayatına eşlik edecek favorini keşfet.",
  heroImage:""
};
const safeKeys = ["announcement","heroTitle","heroSubtitle","heroImage","storeName","seoTitle","seoDescription","supportEmail","phone","freeShippingThreshold"];

export async function GET() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({settings:defaults,source:"default"},{headers:{"Cache-Control":"no-store"}});
  try {
    const rows = await supabaseRequest("/rest/v1/anavelle_settings?id=eq.store&select=data") as {data:Record<string,unknown>}[];
    const data = rows[0]?.data || {};
    const safe = Object.fromEntries(safeKeys.filter(key=>key in data).map(key=>[key,data[key]]));
    return NextResponse.json({settings:{...defaults,...safe},source:"database"},{headers:{"Cache-Control":"no-store"}});
  } catch { return NextResponse.json({settings:defaults,source:"default"},{headers:{"Cache-Control":"no-store"}}); }
}
