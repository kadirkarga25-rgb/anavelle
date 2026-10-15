import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

const labels: Record<string,string> = { kadin:"Kadın Koleksiyonu", sandalet:"Sandalet", terlik:"Terlik", bot:"Bot", outlet:"Outlet" };

export default async function CategoryPage({ params, searchParams }: { params: Promise<{slug:string}>; searchParams: Promise<{q?:string;sort?:string;min?:string;max?:string}> }) {
 const {slug} = await params;
 const query = await searchParams;
 if (!labels[slug]) notFound();
 let items = slug === "outlet" ? products.filter(p=>p.oldPrice) : slug === "kadin" ? products : products.filter(p=>p.category===slug);
 if (query.q) items = items.filter(p=>p.name.toLocaleLowerCase("tr-TR").includes(query.q!.toLocaleLowerCase("tr-TR")));
 if (query.min) items = items.filter(p=>p.price >= Number(query.min));
 if (query.max) items = items.filter(p=>p.price <= Number(query.max));
 if (query.sort === "asc") items = [...items].sort((a,b)=>a.price-b.price);
 if (query.sort === "desc") items = [...items].sort((a,b)=>b.price-a.price);
 if (query.sort === "name") items = [...items].sort((a,b)=>a.name.localeCompare(b.name,"tr"));
 return <><section className="page-title"><div className="container"><div className="kicker">ANAVELLE KOLEKSİYONU</div><h1 style={{fontFamily:"Georgia,serif",fontSize:42,fontWeight:400,margin:"12px 0"}}>{labels[slug]}</h1><p className="muted">Zamansız çizgiler ve günlük konforun buluşması.</p></div></section><section className="section container"><form className="filters"><input name="q" placeholder="Ürün ara" defaultValue={query.q}/><input name="min" type="number" min="0" placeholder="En düşük fiyat" defaultValue={query.min}/><input name="max" type="number" min="0" placeholder="En yüksek fiyat" defaultValue={query.max}/><select name="sort" defaultValue={query.sort||"featured"} aria-label="Sıralama"><option value="featured">Önerilen sıralama</option><option value="asc">Fiyat: artan</option><option value="desc">Fiyat: azalan</option><option value="name">İsim: A-Z</option></select><button className="button" type="submit">Filtrele</button></form><div className="muted" style={{marginBottom:18}}>{items.length} ürün listeleniyor</div>{items.length ? <div className="products">{items.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <p>Bu kriterlere uygun ürün bulunamadı.</p>}</section></>;
}