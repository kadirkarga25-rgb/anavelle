import Link from "next/link";
import { notFound } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

const labels: Record<string, string> = { kadin: "Kadın Koleksiyonu", sandalet: "Sandalet", terlik: "Terlik", bot: "Bot", outlet: "Outlet" };

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ q?: string; sort?: string; min?: string; max?: string; color?: string; size?: string; sale?: string }> }) {
  const { slug } = await params;
  const query = await searchParams;
  if (!labels[slug]) notFound();

  let items = slug === "outlet" ? products.filter((product) => product.oldPrice) : slug === "kadin" ? products : products.filter((product) => product.category === slug);
  if (query.q) items = items.filter((product) => product.name.toLocaleLowerCase("tr-TR").includes(query.q!.toLocaleLowerCase("tr-TR")));
  if (query.min) items = items.filter((product) => product.price >= Number(query.min));
  if (query.max) items = items.filter((product) => product.price <= Number(query.max));
  if (query.color) items = items.filter((product) => product.colors.includes(query.color!));
  if (query.size) items = items.filter((product) => product.sizes.includes(Number(query.size)));
  if (query.sale === "yes") items = items.filter((product) => Boolean(product.oldPrice));
  if (query.sort === "asc") items = [...items].sort((a, b) => a.price - b.price);
  if (query.sort === "desc") items = [...items].sort((a, b) => b.price - a.price);
  if (query.sort === "name") items = [...items].sort((a, b) => a.name.localeCompare(b.name, "tr"));
  if (query.sort === "name-desc") items = [...items].sort((a, b) => b.name.localeCompare(a.name, "tr"));

  return <>
    <section className="category-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Anasayfa</Link><span>/</span><span>{labels[slug]}</span></div><div className="kicker">ANAVELLE KOLEKSİYONU</div><h1>{labels[slug]}</h1><p>Zamansız çizgiler ve günlük stil için seçilmiş tasarımlar.</p></div></section>
    <section className="section container category-listing">
      <form className="catalog-toolbar" method="get">
        <div className="catalog-result"><strong>{items.length}</strong> ürün <span>·</span> {labels[slug]}</div>
        <div className="catalog-controls">
          <label><SlidersHorizontal size={15} /><span>Filtrele</span><select name="color" defaultValue={query.color || ""} aria-label="Renk filtresi"><option value="">Tüm renkler</option>{Array.from(new Set(products.flatMap((product) => product.colors))).sort().map((color) => <option key={color} value={color}>{color}</option>)}</select></label>
          <select name="size" defaultValue={query.size || ""} aria-label="Beden filtresi"><option value="">Tüm bedenler</option>{[36, 37, 38, 39, 40, 41].map((size) => <option key={size} value={size}>{size}</option>)}</select>
          <label className="price-filter"><span>₺</span><input type="number" min="0" name="min" placeholder="En az" defaultValue={query.min} aria-label="En düşük fiyat" /><input type="number" min="0" name="max" placeholder="En çok" defaultValue={query.max} aria-label="En yüksek fiyat" /></label>
          <label className="sale-filter"><input type="checkbox" name="sale" value="yes" defaultChecked={query.sale === "yes"} /> İndirimdekiler</label>
          <label className="sort-filter"><ArrowUpDown size={15} /><select name="sort" defaultValue={query.sort || "featured"} aria-label="Sıralama"><option value="featured">Önerilen</option><option value="asc">Fiyat: artan</option><option value="desc">Fiyat: azalan</option><option value="name">İsim: A-Z</option><option value="name-desc">İsim: Z-A</option></select></label>
          <button className="button catalog-apply" type="submit">Uygula</button>
          <Link className="clear-filters" href={`/kategori/${slug}`}>Temizle</Link>
        </div>
      </form>
      {items.length ? <div className="products catalog-products">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-results"><div className="kicker">SONUÇ BULUNAMADI</div><h2>Bu seçimde ürün yok.</h2><p>Filtreleri değiştirerek diğer modelleri keşfedebilirsin.</p><Link className="button" href={`/kategori/${slug}`}>Filtreleri temizle</Link></div>}
      <div className="catalog-disclaimer">Katalogdaki ürün ve fiyatlar demo amaçlıdır. Gerçek ürün bilgileri, stoklar ve fiyatlar henüz sisteme bağlanmamıştır.</div>
    </section>
  </>;
}
