"use client";

import Link from "next/link";
import { useState } from "react";
import { ClipboardList, RefreshCw, ShieldCheck } from "lucide-react";

export default function ReturnsPage() {
  const [message, setMessage] = useState("");
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const prior = JSON.parse(localStorage.getItem("anavelle-returns-demo") || "[]") as Record<string, FormDataEntryValue>[];
      const reference = "DEMO-" + Date.now().toString().slice(-7);
      prior.push({ ...data, reference, createdAt: new Date().toISOString() });
      localStorage.setItem("anavelle-returns-demo", JSON.stringify(prior));
      setMessage(`Demo talep taslağı ${reference} numarasıyla bu tarayıcıda saklandı. Mağazaya iletilmedi.`);
      form.reset();
    } catch { setMessage("Talep taslağı tarayıcıya kaydedilemedi."); }
  }
  return <section className="section container returns-page">
    <div className="breadcrumbs"><Link href="/">Anasayfa</Link><span>/</span><span>İade ve değişim</span></div>
    <div className="returns-layout">
      <div className="returns-intro"><div className="kicker">MÜŞTERİ DENEYİMİ</div><h1 className="page-heading">İade ve değişim</h1><p className="muted">Siparişinle ilgili bir talebin varsa bilgilerini hazırlayabilirsin. Gerçek satış başlamadan önce Anavelle’nin iade politikası ve yasal metinleri onaylanmalıdır.</p>
        <div className="account-benefits"><div><ClipboardList/><span><strong>Sipariş bilgilerini hazırla</strong><small>Sipariş numaran ve sipariş e-postan talep için gereklidir.</small></span></div><div><RefreshCw/><span><strong>Talebini belirt</strong><small>İade, değişim veya ürünle ilgili destek seçeneğini seç.</small></span></div><div><ShieldCheck/><span><strong>Güvenli işlem</strong><small>Bu form yalnızca tarayıcıda demo taslağı oluşturur; sunucuya gönderim yapılmaz.</small></span></div></div>
        <div className="returns-policy-note"><strong>Satış öncesi kontrol</strong><p>İade süresi, kargo masrafı, istisnalar ve işlem adımları işletmenin gerçek politikasıyla doğrulanmadan burada taahhüt verilmez.</p></div>
      </div>
      <form className="panel returns-form" onSubmit={submit}>
        <div className="kicker">TALEP TASLAĞI</div><h2>Nasıl yardımcı olabiliriz?</h2>
        <div className="field"><label htmlFor="return-order">Sipariş numarası</label><input id="return-order" name="orderNumber" required placeholder="Örn. ANV-10001"/></div>
        <div className="field"><label htmlFor="return-email">Sipariş e-posta adresi</label><input id="return-email" name="email" type="email" required placeholder="ornek@eposta.com"/></div>
        <div className="field"><label htmlFor="return-product">Ürün adı / kodu</label><input id="return-product" name="product" required placeholder="Ürün adını yaz"/></div>
        <div className="field"><label htmlFor="return-type">Talep türü</label><select id="return-type" name="type" required><option value="">Seçiniz</option><option>İade</option><option>Değişim</option><option>Hasarlı ürün</option><option>Yanlış ürün</option><option>Diğer destek</option></select></div>
        <div className="field"><label htmlFor="return-reason">Açıklama</label><textarea id="return-reason" name="reason" rows={4} required minLength={8} placeholder="Talebini kısaca açıkla"/></div>
        <button className="button" type="submit">Demo talep taslağı oluştur</button>
        {message && <p className="account-feedback" role="status">{message}</p>}
        <p className="account-demo-note">Bu form gerçek iade başlatmaz, e-posta göndermez ve sipariş doğrulaması yapmaz.</p>
      </form>
    </div>
    <div className="returns-faq-link"><span>Başka bir konuda yardıma mı ihtiyacın var?</span><Link href="/iletisim">İletişim sayfasına git →</Link></div>
  </section>;
}
