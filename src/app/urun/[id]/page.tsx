"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Heart, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { products, money } from "@/data/products";

export default function ProductDetailPage() {
 const params = useParams<{id:string}>();
 const product = useMemo(()=>products.find(p=>p.id===params.id),[params.id]);
 const [size,setSize] = useState<number|undefined>();
 const [qty,setQty] = useState(1);
 const [message,setMessage] = useState("");
 if (!product) return <div className="container section"><h1>Ürün bulunamadı</h1><Link href="/kategori/kadin">Koleksiyona dön</Link></div>;
 function addCart() {
  if (!size) { setMessage("Lütfen bir beden seç."); return; }
  const cart = JSON.parse(localStorage.getItem("anavelle-cart")||"[]") as {id:string;size:number;qty:number}[];
  const old = cart.find(x=>x.id===product.id && x.size===size);
  if (old) old.qty += qty; else cart.push({id:product.id,size,qty});
  localStorage.setItem("anavelle-cart",JSON.stringify(cart));
  window.dispatchEvent(new Event("anavelle-cart-updated"));
  setMessage("Ürün demo sepetine eklendi.");
 }
 function favorite() {
  const fav = JSON.parse(localStorage.getItem("anavelle-favorites")||"[]") as string[];
  localStorage.setItem("anavelle-favorites",JSON.stringify(fav.includes(product.id)?fav.filter(x=>x!==product.id):[...fav,product.id]));
  setMessage("Favori tercihin tarayıcıda kaydedildi.");
 }
 return <section className="section container"><div className="muted" style={{marginBottom:20}}><Link href="/">Anasayfa</Link> / <Link href={"/kategori/"+product.category}>{product.category}</Link> / {product.name}</div><div className="layout-two"><div><div className={"product-image "+product.tone} style={{aspectRatio:"4/5"}}><span className="product-tag">ANAVELLE</span></div><div className="trust"><div>Özenli tasarım</div><div>Günlük konfor</div></div></div><div style={{padding:"12px 0"}}><div className="kicker">ANAVELLE · {product.id.toUpperCase()}</div><h1 style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:40,lineHeight:1.15}}>{product.name}</h1><div className="price" style={{fontSize:24}}>{money(product.price)} {product.oldPrice && <span className="old-price">{money(product.oldPrice)}</span>}</div><p className="muted">{product.description}</p><div style={{margin:"25px 0"}}><strong style={{fontSize:12}}>BEDEN SEÇİN</strong><div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>{product.sizes.map(s=><button key={s} onClick={()=>setSize(s)} style={{border:"1px solid "+(size===s?"#24150F":"#ddd"),background:size===s?"#24150F":"white",color:size===s?"white":"#24150F",minWidth:42,padding:"12px 8px"}}>{s}</button>)}</div></div><div className="field"><label>Adet</label><select value={qty} onChange={e=>setQty(Number(e.target.value))} style={{padding:12,width:100,border:"1px solid #ddd"}}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</select></div><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button className="button" onClick={addCart}>Sepete ekle</button><button className="button outline" onClick={favorite}><Heart size={16} style={{marginRight:8}}/> Favoriler</button></div>{message && <p role="status" className="muted" style={{marginTop:14}}>{message}</p>}<hr style={{border:0,borderTop:"1px solid #eee",margin:"28px 0"}}/><p className="muted"><Truck size={16} style={{display:"inline",marginRight:8}}/> Teslimat bilgileri sipariş altyapısı kurulduğunda etkinleşecek.</p><p className="muted"><RefreshCw size={16} style={{display:"inline",marginRight:8}}/> İade ve değişim koşulları</p><p className="muted"><ShieldCheck size={16} style={{display:"inline",marginRight:8}}/> Gerçek ödeme henüz etkin değil.</p></div></div></section>;
}