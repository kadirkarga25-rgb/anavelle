import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    application: "Anavelle",
    mode: "storefront-prototype",
    database: process.env.DATABASE_URL ? "configured" : "not-configured",
    authentication: process.env.AUTH_SECRET ? "configured" : "not-configured",
    payments: process.env.PAYMENT_PROVIDER ? "configured" : "not-configured",
    timestamp: new Date().toISOString()
  });
}