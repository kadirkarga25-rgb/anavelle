import type { MetadataRoute } from "next";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://anavelleshoes.netlify.app";
  const paths = ["", "/kategori/kadin", "/kategori/sandalet", "/kategori/terlik", "/kategori/bot", "/kategori/outlet", "/hakkimizda", "/iletisim", "/iade-degisim"];
  const pages = paths.map((path) => ({ url: base + path, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 }));
  const productPages = products.map((product) => ({ url: base + "/urun/" + product.id, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 }));
  return [...pages, ...productPages];
}
