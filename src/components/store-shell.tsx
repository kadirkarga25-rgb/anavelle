"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, UserRound, ShoppingBag, Heart, Menu, X, ChevronUp, Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

export function StoreShell({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [cookieOpen, setCookieOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const sync = () => {
      try { setCount(JSON.parse(localStorage.getItem("anavelle-cart") || "[]").reduce((s: number, i: {qty:number}) => s + i.qty, 0)); } catch {}
      setShowTop(window.scrollY > 480);
    };
    sync();
    const t = window.setTimeout(() => {
      if (!localStorage.getItem("anavelle-cookie-choice")) setCookieOpen(true);
    }, 900);
    const n = window.setTimeout(() => {
      if (!sessionStorage.getItem("anavelle-news-seen")) setNewsOpen(true);
    }, 11000);
    window.addEventListener("storage", sync);
    window.addEventListener("scroll", sync);
    return () => { window.clearTimeout(t); window.clearTimeout(n); window.removeEventListener("storage", sync); window.removeEventListener("scroll", sync); };
  }, []);

  function addNewsletter(email: string) {
    const prior = JSON.parse(localStorage.getItem("anavelle-newsletter-demo") || "[]");
    if (!prior.includes(email)) localStorage.setItem("anavelle-newsletter-demo", JSON.stringify([...prior, email]));
    sessionStorage.setItem("anavelle-news-seen", "1");
    setNewsOpen(false);
    window.dispatchEvent(new Event("anavelle-toast"));
  }

  useEffect(() => {
    const update = () => { try { setCount(JSON.parse(localStorage.getItem("anavelle-cart") || "[]").reduce((s: number, i: {qty:number}) => s + i.qty, 0)); } catch {} };
    window.addEventListener("anavelle-cart-updated", update);
    return () => window.removeEventListener("anavelle-cart-updated", update);
  }, []);

  return <>
    <div className="topline">ÜCRETSİZ KARGO FIRSATLARI · ZAMANSIZ TASARIMLAR · ANAVELLE</div>
    <header className="header"><div className="container header-row">
      <button aria-label="Menüyü aç" className="outline-button" onClick={() => setMenuOpen(!menuOpen)} style={{background:"none",border:0,display:"none"}}><Menu/></button>
      <Link className="brand" href="/">ANA<em>VELLE</em></Link>
      <nav className="nav"><Link href="/kategori/kadin">KADIN</Link><Link href="/kategori/sandalet">SANDALET</Link><Link href="/kategori/terlik">TERLİK</Link><Link href="/kategori/bot">BOT</Link><Link href="/kategori/outlet">OUTLET</Link></nav>
      <div className="actions"><form action="/arama" style={{display:"flex",alignItems:"center",gap:5}}><input className="search" aria-label="Ürün ara" name="q" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ürün ara..." /><button aria-label="Ara" type="submit" style={{background:"none",border:0}}><Search size={18}/></button></form><Link aria-label="Hesabım" href="/hesabim"><UserRound size={19}/></Link><Link aria-label="Favorilerim" href="/favoriler"><Heart size={19}/></Link><Link aria-label="Sepetim" href="/sepet"><ShoppingBag size={19}/><span> {count || ""}</span></Link></div>
    </div>
    {menuOpen && <div className="container" style={{paddingBottom:18,display:"grid",gap:12}}><button onClick={()=>setMenuOpen(false)} style={{border:0,background:"transparent",textAlign:"right"}}><X/></button><Link href="/kategori/kadin">Kadın</Link><Link href="/kategori/sandalet">Sandalet</Link><Link href="/kategori/terlik">Terlik</Link><Link href="/kategori/bot">Bot</Link><Link href="/kategori/outlet">Outlet</Link></div>}
    </header>
    <main>{children}</main>
    <section className="newsletter"><div className="kicker">ANAVELLE'DEN HABERLER</div><h2>İlham veren adımlar, e-posta kutunda.</h2><p className="muted">Yeni koleksiyonlardan ve özel fırsatlardan haberdar ol.</p><form className="newsletter-form" onSubmit={e=>{e.preventDefault();addNewsletter(String(new FormData(e.currentTarget).get("email")));}}><input required type="email" name="email" placeholder="E-posta adresin" aria-label="E-posta adresin"/><button className="button" type="submit">Kaydol</button></form><small className="muted">Bu sürümde kayıtlar yalnızca bu tarayıcıda demo olarak tutulur.</small></section>
    <footer className="footer"><div className="container"><div className="footer-grid"><div><div className="brand">ANA<em>VELLE</em></div><p>Zarafetin konforla buluştuğu yer.<br/>Her adımda kendine daha yakın.</p></div><div><h3>ALIŞVERİŞ</h3><Link href="/kategori/kadin">Kadın</Link><Link href="/kategori/sandalet">Sandalet</Link><Link href="/kategori/terlik">Terlik</Link><Link href="/kategori/outlet">Outlet</Link></div><div><h3>YARDIM</h3><Link href="/siparis-takip">Sipariş takibi</Link><Link href="/hesabim">Hesabım</Link><Link href="/iade-degisim">İade ve değişim</Link><Link href="/iletisim">İletişim</Link></div><div><h3>GÜVENLİ ALIŞVERİŞ</h3><p><ShieldCheck size={15} style={{display:"inline",marginRight:6}}/>Güvenli alışveriş deneyimi</p><p><Truck size={15} style={{display:"inline",marginRight:6}}/>Teslimat bilgileri</p><p><RefreshCw size={15} style={{display:"inline",marginRight:6}}/>İade bilgilendirmesi</p><p><Headphones size={15} style={{display:"inline",marginRight:6}}/>Müşteri desteği</p></div></div><div style={{borderTop:"1px solid #574941",marginTop:32,paddingTop:20,fontSize:11,color:"#bfb2a8"}}>© {new Date().getFullYear()} Anavelle. Tüm hakları saklıdır. · Demo mağaza; gerçek ödeme alınmaz.</div></div></footer>
    {cookieOpen && <div role="dialog" aria-label="Çerez tercihleri" style={{position:"fixed",left:18,bottom:18,zIndex:40,width:"min(360px,calc(100% - 36px))",background:"white",boxShadow:"0 8px 40px #0002",padding:22,border:"1px solid #eee"}}><button aria-label="Kapat" onClick={()=>{setCookieOpen(false);localStorage.setItem("anavelle-cookie-choice","dismissed")}} style={{float:"right",border:0,background:"none"}}><X size={17}/></button><strong>Gizliliğin bizim için önemli</strong><p className="muted">Bu başlangıç sürümü yalnızca sepet ve tercih demolarını tarayıcıda saklar. Analitik çerez kullanılmıyor.</p><button className="button" onClick={()=>{localStorage.setItem("anavelle-cookie-choice","accepted");setCookieOpen(false)}}>Anladım</button></div>}
    {newsOpen && <div role="dialog" aria-label="Bülten kaydı" style={{position:"fixed",right:20,bottom:20,zIndex:35,width:"min(370px,calc(100% - 40px))",background:"#FAF7F2",padding:24,boxShadow:"0 15px 50px #0002",border:"1px solid #e6d9c9"}}><button aria-label="Kapat" onClick={()=>{setNewsOpen(false);sessionStorage.setItem("anavelle-news-seen","1")}} style={{float:"right",border:0,background:"none"}}><X size={17}/></button><div className="kicker">KÜÇÜK BİR AYRICALIK</div><h3 style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:26,margin:"12px 0"}}>Anavelle dünyasına katıl.</h3><p className="muted">Yeni koleksiyonları ve özel fırsatları ilk sen keşfet.</p><form onSubmit={e=>{e.preventDefault();addNewsletter(String(new FormData(e.currentTarget).get("email")));}}><input required type="email" name="email" placeholder="E-posta adresin" style={{padding:12,width:"100%",border:"1px solid #ded5cc",marginBottom:10}}/><button className="button" style={{width:"100%"}}>Bültene katıl</button></form><p style={{fontSize:10,color:"#88796d"}}>Demo: e-posta sunucuya gönderilmez.</p></div>}
    {showTop && <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} aria-label="Sayfa başına dön" style={{position:"fixed",bottom:20,left:20,zIndex:25,width:42,height:42,border:0,background:"#24150F",color:"white",display:"grid",placeItems:"center"}}><ChevronUp/></button>}
  </>;
}