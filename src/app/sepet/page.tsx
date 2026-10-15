"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { products, money, Product } from "@/data/products";
import { getAdminCatalog, hasAdminCatalogOverride } from "@/lib/admin-catalog";
import { CatalogImage } from "@/components/catalog-image";

type CartItem = { id: string; size: number; color?: string; qty: number };

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [catalog, setCatalog] = useState<Product[]>(products);
  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem("anavelle-cart") || "[]")); } catch {}
    setCatalog(getAdminCatalog());
    if (!hasAdminCatalogOverride()) void fetch("/api/products",{cache:"no-store"}).then(r=>r.json()).then(data=>{if(Array.isArray(data.products))setCatalog(data.products as Product[]);}).catch(()=>{});
    const sync = () => setCatalog(getAdminCatalog());
    window.addEventListener("anavelle-admin-catalog-updated", sync);
    return () => window.removeEventListener("anavelle-admin-catalog-updated", sync);
  }, []);

  function save(items: CartItem[]) {
    setCart(items);
    localStorage.setItem("anavelle-cart", JSON.stringify(items));
    window.dispatchEvent(new Event("anavelle-cart-updated"));
  }

  const total = cart.reduce((sum, item) => sum + (catalog.find((product) => product.id === item.id)?.price || 0) * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return <section className="section container cart-page">
    <div className="breadcrumbs"><Link href="/">Anasayfa</Link><span>/</span><span>Sepetim</span></div>
    <div className="cart-heading"><div><div className="kicker">ALIŞVERİŞİN</div><h1>Sepetim <span>({itemCount} ürün)</span></h1></div><Link className="section-link" href="/kategori/kadin">Alışverişe devam et <ArrowRight size={15} /></Link></div>
    {cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={32} /><h2>Sepetin henüz boş.</h2><p>Tarzına eşlik edecek yeni favorini keşfet.</p><Link className="button" href="/kategori/kadin">Koleksiyonu keşfet <ArrowRight size={15} /></Link></div> :
      <div className="cart-layout">
        <div className="cart-items">{cart.map((item, index) => {
          const product = catalog.find((entry) => entry.id === item.id);
          if (!product) return null;
          return <article className="cart-item" key={item.id + "-" + item.size + "-" + (item.color || "")}>
            <Link href={"/urun/" + product.id} className="cart-item-image"><CatalogImage image={product.image} alt={product.name} /></Link>
            <div className="cart-item-details"><div className="kicker">{product.category}</div><Link className="cart-item-name" href={"/urun/" + product.id}>{product.name}</Link><p>Beden: <strong>{item.size}</strong>{item.color && <> · Renk: <strong>{item.color}</strong></>}</p><div className="cart-item-bottom"><select aria-label="Adet" value={item.qty} onChange={(event) => save(cart.map((entry, position) => index === position ? { ...entry, qty: Number(event.target.value) } : entry))}>{[1, 2, 3, 4, 5].map((quantity) => <option key={quantity} value={quantity}>{quantity} adet</option>)}</select><button onClick={() => save(cart.filter((_, position) => position !== index))}><Trash2 size={14} /> Kaldır</button></div></div>
            <strong className="cart-item-price">{money(product.price * item.qty)}</strong>
          </article>;
        })}</div>
        <aside className="cart-summary"><div className="kicker">SİPARİŞ ÖZETİ</div><h2>Toplamın</h2><div className="summary-line"><span>Ürünler ({itemCount} adet)</span><strong>{money(total)}</strong></div><div className="summary-line"><span>Kargo</span><span>Entegrasyon bekleniyor</span></div><div className="summary-total"><span>Genel toplam</span><strong>{money(total)}</strong></div><Link className="button checkout-demo" href="/odeme">Teslimat ve ödemeye geç <ArrowRight size={15} /></Link><p>Bu mağaza şu anda gerçek ödeme almaz. Kargo, stok ve ödeme servisleri bağlanmadan sipariş oluşturulamaz.</p><div className="summary-trust"><span>✓ Sepet bilgisi tarayıcıda saklanır</span><span>✓ Ürün/beden seçimini düzenleyebilirsin</span></div></aside>
      </div>}
  </section>;
}
