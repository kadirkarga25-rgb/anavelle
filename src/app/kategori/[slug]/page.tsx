import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpDown, CheckCircle2, SlidersHorizontal } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

const labels: Record<string, string> = {
  kadin: "Kadın Koleksiyonu", sandalet: "Sandalet", terlik: "Terlik", bot: "Bot", outlet: "Outlet"
};
const sizes = [36, 37, 38, 39, 40, 41];
const sortLabels: Record<string, string> = {
  featured: "Önerilen", newest: "En yeniler", popular: "En çok satanlar",
  rating: "En çok oylananlar", asc: "En düşük fiyat", desc: "En yüksek fiyat",
  name: "Ürün adı (A-Z)", "name-desc": "Ürün adı (Z-A)"
};

type SearchParams = {
  q?: string; sort?: string; min?: string; max?: string; color?: string; size?: string;
  sale?: string; inStock?: string; freeShipping?: string; feature?: string; page?: string; view?: string;
};

export default async function CategoryPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  if (!labels[slug]) notFound();

  let items = slug === "outlet" ? products.filter((product) => product.oldPrice) :
    slug === "kadin" ? products : products.filter((product) => product.category === slug);
  if (query.q) items = items.filter((p) => p.name.toLocaleLowerCase("tr-TR").includes(query.q!.toLocaleLowerCase("tr-TR")));
  if (query.min && Number.isFinite(Number(query.min))) items = items.filter((p) => p.price >= Number(query.min));
  if (query.max && Number.isFinite(Number(query.max))) items = items.filter((p) => p.price <= Number(query.max));
  if (query.color) items = items.filter((p) => p.colors.includes(query.color!));
  if (query.size) items = items.filter((p) => p.sizes.includes(Number(query.size)));
  if (query.sale === "yes") items = items.filter((p) => Boolean(p.oldPrice));
  if (query.inStock === "yes") items = items.filter((p) => p.inStock);
  if (query.freeShipping === "yes") items = items.filter((p) => p.freeShipping);
  if (query.feature) items = items.filter((p) => p.features.includes(query.feature!));

  switch (query.sort) {
    case "newest": items = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
    case "popular": items = [...items].sort((a, b) => b.soldCount - a.soldCount); break;
    case "rating": items = [...items].sort((a, b) => b.rating - a.rating); break;
    case "asc": items = [...items].sort((a, b) => a.price - b.price); break;
    case "desc": items = [...items].sort((a, b) => b.price - a.price); break;
    case "name": items = [...items].sort((a, b) => a.name.localeCompare(b.name, "tr")); break;
    case "name-desc": items = [...items].sort((a, b) => b.name.localeCompare(a.name, "tr")); break;
  }

  const pageSize = 12;
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(pageCount, Math.max(1, Number(query.page) || 1));
  const visibleItems = items.slice((page - 1) * pageSize, page * pageSize);
  const colors = Array.from(new Set(products.flatMap((p) => p.colors))).sort((a, b) => a.localeCompare(b, "tr"));
  const features = Array.from(new Set(products.flatMap((p) => p.features))).sort((a, b) => a.localeCompare(b, "tr"));
  const activeCount = [query.color, query.size, query.min, query.max, query.sale, query.inStock, query.freeShipping, query.feature].filter(Boolean).length;

  return <>
    <section className="category-hero"><div className="container">
      <div className="breadcrumbs"><Link href="/">Anasayfa</Link><span>/</span><span>{labels[slug]}</span></div>
      <div className="kicker">ANAVELLE KOLEKSİYONU</div><h1>{labels[slug]}</h1>
      <p>Zamansız çizgiler, özenli detaylar ve günlük stil için seçilmiş tasarımlar.</p>
      <div className="category-benefits"><span><CheckCircle2 size={15}/> Seçili koleksiyon</span><span><SlidersHorizontal size={15}/> Gelişmiş filtreler</span><span>Yeni sezon seçkisi</span></div>
    </div></section>
    <section className="section container category-listing">
      <div className="catalog-heading"><div><div className="kicker">KOLEKSİYONU KEŞFET</div><h2>{labels[slug]}</h2></div><p><strong>{items.length}</strong> ürün bulundu</p></div>
      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <form className="filter-panel" method="get">
            {query.q && <input type="hidden" name="q" value={query.q}/>}
            <div className="filter-panel-head"><h3>Filtreleme</h3>{activeCount > 0 && <span>{activeCount} aktif</span>}</div>
            <fieldset><legend>Fiyat aralığı</legend><div className="price-range"><label><span>En az (₺)</span><input type="number" min="0" name="min" placeholder="0" defaultValue={query.min}/></label><label><span>En çok (₺)</span><input type="number" min="0" name="max" placeholder="—" defaultValue={query.max}/></label></div></fieldset>
            <fieldset><legend>Renk</legend><select name="color" defaultValue={query.color || ""} aria-label="Renk filtresi"><option value="">Tüm renkler</option>{colors.map((color) => <option key={color} value={color}>{color}</option>)}</select></fieldset>
            <fieldset><legend>Beden</legend><div className="filter-size-grid">{sizes.map((size) => <label key={size} className={query.size === String(size) ? "filter-size selected" : "filter-size"}><input type="radio" name="size" value={size} defaultChecked={query.size === String(size)}/><span>{size}</span></label>)}<label className="filter-size"><input type="radio" name="size" value="" defaultChecked={!query.size}/><span>Tümü</span></label></div></fieldset>
            <fieldset><legend>Özellikler</legend><select name="feature" defaultValue={query.feature || ""} aria-label="Ürün özelliği"><option value="">Tüm özellikler</option>{features.map((feature) => <option key={feature} value={feature}>{feature}</option>)}</select></fieldset>
            <fieldset className="filter-checks"><legend>Alışveriş seçenekleri</legend>
              <label><input type="checkbox" name="sale" value="yes" defaultChecked={query.sale === "yes"}/> İndirimdekiler</label>
              <label><input type="checkbox" name="inStock" value="yes" defaultChecked={query.inStock === "yes"}/> Stokta olanlar</label>
              <label><input type="checkbox" name="freeShipping" value="yes" defaultChecked={query.freeShipping === "yes"}/> Ücretsiz kargo</label>
            </fieldset>
            <input type="hidden" name="sort" value={query.sort || "featured"}/>
            <button className="button filter-submit" type="submit">Ürünleri listele</button>
            <Link className="filter-reset" href={slug === "kadin" ? "/kategori/kadin" : `/kategori/${slug}`}>Seçimleri temizle</Link>
          </form>
          <div className="filter-help"><strong>Karar vermekte zorlanıyor musun?</strong><p>Ürün özelliklerini ve beden seçeneklerini ürün detayında inceleyebilirsin.</p><Link href="/iletisim">Bize ulaş →</Link></div>
        </aside>
        <div className="catalog-main">
          <form className="catalog-toolbar" method="get">
            {Object.entries(query).filter(([key, value]) => key !== "sort" && key !== "page" && key !== "view" && Boolean(value)).map(([key, value]) => <input key={key} type="hidden" name={key} value={value}/>)}
            <span className="catalog-result">Gösterilen <strong>{visibleItems.length}</strong> / {items.length} ürün</span>
            <label className="sort-filter"><ArrowUpDown size={15}/><span>Sırala</span><select name="sort" defaultValue={query.sort || "featured"} aria-label="Sıralama">{Object.entries(sortLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <button className="button catalog-apply" type="submit">Uygula</button>
          </form>
          {visibleItems.length ? <div className={query.view === "list" ? "products catalog-products list-view" : "products catalog-products"}>{visibleItems.map((product) => <ProductCard key={product.id} product={product}/>)}</div> :
            <div className="empty-results"><div className="kicker">SONUÇ BULUNAMADI</div><h2>Bu seçimde ürün yok.</h2><p>Filtreleri değiştirerek diğer modelleri keşfedebilirsin.</p><Link className="button" href={`/kategori/${slug}`}>Filtreleri temizle</Link></div>}
          {pageCount > 1 && <nav className="catalog-pagination" aria-label="Sayfalar">{Array.from({length: pageCount}, (_, i) => i + 1).map((n) => <Link key={n} aria-current={page === n ? "page" : undefined} className={page === n ? "active" : ""} href={`/kategori/${slug}?${new URLSearchParams({...Object.fromEntries(Object.entries(query).filter(([k,v]) => k !== "page" && Boolean(v)) as [string,string][]), page:String(n)}).toString()}`}>{n}</Link>)}</nav>}
          <div className="catalog-disclaimer">Önemli: Bu sayfada örnek ürün kataloğu kullanılmaktadır. Görseller, fiyatlar, değerlendirmeler, stok ve kargo bilgileri canlı satış verisi değildir; gerçek ürün verileri bağlandığında güncellenecektir.</div>
        </div>
      </div>
    </section>
  </>;
}
