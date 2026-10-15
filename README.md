# Anavelle Store

Modern Turkish fashion footwear storefront starter using Next.js App Router, TypeScript, and Tailwind CSS.

## Status
This is the initial storefront scaffold. Production commerce is not enabled until you configure a database, authentication, transactional email, payment provider, shipping integration, and hosting.

## Local development
```bash
npm install
npm run dev
```

## Deployment
Connect this repository to a hosting provider that supports Next.js (for example, Vercel). Configure environment variables before production use. GitHub repository publishing does not itself deploy the site.

## Brand
- Espresso: `#24150F`
- Gold: `#B8862F`
- Champagne: `#D8B56A`
- Warm Ivory: `#FAF7F2`

## Important
Cart and account interactions in this scaffold are demonstration-only. Do not accept real payments or customer personal data until production services and security controls are configured.

## Admin paneli ve kalıcı katalog

- Yönetim paneli: `/admin`
- Yönetici girişi sunucu tarafında `ANAVELLE_ADMIN_PASSWORD` ile korunur; oturum imzalı, HTTP-only çerez kullanır.
- Kalıcı ürün kataloğu, mağaza ayarları ve görsel depolaması için Supabase gerekir.
- `supabase/anavelle-admin-schema.sql` dosyasını Supabase SQL Editor'de çalıştır.
- Netlify site ayarlarında `.env.example` içindeki `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ANAVELLE_ADMIN_PASSWORD` ve `ANAVELLE_SESSION_SECRET` değişkenlerini tanımla. Gerçek gizli anahtarları GitHub'a yükleme ve `NEXT_PUBLIC_*` değişkenlerine koyma.
- Ortam değişkenlerini kaydedip yeni dağıtımın tamamlanmasını bekle; ardından `/admin` sayfasından giriş yap.
- Supabase ayarları olmadan ürün düzenleme yalnızca mevcut tarayıcıda demo olarak saklanır. Gerçek müşterilerden sipariş almadan önce ödeme, sipariş oluşturma, kargo, vergi, iade, e-posta ve yasal metinler ayrıca tamamlanmalıdır.

Admin özellikleri: ürün ekleme/düzenleme/kopyalama/aktif-pasif/silme, fiyat ve beden-renk yönetimi, fotoğraf kütüphanesi, kategori slug'ları, vitrin başlığı ve duyuru, SEO/iletişim ayarları, JSON katalog yedeği ve sipariş durum arayüzü.
