"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, GitCompareArrows, Trash2 } from "lucide-react";
import { products, money, Product } from "@/data/products";
import { getAdminCatalog } from "@/lib/admin-catalog";
import { CatalogImage } from "@/components/catalog-image";

export default function ComparePage() {
  const [ids, setIds] = useState<string[]>([]);
  const [catalog, setCatalog] = useState<Product[]>(products);
  useEffect(() => {
    const sync = () => {
      try { setIds(JSON.parse(localStorage.getItem("anavelle-compare") || "[]") as string[]); } catch { setIds([]); }
    };
    sync();
    setCatalog(getAdminCatalog());
    const syncCatalog = () => setCatalog(getAdminCatalog());
    window.addEventListener("anavelle-admin-catalog-updated", syncCatalog);
    window.addEventListener("anavelle-compare-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("anavelle-compare-updated", sync);
      window.removeEventListener("anavelle-admin-catalog-updated", syncCatalog);
      window.removeEventListener("anavelle-admin-catalog-updated", syncCatalog);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const chosen = catalog.filter((product) => ids.includes(product.id));
  function remove(id: string) {
    const next = ids.filter((entry) => entry !== id);
    localStorage.setItem("anavelle-compare", JSON.stringify(next));
    setIds(next);
    window.dispatchEvent(new Event("anavelle-compare-updated"));
  }
  return <section className="section container compare-page">
    <div className="breadcrumbs"><Link href="/">Anasayfa</Link><span>/</span><span>Ürün karşılaştırma</span></div>
    <div className="kicker">DAHA KOLAY KARAR VER</div><h1 className="page-heading">Ürün karşılaştırma</h1>
    <p className="muted">En fazla dört ürünü fiyat, renk, beden ve ürün özellikleri açısından yan yana incele.</p>
    {chosen.length === 0 ? <div className="empty-cart"><GitCompareArrows size={32}/><h2>Karşılaştırma listen boş.</h2><p>Ürün kartlarındaki karşılaştırma simgesini kullanarak ürün ekleyebilirsin.</p><Link className="button" href="/kategori/kadin">Ürünleri keşfet <ArrowRight size={15}/></Link></div> :
    <div className="compare-table-wrap"><table className="compare-table"><thead><tr><th>Özellik</th>{chosen.map((p)=><th key={p.id}><CatalogImage image={p.image} alt={p.name}/><Link href={`/urun/${p.id}`}>{p.name}</Link><button className="compare-remove" onClick={()=>remove(p.id)}><Trash2 size={14}/> Kaldır</button></th>)}</tr></thead><tbody>
      <tr><th>Fiyat</th>{chosen.map((p)=><td key={p.id}><strong>{money(p.price)}</strong>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</td>)}</tr>
      <tr><th>Renkler</th>{chosen.map((p)=><td key={p.id}>{p.colors.join(", ")}</td>)}</tr>
      <tr><th>Bedenler</th>{chosen.map((p)=><td key={p.id}>{p.sizes.join(" · ")}</td>)}</tr>
      <tr><th>Materyal</th>{chosen.map((p)=><td key={p.id}>{p.material}</td>)}</tr>
      <tr><th>Özellikler</th>{chosen.map((p)=><td key={p.id}>{p.features.join(", ")}</td>)}</tr>
      <tr><th>Değerlendirme</th>{chosen.map((p)=><td key={p.id}>{p.rating.toFixed(1)} / 5 <small>({p.reviewCount} demo değerlendirme)</small></td>)}</tr>
      <tr><th>Ürün detayları</th>{chosen.map((p)=><td key={p.id}><Link className="button" href={`/urun/${p.id}`}>Ürünü incele</Link></td>)}</tr>
    </tbody></table><p className="catalog-disclaimer">Karşılaştırmadaki ürün, fiyat, puan, stok ve teknik bilgiler demo verileridir. Gerçek satış kataloğu bağlandığında gerçek verilerle değişmelidir.</p></div>}
  </section>;
}
