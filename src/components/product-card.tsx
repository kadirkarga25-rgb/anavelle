"use client";

import Link from "next/link";
import { Heart, ArrowUpRight } from "lucide-react";
import { Product, money } from "@/data/products";
import { useEffect, useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("anavelle-favorites") || "[]") as string[];
      setFav(saved.includes(product.id));
    } catch {}
  }, [product.id]);

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const current = JSON.parse(localStorage.getItem("anavelle-favorites") || "[]") as string[];
    const next = current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id];
    localStorage.setItem("anavelle-favorites", JSON.stringify(next));
    setFav(next.includes(product.id));
    window.dispatchEvent(new Event("anavelle-favorites-updated"));
  }

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <article className="product-card">
      <div className="product-media">
        <Link href={`/urun/${product.id}`} aria-label={product.name}>
          <img className="product-photo" src={product.image} alt={product.name} loading="lazy" />
        </Link>
        <div className="product-badges">
          {product.tag && <span className="product-tag">{product.tag}</span>}
          {discount > 0 && <span className="discount-tag">%{discount} İNDİRİM</span>}
        </div>
        <button className={`favorite-button ${fav ? "is-favorite" : ""}`} aria-label={fav ? "Favorilerden çıkar" : "Favorilere ekle"} onClick={toggle}>
          <Heart size={18} fill={fav ? "currentColor" : "none"} />
        </button>
        <Link className="quick-view" href={`/urun/${product.id}`}>Ürünü incele <ArrowUpRight size={15} /></Link>
      </div>
      <div className="product-info">
        <div className="product-meta"><span>{product.category.toLocaleUpperCase("tr-TR")}</span><span>{product.colors.length} renk</span></div>
        <Link className="product-name" href={`/urun/${product.id}`}>{product.name}</Link>
        <div className="price-row">
          <span className="price">{money(product.price)}</span>
          {product.oldPrice && <span className="old-price">{money(product.oldPrice)}</span>}
        </div>
      </div>
    </article>
  );
}
