import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
 const base = process.env.NEXT_PUBLIC_SITE_URL || "https://anavelle.com";
 const paths = ["", "/kategori/kadin", "/kategori/sandalet", "/kategori/terlik", "/kategori/bot", "/kategori/outlet", "/hakkimizda", "/iletisim", "/iade-degisim"];
 return paths.map(path => ({ url: base + path, lastModified: new Date(), changeFrequency: "weekly", priority: path === "" ? 1 : 0.7 }));
}