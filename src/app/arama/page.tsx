import Link from "next/link";
import { ArrowUpDown, Search } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

type SearchParams = { q?: string; category?: string; sort?: string; min?: string; max?: string };
const categories = [{ value: "kadin", label: "Kadın" }, { value: "sandalet", label: "Sandalet" }, { value: "terlik", label: "Terlik" }, { value: "bot", label: "Bot" }];

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = await searchParams;
  const q = (query.q || "").trim();
  const normalized = q.toLocaleLowerCase("tr-TR");
  let found = products.filter((p) => !normalized || [p.name, p.category, ...p.colors, ...p.features].some((value) => value.toLocaleLowerCase("tr-TR").includes(normalized)));
  if (query.category) found = found.filter((p) => query.category === "kadin" ? true : p.category === query.category);
  if (query.min && Number.isFinite(Number(query.min))) found = found.filter((p) => p.price >= Number(query.min));
  if (query.max && Number.isFinite(Number(query.max))) found = found.filter((p) => p.price <= Number(query.max));
  switch (query.sort) {
    case "asc": found = [...found].sort((a, b) => a.price - b.price); break;
    case "desc": found = [...found].sort((a, b) => b.price - a.price); break;
    case "newest": found = [...found].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
    case "popular": found = [...found].sort((a, b) => b.soldCount - a.soldCount); break;
    case "rating": found = [...found].sort((a, b) => b.rating - a.rating); break;
  }

  return <section className="section container search-page">
    <div className="breadcrumbs"><Link href="/">Anasayfa</Link><span>/</span><span>Arama</span></div>
    <div className="kicker">ANAVELLE KOLEKSİYONU</div>
    <h1 className="page-heading">{q ? `“${q}” arama sonuçları` : "Ürünleri keşfet"}</h1>
    <p className="muted">{found.length} ürün bulundu. Ürün adı, kategori, renk veya özellik yazarak arayabilirsin.</p>
    <form className="search-refine-form" method="get">
      <label><Search size={16}/><input name="q" defaultValue={q} placeholder="Ayakkabı, renk veya özellik ara..." aria-label="Arama kelimesi"/></label>
      <select name="category" defaultValue={query.category || ""} aria-label="Kategori"><option value="">Tüm kategoriler</option>{categories.map((c)=><option key={c.value} value={c.value}>{c.label}</option>)}</select>
      <input type="number" min="0" name="min" placeholder="En az ₺" defaultValue={query.min} aria-label="En düşük fiyat"/>
      <input type="number" min="0" name="max" placeholder="En çok ₺" defaultValue={query.max} aria-label="En yüksek fiyat"/>
      <select name="sort" defaultValue={query.sort || "relevance"} aria-label="Sıralama"><option value="relevance">Önerilen</option><option value="newest">En yeniler</option><option value="popular">En çok satanlar</option><option value="rating">En çok oylananlar</option><option value="asc">Fiyat artan</option><option value="desc">Fiyat azalan</option></select>
      <button className="button" type="submit">Sonuçları filtrele <ArrowUpDown size={14}/></button>
    </form>
    {found.length ? <div className="products search-products">{found.map((product) => <ProductCard key={product.id} product={product}/>)}</div> :
      <div className="empty-results"><div className="kicker">SONUÇ BULUNAMADI</div><h2>Aradığın modeli bulamadık.</h2><p>Farklı bir kelime veya daha geniş fiyat aralığı deneyebilirsin.</p><Link className="button" href="/kategori/kadin">Kadın koleksiyonunu keşfet</Link></div>}
    <p className="catalog-disclaimer">Arama örnek ürün kataloğunda yapılır; canlı ürün ve stok sistemi henüz bağlı değildir.</p>
  </section>;
}
