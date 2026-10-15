"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Heart, Truck, RefreshCw, ShieldCheck, Ruler, ChevronDown, Check, Share2, PackageCheck } from "lucide-react";
import { products, money } from "@/data/products";
import { ProductCard } from "@/components/product-card";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const product = useMemo(() => products.find((item) => item.id === params.id), [params.id]);
  const [size, setSize] = useState<number | undefined>();
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"detail" | "delivery" | "returns">("detail");
  const [sizeGuide, setSizeGuide] = useState(false);

  if (!product) return <section className="section container"><h1>Ürün bulunamadı</h1><Link className="button" href="/kategori/kadin">Koleksiyona dön</Link></section>;
  const activeProduct = product;
  const related = products.filter((item) => item.id !== activeProduct.id && (item.category === activeProduct.category || item.category === "kadin")).slice(0, 4);

  function addCart() {
    if (!size) { setMessage("Devam etmek için lütfen beden seç."); return; }
    if (!color) { setMessage("Lütfen ürün rengini seç."); return; }
    try {
      const cart = JSON.parse(localStorage.getItem("anavelle-cart") || "[]") as { id: string; size: number; color?: string; qty: number }[];
      const existing = cart.find((item) => item.id === activeProduct.id && item.size === size && item.color === color);
      if (existing) existing.qty += qty;
      else cart.push({ id: activeProduct.id, size, color, qty });
      localStorage.setItem("anavelle-cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("anavelle-cart-updated"));
      setMessage("Seçimin demo sepetine eklendi.");
    } catch {
      setMessage("Sepet şu anda güncellenemedi. Lütfen yeniden dene.");
    }
  }

  function toggleFavorite() {
    try {
      const favorites = JSON.parse(localStorage.getItem("anavelle-favorites") || "[]") as string[];
      const next = favorites.includes(activeProduct.id) ? favorites.filter((id) => id !== activeProduct.id) : [...favorites, activeProduct.id];
      localStorage.setItem("anavelle-favorites", JSON.stringify(next));
      window.dispatchEvent(new Event("anavelle-favorites-updated"));
      setMessage(next.includes(activeProduct.id) ? "Ürün favorilerine eklendi." : "Ürün favorilerinden çıkarıldı.");
    } catch { setMessage("Favori tercihi kaydedilemedi."); }
  }

  async function shareProduct() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: activeProduct.name, url });
      else { await navigator.clipboard.writeText(url); setMessage("Ürün bağlantısı kopyalandı."); }
    } catch {}
  }

  return <>
    <section className="section container product-detail-section">
      <div className="breadcrumbs"><Link href="/">Anasayfa</Link><span>/</span><Link href={`/kategori/${activeProduct.category === "kadin" ? "kadin" : activeProduct.category}`}>{activeProduct.category === "kadin" ? "Kadın koleksiyonu" : activeProduct.category}</Link><span>/</span><span>{activeProduct.name}</span></div>
      <div className="product-detail-grid">
        <div className="product-gallery">
          <div className="product-main-image"><img src={activeProduct.image} alt={activeProduct.name} /><span className="gallery-label">ANAVELLE · {activeProduct.id.toUpperCase()}</span></div>
          <div className="gallery-caption"><span>Ürün görseli temsili koleksiyon görselidir.</span><button onClick={shareProduct}><Share2 size={15} /> Paylaş</button></div>
        </div>
        <div className="product-buy-panel">
          <div className="kicker">ANAVELLE KOLEKSİYONU</div>
          <h1>{activeProduct.name}</h1>
          <div className="product-rating-line"><span className="rating-stars">★★★★★</span><span>Yorum sistemi hazırlanıyor</span></div>
          <div className="detail-price"><strong>{money(activeProduct.price)}</strong>{activeProduct.oldPrice && <><del>{money(activeProduct.oldPrice)}</del><span className="detail-discount">%{Math.round((1 - activeProduct.price / activeProduct.oldPrice) * 100)} indirim</span></>}</div>
          <p className="detail-description">{activeProduct.description}</p>
          <div className="product-choice">
            <div className="choice-heading"><strong>Renk</strong><span>{color || "Renk seçiniz"}</span></div>
            <div className="color-options">{activeProduct.colors.map((item, index) => <button key={item} className={color === item ? "color-option selected" : "color-option"} onClick={() => setColor(item)}><span className={`color-swatch swatch-${index % 5}`} />{item}</button>)}</div>
          </div>
          <div className="product-choice">
            <div className="choice-heading"><strong>Beden</strong><button className="size-guide-link" onClick={() => setSizeGuide(true)}><Ruler size={14} /> Beden rehberi</button></div>
            <div className="size-options">{activeProduct.sizes.map((item) => <button key={item} className={size === item ? "size-option selected" : "size-option"} onClick={() => { setSize(item); setMessage(""); }}>{item}</button>)}</div>
          </div>
          <div className="product-choice quantity-choice"><strong>Adet</strong><select value={qty} onChange={(event) => setQty(Number(event.target.value))} aria-label="Adet">{[1, 2, 3, 4, 5].map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
          <div className="buy-actions"><button className="button buy-button" onClick={addCart}>Sepete ekle <span>· {money(activeProduct.price * qty)}</span></button><button className="icon-action-button" aria-label="Favorilere ekle" onClick={toggleFavorite}><Heart size={19} /></button></div>
          {message && <p className="product-feedback" role="status">{message}</p>}
          <div className="product-assurances"><div><Truck /><span><strong>Teslimat bilgisi</strong><small>Kargo servisi bağlandığında gösterilecek</small></span></div><div><RefreshCw /><span><strong>İade ve değişim</strong><small>Politika yayına alınmadan önce doğrulanmalı</small></span></div><div><ShieldCheck /><span><strong>Güvenli ödeme</strong><small>Gerçek ödeme henüz etkin değil</small></span></div></div>
          <div className="product-accordion">
            <button onClick={() => setActiveTab(activeTab === "detail" ? "delivery" : "detail")}><span>Ürün detayları</span><ChevronDown size={16} /></button>
            {activeTab === "detail" && <div><p>{activeProduct.description}</p><p><strong>Materyal:</strong> {activeProduct.material}</p><p><strong>Topuk / taban:</strong> {activeProduct.heelHeight}</p><p className="muted">Bu ürün kartındaki teknik bilgiler doğrulanana kadar kesin ürün özelliği olarak değerlendirilmemelidir.</p></div>}
            <button onClick={() => setActiveTab(activeTab === "delivery" ? "detail" : "delivery")}><span>Teslimat ve ödeme</span><ChevronDown size={16} /></button>
            {activeTab === "delivery" && <div><p>Bu mağaza sürümünde kargo firması ve ödeme sağlayıcısı henüz bağlanmadı. Gerçek sipariş alınmamaktadır.</p></div>}
            <button onClick={() => setActiveTab(activeTab === "returns" ? "detail" : "returns")}><span>İade ve değişim</span><ChevronDown size={16} /></button>
            {activeTab === "returns" && <div><p>Satışa açılmadan önce doğrulanmış iade/değişim politikası ve yasal metinler bu alana eklenmelidir.</p><Link href="/iade-degisim">İade ve değişim sayfası</Link></div>}
          </div>
        </div>
      </div>
    </section>
    {related.length > 0 && <section className="section featured-section"><div className="container"><div className="section-head"><div><div className="kicker">SENİN İÇİN</div><h2>Benzer stiller</h2></div><Link className="section-link" href="/kategori/kadin">Tüm ürünler</Link></div><div className="products">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></div></section>}
    {sizeGuide && <div className="modal-backdrop" role="presentation" onClick={() => setSizeGuide(false)}><section className="size-guide-modal" role="dialog" aria-modal="true" aria-label="Beden rehberi" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSizeGuide(false)} aria-label="Kapat">×</button><div className="kicker">BEDEN REHBERİ</div><h2>Doğru bedeni seç</h2><p>Ürün bedenleri örnek katalog verisidir. Gerçek ürün ölçüleri ve kalıp bilgileri mağaza yayına alınmadan önce doğrulanmalıdır.</p><table><thead><tr><th>Numara</th><th>Ayak uzunluğu</th></tr></thead><tbody>{activeProduct.sizes.map((item) => <tr key={item}><td>{item}</td><td>Ürün ölçüsü eklenecek</td></tr>)}</tbody></table><button className="button" onClick={() => setSizeGuide(false)}>Anladım</button></section></div>}
  </>;
}
