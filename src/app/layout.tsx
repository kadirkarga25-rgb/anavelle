import type { Metadata } from "next";
import "./globals.css";
import { StoreShell } from "@/components/store-shell";

export const metadata: Metadata = {
  title: "Anavelle | Her adımda zarafet",
  description: "Anavelle kadın ayakkabı, sandalet ve terlik koleksiyonu. Konforu ve zarafeti bir araya getiren seçkin tasarımlar.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://anavelle.com")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body><StoreShell>{children}</StoreShell></body></html>;
}