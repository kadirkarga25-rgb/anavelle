"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, UserRound, ShoppingBag, Heart, Menu, X, ChevronUp, Truck, ShieldCheck, RefreshCw, Headphones, MessageCircle, ArrowRight } from "lucide-react";

const navItems = [
  { label: "KADIN", href: "/kategori/kadin" },
  { label: "SANDALET", href: "/kategori/sandalet" },
  { label: "TERLİK", href: "/kategori/terlik" },
  { label: "BOT", href: "/kategori/bot" },
  { label: "OUTLET", href: "/kategori/outlet" }
];

export function StoreShell({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [cookieOpen, setCookieOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");

  useEffect(() => {
    const sync = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("anavelle-cart") || "[]") as { qty: number }[];
        setCount(cart.reduce((sum, item) => sum + item.qty, 0));
      } catch {}
      setShowTop(window.scrollY > 480);
    };
    sync();
    const cookieTimer = window.setTimeout(() => {
      if (!localStorage.getItem("anavelle-cookie-choice")) setCookieOpen(true);
    }, 1000);
    const newsletterTimer = window.setTimeout(() => {
      if (!sessionStorage.getItem("anavelle-news-seen")) setNewsOpen(true);
    }, 14000);
    window.addEventListener("storage", sync);
    window.addEventListener("scroll", sync);
    window.addEventListener("anavelle-cart-updated", sync);
    return () => {
      window.clearTimeout(cookieTimer);
      window.clearTimeout(newsletterTimer);
      window.removeEventListener("storage", sync);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("anavelle-cart-updated", sync);
    };
  }, []);

  function addNewsletter(email: string) {
    const clean = email.trim().toLowerCase();
    if (!clean) return;
    try {
      const prior = JSON.parse(localStorage.getItem("anavelle-newsletter-demo") || "[]") as string[];
      if (!prior.includes(clean)) localStorage.setItem("anavelle-newsletter-demo", JSON.stringify([...prior, clean]));
    } catch {}
    sessionStorage.setItem("anavelle-news-seen", "1");
    setNewsOpen(false);
  }

  return <>
    <div className="topline"><span>ANAVELLE</span><i /> Zamansız tasarımlar, günlük stil <i /> Yeni sezonu keşfet</div>
    <header className="header">
      <div className="container header-row">
        <button className="mobile-menu-toggle" aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        <Link className="brand" href="/" aria-label="Anavelle ana sayfa">ANA<em>VELLE</em><small>TIMELESS COMFORT</small></Link>
        <nav className="nav" aria-label="Ana menü">{navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
        <div className="actions">
          <form className="header-search" action="/arama"><input className="search" aria-label="Ürün ara" name="q" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ürün ara..." /><button aria-label="Ara" type="submit"><Search size={18} /></button></form>
          <Link aria-label="Hesabım" href="/hesabim"><UserRound size={19} /></Link>
          <Link aria-label="Favorilerim" href="/favoriler"><Heart size={19} /></Link>
          <Link className="cart-link" aria-label="Sepetim" href="/sepet"><ShoppingBag size={19} /><span>{count}</span></Link>
        </div>
      </div>
      {menuOpen && <div className="mobile-menu"><div className="mobile-menu-inner">{navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowRight size={15} /></Link>)}<Link href="/siparis-takip" onClick={() => setMenuOpen(false)}>SİPARİŞ TAKİBİ<ArrowRight size={15} /></Link><Link href="/iletisim" onClick={() => setMenuOpen(false)}>İLETİŞİM<ArrowRight size={15} /></Link></div></div>}
      <div className="category-ribbon"><div className="container">{navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/siparis-takip">SİPARİŞ TAKİBİ</Link></div></div>
    </header>

    <main>{children}</main>

    <section className="newsletter"><div className="kicker">ANAVELLE'DEN HABERLER</div><h2>İlham veren adımlar, e-posta kutunda.</h2><p className="muted">Yeni koleksiyonlardan ve özel fırsatlardan haberdar ol.</p><form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); addNewsletter(String(new FormData(event.currentTarget).get("email"))); }}><input required type="email" name="email" placeholder="E-posta adresin" aria-label="E-posta adresin" /><button className="button" type="submit">Kaydol</button></form><small className="muted">Bülten servisi bağlanana kadar kayıt bu tarayıcıda demo olarak tutulur.</small></section>

    <footer className="footer"><div className="container"><div className="footer-grid">
      <div><Link className="brand footer-brand" href="/">ANA<em>VELLE</em><small>TIMELESS COMFORT</small></Link><p>Zarafetin konforla buluştuğu yer.<br />Her adımda kendine daha yakın.</p><p className="footer-note">Bağımsız bir marka deneyimi · Anavelle</p></div>
      <div><h3>KOLEKSİYON</h3><Link href="/kategori/kadin">Kadın</Link><Link href="/kategori/sandalet">Sandalet</Link><Link href="/kategori/terlik">Terlik</Link><Link href="/kategori/bot">Bot</Link><Link href="/kategori/outlet">Outlet</Link></div>
      <div><h3>YARDIM</h3><Link href="/siparis-takip">Sipariş takibi</Link><Link href="/hesabim">Hesabım</Link><Link href="/iade-degisim">İade ve değişim</Link><Link href="/iletisim">İletişim</Link></div>
      <div><h3>ALIŞVERİŞ BİLGİLERİ</h3><p><ShieldCheck size={15} /> Güvenli alışveriş altyapısı hazırlanıyor</p><p><Truck size={15} /> Teslimat bilgileri</p><p><RefreshCw size={15} /> İade bilgilendirmesi</p><p><Headphones size={15} /> Müşteri desteği</p></div>
    </div><div className="footer-bottom"><span>© {new Date().getFullYear()} Anavelle. Tüm hakları saklıdır.</span><span>Bu sürümde gerçek ödeme ve sipariş servisi etkin değildir.</span><Link href="/iade-degisim">Alışveriş koşulları</Link></div></div></footer>

    <button className="support-launcher" onClick={() => setSupportOpen(!supportOpen)} aria-label={supportOpen ? "Destek panelini kapat" : "Destek panelini aç"}><MessageCircle size={20} /><span>Yardım</span></button>
    {supportOpen && <section className="support-panel" role="dialog" aria-label="Anavelle müşteri desteği"><div className="support-head"><div><small>ANAVELLE DESTEK</small><strong>Nasıl yardımcı olabiliriz?</strong></div><button aria-label="Kapat" onClick={() => setSupportOpen(false)}><X size={18} /></button></div><p className="muted">Destek paneli beta sürümündedir. Mesaj gönderim servisi henüz bağlanmadı.</p><form onSubmit={(event) => { event.preventDefault(); setSupportMessage("Destek servisi henüz bağlanmadığı için mesaj gönderilmedi. Lütfen daha sonra tekrar deneyin."); }}><label htmlFor="support-topic">Konu</label><select id="support-topic"><option>Ürün hakkında</option><option>Sipariş desteği</option><option>Beden ve kalıp</option><option>İade ve değişim</option></select><label htmlFor="support-text">Mesajınız</label><textarea id="support-text" required rows={3} placeholder="Size nasıl yardımcı olabiliriz?" /><button className="button" type="submit">Mesajı hazırla</button></form>{supportMessage && <p className="support-message" role="status">{supportMessage}</p>}<Link href="/iletisim" className="support-contact">İletişim sayfasına git <ArrowRight size={14} /></Link></section>}

    {cookieOpen && <div className="cookie-card" role="dialog" aria-label="Çerez tercihleri"><button aria-label="Kapat" onClick={() => { setCookieOpen(false); localStorage.setItem("anavelle-cookie-choice", "dismissed"); }}><X size={17} /></button><strong>Gizliliğin bizim için önemli</strong><p>Bu sürümde sepet ve tercih demoları tarayıcında saklanır. Analitik çerez kullanılmıyor.</p><button className="button" onClick={() => { localStorage.setItem("anavelle-cookie-choice", "accepted"); setCookieOpen(false); }}>Anladım</button></div>}

    {newsOpen && <div className="newsletter-popup" role="dialog" aria-label="Bülten kaydı"><button className="popup-close" aria-label="Kapat" onClick={() => { setNewsOpen(false); sessionStorage.setItem("anavelle-news-seen", "1"); }}><X size={17} /></button><div className="kicker">KÜÇÜK BİR AYRICALIK</div><h3>Anavelle dünyasına katıl.</h3><p className="muted">Yeni koleksiyonları ve özel fırsatları ilk sen keşfet.</p><form onSubmit={(event) => { event.preventDefault(); addNewsletter(String(new FormData(event.currentTarget).get("email"))); }}><input required type="email" name="email" placeholder="E-posta adresin" /><button className="button">Bültene katıl</button></form><small>Kayıt servisi bağlanana kadar e-posta sunucuya gönderilmez.</small></div>}

    {showTop && <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Sayfa başına dön"><ChevronUp /></button>}
  </>;
}
