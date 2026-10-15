import type { Metadata } from "next";
import "./globals.css";
import { StoreShell } from "@/components/store-shell";
import { supabaseRequest } from "@/lib/server/admin-auth";

export async function generateMetadata(): Promise<Metadata> {
  let title = "Anavelle | Her adımda zarafet";
  let description = "Anavelle kadın ayakkabı, sandalet ve terlik koleksiyonu. Konforu ve zarafeti bir araya getiren seçkin tasarımlar.";
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const rows = await supabaseRequest("/rest/v1/anavelle_settings?id=eq.store&select=data") as {data:{seoTitle?:string;seoDescription?:string}}[];
      if (rows[0]?.data?.seoTitle) title = rows[0].data.seoTitle;
      if (rows[0]?.data?.seoDescription) description = rows[0].data.seoDescription;
    } catch {}
  }
  return { title, description, metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://anavelleshoes.netlify.app") };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body><StoreShell>{children}</StoreShell></body></html>;
}