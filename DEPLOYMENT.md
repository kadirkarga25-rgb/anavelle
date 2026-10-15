# Anavelle yayınlama notları

## GitHub
Kaynak kodu: https://github.com/kadirkarga25-rgb/anavelle

## Yayınlama
Bu depo Next.js uygulamasıdır. GitHub tek başına Next.js sunucusunu çalıştırmaz. Vercel gibi Next.js destekleyen bir hostta New Project > Import Git Repository > `kadirkarga25-rgb/anavelle` seçilerek dağıtım yapılabilir. Gerçek bir canlı URL ancak sağlayıcı dağıtımı tamamladıktan sonra doğrulanmalıdır.

## Environment variables
`.env.example` dosyasını örnek al. Gerçek gizli anahtarları GitHub'a commit etme. Veritabanı, auth, ödeme, e-posta ve kargo servisleri henüz bağlı değildir.

## Şu an çalışan demo davranışları
- Anasayfa ve örnek ürün kartları
- Kategori/arama/sıralama/fiyat filtreleri
- Ürün detayında beden/adet seçimi
- Tarayıcı localStorage tabanlı demo sepet ve favoriler
- Giriş/kayıt, sipariş takibi ve iletişim için açıkça demo olarak işaretlenmiş formlar
- Çerez tercih penceresi, gecikmeli bülten popup'ı, mobil kategoriler menüsü
- `/api/health` servis durum endpoint'i

## Üretim öncesi bloklayıcılar
- Veritabanı ve server-side katalog/stock
- Gerçek kimlik doğrulama ve admin authorization
- Ödeme sağlayıcısı ve imzalı webhook doğrulaması
- Sipariş, iptal, iade, indirim ve kargo yaşam döngüsü
- Bülten için sunucu tarafı onay ve e-posta sağlayıcısı
- KVKK, çerez rızası, mesafeli satış ve iade politikalarının hukuki kontrolü
- Gerçek ürün fotoğrafları, stok ve fiyatların doğrulanması
- Erişilebilirlik, SEO ve üretim güvenlik testleri
