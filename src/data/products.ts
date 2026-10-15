export type Product = { id:string; name:string; category:string; price:number; oldPrice?:number; tag?:string; colors:string[]; sizes:number[]; tone:string; description:string };
export const products: Product[] = [
 {id:"av-101",name:"Deri Anatomic Sandalet",category:"sandalet",price:1299,oldPrice:1599,tag:"ÇOK SATAN",colors:["Taba","Siyah"],sizes:[36,37,38,39,40,41],tone:"sand",description:"Yumuşak dokulu deri görünümü, dengeli taban ve gün boyu konfor hissi."},
 {id:"av-102",name:"Minimal Günlük Terlik",category:"terlik",price:899,tag:"YENİ",colors:["Krem","Siyah"],sizes:[36,37,38,39,40,41],tone:"light",description:"Sade çizgiler ve hafif bir siluetle gündelik kombinlerin tamamlayıcısı."},
 {id:"av-103",name:"Şehir Stili Loafer",category:"kadin",price:1499,oldPrice:1799,colors:["Siyah","Vizon"],sizes:[36,37,38,39,40,41],tone:"olive",description:"Zamansız formu modern detaylarla buluşturan şehir klasiği."},
 {id:"av-104",name:"Zarif Bantlı Sandalet",category:"sandalet",price:1199,colors:["Taba","Krem"],sizes:[36,37,38,39,40,41],tone:"sand",description:"Hafif ve zarif tasarım; yaz günlerinden şehir akşamlarına."},
 {id:"av-105",name:"Yumuşak Taban Ev Terliği",category:"terlik",price:749,oldPrice:899,tag:"KONFOR",colors:["Krem","Vizon"],sizes:[36,37,38,39,40,41],tone:"light",description:"Ev içinde rahatlık ve sadelik arayanlar için."},
 {id:"av-106",name:"Klasik Bilek Bot",category:"bot",price:1899,colors:["Siyah","Kahve"],sizes:[36,37,38,39,40,41],tone:"olive",description:"Mevsim geçişlerinde güçlü ve sade bir tamamlayıcı."},
 {id:"av-107",name:"Deri Görünümlü Günlük Ayakkabı",category:"kadin",price:1399,oldPrice:1699,tag:"FIRSAT",colors:["Siyah","Krem"],sizes:[36,37,38,39,40,41],tone:"sand",description:"Kombinlere kolayca uyum sağlayan yalın günlük tasarım."},
 {id:"av-108",name:"Anavelle Rahat Sandalet",category:"sandalet",price:1099,colors:["Taba","Kahve"],sizes:[36,37,38,39,40,41],tone:"light",description:"Minimal detayları ve yalın formuyla yaz gardırobunun favorisi."}
];
export const money = (v:number) => new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY",maximumFractionDigits:0}).format(v);