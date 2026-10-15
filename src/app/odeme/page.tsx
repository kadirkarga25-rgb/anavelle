"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CreditCard, LockKeyhole, PackageCheck, Truck } from "lucide-react";
import { products, money, Product } from "@/data/products";
import { getAdminCatalog } from "@/lib/admin-catalog";
import { CatalogImage } from "@/components/catalog-image";

type CartItem = { id: string; size: number; color?: string; qty: number };

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [catalog, setCatalog] = useState<Product[]>(products);
  const [payment, setPayment] = useState("card");
  const [delivery, setDelivery] = useState("standard");
  const [message, setMessage] = useState("");
  const [terms, setTerms] = useState(false);
  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem("anavelle-cart") || "[]") as CartItem[]); } catch { setCart([]); }
    setCatalog(getAdminCatalog());
    const syncCatalog = () => setCatalog(getAdminCatalog());
    window.addEventListener("anavelle-admin-catalog-updated", syncCatalog);
    return () => window.removeEventListener("anavelle-admin-catalog-updated", syncCatalog);
  }, []);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (catalog.find((p) => p.id === item.id)?.price || 0) * item.qty, 0), [cart, catalog]);
  const shipping = delivery === "standard" ? 0 : 0;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!terms) { setMessage("Devam etmek için bilgilendirme onay kutusunu işaretlemelisin."); return; }
    setMessage("Demo kontrol tamamlandı; gerçek sipariş oluşturulmadı ve form bilgilerin gönderilmedi. Canlı ödeme, sipariş, stok ve kargo bağlantıları kurulmadan bu mağazada ödeme alınamaz.");
  }

  return <section className="section container checkout-page">
    <div className="breadcrumbs"><Link href="/">Anasayfa</Link><span>/</span><Link href="/sepet">Sepetim</Link><span>/</span><span>Ödeme</span></div>
    <div className="checkout-heading"><div><div className="kicker">GÜVENLİ ALIŞVERİŞ AKIŞI</div><h1 className="page-heading">Teslimat ve ödeme</h1><p className="muted">Bu ekran ödeme sürecinin arayüz prototipidir. Sipariş ve ödeme alınmaz.</p></div><div className="checkout-step"><span>1</span> Teslimat <span>2</span> Ödeme <span>3</span> Onay</div></div>
    {cart.length === 0 ? <div className="empty-cart"><PackageCheck size={32}/><h2>Sepetinde ürün yok.</h2><p>Ödeme adımına geçmek için önce bir ürün seçmelisin.</p><Link className="button" href="/kategori/kadin">Koleksiyonu keşfet <ArrowRight size={15}/></Link></div> :
    <div className="checkout-layout">
      <form className="checkout-form" onSubmit={submit}>
        <section className="checkout-section"><div className="checkout-section-title"><span>01</span><div><h2>İletişim bilgileri</h2><p>Sipariş bilgilendirmesi için</p></div></div>
          <div className="checkout-fields"><div className="field"><label htmlFor="checkout-email">E-posta</label><input id="checkout-email" type="email" required autoComplete="email" placeholder="ornek@eposta.com"/></div><div className="field"><label htmlFor="checkout-phone">Telefon</label><input id="checkout-phone" type="tel" required autoComplete="tel" placeholder="05xx xxx xx xx"/></div></div>
        </section>
        <section className="checkout-section"><div className="checkout-section-title"><span>02</span><div><h2>Teslimat adresi</h2><p>Gönderim adresini gir</p></div></div>
          <div className="checkout-fields"><div className="field"><label htmlFor="checkout-name">Ad</label><input id="checkout-name" required autoComplete="given-name"/></div><div className="field"><label htmlFor="checkout-surname">Soyad</label><input id="checkout-surname" required autoComplete="family-name"/></div><div className="field"><label htmlFor="checkout-city">İl</label><input id="checkout-city" required autoComplete="address-level1"/></div><div className="field"><label htmlFor="checkout-district">İlçe</label><input id="checkout-district" required autoComplete="address-level2"/></div><div className="field full-field"><label htmlFor="checkout-address">Açık adres</label><textarea id="checkout-address" required rows={3} autoComplete="street-address" placeholder="Mahalle, cadde/sokak, bina ve daire no"/></div><div className="field full-field"><label htmlFor="checkout-note">Sipariş notu (isteğe bağlı)</label><textarea id="checkout-note" rows={2} placeholder="Teslimatla ilgili ek not"/></div></div>
        </section>
        <section className="checkout-section"><div className="checkout-section-title"><span>03</span><div><h2>Teslimat seçeneği</h2><p>Demo seçenekler · gerçek kargo bağlantısı yok</p></div></div>
          <div className="checkout-option-list"><label className={delivery==="standard"?"checkout-option selected":"checkout-option"}><input type="radio" name="delivery" value="standard" checked={delivery==="standard"} onChange={()=>setDelivery("standard")}/><Truck/><span><strong>Standart teslimat</strong><small>Gönderim süresi ve ücreti henüz doğrulanmadı</small></span><b>—</b></label><label className={delivery==="pickup"?"checkout-option selected":"checkout-option"}><input type="radio" name="delivery" value="pickup" checked={delivery==="pickup"} onChange={()=>setDelivery("pickup")}/><PackageCheck/><span><strong>Alternatif teslimat</strong><small>Bu seçenek demo amaçlıdır, gerçek hizmet değildir</small></span><b>—</b></label></div>
        </section>
        <section className="checkout-section"><div className="checkout-section-title"><span>04</span><div><h2>Ödeme yöntemi</h2><p>Gerçek ödeme sağlayıcısı henüz bağlı değil</p></div></div>
          <div className="checkout-option-list"><label className={payment==="card"?"checkout-option selected":"checkout-option"}><input type="radio" name="payment" value="card" checked={payment==="card"} onChange={()=>setPayment("card")}/><CreditCard/><span><strong>Kredi / banka kartı</strong><small>Güvenli ödeme entegrasyonu bekleniyor</small></span></label><label className={payment==="transfer"?"checkout-option selected":"checkout-option"}><input type="radio" name="payment" value="transfer" checked={payment==="transfer"} onChange={()=>setPayment("transfer")}/><LockKeyhole/><span><strong>Havale / EFT</strong><small>Gerçek banka bilgileri yapılandırılmadı</small></span></label></div>
        </section>
        <label className="checkout-consent"><input type="checkbox" checked={terms} onChange={(event)=>setTerms(event.target.checked)}/><span>Bu ekranın demo olduğunu, form bilgilerimin sunucuya gönderilmediğini ve gerçek sipariş oluşmayacağını anladım.</span></label>
        <button className="button checkout-submit" type="submit">Demo kontrolünü tamamla <ArrowRight size={16}/></button>
        {message && <p className="account-feedback" role="status">{message}</p>}
        <Link href="/sepet" className="checkout-back"><ArrowLeft size={14}/> Sepete dön</Link>
      </form>
      <aside className="checkout-summary"><div className="kicker">SİPARİŞ ÖZETİ</div><h2>Sepetin ({itemCount})</h2>
        <div className="checkout-items">{cart.map((item)=>{const p=catalog.find((product)=>product.id===item.id);if(!p)return null;return <div className="checkout-item" key={item.id+"-"+item.size+"-"+item.color}><CatalogImage image={p.image} alt={p.name}/><div><strong>{p.name}</strong><small>Beden {item.size}{item.color?" · "+item.color:""} · {item.qty} adet</small><b>{money(p.price*item.qty)}</b></div></div>})}</div>
        <div className="summary-line"><span>Ürünler</span><strong>{money(subtotal)}</strong></div><div className="summary-line"><span>Kargo</span><strong>{shipping===0?"Belirlenecek":money(shipping)}</strong></div><div className="summary-total"><span>Genel toplam</span><strong>{money(subtotal+shipping)}</strong></div>
        <div className="checkout-security"><LockKeyhole size={17}/><span>Ödeme sağlayıcısı ve güvenli sipariş altyapısı etkin değil. Kart bilgisi girme veya ödeme yapma.</span></div>
      </aside>
    </div>}
  </section>;
}
