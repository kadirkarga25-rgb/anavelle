"use client";

import Link from "next/link";
import { Heart, ArrowUpRight, Star, GitCompareArrows, Check, ShoppingBag, X } from "lucide-react";
import { Product, money } from "@/data/products";
import { getAdminCatalog, hasAdminCatalogOverride, resolveProductImage } from "@/lib/admin-catalog";
import { useEffect, useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const [fav, setFav] = useState(false);
  const [compared, setCompared] = useState(false);
  const [notice, setNotice] = useState("");
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickSize, setQuickSize] = useState<number | undefined>();
  const [quickColor, setQuickColor] = useState("");
  const [quickQty, setQuickQty] = useState(1);
  const [displayProduct, setDisplayProduct] = useState(product);
  const [displayImage, setDisplayImage] = useState(product.image);
  const p = displayProduct;

  useEffect(() => {
    let active = true;
    let objectUrl = "";
    const syncProduct = () => {
      const localOverride = hasAdminCatalogOverride();
      const found = getAdminCatalog().find(item => item.id === product.id);
      const apply = (item: Product | undefined) => {
        if (!item) { setDisplayProduct({ ...product, inStock:false }); return; }
        setDisplayProduct(item);
        void resolveProductImage(item.image).then(src => {
          if (!active) { if (src.startsWith("blob:")) URL.revokeObjectURL(src); return; }
          if (src.startsWith("blob:")) objectUrl = src;
          setDisplayImage(src || item.image);
        });
      };
      if (localOverride) apply(found);
      else void fetch("/api/products", {cache:"no-store"}).then(r=>r.json()).then(data=>{
        if (active && Array.isArray(data.products)) apply(data.products.find((item:Product)=>item.id===product.id) as Product | undefined);
        else if (active) apply(found);
      }).catch(()=>{if(active)apply(found);});
    };
    const sync = () => {
      try {
        setFav((JSON.parse(localStorage.getItem("anavelle-favorites") || "[]") as string[]).includes(product.id));
        setCompared((JSON.parse(localStorage.getItem("anavelle-compare") || "[]") as string[]).includes(p.id));
      } catch {}
    };
    syncProduct();
    sync();
    window.addEventListener("anavelle-admin-catalog-updated", syncProduct);
    window.addEventListener("anavelle-favorites-updated", sync);
    window.addEventListener("anavelle-compare-updated", sync);
    return () => {
      active = false;
      window.removeEventListener("anavelle-admin-catalog-updated", syncProduct);
      window.removeEventListener("anavelle-favorites-updated", sync);
      window.removeEventListener("anavelle-compare-updated", sync);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [product.id]);

  function toggleFavorite(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      const current = JSON.parse(localStorage.getItem("anavelle-favorites") || "[]") as string[];
      const next = current.includes(p.id) ? current.filter((id) => id !== p.id) : [...current, p.id];
      localStorage.setItem("anavelle-favorites", JSON.stringify(next));
      setFav(next.includes(p.id));
      window.dispatchEvent(new Event("anavelle-favorites-updated"));
    } catch { setNotice("Favori tercihi kaydedilemedi."); }
  }

  function toggleCompare(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      const current = JSON.parse(localStorage.getItem("anavelle-compare") || "[]") as string[];
      if (current.includes(p.id)) {
        const next = current.filter((id) => id !== p.id);
        localStorage.setItem("anavelle-compare", JSON.stringify(next));
        setCompared(false);
        setNotice("Karşılaştırmadan çıkarıldı.");
      } else if (current.length >= 4) {
        setNotice("En fazla 4 ürünü karşılaştırabilirsin.");
        return;
      } else {
        const next = [...current, p.id];
        localStorage.setItem("anavelle-compare", JSON.stringify(next));
        setCompared(true);
        setNotice("Karşılaştırma listene eklendi.");
      }
      window.dispatchEvent(new Event("anavelle-compare-updated"));
    } catch { setNotice("Karşılaştırma listesi güncellenemedi."); }
  }

  function quickAdd() {
    if (!quickSize || !quickColor) { setNotice("Hızlı sepete eklemek için beden ve renk seç."); return; }
    try {
      const cart = JSON.parse(localStorage.getItem("anavelle-cart") || "[]") as { id: string; size: number; color?: string; qty: number }[];
      const existing = cart.find((item) => item.id === p.id && item.size === quickSize && item.color === quickColor);
      if (existing) existing.qty += quickQty;
      else cart.push({ id: p.id, size: quickSize, color: quickColor, qty: quickQty });
      localStorage.setItem("anavelle-cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("anavelle-cart-updated"));
      setQuickOpen(false);
      setNotice("Ürün demo sepetine eklendi.");
    } catch { setNotice("Sepet güncellenemedi."); }
  }

  if (!p.inStock) return null;\n\n  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  return (
    <article className="product-card">
      <div className="product-media">
        <Link href={`/urun/${p.id}`} aria-label={p.name}>
          <img className="product-photo" src={displayImage} alt={p.name} loading="lazy" />
        </Link>
        <div className="product-badges">
          {p.tag && <span className="product-tag">{p.tag}</span>}
          {discount > 0 && <span className="discount-tag">%{discount} İNDİRİM</span>}
        </div>
        <div className="product-card-actions">
          <button className={`favorite-button ${fav ? "is-favorite" : ""}`} aria-label={fav ? "Favorilerden çıkar" : "Favorilere ekle"} title={fav ? "Favorilerden çıkar" : "Favorilere ekle"} onClick={toggleFavorite}>
            <Heart size={18} fill={fav ? "currentColor" : "none"} />
          </button>
          <button className={`compare-button ${compared ? "is-compared" : ""}`} aria-label={compared ? "Karşılaştırmadan çıkar" : "Karşılaştırmaya ekle"} title={compared ? "Karşılaştırmadan çıkar" : "Karşılaştırmaya ekle"} onClick={toggleCompare}>
            {compared ? <Check size={17}/> : <GitCompareArrows size={17}/>}
          </button>
        </div>
        <Link className="quick-view" href={`/urun/${p.id}`}>Ürünü incele <ArrowUpRight size={15} /></Link>
      </div>
      <div className="product-info">
        <div className="product-meta"><span>{p.category.toLocaleUpperCase("tr-TR")}</span><span>{p.colors.length} renk</span></div>
        <Link className="product-name" href={`/urun/${p.id}`}>{p.name}</Link>
        <div className="product-rating"><span aria-label={`${p.rating} / 5 demo puanı`}><Star size={13} fill="currentColor"/>{p.rating.toFixed(1)}</span><small>{p.reviewCount} değerlendirme (demo)</small></div>
        <div className="price-row">
          <span className="price">{money(p.price)}</span>
          {p.oldPrice && <span className="old-price">{money(p.oldPrice)}</span>}
        </div>
        <div className="product-card-bottom"><span>{p.inStock ? "Stok durumu: örnek" : "Stok bilgisi yok"}</span><Link href="/karsilastir">Karşılaştır <ArrowUpRight size={12}/></Link></div>
        <button className="product-quick-add" onClick={() => { setQuickSize(undefined); setQuickColor(""); setQuickQty(1); setQuickOpen(true); }}><ShoppingBag size={15}/> Sepete ekle</button>
        {notice && <p className="product-card-notice" role="status">{notice}</p>}
      </div>
      {quickOpen && <div className="modal-backdrop quick-add-backdrop" role="presentation" onClick={() => setQuickOpen(false)}>
        <section className="quick-add-modal" role="dialog" aria-modal="true" aria-label={p.name + " hızlı sepete ekle"} onClick={(event) => event.stopPropagation()}>
          <button className="modal-close" onClick={() => setQuickOpen(false)} aria-label="Kapat"><X size={18}/></button>
          <div className="quick-add-product"><img src={p.image} alt={p.name}/><div><div className="kicker">HIZLI SEPET</div><h3>{p.name}</h3><strong>{money(p.price)}</strong></div></div>
          <div className="field"><label>Renk seç</label><select value={quickColor} onChange={(event) => setQuickColor(event.target.value)}><option value="">Renk seçiniz</option>{p.colors.map((color) => <option key={color} value={color}>{color}</option>)}</select></div>
          <div className="field"><label>Beden seç</label><div className="size-options">{p.sizes.map((size) => <button type="button" key={size} className={quickSize === size ? "size-option selected" : "size-option"} onClick={() => setQuickSize(size)}>{size}</button>)}</div></div>
          <div className="field"><label>Adet</label><select value={quickQty} onChange={(event) => setQuickQty(Number(event.target.value))}>{[1,2,3,4,5].map((qty) => <option key={qty} value={qty}>{qty}</option>)}</select></div>
          <button className="button" onClick={quickAdd}>Sepete ekle · {money(p.price * quickQty)}</button>
          <Link className="quick-add-detail-link" href={"/urun/" + p.id}>Tüm ürün detaylarını gör</Link>
          <p className="catalog-disclaimer">Demo katalog: bu işlem gerçek sipariş oluşturmaz.</p>
        </section>
      </div>}
    </article>
  );
}
