import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string}>}) {
 const {q=""} = await searchParams;
 const found = products.filter(p=>p.name.toLocaleLowerCase("tr-TR").includes(q.toLocaleLowerCase("tr-TR")));
 return <section className="section container"><div className="kicker">ARAMA</div><h1 style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:40}}>“{q}” için sonuçlar</h1><p className="muted">{found.length} ürün bulundu.</p>{found.length?<div className="products" style={{marginTop:24}}>{found.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<p>Aramana uygun ürün bulunamadı.</p>}</section>;
}