"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Heart, Truck, RefreshCw, ShieldCheck, Ruler, ChevronDown, Check, Share2, PackageCheck, BellRing, GitCompareArrows, MessageSquareText, ShoppingBag, Star, ArrowRight } from "lucide-react";
import { products, money, Product } from "@/data/products";
import { getAdminCatalog, hasAdminCatalogOverride, resolveProductImage } from "@/lib/admin-catalog";
import { ProductCard } from "@/components/product-card";
import { CatalogImage } from "@/components/catalog-image";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | undefined>(() => products.find((item) => item.id === params.id));
  const [displayImage, setDisplayImage] = useState("");
  const [selectedImageRef, setSelectedImageRef] = useState("");
  useEffect(() => {
    let active = true;
    let objectUrl = "";
    const sync = () => {
      const apply = (found: Product | undefined) => {
        if (!found) { setProduct(undefined); return; }
        setProduct(found);
        setSelectedImageRef(found.image);
        void resolveProductImage(found.image).then(src => {
          if (!active) { if (src.startsWith("blob:")) URL.revokeObjectURL(src); return; }
          if (src.startsWith("blob:")) objectUrl = src;
          setDisplayImage(src || found.image);
        });
      };
      if (hasAdminCatalogOverride()) apply(getAdminCatalog().find(item => item.id === params.id));
      else void fetch("/api/products",{cache:"no-store"}).then(r=>r.json()).then(data=>{
        if(active && Array.isArray(data.products)) apply(data.products.find((item:Product)=>item.id===params.id) as Product | undefined);
        else if(active) apply(getAdminCatalog().find(item=>item.id===params.id));
      }).catch(()=>{if(active)apply(getAdminCatalog().find(item=>item.id===params.id));});
    };
    sync();
    window.addEventListener("anavelle-admin-catalog-updated", sync);
    return () => {
      active = false;
      window.removeEventListener("anavelle-admin-catalog-updated", sync);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [params.id]);
  const [size, setSize] = useState<number | undefined>();
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"detail" | "delivery" | "returns" | "reviews">("detail");
  const [sizeGuide, setSizeGuide] = useState(false);
  const [priceAlertOpen, setPriceAlertOpen] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  if (!product) return <section className="section container"><h1>Ürün bulunamadı</h1><Link className="button" href="/kategori/kadin">Koleksiyona dön</Link></section>;
  const activeProduct = product;
  const related = getAdminCatalog().filter((item) => item.id !== activeProduct.id && (item.category === activeProduct.category || item.category === "kadin")).slice(0, 4);

  function addCart(goToCart = false) {
    if (!size) { setMessage("Devam etmek için lütfen beden seç."); return; }
    if (!color) { setMessage("Lütfen ürün rengini seç."); return; }
    try {
      const cart = JSON.parse(localStorage.getItem("anavelle-cart") || "[]") as { id: string; size: number; color?: string; qty: number }[];
      const existing = cart.find((item) => item.id === activeProduct.id && item.size === size && item.color === color);
      if (existing) existing.qty += qty;
      else cart.push({ id: activeProduct.id, size, color, qty });
      localStorage.setItem("anavelle-cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("anavelle-cart-updated"));
      setMessage("Ürün demo sepetine eklendi.");
      if (goToCart) router.push("/sepet");
    } catch { setMessage("Sepet şu anda güncellenemedi. Lütfen yeniden dene."); }
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

  function toggleCompare() {
    try {
      const current = JSON.parse(localStorage.getItem("anavelle-compare") || "[]") as string[];
      if (current.includes(activeProduct.id)) {
        localStorage.setItem("anavelle-compare", JSON.stringify(current.filter((id) => id !== activeProduct.id)));
        setMessage("Ürün karşılaştırma listesinden çıkarıldı.");
      } else if (current.length >= 4) {
        setMessage("En fazla 4 ürünü karşılaştırabilirsin.");
        return;
      } else {
        localStorage.setItem("anavelle-compare", JSON.stringify([...current, activeProduct.id]));
        setMessage("Ürün karşılaştırma listene eklendi.");
      }
      window.dispatchEvent(new Event("anavelle-compare-updated"));
    } catch { setMessage("Karşılaştırma listesi güncellenemedi."); }
  }

  async function shareProduct() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: activeProduct.name, url });
      else { await navigator.clipboard.writeText(url); setMessage("Ürün bağlantısı kopyalandı."); }
    } catch {}
  }

  function savePriceAlert(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = alertEmail.trim().toLowerCase();
    if (!clean) return;
    try {
      const prior = JSON.parse(localStorage.getItem("anavelle-price-alerts-demo") || "[]") as { productId: string; email: string; price: number }[];
      const next = prior.filter((entry) => !(entry.productId === activeProduct.id && entry.email === clean));
      next.push({ productId: activeProduct.id, email: clean, price: activeProduct.price });
      localStorage.setItem("anavelle-price-alerts-demo", JSON.stringify(next));
      setPriceAlertOpen(false);
      setMessage("Fiyat alarmı bu tarayıcıda demo olarak kaydedildi; e-posta bildirimi gönderilmedi.");
    } catch { setMessage("Fiyat alarmı kaydedilemedi."); }
  }

  function saveReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const prior = JSON.parse(localStorage.getItem("anavelle-reviews-demo") || "[]") as { productId: string; rating: number; text: string; createdAt: string }[];
      prior.push({ productId: activeProduct.id, rating: reviewRating, text: reviewText.trim(), createdAt: new Date().toISOString() });
      localStorage.setItem("anavelle-reviews-demo", JSON.stringify(prior));
      setReviewOpen(false);
      setReviewText("");
      setMessage("Değerlendirmen bu tarayıcıya demo olarak kaydedildi; mağazada yayınlanmadı.");
    } catch { setMessage("Değerlendirme kaydedilemedi."); }
  }

  return <>
    <section className="section container product-detail-section">
      <div className="breadcrumbs"><Link href="/">Anasayfa</Link><span>/</span><Link href={`/kategori/${activeProduct.category === "kadin" ? "kadin" : activeProduct.category}`}>{activeProduct.category === "kadin" ? "Kadın koleksiyonu" : activeProduct.category}</Link><span>/</span><span>{activeProduct.name}</span></div>
      <div className="product-detail-grid">
        <div className="product-gallery">
          <div className="product-main-image"><CatalogImage image={displayImage || activeProduct.image} alt={activeProduct.name}/><span className="gallery-label">ANAVELLE · {activeProduct.id.toUpperCase()}</span></div>
          {Array.from(new Set([activeProduct.image,...(activeProduct.gallery||[])].filter(Boolean))).length>1&&<div className="product-gallery-thumbs" aria-label="Ürün fotoğrafları">{Array.from(new Set([activeProduct.image,...(activeProduct.gallery||[])].filter(Boolean))).map((image,index)=><button key={image+"-"+index} type="button" className={selectedImageRef===image?"selected":""} onClick={()=>{setSelectedImageRef(image);setDisplayImage(image);}} aria-label={"Ürün fotoğrafı "+(index+1)}><CatalogImage image={image} alt={activeProduct.name+" fotoğraf "+(index+1)}/></button>)}</div>}
          <div className="gallery-caption"><span>Temsili katalog görseli · Gerçek ürün fotoğrafları eklenecek.</span><button onClick={shareProduct}><Share2 size={15}/> Paylaş</button></div>
          <div className="product-image-note"><ShieldCheck size={17}/><span>Ürün fotoğrafı, malzeme ve ölçüler gerçek katalogla doğrulanmadan kesin özellik olarak değerlendirilmemelidir.</span></div>
        </div>
        <div className="product-buy-panel">
          <div className="kicker">ANAVELLE KOLEKSİYONU · {activeProduct.id.toUpperCase()}</div>
          <h1>{activeProduct.name}</h1>
          <div className="product-rating-line"><span className="rating-stars"><Star size={15} fill="currentColor"/>{activeProduct.rating.toFixed(1)}</span><button onClick={() => setActiveTab("reviews")}>{activeProduct.reviewCount} değerlendirme (demo)</button><span className="rating-disclaimer">Örnek puan</span></div>
          <div className="detail-price"><strong>{money(activeProduct.price)}</strong>{activeProduct.oldPrice && <><del>{money(activeProduct.oldPrice)}</del><span className="detail-discount">%{Math.round((1 - activeProduct.price / activeProduct.oldPrice) * 100)} indirim (demo)</span></>}</div>
          <p className="detail-description">{activeProduct.description}</p>
          <div className="product-detail-tags">{activeProduct.features.map((feature) => <span key={feature}>{feature}</span>)}</div>
          <div className="product-choice">
            <div className="choice-heading"><strong>Renk</strong><span>{color || "Renk seçiniz"}</span></div>
            <div className="color-options">{activeProduct.colors.map((item, index) => <button type="button" key={item} className={color === item ? "color-option selected" : "color-option"} onClick={() => setColor(item)}><span className={`color-swatch swatch-${index % 5}`}/>{item}</button>)}</div>
          </div>
          <div className="product-choice">
            <div className="choice-heading"><strong>Beden</strong><button className="size-guide-link" onClick={() => setSizeGuide(true)}><Ruler size={14}/> Beden rehberi</button></div>
            <div className="size-options">{activeProduct.sizes.map((item) => <button type="button" key={item} className={size === item ? "size-option selected" : "size-option"} onClick={() => { setSize(item); setMessage(""); }}>{item}</button>)}</div>
          </div>
          <div className="product-choice quantity-choice"><strong>Adet</strong><select value={qty} onChange={(event) => setQty(Number(event.target.value))} aria-label="Adet">{[1, 2, 3, 4, 5].map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
          <div className="buy-actions"><button className="button buy-button" onClick={() => addCart(false)}><ShoppingBag size={16}/> Sepete ekle <span>· {money(activeProduct.price * qty)}</span></button><button className="button buy-now-button" onClick={() => addCart(true)}>Hemen al <ArrowRight size={15}/></button></div>
          <div className="product-secondary-actions"><button onClick={toggleFavorite}><Heart size={16}/> Favorilerime ekle</button><button onClick={toggleCompare}><GitCompareArrows size={16}/> Karşılaştır</button><button onClick={() => setPriceAlertOpen(true)}><BellRing size={16}/> Fiyat alarmı</button><button onClick={() => setReviewOpen(true)}><MessageSquareText size={16}/> Yorum yaz</button></div>
          {message && <p className="product-feedback" role="status">{message}</p>}
          <div className="product-assurances"><div><Truck/><span><strong>Teslimat bilgisi</strong><small>Kargo sağlayıcısı henüz bağlanmadı</small></span></div><div><RefreshCw/><span><strong>İade ve değişim</strong><small>Yayın öncesi gerçek politika eklenecek</small></span></div><div><ShieldCheck/><span><strong>Ödeme güvenliği</strong><small>Canlı ödeme etkin değil</small></span></div><div><PackageCheck/><span><strong>Stok bilgisi</strong><small>Örnek katalog verisi</small></span></div></div>
          <div className="product-accordion">
            <button onClick={() => setActiveTab(activeTab === "detail" ? "delivery" : "detail")}><span>Ürün detayları ve özellikleri</span><ChevronDown size={16}/></button>
            {activeTab === "detail" && <div><p>{activeProduct.description}</p><p><strong>Materyal:</strong> {activeProduct.material}</p><p><strong>Topuk / taban:</strong> {activeProduct.heelHeight}</p><p><strong>Özellikler:</strong> {activeProduct.features.join(", ")}</p></div>}
            <button onClick={() => setActiveTab(activeTab === "delivery" ? "detail" : "delivery")}><span>Teslimat ve ödeme</span><ChevronDown size={16}/></button>
            {activeTab === "delivery" && <div><p>Gerçek kargo firması, teslimat süresi, ödeme yöntemleri ve taksit seçenekleri henüz yapılandırılmadı. Canlı sipariş alınmamaktadır.</p></div>}
            <button onClick={() => setActiveTab(activeTab === "returns" ? "detail" : "returns")}><span>İade ve değişim</span><ChevronDown size={16}/></button>
            {activeTab === "returns" && <div><p>Satışa açılmadan önce şirket politikası ve yasal metinler eklenmelidir.</p><Link href="/iade-degisim">İade ve değişim sayfası</Link></div>}
            <button onClick={() => setActiveTab(activeTab === "reviews" ? "detail" : "reviews")}><span>Değerlendirmeler</span><ChevronDown size={16}/></button>
            {activeTab === "reviews" && <div><p>Buradaki puan ve değerlendirme sayıları örnek katalog verisidir; gerçek müşteri yorumları sisteme bağlı değildir.</p><button className="button outline" onClick={() => setReviewOpen(true)}>Değerlendirme yaz</button></div>}
          </div>
        </div>
      </div>
      <div className="catalog-disclaimer">Bu ürün sayfası demo katalogla çalışır. Fiyat, stok, fotoğraf, puan, kargo ve ürün özellikleri canlı satış verisi değildir.</div>
    </section>
    {related.length > 0 && <section className="section featured-section"><div className="container"><div className="section-head"><div><div className="kicker">SENİN İÇİN</div><h2>Benzer stiller</h2></div><Link className="section-link" href="/kategori/kadin">Tüm ürünler</Link></div><div className="products">{related.map((item) => <ProductCard key={item.id} product={item}/>)}</div></div></section>}
    {sizeGuide && <div className="modal-backdrop" role="presentation" onClick={() => setSizeGuide(false)}><section className="size-guide-modal" role="dialog" aria-modal="true" aria-label="Beden rehberi" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSizeGuide(false)} aria-label="Kapat">×</button><div className="kicker">BEDEN REHBERİ</div><h2>Doğru bedeni seç</h2><p>Gerçek ayak ölçüleri ve kalıp bilgileri ürün bazında eklenmelidir.</p><table><thead><tr><th>Numara</th><th>Ayak uzunluğu</th></tr></thead><tbody>{activeProduct.sizes.map((item) => <tr key={item}><td>{item}</td><td>Ölçü bilgisi bekleniyor</td></tr>)}</tbody></table><button className="button" onClick={() => setSizeGuide(false)}>Anladım</button></section></div>}
    {priceAlertOpen && <div className="modal-backdrop" role="presentation" onClick={() => setPriceAlertOpen(false)}><section className="size-guide-modal" role="dialog" aria-modal="true" aria-label="Fiyat alarmı" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setPriceAlertOpen(false)} aria-label="Kapat">×</button><div className="kicker">FİYAT ALARMI</div><h2>Fiyat değişikliğinden haberdar ol</h2><p>Bu prototip talebini yalnızca bu tarayıcıda saklar; e-posta gönderimi yapılmaz.</p><form onSubmit={savePriceAlert}><div className="field"><label>E-posta adresi</label><input type="email" required value={alertEmail} onChange={(event) => setAlertEmail(event.target.value)} placeholder="ornek@eposta.com"/></div><button className="button" type="submit">Alarmı kaydet</button></form></section></div>}
    {reviewOpen && <div className="modal-backdrop" role="presentation" onClick={() => setReviewOpen(false)}><section className="size-guide-modal" role="dialog" aria-modal="true" aria-label="Ürün değerlendirmesi" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setReviewOpen(false)} aria-label="Kapat">×</button><div className="kicker">ÜRÜN DEĞERLENDİRMESİ</div><h2>Deneyimini paylaş</h2><p>Yorumun yalnızca bu tarayıcıya demo olarak kaydedilir; mağazada yayınlanmaz.</p><form onSubmit={saveReview}><div className="field"><label>Puanın</label><select value={reviewRating} onChange={(event) => setReviewRating(Number(event.target.value))}>{[5,4,3,2,1].map((rating)=><option key={rating} value={rating}>{rating} / 5</option>)}</select></div><div className="field"><label>Yorumun</label><textarea rows={4} required minLength={5} value={reviewText} onChange={(event) => setReviewText(event.target.value)} placeholder="Ürün deneyimini anlat..."/></div><button className="button" type="submit">Değerlendirmeyi kaydet</button></form></section></div>}
  </>;
}
