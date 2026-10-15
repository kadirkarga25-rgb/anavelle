"use client";
import { useState } from "react";
export default function TrackOrderPage() {
 const [order,setOrder] = useState("");
 const [email,setEmail] = useState("");
 const [message,setMessage] = useState("");
 return <section className="section container"><div style={{maxWidth:650,margin:"auto"}}><div className="kicker">SİPARİŞ DESTEĞİ</div><h1 style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:42}}>Siparişini takip et.</h1><p className="muted">Sipariş ve kargo sunucusu henüz bağlanmadı. Bu form gerçek sipariş araması yapmaz.</p><form className="panel" onSubmit={e=>{e.preventDefault();setMessage("Sipariş takip servisi yapılandırılmadı. Gerçek sipariş bilgisi sorgulanmadı.")}}><div className="field"><label>Sipariş numarası</label><input required value={order} onChange={e=>setOrder(e.target.value)} placeholder="Örn. ANV-10001"/></div><div className="field"><label>Sipariş e-postası</label><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="ornek@eposta.com"/></div><button className="button">Siparişi sorgula (demo)</button>{message&&<p className="muted">{message}</p>}</form></div></section>;
}