"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";

type HeroSettings = { heroTitle:string; heroSubtitle:string; heroImage:string };
const defaults:HeroSettings = { heroTitle:"Her adımda\ndaha iyi bir sen.", heroSubtitle:"Zamansız çizgiler, özenli detaylar ve kendi ritmine uyum sağlayan bir stil. Günlük hayatına eşlik edecek favorini keşfet.", heroImage:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1400&q=90" };

export function StorefrontHero() {
  const [settings,setSettings]=useState<HeroSettings>(defaults);
  useEffect(()=>{
    let active=true;
    const local=()=>{try{const data=JSON.parse(localStorage.getItem("anavelle-admin-settings-v1")||"{}");if(data.heroTitle||data.heroSubtitle||data.heroImage)setSettings(prev=>({...prev,...data,heroImage:data.heroImage||prev.heroImage}));}catch{}};
    local();
    if(localStorage.getItem("anavelle-admin-settings-v1")===null){
      void fetch("/api/storefront-settings",{cache:"no-store"}).then(r=>r.json()).then(data=>{if(active&&data.settings)setSettings(prev=>({...prev,...data.settings,heroImage:data.settings.heroImage||prev.heroImage}));}).catch(()=>{});
    }
    window.addEventListener("anavelle-admin-settings-updated",local);
    window.addEventListener("storage",local);
    return()=>{active=false;window.removeEventListener("anavelle-admin-settings-updated",local);window.removeEventListener("storage",local);};
  },[]);
  const lines=settings.heroTitle.split("\n");
  return <section className="hero-wrap">
    <div className="hero">
      <div className="hero-copy">
        <div className="hero-eyebrow"><span/> ANAVELLE · YENİ SEZON</div>
        <h1>{lines.map((line,index)=><span key={index}>{index>0&&<br/>}{line.includes("daha iyi")?<>{line.split("daha iyi")[0]}<em>daha iyi</em>{line.split("daha iyi").slice(1).join("daha iyi")}</>:line}</span>)}</h1>
        <p>{settings.heroSubtitle}</p>
        <div className="hero-actions"><Link className="button" href="/kategori/kadin">Koleksiyonu keşfet <ArrowRight size={16}/></Link><Link className="text-link" href="/kategori/outlet">Fırsatları gör <ArrowUpRight size={15}/></Link></div>
        <div className="hero-note"><Sparkles size={15}/> Her adımda zarafet, her gün kendin.</div>
      </div>
      <div className="hero-visual">
        <img src={settings.heroImage||defaults.heroImage} alt="Anavelle yeni sezon ayakkabı stil görseli" fetchPriority="high"/>
        <div className="hero-stamp"><span>ANAVELLE</span><small>TIMELESS COMFORT</small></div>
        <div className="hero-caption"><span>01 / 04</span><span>Yeni sezon seçkisi</span></div>
      </div>
    </div>
  </section>;
}
