"use client";
import { useEffect, useState } from "react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

export default function FavoritesPage() {
 const [ids,setIds] = useState<string[]>([]);
 useEffect(()=>{try{setIds(JSON.parse(localStorage.getItem("anavelle-favorites")||"[]"))}catch{}},[]);
 return <section className="section container"><div className="kicker">SANA ÖZEL</div><h1 style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:42}}>Favorilerim</h1>{ids.length?<div className="products">{products.filter(p=>ids.includes(p.id)).map(p=><ProductCard key={p.id} product={p}/>)}</div>:<p className="muted">Henüz favori ürün eklemedin. Ürün kartlarındaki kalp simgesini kullanabilirsin.</p>}</section>;
}