"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, PackageCheck, Heart, RefreshCw } from "lucide-react";

type Mode = "login" | "register" | "forgot";

export default function AccountPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function changeMode(next: Mode) { setMode(next); setMessage(""); setShowPassword(false); }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "forgot") setMessage("Şifre yenileme e-postası gönderilmedi; güvenli hesap servisi henüz yapılandırılmadı.");
    else setMessage("Form doğrulandı ancak gerçek oturum açma/üyelik sunucusu bağlı olmadığı için hesabın oluşturulmadı. Şifren bu demo tarafından kaydedilmedi.");
  }

  return <section className="section container account-page">
    <div className="account-layout">
      <div className="account-intro">
        <div className="kicker">ANAVELLE HESABIN</div>
        <h1 className="page-heading">Sana özel alanın.</h1>
        <p className="muted">Siparişlerini ve tercihlerini tek yerde takip edeceğin kişisel alan.</p>
        <div className="account-benefits">
          <div><PackageCheck/><span><strong>Siparişlerini takip et</strong><small>Sipariş ve kargo bilgileri hesap servisi bağlandığında görünür.</small></span></div>
          <div><Heart/><span><strong>Favorilerini biriktir</strong><small>Şimdilik favori ürünler bu tarayıcıda tutulur.</small></span></div>
          <div><RefreshCw/><span><strong>İade taleplerini yönet</strong><small>İade servisi bağlandığında taleplerini buradan izleyebilirsin.</small></span></div>
        </div>
        <div className="account-security-note"><LockKeyhole size={17}/><span>Güvenlik notu: Bu prototipte şifreler kaydedilmez ve gerçek kullanıcı hesabı açılmaz.</span></div>
      </div>
      <div className="panel account-form-panel">
        {mode !== "forgot" ? <div className="account-tabs"><button className={mode === "login" ? "active" : ""} onClick={() => changeMode("login")}>Giriş yap</button><button className={mode === "register" ? "active" : ""} onClick={() => changeMode("register")}>Üye ol</button></div> :
          <button className="account-back-link" onClick={() => changeMode("login")}>← Giriş sayfasına dön</button>}
        <div className="kicker">{mode === "login" ? "TEKRAR HOŞ GELDİN" : mode === "register" ? "ANAVELLE'YE KATIL" : "HESAP KURTARMA"}</div>
        <h2>{mode === "login" ? "Hesabına giriş yap" : mode === "register" ? "Yeni hesap oluştur" : "Şifreni yenile"}</h2>
        <p className="muted">{mode === "forgot" ? "Hesabına ait e-posta adresini yaz." : "Ürünlerin, tercihlerin ve siparişlerin için kişisel alanın."}</p>
        <form onSubmit={submit}>
          {mode === "register" && <div className="field"><label htmlFor="account-name">Ad soyad</label><input id="account-name" name="name" required autoComplete="name" placeholder="Adın ve soyadın"/></div>}
          <div className="field"><label htmlFor="account-email">E-posta</label><input id="account-email" name="email" required type="email" autoComplete="email" placeholder="ornek@eposta.com"/></div>
          {mode !== "forgot" && <div className="field"><label htmlFor="account-password">Şifre</label><div className="password-field"><input id="account-password" name="password" required minLength={8} type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="En az 8 karakter"/><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></div>}
          {mode === "login" && <button type="button" className="forgot-password-link" onClick={() => changeMode("forgot")}>Şifremi unuttum</button>}
          {mode === "register" && <label className="account-consent"><input type="checkbox" required/><span>Gizlilik ve kişisel verilerin işlenmesine ilişkin metinleri okudum. (Yasal metinler yayına alınmadan önce doğrulanmalıdır.)</span></label>}
          <button className="button account-submit" type="submit">{mode === "login" ? "Giriş yap" : mode === "register" ? "Hesap oluştur" : "Yenileme bağlantısı iste"}</button>
        </form>
        {message && <p role="status" className="account-feedback">{message}</p>}
        <p className="account-demo-note">Demo arayüzü · Kimlik doğrulama, şifre sıfırlama ve hesap veritabanı etkin değil.</p>
      </div>
    </div>
    <div className="account-order-link"><span>Siparişin mi var?</span><Link href="/siparis-takip">Sipariş takip sayfasına git →</Link></div>
  </section>;
}
