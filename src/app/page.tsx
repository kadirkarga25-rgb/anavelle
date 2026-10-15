import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Heart, Leaf, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

const collections = [
  { title: "Sandalet", eyebrow: "HAFİF ADIMLAR", href: "/kategori/sandalet", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85" },
  { title: "Terlik", eyebrow: "GÜNLÜK KONFOR", href: "/kategori/terlik", image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=85" },
  { title: "Şehir stili", eyebrow: "ZAMANSIZ FORMLAR", href: "/kategori/kadin", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85" },
  { title: "Bot", eyebrow: "MEVSİMİN İMZASI", href: "/kategori/bot", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=900&q=85" }
];

export default function HomePage() {
  return <>
    <section className="hero-wrap">
      <div className="hero">
        <div className="hero-copy">
          <div className="hero-eyebrow"><span /> ANAVELLE · YENİ SEZON</div>
          <h1>Her adımda<br /><em>daha iyi</em> bir sen.</h1>
          <p>Zamansız çizgiler, özenli detaylar ve kendi ritmine uyum sağlayan bir stil. Günlük hayatına eşlik edecek favorini keşfet.</p>
          <div className="hero-actions">
            <Link className="button" href="/kategori/kadin">Koleksiyonu keşfet <ArrowRight size={16} /></Link>
            <Link className="text-link" href="/kategori/outlet">Fırsatları gör <ArrowUpRight size={15} /></Link>
          </div>
          <div className="hero-note"><Sparkles size={15} /> Her adımda zarafet, her gün kendin.</div>
        </div>
        <div className="hero-visual">
          <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1400&q=90" alt="Anavelle yeni sezon ayakkabı stil görseli" fetchPriority="high" />
          <div className="hero-stamp"><span>ANAVELLE</span><small>TIMELESS COMFORT</small></div>
          <div className="hero-caption"><span>01 / 04</span><span>Yeni sezon seçkisi</span></div>
        </div>
      </div>
    </section>

    <section className="trust-strip container" aria-label="Alışveriş özellikleri">
      <div><PackageCheck /><span><strong>Özenli seçim</strong><small>Her detayda sadelik</small></span></div>
      <div><ShieldCheck /><span><strong>Güvenli deneyim</strong><small>Altyapı tamamlandığında</small></span></div>
      <div><Leaf /><span><strong>Zamansız tasarım</strong><small>Stiline uyum sağlayan</small></span></div>
      <div><Heart /><span><strong>Sana özel seçkiler</strong><small>Favorilerini biriktir</small></span></div>
    </section>

    <section className="section container">
      <div className="section-head"><div><div className="kicker">TARZINI BUL</div><h2>Koleksiyonları keşfet</h2><p className="muted">Günün farklı anları için seçilmiş stiller.</p></div><Link className="section-link" href="/kategori/kadin">Tüm koleksiyon <ArrowRight size={15} /></Link></div>
      <div className="collection-grid">
        {collections.map((item, index) => <Link href={item.href} className={`collection-tile collection-${index + 1}`} key={item.title}>
          <img src={item.image} alt={item.title} loading="lazy" />
          <span className="collection-shade" />
          <span className="collection-copy"><small>{item.eyebrow}</small><strong>{item.title}</strong><span className="collection-cta">Keşfet <ArrowUpRight size={15} /></span></span>
        </Link>)}
      </div>
    </section>

    <section className="section featured-section">
      <div className="container">
        <div className="section-head"><div><div className="kicker">ANAVELLE SEÇKİSİ</div><h2>Öne çıkanlar</h2><p className="muted">Yeni favorini bulmak için koleksiyona göz at.</p></div><Link className="section-link" href="/kategori/kadin">Tüm ürünler <ArrowRight size={15} /></Link></div>
        <div className="products">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </div>
    </section>

    <section className="editorial container">
      <div className="editorial-image"><img src="https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1100&q=85" alt="Günlük stil için ayakkabı seçkisi" loading="lazy" /><span>THE ANAVELLE EDIT</span></div>
      <div className="editorial-copy"><div className="kicker">KENDİ RİTMİNDE</div><h2>Şıklık, kendin gibi hissettiğinde başlar.</h2><p>Her gün aynı değil. Stilinin de tek bir kalıba sığması gerekmiyor. Günlük rahatlıktan şehir şıklığına, kendi adımını seç.</p><ul><li><Check size={16} /> Günlük stile uyum sağlayan seçkiler</li><li><Check size={16} /> Zamansız renk ve formlar</li><li><Check size={16} /> Sana göre keşif ve favoriler</li></ul><Link className="button outline" href="/hakkimizda">Anavelle'yi tanı <ArrowRight size={16} /></Link></div>
    </section>

    <section className="benefit-band"><div className="container benefit-inner"><div><div className="kicker">BİR ADIM ÖNDE</div><h2>Favorilerin seni bekliyor.</h2><p>Beğendiğin tasarımları favorilerine ekle, sonra kolayca geri dön.</p></div><Link className="button light-button" href="/favoriler">Favorilerimi gör <Heart size={16} /></Link></div></section>
  </>;
}
