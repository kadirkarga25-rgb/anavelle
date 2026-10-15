"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product, money } from "@/data/products";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
 const [fav,setFav] = useState(false);
 function toggle() {
  const current = JSON.parse(localStorage.getItem("anavelle-favorites") || "[]") as string[];
  const next = current.includes(product.id) ? current.filter(x=>x!==product.id) : [...current,product.id];
  localStorage.setItem("anavelle-favorites",JSON.stringify(next)); setFav(!fav);
 }
 return <article><Link href={"/urun/"+product.id}><div className={"product-image "+product.tone}>{product.tag && <span className="product-tag">{product.tag}</span>}</div></Link><div className="product-info"><div className="product-actions"><span>{product.category.toLocaleUpperCase("tr-TR")}</span><button aria-label="Favorilere ekle" onClick={toggle} style={{border:0,background:"transparent",color:fav?"#B8862F":"inherit"}}><Heart size={17} fill={fav?"currentColor":"none"}/></button></div><Link className="product-name" href={"/urun/"+product.id}>{product.name}</Link><div className="price">{money(product.price)}{product.oldPrice && <span className="old-price">{money(product.oldPrice)}</span>}</div></div></article>
}