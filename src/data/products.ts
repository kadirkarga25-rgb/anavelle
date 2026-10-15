export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  tag?: string;
  colors: string[];
  sizes: number[];
  tone: string;
  description: string;
  image: string;
  material: string;
  heelHeight: string;
};

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

export const products: Product[] = [
  { id: "av-101", name: "Deri Görünümlü Anatomic Sandalet", category: "sandalet", price: 1299, oldPrice: 1599, tag: "ÇOK SATAN", colors: ["Taba", "Siyah"], sizes: [36, 37, 38, 39, 40, 41], tone: "sand", image: photo("photo-1543163521-1bf539c55dd2"), material: "Ürün detayları doğrulanacak", heelHeight: "Ürün bilgisi bekleniyor", description: "Zarif çizgiler ve dengeli bir siluetle yaz kombinlerine eşlik etmek için tasarlanan model." },
  { id: "av-102", name: "Minimal Günlük Terlik", category: "terlik", price: 899, tag: "YENİ", colors: ["Krem", "Siyah"], sizes: [36, 37, 38, 39, 40, 41], tone: "light", image: photo("photo-1603487742131-4160ec999306"), material: "Ürün detayları doğrulanacak", heelHeight: "Ürün bilgisi bekleniyor", description: "Sade çizgiler ve hafif bir siluetle günlük kombinlerin tamamlayıcısı." },
  { id: "av-103", name: "Şehir Stili Loafer", category: "kadin", price: 1499, oldPrice: 1799, tag: "ZAMANSIZ", colors: ["Siyah", "Vizon"], sizes: [36, 37, 38, 39, 40, 41], tone: "olive", image: photo("photo-1549298916-b41d501d3772"), material: "Ürün detayları doğrulanacak", heelHeight: "Ürün bilgisi bekleniyor", description: "Zamansız formu modern detaylarla buluşturan şehir klasiği." },
  { id: "av-104", name: "Zarif Bantlı Sandalet", category: "sandalet", price: 1199, colors: ["Taba", "Krem"], sizes: [36, 37, 38, 39, 40, 41], tone: "sand", image: photo("photo-1514989940723-e8e51635b782"), material: "Ürün detayları doğrulanacak", heelHeight: "Ürün bilgisi bekleniyor", description: "Hafif ve zarif tasarım; yaz günlerinden şehir akşamlarına." },
  { id: "av-105", name: "Yumuşak Taban Ev Terliği", category: "terlik", price: 749, oldPrice: 899, tag: "KONFOR", colors: ["Krem", "Vizon"], sizes: [36, 37, 38, 39, 40, 41], tone: "light", image: photo("photo-1600185365483-26d7a4cc7519"), material: "Ürün detayları doğrulanacak", heelHeight: "Ürün bilgisi bekleniyor", description: "Ev içinde rahatlık ve sadelik arayanlar için yalın bir seçenek." },
  { id: "av-106", name: "Klasik Bilek Bot", category: "bot", price: 1899, colors: ["Siyah", "Kahve"], sizes: [36, 37, 38, 39, 40, 41], tone: "olive", image: photo("photo-1608256246200-53e635b5b65f"), material: "Ürün detayları doğrulanacak", heelHeight: "Ürün bilgisi bekleniyor", description: "Mevsim geçişlerinde güçlü ve sade bir tamamlayıcı." },
  { id: "av-107", name: "Günlük Şehir Ayakkabısı", category: "kadin", price: 1399, oldPrice: 1699, tag: "FIRSAT", colors: ["Siyah", "Krem"], sizes: [36, 37, 38, 39, 40, 41], tone: "sand", image: photo("photo-1542291026-7eec264c27ff"), material: "Ürün detayları doğrulanacak", heelHeight: "Ürün bilgisi bekleniyor", description: "Kombinlere kolayca uyum sağlayan yalın günlük tasarım." },
  { id: "av-108", name: "Anavelle Rahat Sandalet", category: "sandalet", price: 1099, colors: ["Taba", "Kahve"], sizes: [36, 37, 38, 39, 40, 41], tone: "light", image: photo("photo-1608231387042-66d1773070a5"), material: "Ürün detayları doğrulanacak", heelHeight: "Ürün bilgisi bekleniyor", description: "Minimal detayları ve yalın formuyla yaz gardırobunun favorisi." }
];

export const money = (value: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2 }).format(value);
