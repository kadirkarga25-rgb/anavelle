"use client";
import { useEffect, useState } from "react";
import { products, Product } from "@/data/products";
import { getAdminCatalog, hasAdminCatalogOverride } from "@/lib/admin-catalog";
import { ProductCard } from "@/components/product-card";

export default function FavoritesPage() {
 const [ids,setIds] = useState<string[]>([]);
 const [catalog,setCatalog] = useState<Product[]>(products);
 useEffect(()=>{try{setIds(JSON.parse(localStorage.getItem("anavelle-favorites")||"[]"))}catch{} setCatalog(getAdminCatalog()); if(!hasAdminCatalogOverride()) void fetch("/api/products",{cache:"no-store"}).then(r=>r.json()).then(data=>{if(Array.isArray(data.products))setCatalog(data.products as Product[]);}).catch(()=>{}); const sync=()=>setCatalog(getAdminCatalog()); window.addEventListener("anavelle-admin-catalog-updated",sync); return ()=>window.removeEventListener("anavelle-admin-catalog-updated",sync);},[]);
 return <section className="section container"><div className="kicker">SANA ÖZEL</div><h1 style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:42}}>Favorilerim</h1>{ids.length?<div className="products">{catalog.filter(p=>ids.includes(p.id)).map(p=><ProductCard key={p.id} product={p}/>)}</div>:<p className="muted">Henüz favori ürün eklemedin. Ürün kartlarındaki kalp simgesini kullanabilirsin.</p>}</section>;
}