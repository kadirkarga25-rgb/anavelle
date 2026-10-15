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
  gallery?: string[];
  material: string;
  heelHeight: string;
  features: string[];
  inStock: boolean;
  freeShipping: boolean;
  rating: number;
  reviewCount: number;
  soldCount: number;
  createdAt: string;
};

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

// Bu katalog geliştirme ortamı için örnek veridir; gerçek stok, fiyat, ürün görseli ve teknik özellik kaynağı değildir.
export const products: Product[] = [
  { id: "av-101", name: "Deri Görünümlü Anatomic Sandalet", category: "sandalet", price: 1299, oldPrice: 1599, tag: "ÇOK SATAN", colors: ["Taba", "Siyah"], sizes: [36, 37, 38, 39, 40, 41], tone: "sand", image: photo("photo-1543163521-1bf539c55dd2"), material: "Ürün detayı doğrulanacak", heelHeight: "Ürün bilgisi bekleniyor", description: "Zarif çizgiler ve dengeli bir siluetle yaz kombinlerine eşlik etmek için tasarlanan model.", features: ["Günlük kullanım", "Hafif tasarım", "Sandalet"], inStock: true, freeShipping: true, rating: 4.8, reviewCount: 7, soldCount: 86, createdAt: "2026-10-01" },
  { id: "av-102", name: "Minimal Günlük Terlik", category: "terlik", price: 899, tag: "YENİ", colors: ["Krem", "Siyah"], sizes: [36, 37, 38, 39, 40, 41], tone: "light", image: photo("photo-1603487742131-4160ec999306"), material: "Ürün detayı doğrulanacak", heelHeight: "Ürün bilgisi bekleniyor", description: "Sade çizgiler ve hafif bir siluetle günlük kombinlerin tamamlayıcısı.", features: ["Günlük kullanım", "Minimal tasarım", "Terlik"], inStock: true, freeShipping: true, rating: 4.6, reviewCount: 3, soldCount: 61, createdAt: "2026-09-25" },
  { id: "av-103", name: "Şehir Stili Loafer", category: "kadin", price: 1499, oldPrice: 1799, tag: "ZAMANSIZ", colors: ["Siyah", "Vizon"], sizes: [36, 37, 38, 39, 40, 41], tone: "olive", image: photo("photo-1549298916-b41d501d3772"), material: "Ürün detayı doğrulanacak", heelHeight: "Ürün bilgisi bekleniyor", description: "Zamansız formu modern detaylarla buluşturan şehir klasiği.", features: ["Günlük kullanım", "Şehir stili", "Loafer"], inStock: true, freeShipping: true, rating: 4.7, reviewCount: 4, soldCount: 74, createdAt: "2026-09-20" },
  { id: "av-104", name: "Zarif Bantlı Sandalet", category: "sandalet", price: 1199, colors: ["Taba", "Krem"], sizes: [36, 37, 38, 39, 40, 41], tone: "sand", image: photo("photo-1514989940723-e8e51635b782"), material: "Ürün detayı doğrulanacak", heelHeight: "Ürün bilgisi bekleniyor", description: "Hafif ve zarif tasarım; yaz günlerinden şehir akşamlarına.", features: ["Günlük kullanım", "Sandalet", "Minimal tasarım"], inStock: true, freeShipping: true, rating: 4.5, reviewCount: 2, soldCount: 48, createdAt: "2026-08-29" },
  { id: "av-105", name: "Yumuşak Taban Ev Terliği", category: "terlik", price: 749, oldPrice: 899, tag: "KONFOR", colors: ["Krem", "Vizon"], sizes: [36, 37, 38, 39, 40, 41], tone: "light", image: photo("photo-1600185365483-26d7a4cc7519"), material: "Ürün detayı doğrulanacak", heelHeight: "Ürün bilgisi bekleniyor", description: "Ev içinde rahatlık ve sadelik arayanlar için yalın bir seçenek.", features: ["Ev kullanımı", "Hafif tasarım", "Terlik"], inStock: true, freeShipping: true, rating: 4.9, reviewCount: 5, soldCount: 102, createdAt: "2026-09-11" },
  { id: "av-106", name: "Klasik Bilek Bot", category: "bot", price: 1899, colors: ["Siyah", "Kahve"], sizes: [36, 37, 38, 39, 40, 41], tone: "olive", image: photo("photo-1608256246200-53e635b5b65f"), material: "Ürün detayı doğrulanacak", heelHeight: "Ürün bilgisi bekleniyor", description: "Mevsim geçişlerinde güçlü ve sade bir tamamlayıcı.", features: ["Günlük kullanım", "Bot", "Şehir stili"], inStock: true, freeShipping: true, rating: 4.4, reviewCount: 2, soldCount: 35, createdAt: "2026-09-03" },
  { id: "av-107", name: "Günlük Şehir Ayakkabısı", category: "kadin", price: 1399, oldPrice: 1699, tag: "FIRSAT", colors: ["Siyah", "Krem"], sizes: [36, 37, 38, 39, 40, 41], tone: "sand", image: photo("photo-1542291026-7eec264c27ff"), material: "Ürün detayı doğrulanacak", heelHeight: "Ürün bilgisi bekleniyor", description: "Kombinlere kolayca uyum sağlayan yalın günlük tasarım.", features: ["Günlük kullanım", "Şehir stili", "Sneaker"], inStock: true, freeShipping: true, rating: 4.6, reviewCount: 6, soldCount: 93, createdAt: "2026-09-18" },
  { id: "av-108", name: "Anavelle Rahat Sandalet", category: "sandalet", price: 1099, colors: ["Taba", "Kahve"], sizes: [36, 37, 38, 39, 40, 41], tone: "light", image: photo("photo-1608231387042-66d1773070a5"), material: "Ürün detayı doğrulanacak", heelHeight: "Ürün bilgisi bekleniyor", description: "Minimal detayları ve yalın formuyla yaz gardırobunun favorisi.", features: ["Günlük kullanım", "Sandalet", "Hafif tasarım"], inStock: true, freeShipping: true, rating: 4.7, reviewCount: 3, soldCount: 57, createdAt: "2026-10-08" }
];

export const money = (value: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2 }).format(value);
