"use client";

import Link from "next/link";
import { Heart, ArrowUpRight, Star, GitCompareArrows, Check, ShoppingBag, X } from "lucide-react";
import { Product, money } from "@/data/products";
import { useEffect, useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const [fav, setFav] = useState(false);
  const [compared, setCompared] = useState(false);
  const [notice, setNotice] = useState("");
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickSize, setQuickSize] = useState<number | undefined>();
  const [quickColor, setQuickColor] = useState("");
  const [quickQty, setQuickQty] = useState(1);

  useEffect(() => {
    try {
      setFav((JSON.parse(localStorage.getItem("anavelle-favorites") || "[]") as string[]).includes(product.id));
      setCompared((JSON.parse(localStorage.getItem("anavelle-compare") || "[]") as string[]).includes(product.id));
    } catch {}
    const sync = () => {
      try {
        setFav((JSON.parse(localStorage.getItem("anavelle-favorites") || "[]") as string[]).includes(product.id));
        setCompared((JSON.parse(localStorage.getItem("anavelle-compare") || "[]") as string[]).includes(product.id));
      } catch {}
    };
    window.addEventListener("anavelle-favorites-updated", sync);
    window.addEventListener("anavelle-compare-updated", sync);
    return () => {
      window.removeEventListener("anavelle-favorites-updated", sync);
      window.removeEventListener("anavelle-compare-updated", sync);
    };
  }, [product.id]);

  function toggleFavorite(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      const current = JSON.parse(localStorage.getItem("anavelle-favorites") || "[]") as string[];
      const next = current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id];
      localStorage.setItem("anavelle-favorites", JSON.stringify(next));
      setFav(next.includes(product.id));
      window.dispatchEvent(new Event("anavelle-favorites-updated"));
    } catch { setNotice("Favori tercihi kaydedilemedi."); }
  }

  function toggleCompare(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      const current = JSON.parse(localStorage.getItem("anavelle-compare") || "[]") as string[];
      if (current.includes(product.id)) {
        const next = current.filter((id) => id !== product.id);
        localStorage.setItem("anavelle-compare", JSON.stringify(next));
        setCompared(false);
        setNotice("Karşılaştırmadan çıkarıldı.");
      } else if (current.length >= 4) {
        setNotice("En fazla 4 ürünü karşılaştırabilirsin.");
        return;
      } else {
        const next = [...current, product.id];
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
      const existing = cart.find((item) => item.id === product.id && item.size === quickSize && item.color === quickColor);
      if (existing) existing.qty += quickQty;
      else cart.push({ id: product.id, size: quickSize, color: quickColor, qty: quickQty });
      localStorage.setItem("anavelle-cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("anavelle-cart-updated"));
      setQuickOpen(false);
      setNotice("Ürün demo sepetine eklendi.");
    } catch { setNotice("Sepet güncellenemedi."); }
  }

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <article className="product-card">
      <div className="product-media">
        <Link href={`/urun/${product.id}`} aria-label={product.name}>
          <img className="product-photo" src={product.image} alt={product.name} loading="lazy" />
        </Link>
        <div className="product-badges">
          {product.tag && <span className="product-tag">{product.tag}</span>}
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
        <Link className="quick-view" href={`/urun/${product.id}`}>Ürünü incele <ArrowUpRight size={15} /></Link>
      </div>
      <div className="product-info">
        <div className="product-meta"><span>{product.category.toLocaleUpperCase("tr-TR")}</span><span>{product.colors.length} renk</span></div>
        <Link className="product-name" href={`/urun/${product.id}`}>{product.name}</Link>
        <div className="product-rating"><span aria-label={`${product.rating} / 5 demo puanı`}><Star size={13} fill="currentColor"/>{product.rating.toFixed(1)}</span><small>{product.reviewCount} değerlendirme (demo)</small></div>
        <div className="price-row">
          <span className="price">{money(product.price)}</span>
          {product.oldPrice && <span className="old-price">{money(product.oldPrice)}</span>}
        </div>
        <div className="product-card-bottom"><span>{product.inStock ? "Stok durumu: örnek" : "Stok bilgisi yok"}</span><Link href="/karsilastir">Karşılaştır <ArrowUpRight size={12}/></Link></div>
        <button className="product-quick-add" onClick={() => { setQuickSize(undefined); setQuickColor(""); setQuickQty(1); setQuickOpen(true); }}><ShoppingBag size={15}/> Sepete ekle</button>
        {notice && <p className="product-card-notice" role="status">{notice}</p>}
      </div>
      {quickOpen && <div className="modal-backdrop quick-add-backdrop" role="presentation" onClick={() => setQuickOpen(false)}>
        <section className="quick-add-modal" role="dialog" aria-modal="true" aria-label={product.name + " hızlı sepete ekle"} onClick={(event) => event.stopPropagation()}>
          <button className="modal-close" onClick={() => setQuickOpen(false)} aria-label="Kapat"><X size={18}/></button>
          <div className="quick-add-product"><img src={product.image} alt={product.name}/><div><div className="kicker">HIZLI SEPET</div><h3>{product.name}</h3><strong>{money(product.price)}</strong></div></div>
          <div className="field"><label>Renk seç</label><select value={quickColor} onChange={(event) => setQuickColor(event.target.value)}><option value="">Renk seçiniz</option>{product.colors.map((color) => <option key={color} value={color}>{color}</option>)}</select></div>
          <div className="field"><label>Beden seç</label><div className="size-options">{product.sizes.map((size) => <button type="button" key={size} className={quickSize === size ? "size-option selected" : "size-option"} onClick={() => setQuickSize(size)}>{size}</button>)}</div></div>
          <div className="field"><label>Adet</label><select value={quickQty} onChange={(event) => setQuickQty(Number(event.target.value))}>{[1,2,3,4,5].map((qty) => <option key={qty} value={qty}>{qty}</option>)}</select></div>
          <button className="button" onClick={quickAdd}>Sepete ekle · {money(product.price * quickQty)}</button>
          <Link className="quick-add-detail-link" href={"/urun/" + product.id}>Tüm ürün detaylarını gör</Link>
          <p className="catalog-disclaimer">Demo katalog: bu işlem gerçek sipariş oluşturmaz.</p>
        </section>
      </div>}
    </article>
  );
}
