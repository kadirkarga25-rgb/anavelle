"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, MessageCircle, PackageCheck, CreditCard, Ruler, RefreshCw, Truck } from "lucide-react";

const topics = [
  { title: "Doğru bedeni nasıl seçebilirim?", icon: Ruler, answer: "Ürün sayfasındaki beden rehberi bölümünü kontrol et. Gerçek ayak uzunluğu ve kalıp ölçüleri, ürünlerin doğrulanmış verileri eklendiğinde burada gösterilecek." },
  { title: "Siparişimi nasıl takip ederim?", icon: PackageCheck, answer: "Sipariş takip ekranı tasarlandı; gerçek sipariş numarası ve kargo sorgulaması için sipariş veritabanı ile kargo sağlayıcısı bağlantısı kurulması gerekiyor." },
  { title: "Hangi ödeme yöntemleri kullanılabilir?", icon: CreditCard, answer: "Ödeme sağlayıcısı henüz yapılandırılmadı. Canlı ödeme alınmıyor; ödeme seçenekleri ve taksit bilgileri sağlayıcı seçilip test edildikten sonra duyurulacak." },
  { title: "Kargo ne zaman teslim edilir?", icon: Truck, answer: "Kargo firması, gönderim ücreti ve teslimat süreleri henüz onaylanmadı. Bu bilgiler gerçek lojistik anlaşması doğrulandıktan sonra yayınlanacak." },
  { title: "İade veya değişim talebi nasıl oluşturulur?", icon: RefreshCw, answer: "İade ve değişim sayfasından demo talep taslağı oluşturabilirsin. Bu taslak mağazaya gönderilmez. Gerçek iade işlemi için sipariş ve müşteri hizmetleri altyapısı gerekir." },
  { title: "Ürün fiyatı veya stok bilgisi güncel mi?", icon: PackageCheck, answer: "Şu anda örnek katalog kullanılıyor. Ürün fiyatları, beden bazlı stok ve kampanyalar canlı satış sistemiyle bağlantılı değil." }
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);
  return <section className="section container help-page">
    <div className="breadcrumbs"><Link href="/">Anasayfa</Link><span>/</span><span>Yardım merkezi</span></div>
    <div className="help-hero"><div className="kicker">ANAVELLE DESTEK</div><h1 className="page-heading">Nasıl yardımcı olabiliriz?</h1><p className="muted">Alışveriş, beden seçimi ve sipariş süreciyle ilgili sık sorulan sorular.</p><Link className="button" href="/iletisim"><MessageCircle size={15}/> Bize ulaş</Link></div>
    <div className="help-content"><div className="help-topic-list">{topics.map((topic,index)=>{const Icon=topic.icon;return <article className={open===index?"help-topic is-open":"help-topic"} key={topic.title}><button onClick={()=>setOpen(open===index?null:index)} aria-expanded={open===index}><span className="help-topic-icon"><Icon size={18}/></span><strong>{topic.title}</strong><ChevronDown size={17}/></button>{open===index&&<p>{topic.answer}</p>}</article>})}</div>
      <aside className="help-contact-card"><div className="kicker">BİRLİKTE ÇÖZELİM</div><h2>Soruna yanıt bulamadın mı?</h2><p className="muted">İletişim formunu açıp konu başlığını seçebilirsin. Form gönderimi sunucu bağlantısı kurulana kadar demo modundadır.</p><Link className="button" href="/iletisim">İletişim formuna git</Link><Link className="help-order-link" href="/siparis-takip">Sipariş takibi →</Link></aside></div>
    <p className="catalog-disclaimer">Bu yardım merkezi Anavelle mağazasının geliştirme sürümüne aittir. Ödeme, kargo, stok ve iade koşulları canlı satış öncesinde işletme tarafından doğrulanıp yayınlanmalıdır.</p>
  </section>;
}
