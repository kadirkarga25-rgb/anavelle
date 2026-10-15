"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/data/products";
import { getAdminCatalog } from "@/lib/admin-catalog";
import { ProductCard } from "@/components/product-card";

type Filters = { q?:string; sort?:string; min?:string; max?:string; color?:string; size?:string; sale?:string; inStock?:string; freeShipping?:string; feature?:string; page?:string; view?:string };
const sortLabels: Record<string,string> = { featured:"Önerilen",newest:"En yeniler",popular:"En çok satanlar",rating:"En çok oylananlar",asc:"En düşük fiyat",desc:"En yüksek fiyat",name:"Ürün adı (A-Z)","name-desc":"Ürün adı (Z-A)" };

export function AdminAwareCategoryGrid({slug,filters}:{slug:string;filters:Filters}) {
  const [catalog,setCatalog] = useState<Product[]>(()=>getAdminCatalog());
  useEffect(()=>{
    const sync=()=>setCatalog(getAdminCatalog());
    sync();
    window.addEventListener("anavelle-admin-catalog-updated",sync);
    return ()=>window.removeEventListener("anavelle-admin-catalog-updated",sync);
  },[]);
  const items=useMemo(()=>{
    let list=catalog.filter(p=>slug==="outlet"?Boolean(p.oldPrice):slug==="kadin"?p.category!=="outlet":p.category===slug);
    if(filters.q)list=list.filter(p=>p.name.toLocaleLowerCase("tr-TR").includes(filters.q!.toLocaleLowerCase("tr-TR")));
    if(filters.min&&Number.isFinite(Number(filters.min)))list=list.filter(p=>p.price>=Number(filters.min));
    if(filters.max&&Number.isFinite(Number(filters.max)))list=list.filter(p=>p.price<=Number(filters.max));
    if(filters.color)list=list.filter(p=>p.colors.includes(filters.color!));
    if(filters.size)list=list.filter(p=>p.sizes.includes(Number(filters.size)));
    if(filters.sale==="yes")list=list.filter(p=>Boolean(p.oldPrice));
    if(filters.inStock==="yes")list=list.filter(p=>p.inStock);
    if(filters.freeShipping==="yes")list=list.filter(p=>p.freeShipping);
    if(filters.feature)list=list.filter(p=>p.features.includes(filters.feature!));
    switch(filters.sort){
      case "newest":list=[...list].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));break;
      case "popular":list=[...list].sort((a,b)=>b.soldCount-a.soldCount);break;
      case "rating":list=[...list].sort((a,b)=>b.rating-a.rating);break;
      case "asc":list=[...list].sort((a,b)=>a.price-b.price);break;
      case "desc":list=[...list].sort((a,b)=>b.price-a.price);break;
      case "name":list=[...list].sort((a,b)=>a.name.localeCompare(b.name,"tr"));break;
      case "name-desc":list=[...list].sort((a,b)=>b.name.localeCompare(a.name,"tr"));break;
    }
    return list;
  },[catalog,slug,filters.q,filters.min,filters.max,filters.color,filters.size,filters.sale,filters.inStock,filters.freeShipping,filters.feature,filters.sort]);
  const pageSize=12;
  const pageCount=Math.max(1,Math.ceil(items.length/pageSize));
  const page=Math.min(pageCount,Math.max(1,Number(filters.page)||1));
  const visible=items.slice((page-1)*pageSize,page*pageSize);
  function pageHref(next:number){const params=new URLSearchParams();Object.entries(filters).forEach(([key,value])=>{if(value&&key!=="page")params.set(key,value)});params.set("page",String(next));return "/kategori/"+slug+"?"+params.toString();}
  return <>
    <form className="catalog-toolbar" method="get">
      {Object.entries(filters).filter(([key,value])=>key!=="sort"&&key!=="page"&&key!=="view"&&Boolean(value)).map(([key,value])=><input key={key} type="hidden" name={key} value={value}/>)}
      <span className="catalog-result">Gösterilen <strong>{visible.length}</strong> / {items.length} ürün</span>
      <label className="sort-filter"><ArrowUpDown size={15}/><span>Sırala</span><select name="sort" defaultValue={filters.sort||"featured"} aria-label="Sıralama">{Object.entries(sortLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <button className="button catalog-apply" type="submit">Uygula</button>
    </form>
    {visible.length?<div className={filters.view==="list"?"products catalog-products list-view":"products catalog-products"}>{visible.map(product=><ProductCard key={product.id} product={product}/>)}</div>:
      <div className="empty-results"><div className="kicker">SONUÇ BULUNAMADI</div><h2>Bu seçimde ürün yok.</h2><p>Filtreleri değiştirerek veya yönetim panelinden ürün ekleyerek devam edebilirsin.</p><Link className="button" href={"/kategori/"+slug}>Filtreleri temizle</Link></div>}
    {pageCount>1&&<nav className="catalog-pagination" aria-label="Sayfalar">{page>1&&<Link href={pageHref(page-1)} aria-label="Önceki sayfa"><ChevronLeft size={15}/></Link>}{Array.from({length:pageCount},(_,i)=>i+1).map(n=><Link key={n} aria-current={page===n?"page":undefined} className={page===n?"active":""} href={pageHref(n)}>{n}</Link>)}{page<pageCount&&<Link href={pageHref(page+1)} aria-label="Sonraki sayfa"><ChevronRight size={15}/></Link>}</nav>}
  </>;
}
