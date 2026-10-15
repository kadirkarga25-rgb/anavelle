"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { products as seedProducts, Product, money } from "@/data/products";
import { AdminMedia, deleteMediaBlob, downloadJson, getAdminCatalog, getAdminMedia, resolveProductImage, saveAdminCatalog, saveAdminMedia, saveMediaBlob } from "@/lib/admin-catalog";
import {
  LayoutDashboard, Package, Images, ShoppingCart, Tags, Settings, Search, Plus, Pencil, Trash2,
  Copy, Upload, Download, Eye, EyeOff, ImagePlus, X, Check, AlertTriangle, ExternalLink,
  Menu, PanelLeftClose, PackageCheck, Truck, CreditCard, Store, Save, RefreshCw, FileUp, FileDown,
  CircleDollarSign, Boxes, Activity, ArrowUpRight, ChevronRight, SearchCheck, ClipboardList, SlidersHorizontal
} from "lucide-react";

type Section = "overview" | "products" | "media" | "orders" | "categories" | "content" | "settings";
type DemoOrder = { id: string; customer: string; email: string; total: number; status: string; createdAt: string; itemCount: number };
type StoreSettings = { storeName: string; supportEmail: string; phone: string; announcement: string; heroTitle: string; heroSubtitle: string; heroImage: string; seoTitle: string; seoDescription: string; currency: string; freeShippingThreshold: string };
const defaultSettings: StoreSettings = { storeName: "ANAVELLE", supportEmail: "", phone: "", announcement: "Yeni sezonu keşfet", heroTitle: "Her adımda\\ndaha iyi bir sen.", heroSubtitle: "Zamansız çizgiler, özenli detaylar ve kendi ritmine uyum sağlayan stil.", heroImage: "", seoTitle: "Anavelle | Her adımda zarafet", seoDescription: "Anavelle kadın ayakkabı, sandalet ve terlik koleksiyonu.", currency: "TRY", freeShippingThreshold: "" };
const sections: { id: Section; label: string; group: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Genel bakış", group: "MAĞAZA", icon: LayoutDashboard },
  { id: "products", label: "Ürünler", group: "KATALOG", icon: Package },
  { id: "categories", label: "Kategoriler", group: "KATALOG", icon: Tags },
  { id: "media", label: "Fotoğraf & medya", group: "KATALOG", icon: Images },
  { id: "orders", label: "Siparişler", group: "SATIŞ", icon: ShoppingCart },
  { id: "content", label: "Ana sayfa içerikleri", group: "MAĞAZA", icon: Store },
  { id: "settings", label: "Mağaza ayarları", group: "SİSTEM", icon: Settings }
];
const emptyProduct = (): Product => ({ id: "av-" + Math.random().toString(36).slice(2, 8), name: "", category: "sandalet", price: 0, colors: ["Siyah"], sizes: [36,37,38,39,40,41], tone: "sand", image: "", material: "", heelHeight: "", description: "", features: [], inStock: true, freeShipping: false, rating: 0, reviewCount: 0, soldCount: 0, createdAt: new Date().toISOString().slice(0,10) });

export default function AdminPage() {
  const [section, setSection] = useState<Section>("overview");
  const [catalog, setCatalog] = useState<Product[]>(seedProducts);
  const [media, setMedia] = useState<AdminMedia[]>([]);
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [editor, setEditor] = useState<Product | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mediaUrls, setMediaUrls] = useState<Record<string,string>>({});
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [mediaSearch, setMediaSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("all");
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<string[]>(["kadin","sandalet","terlik","bot","outlet"]);
  const [settingsDraft, setSettingsDraft] = useState<StoreSettings>(defaultSettings);
  const [contentDraft, setContentDraft] = useState<StoreSettings>(defaultSettings);
  const fileInput = useRef<HTMLInputElement>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const [photoTarget, setPhotoTarget] = useState<"product"|"library">("product");
  const [authStatus, setAuthStatus] = useState({ ready:false, authenticated:false, configured:false, databaseConfigured:false, mediaConfigured:false });

  useEffect(() => {
    let active = true;
    fetch("/api/admin/auth/session", { cache:"no-store" }).then(r=>r.json()).then(data=>{
      if(active)setAuthStatus({ready:true,authenticated:Boolean(data.authenticated),configured:Boolean(data.configured),databaseConfigured:Boolean(data.databaseConfigured),mediaConfigured:Boolean(data.mediaConfigured)});
    }).catch(()=>{if(active)setAuthStatus({ready:true,authenticated:false,configured:false,databaseConfigured:false,mediaConfigured:false});});
    return ()=>{active=false;};
  }, []);

  useEffect(() => {
    if (!authStatus.authenticated) return;
    let active = true;
    async function loadServerData() {
      if (authStatus.mediaConfigured) {
        try {
          const response = await fetch("/api/admin/media", {cache:"no-store"});
          const data = await response.json();
          if (response.ok && Array.isArray(data.media) && active) {
            const remoteMedia = data.media as AdminMedia[];
            const mergedMedia = [...remoteMedia, ...getAdminMedia().filter(local => !remoteMedia.some(remote => remote.storageId && remote.storageId === local.storageId))];
            setMedia(mergedMedia); saveAdminMedia(mergedMedia);
          }
        } catch {}
      }
      if (authStatus.databaseConfigured) {
        try {
          const response = await fetch("/api/admin/products", { cache:"no-store" });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Ürün kataloğu sunucudan okunamadı.");
          if (!active) return;
          if (Array.isArray(data.products) && data.products.length) { setCatalog(data.products); saveAdminCatalog(data.products); }
          else {
            const seed = getAdminCatalog();
            const write = await fetch("/api/admin/products", { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({products:seed}) });
            if (!write.ok) throw new Error("İlk ürün kataloğu veritabanına aktarılamadı.");
          }
        } catch (e) { if(active) fail(e instanceof Error ? e.message : "Sunucu kataloğu yüklenemedi."); }
        try {
          const response = await fetch("/api/admin/settings", { cache:"no-store" });
          const data = await response.json();
          if (response.ok && data.settings && active) {
            const merged = { ...defaultSettings, ...data.settings } as StoreSettings;
            setSettings(merged); setSettingsDraft(merged); setContentDraft(merged);
            localStorage.setItem("anavelle-admin-settings-v1", JSON.stringify(merged));
          }
        } catch {}
        try {
          const response = await fetch("/api/admin/orders", { cache:"no-store" });
          const data = await response.json();
          if (response.ok && Array.isArray(data.orders) && active) { setOrders(data.orders); localStorage.setItem("anavelle-admin-orders-v1",JSON.stringify(data.orders)); }
        } catch {}
      }
    }
    void loadServerData();
    return ()=>{active=false;};
  }, [authStatus.authenticated, authStatus.databaseConfigured]);

  useEffect(() => {
    const loaded = getAdminCatalog();
    setCatalog(loaded);
    setMedia(getAdminMedia());
    try {
      setOrders(JSON.parse(localStorage.getItem("anavelle-admin-orders-v1") || "[]") as DemoOrder[]);
      const saved = { ...defaultSettings, ...JSON.parse(localStorage.getItem("anavelle-admin-settings-v1") || "{}") } as StoreSettings;
      setSettings(saved); setSettingsDraft(saved); setContentDraft(saved);
      setCategories(JSON.parse(localStorage.getItem("anavelle-admin-categories-v1") || '["kadin","sandalet","terlik","bot","outlet"]') as string[]);
    } catch {}
    const refresh = () => setCatalog(getAdminCatalog());
    window.addEventListener("anavelle-admin-catalog-updated", refresh);
    return () => window.removeEventListener("anavelle-admin-catalog-updated", refresh);
  }, []);

  useEffect(() => {
    let active = true;
    async function loadImages() {
      const pairs = await Promise.all(media.map(async item => {
        try {
          const src = await resolveProductImage("anavelle-media:" + item.id);
          return [item.id, src] as const;
        } catch { return [item.id, ""] as const; }
      }));
      if (active) setMediaUrls(Object.fromEntries(pairs));
    }
    void loadImages();
    return () => { active = false; };
  }, [media]);

  const visibleProducts = useMemo(() => catalog.filter(p => {
    const matchesQuery = !query || [p.name,p.id,p.category,...p.colors,...p.features].some(value => value.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR")));
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchesStock = stockFilter === "all" || (stockFilter === "stock" ? p.inStock : !p.inStock);
    return matchesQuery && matchesCategory && matchesStock && (showHidden || p.inStock || stockFilter !== "all");
  }), [catalog, query, categoryFilter, stockFilter, showHidden]);
  const activeProducts = catalog.filter(p => p.inStock);
  const totalValue = activeProducts.reduce((sum,p)=>sum+p.price,0);
  const categoryCount = new Set(catalog.map(p=>p.category)).size;

  function announce(message: string) { setNotice(message); setError(""); window.setTimeout(()=>setNotice(""),5000); }
  function fail(message: string) { setError(message); setNotice(""); }
  function saveProducts(next: Product[], message: string) {
    setCatalog(next); saveAdminCatalog(next);
    if (authStatus.authenticated && authStatus.databaseConfigured) {
      void fetch("/api/admin/products", { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({products:next}) })
        .then(async response=>{const data=await response.json();if(!response.ok)throw new Error(data.error||"Veritabanına kaydedilemedi.");announce(message+" Sunucuya kaydedildi.");})
        .catch(e=>fail("Tarayıcıya kaydedildi ancak sunucuya yazılamadı: "+(e instanceof Error?e.message:"bilinmeyen hata")));
    } else announce(message+" Bu tarayıcıya kaydedildi.");
  }
  function saveSettings(next: StoreSettings) {
    localStorage.setItem("anavelle-admin-settings-v1", JSON.stringify(next)); window.dispatchEvent(new Event("anavelle-admin-settings-updated")); setSettings(next); setSettingsDraft(next); setContentDraft(next);
    if (authStatus.authenticated && authStatus.databaseConfigured) {
      void fetch("/api/admin/settings", { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({settings:next}) })
        .then(async response=>{const data=await response.json();if(!response.ok)throw new Error(data.error||"Ayarlar sunucuya kaydedilemedi.");announce("Mağaza ayarları sunucuya kaydedildi.");})
        .catch(e=>fail("Ayarlar bu tarayıcıya kaydedildi ancak sunucuya yazılamadı: "+(e instanceof Error?e.message:"bilinmeyen hata")));
    } else announce("Mağaza ayarları bu tarayıcıya kaydedildi.");
  }
  function startNew() { setEditingId(null); setEditor(emptyProduct()); setError(""); }
  function startEdit(product: Product) { setEditingId(product.id); setEditor({ ...product, colors:[...product.colors], sizes:[...product.sizes], features:[...product.features] }); setError(""); }
  function updateEditor<K extends keyof Product>(key: K, value: Product[K]) { setEditor(prev => prev ? { ...prev, [key]: value } : prev); }

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor) return;
    if (!editor.name.trim()) { fail("Ürün adı zorunludur."); return; }
    if (!editor.category.trim()) { fail("Kategori seçmelisin."); return; }
    if (!Number.isFinite(editor.price) || editor.price < 0) { fail("Geçerli bir satış fiyatı gir."); return; }
    if (editor.oldPrice !== undefined && editor.oldPrice > 0 && editor.oldPrice < editor.price) { fail("Eski fiyat, satış fiyatından düşük olamaz."); return; }
    if (!editor.sizes.length) { fail("En az bir beden seçmelisin."); return; }
    if (!editor.colors.length) { fail("En az bir renk eklemelisin."); return; }
    const normalized = { ...editor, id: editor.id.trim() || ("av-" + Date.now().toString(36)), name: editor.name.trim(), category: editor.category.trim().toLocaleLowerCase("tr-TR"), colors: editor.colors.filter(Boolean), sizes: [...new Set(editor.sizes)].sort(), features: editor.features.filter(Boolean), description: editor.description.trim(), createdAt: editor.createdAt || new Date().toISOString().slice(0,10) };
    if (!normalized.image) { fail("Ürün fotoğrafı seç veya görsel bağlantısı gir."); return; }
    const duplicate = catalog.some(p => p.id === normalized.id && p.id !== editingId);
    if (duplicate) { fail("Bu ürün kodu zaten kullanılıyor."); return; }
    const next = editingId ? catalog.map(p=>p.id===editingId?normalized:p) : [normalized,...catalog];
    saveProducts(next, editingId ? "Ürün değişiklikleri kaydedildi." : "Yeni ürün kataloğa eklendi.");
    setEditor(null); setEditingId(null);
  }

  async function uploadFiles(files: FileList | File[] | null, target: "product"|"library") {
    if (!files?.length) return;
    setBusy(true); setError("");
    try {
      const nextMedia = [...media];
      const added: AdminMedia[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        if (file.size > 15 * 1024 * 1024) { fail(file.name + " 15 MB sınırını aşıyor."); continue; }
        const id = "media-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,7);
        let blob: Blob = file;
        try {
          const optimized = await optimizeImage(file);
          if (optimized) blob = optimized;
        } catch {}
        await saveMediaBlob(id, blob);
        let publicUrl = "";
        if (authStatus.authenticated && authStatus.mediaConfigured) {
          const form = new FormData();
          form.append("file", blob, file.name.replace(/[^a-zA-Z0-9._-]/g,"-"));
          const response = await fetch("/api/admin/media", { method:"POST", body:form });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Fotoğraf buluta yüklenemedi.");
          publicUrl = String(data.publicUrl || "");
          if (data.id) (file as File & {__anavelleStorageId?:string}).__anavelleStorageId = String(data.id);
        }
        const record: AdminMedia = { id, name:file.name, type:blob.type || file.type, size:blob.size, createdAt:new Date().toISOString(), ...(publicUrl ? {url:publicUrl, storageId:(file as File & {__anavelleStorageId?:string}).__anavelleStorageId} : {}) };
        nextMedia.unshift(record); added.push(record);
      }
      if (added.length) {
        saveAdminMedia(nextMedia); setMedia(nextMedia);
        if (target === "product" && editor) {
          updateEditor("image", added[0].url || "anavelle-media:" + added[0].id);
          announce("Fotoğraf optimize edilip medya kütüphanesine eklendi.");
        } else announce(added.length + " görsel medya kütüphanesine eklendi.");
      }
    } catch (e) { fail(e instanceof Error ? e.message : "Fotoğraf yüklenemedi."); }
    finally { setBusy(false); if (fileInput.current) fileInput.current.value = ""; }
  }

  async function removeMedia(item: AdminMedia) {
    if (!window.confirm(item.name + " görselini silmek istediğine emin misin? Bu fotoğrafı kullanan ürünler görselini kaybedebilir.")) return;
    try {
      if (item.url && authStatus.mediaConfigured) {
        const response = await fetch("/api/admin/media", { method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id:item.storageId || item.url.split("/").pop()}) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Bulut görseli silinemedi.");
      }
      await deleteMediaBlob(item.id);
      const next = media.filter(m=>m.id!==item.id);
      saveAdminMedia(next); setMedia(next);
      if (catalog.some(p=>p.image==="anavelle-media:"+item.id)) {
        const nextProducts = catalog.map(p=>p.image==="anavelle-media:"+item.id?{...p,image:""}:p);
        saveProducts(nextProducts,"Görsel silindi; ilişkili ürünlerin fotoğraf alanı boşaltıldı.");
      } else announce("Görsel medya kütüphanesinden silindi.");
    } catch (e) { fail(e instanceof Error ? e.message : "Görsel silinemedi."); }
  }

  function deleteProduct(product: Product) {
    if (!window.confirm(`“${product.name}” ürününü katalogdan silmek istiyor musun?`)) return;
    saveProducts(catalog.filter(p=>p.id!==product.id),"Ürün katalogdan kaldırıldı.");
  }
  function duplicateProduct(product: Product) {
    const copy: Product = { ...product, id:"av-"+Math.random().toString(36).slice(2,8), name:product.name+" (Kopya)", createdAt:new Date().toISOString().slice(0,10) };
    saveProducts([copy,...catalog],"Ürün kopyalandı. Yayınlamadan önce adını ve kodunu kontrol et.");
    startEdit(copy);
  }
  function saveDemoOrders(next: DemoOrder[]) { setOrders(next); localStorage.setItem("anavelle-admin-orders-v1",JSON.stringify(next)); announce("Demo sipariş listesi bu tarayıcıya kaydedildi."); }
  function addDemoOrder() {
    const next: DemoOrder = { id:"DEMO-"+Date.now().toString().slice(-6), customer:"Örnek müşteri", email:"demo@example.com", total:0, status:"Yeni", createdAt:new Date().toISOString(), itemCount:1 };
    saveDemoOrders([next,...orders]);
  }
  function saveCategoryList(next: string[]) { setCategories(next); localStorage.setItem("anavelle-admin-categories-v1",JSON.stringify(next)); announce("Kategori listesi bu tarayıcıya kaydedildi."); }
  function exportCatalog() { downloadJson("anavelle-urun-katalogu.json",catalog); announce("Ürün kataloğu dışa aktarıldı."); }
  function exportAll() { downloadJson("anavelle-magaza-yedegi.json",{version:1,exportedAt:new Date().toISOString(),products:catalog,media,orders,settings,categories}); announce("Mağaza yapılandırma yedeği indirildi. Görsel dosyaları bu JSON'a dahil değildir."); }
  async function importCatalog(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as Product[] | {products?:Product[]};
      const imported = Array.isArray(parsed) ? parsed : parsed.products;
      if (!Array.isArray(imported) || imported.some(p=>!p.id || !p.name || typeof p.price!=="number")) throw new Error("Dosya ürün kataloğu biçiminde değil.");
      if (!window.confirm(imported.length+" ürün içe aktarılacak. Mevcut ürün listesi değiştirilsin mi?")) return;
      saveProducts(imported,"Ürün kataloğu içe aktarıldı."); setSection("products");
    } catch(e) { fail(e instanceof Error?e.message:"Dosya okunamadı."); }
    finally { if(importInput.current)importInput.current.value=""; }
  }
  function editCategoryName(oldName:string) {
    const nextName=window.prompt("Kategori adı (slug):",oldName)?.trim().toLocaleLowerCase("tr-TR");
    if(!nextName||nextName===oldName)return;
    if(categories.includes(nextName)){fail("Bu kategori zaten var.");return;}
    saveCategoryList(categories.map(c=>c===oldName?nextName:c));
    saveProducts(catalog.map(p=>p.category===oldName?{...p,category:nextName}:p),"Kategori ve bağlı ürünler güncellendi.");
  }

  const currentSection = sections.find(item=>item.id===section)!;
  const filteredOrders = orders.filter(o => (orderFilter === "all" || o.status === orderFilter) && (!query || [o.id, o.customer, o.email].some(v => v.toLowerCase().includes(query.toLowerCase()))));
  if (!authStatus.ready || !authStatus.authenticated) return <AdminAccessScreen ready={authStatus.ready} configured={authStatus.configured} onAuthenticated={(status)=>setAuthStatus({ready:true,authenticated:true,configured:true,databaseConfigured:status.databaseConfigured,mediaConfigured:status.mediaConfigured})} />;
  return <div className="admin-app">
    <aside className={mobileNav?"admin-sidebar mobile-open":"admin-sidebar"}>
      <div className="admin-brand"><span className="admin-brand-mark">A</span><div><strong>ANAVELLE</strong><small>MAĞAZA YÖNETİMİ</small></div><button className="admin-mobile-close" onClick={()=>setMobileNav(false)} aria-label="Menüyü kapat"><X size={18}/></button></div>
      <div className="admin-sidebar-label">ÇALIŞMA ALANI</div>
      {sections.map(item=>{const Icon=item.icon;return <button key={item.id} className={section===item.id?"admin-nav-item active":"admin-nav-item"} onClick={()=>{setSection(item.id);setMobileNav(false);setNotice("");setError("");}}><Icon size={17}/><span>{item.label}</span>{item.id==="products"&&<small>{catalog.length}</small>}{item.id==="media"&&<small>{media.length}</small>}</button>})}
      <div className="admin-sidebar-bottom"><span className="admin-demo-dot"/><div><strong>Yerel demo modu</strong><small>Bu tarayıcıda kayıtlı</small></div></div>
    </aside>
    {mobileNav&&<button className="admin-mobile-overlay" onClick={()=>setMobileNav(false)} aria-label="Menüyü kapat"/>}
    <main className="admin-main">
      <header className="admin-topbar"><button className="admin-mobile-toggle" onClick={()=>setMobileNav(true)} aria-label="Menüyü aç"><Menu/></button><div className="admin-top-crumb"><span>ANAVELLE</span><ChevronRight size={14}/><strong>{currentSection.label}</strong></div><div className="admin-top-actions"><span className="admin-status-pill"><span/> {authStatus.databaseConfigured ? "CANLI VERİTABANI" : "DEMO ORTAMI"}</span><button className="admin-logout" onClick={()=>void fetch("/api/admin/auth/logout",{method:"POST"}).then(()=>setAuthStatus({...authStatus,authenticated:false}))}>Çıkış yap</button><Link href="/" target="_blank"><ExternalLink size={15}/> Mağazayı görüntüle</Link></div></header>
      <div className="admin-content">
        {(notice||error)&&<div className={error?"admin-alert error":"admin-alert success"} role="status">{error?<AlertTriangle size={17}/>:<Check size={17}/>}<span>{error||notice}</span><button onClick={()=>{setNotice("");setError("");}} aria-label="Bildirimi kapat"><X size={15}/></button></div>}
        {section==="overview"&&<Overview catalog={catalog} mediaCount={media.length} orders={orders} onNavigate={setSection} onNew={startNew} onExport={exportAll}/>}
        {section==="products"&&<section className="admin-section">
          <div className="admin-page-heading"><div><div className="admin-eyebrow">KATALOG YÖNETİMİ</div><h1>Ürünler</h1><p>Ürün bilgilerini, fotoğrafları, fiyatları, varyantları ve yayın durumunu düzenle.</p></div><div className="admin-heading-actions"><button className="admin-btn secondary" onClick={exportCatalog}><Download size={15}/> Dışa aktar</button><button className="admin-btn secondary" onClick={()=>importInput.current?.click()}><FileUp size={15}/> İçe aktar</button><button className="admin-btn primary" onClick={startNew}><Plus size={16}/> Yeni ürün</button><input ref={importInput} type="file" accept=".json,application/json" hidden onChange={importCatalog}/></div></div>
          <div className="admin-stat-row"><MiniStat icon={Package} label="Toplam ürün" value={String(catalog.length)}/><MiniStat icon={Eye} label="Aktif ürün" value={String(catalog.filter(p=>p.inStock).length)}/><MiniStat icon={EyeOff} label="Pasif ürün" value={String(catalog.filter(p=>!p.inStock).length)}/><MiniStat icon={Tags} label="Kategori" value={String(categoryCount)}/></div>
          <div className="admin-panel admin-product-toolbar"><label className="admin-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ürün adı, kod, renk ara..."/></label><select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}><option value="all">Tüm kategoriler</option>{Array.from(new Set([...categories,...catalog.map(p=>p.category)])).map(c=><option key={c} value={c}>{c}</option>)}</select><select value={stockFilter} onChange={e=>setStockFilter(e.target.value)}><option value="all">Tüm durumlar</option><option value="stock">Aktif</option><option value="out">Pasif</option></select><span className="admin-result-count">{visibleProducts.length} ürün</span></div>
          <div className="admin-panel admin-table-panel"><div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>ÜRÜN</th><th>KATEGORİ</th><th>FİYAT</th><th>RENK / BEDEN</th><th>DURUM</th><th className="align-right">İŞLEMLER</th></tr></thead><tbody>{visibleProducts.map(p=><tr key={p.id}><td><div className="admin-product-cell"><AdminProductImage image={p.image} alt={p.name}/><div><strong>{p.name}</strong><small>{p.id}</small></div></div></td><td><span className="admin-category-chip">{p.category}</span></td><td><strong>{money(p.price)}</strong>{p.oldPrice&&<small className="admin-old-price">{money(p.oldPrice)}</small>}</td><td><span>{p.colors.join(", ")||"—"}</span><small>{p.sizes.join(" · ")||"Beden yok"}</small></td><td><span className={p.inStock?"admin-status active":"admin-status inactive"}><span/>{p.inStock?"Aktif":"Pasif"}</span></td><td><div className="admin-row-actions"><button title="Düzenle" onClick={()=>startEdit(p)}><Pencil size={15}/></button><button title="Kopyala" onClick={()=>duplicateProduct(p)}><Copy size={15}/></button><button title={p.inStock?"Pasif yap":"Aktif yap"} onClick={()=>saveProducts(catalog.map(x=>x.id===p.id?{...x,inStock:!x.inStock}:x),p.inStock?"Ürün pasife alındı.":"Ürün aktifleştirildi.")}>{p.inStock?<EyeOff size={15}/>:<Eye size={15}/>}</button><button title="Sil" className="danger" onClick={()=>deleteProduct(p)}><Trash2 size={15}/></button></div></td></tr>)}</tbody></table>{visibleProducts.length===0&&<div className="admin-empty"><Package size={28}/><strong>Ürün bulunamadı</strong><p>Arama veya filtreleri değiştirebilir ya da yeni ürün ekleyebilirsin.</p></div>}</div><div className="admin-table-foot">Ürün düzenlemeleri bu tarayıcıya kaydedilir; canlı mağaza veritabanına gönderilmez.</div></div>
        </section>}
        {section==="media"&&<section className="admin-section">
          <div className="admin-page-heading"><div><div className="admin-eyebrow">GÖRSEL YÖNETİMİ</div><h1>Fotoğraf & medya</h1><p>Ürün fotoğraflarını yükle, önizle, ürüne bağla ve kullanılmayan dosyaları yönet.</p></div><button className="admin-btn primary" onClick={()=>{setPhotoTarget("library");fileInput.current?.click();}}><ImagePlus size={16}/> Fotoğraf yükle</button></div>
          <div className="admin-media-summary"><div><Images size={20}/><span><strong>{media.length}</strong><small>Yüklenen görsel</small></span></div><div><Package size={20}/><span><strong>{catalog.filter(p=>p.image.startsWith("anavelle-media:")).length}</strong><small>Üründe kullanılan görsel</small></span></div><div><Upload size={20}/><span><strong>15 MB</strong><small>Tek dosya sınırı</small></span></div></div>
          <div className="admin-panel admin-media-toolbar"><label className="admin-search"><Search size={16}/><input value={mediaSearch} onChange={e=>setMediaSearch(e.target.value)} placeholder="Dosya adı ara..."/></label><span className="admin-result-count">{media.filter(m=>m.name.toLowerCase().includes(mediaSearch.toLowerCase())).length} dosya</span></div>
          {media.filter(m=>m.name.toLowerCase().includes(mediaSearch.toLowerCase())).length===0?<div className="admin-panel admin-empty-media"><Images size={34}/><h3>Henüz medya yüklenmedi</h3><p>Ürün düzenlerken fotoğraf yükleyebilir veya buradan toplu görsel ekleyebilirsin.</p><button className="admin-btn primary" onClick={()=>{setPhotoTarget("library");fileInput.current?.click();}}><Upload size={15}/> Fotoğraf seç</button></div>:<div className="admin-media-grid">{media.filter(m=>m.name.toLowerCase().includes(mediaSearch.toLowerCase())).map(m=><article className="admin-media-card" key={m.id}><div className="admin-media-preview">{m.url||mediaUrls[m.id]?<img src={m.url||mediaUrls[m.id]} alt={m.name}/>:<Images size={28}/>}<button title="Görseli sil" onClick={()=>void removeMedia(m)}><Trash2 size={15}/></button></div><div className="admin-media-info"><strong title={m.name}>{m.name}</strong><small>{formatBytes(m.size)} · {new Date(m.createdAt).toLocaleDateString("tr-TR")}</small><select aria-label={m.name+" görselini ürüne bağla"} defaultValue="" onChange={e=>{if(e.target.value){const p=catalog.find(p=>p.id===e.target.value);if(p)saveProducts(catalog.map(x=>x.id===p.id?{...x,image:m.url||"anavelle-media:"+m.id}:x),m.name+" ürün fotoğrafı olarak bağlandı.");e.target.value="";}}}><option value="">Ürüne bağla…</option>{catalog.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div></article>)}</div>}
          <div className="admin-info-note"><AlertTriangle size={17}/><span>Fotoğraflar bu tarayıcının IndexedDB alanında tutulur. Site sunucusuna yüklenmez ve başka cihazlardan görünmez. Canlı kullanım için kalıcı bulut medya deposu bağlanmalıdır.</span></div>
        </section>}
        {section==="categories"&&<section className="admin-section">
          <div className="admin-page-heading"><div><div className="admin-eyebrow">KATALOG YAPISI</div><h1>Kategoriler</h1><p>Kategori slug'larını yönet ve hangi ürünlerin bağlı olduğunu gör.</p></div></div>
          <div className="admin-panel admin-category-create"><label><span>Yeni kategori slug'ı</span><input value={newCategory} onChange={e=>setNewCategory(e.target.value.toLocaleLowerCase("tr-TR").replace(/\s+/g,"-"))} placeholder="ör. babet"/></label><button className="admin-btn primary" onClick={()=>{const name=newCategory.trim();if(!name)return;if(categories.includes(name)){fail("Bu kategori zaten mevcut.");return;}saveCategoryList([...categories,name]);setNewCategory("");}}> <Plus size={15}/> Kategori ekle</button></div>
          <div className="admin-category-grid">{categories.map(c=><article className="admin-panel admin-category-card" key={c}><div className="admin-category-icon"><Tags size={20}/></div><div className="admin-category-title"><strong>{c}</strong><small>{catalog.filter(p=>p.category===c).length} ürün</small></div><button title="Kategori slug'ını değiştir" onClick={()=>editCategoryName(c)}><Pencil size={15}/></button><button title="Kategoriyi sil" className="danger" onClick={()=>{if(catalog.some(p=>p.category===c)){fail("Bu kategoriye bağlı ürünler var. Önce ürünleri başka kategoriye taşı.");return;}if(window.confirm(c+" kategorisi silinsin mi?"))saveCategoryList(categories.filter(x=>x!==c));}}><Trash2 size={15}/></button></article>)}</div>
          <div className="admin-info-note"><AlertTriangle size={17}/><span>Yeni kategori burada yerel listeye eklenir. Mağaza menüsü, URL rotası ve SEO yapılandırması ayrıca kodda/sunucuda eşleştirilmelidir.</span></div>
        </section>}
        {section==="orders"&&<section className="admin-section">
          <div className="admin-page-heading"><div><div className="admin-eyebrow">SİPARİŞ YÖNETİMİ</div><h1>Siparişler</h1><p>Sipariş durumları için arayüz taslağı. Gerçek sipariş sistemi henüz bağlı değil.</p></div><button className="admin-btn secondary" onClick={addDemoOrder}><Plus size={15}/> Demo sipariş oluştur</button></div>
          <div className="admin-info-note"><AlertTriangle size={17}/><span>Bu sayfadaki kayıtlar yalnızca örnek sipariştir. Gerçek müşterilerin bilgileri girilmemeli; ödeme/kargo ve sipariş API'si bağlı değildir.</span></div>
          <div className="admin-panel admin-product-toolbar"><label className="admin-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Sipariş no veya müşteri ara..."/></label><select value={orderFilter} onChange={e=>setOrderFilter(e.target.value)}><option value="all">Tüm durumlar</option>{["Yeni","Hazırlanıyor","Kargoda","Teslim edildi","İptal","İade"].map(s=><option key={s}>{s}</option>)}</select><span className="admin-result-count">{filteredOrders.length} sipariş</span></div>
          <div className="admin-panel admin-table-panel"><div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>SİPARİŞ</th><th>MÜŞTERİ</th><th>TARİH</th><th>ÜRÜN</th><th>TOPLAM</th><th>DURUM</th><th>İŞLEM</th></tr></thead><tbody>{filteredOrders.map(o=><tr key={o.id}><td><strong>{o.id}</strong></td><td><strong>{o.customer}</strong><small>{o.email}</small></td><td>{new Date(o.createdAt).toLocaleDateString("tr-TR")}</td><td>{o.itemCount}</td><td>{money(o.total)}</td><td><select className="admin-inline-select" value={o.status} onChange={e=>saveDemoOrders(orders.map(x=>x.id===o.id?{...x,status:e.target.value}:x))}>{["Yeni","Hazırlanıyor","Kargoda","Teslim edildi","İptal","İade"].map(s=><option key={s}>{s}</option>)}</select></td><td><button className="admin-icon-btn danger" title="Demo siparişi sil" onClick={()=>{if(window.confirm("Demo siparişi silinsin mi?"))saveDemoOrders(orders.filter(x=>x.id!==o.id));}}><Trash2 size={15}/></button></td></tr>)}</tbody></table>{orders.length===0&&<div className="admin-empty"><ShoppingCart size={28}/><strong>Henüz sipariş kaydı yok</strong><p>Gerçek siparişler, sunucu tarafı sipariş entegrasyonu eklendiğinde burada gösterilmelidir.</p></div>}</div></div>
        </section>}
        {section==="content"&&<section className="admin-section">
          <div className="admin-page-heading"><div><div className="admin-eyebrow">VİTRİN DÜZENLEME</div><h1>Ana sayfa içerikleri</h1><p>Duyuru metni, hero başlığı ve görsel tercihini düzenle.</p></div><button className="admin-btn primary" onClick={()=>saveSettings(contentDraft)}><Save size={15}/> Değişiklikleri kaydet</button></div>
          <div className="admin-content-editor"><div className="admin-panel admin-editor-form"><div className="admin-form-section-title">Üst duyuru bandı</div><label className="admin-field"><span>Duyuru metni</span><input value={contentDraft.announcement} onChange={e=>setContentDraft({...contentDraft,announcement:e.target.value})} placeholder="Yeni sezonu keşfet"/></label><div className="admin-form-section-title">Ana sayfa hero alanı</div><label className="admin-field"><span>Başlık</span><textarea rows={2} value={contentDraft.heroTitle} onChange={e=>setContentDraft({...contentDraft,heroTitle:e.target.value})}/></label><label className="admin-field"><span>Alt açıklama</span><textarea rows={3} value={contentDraft.heroSubtitle} onChange={e=>setContentDraft({...contentDraft,heroSubtitle:e.target.value})}/></label><label className="admin-field"><span>Hero görsel URL'si</span><input value={contentDraft.heroImage} onChange={e=>setContentDraft({...contentDraft,heroImage:e.target.value})} placeholder="https://..."/><small>Bu alanın mağaza görünümüne uygulanması için canlı içerik API'si bağlanmalıdır.</small></label></div><div className="admin-content-preview"><div className="admin-form-section-title">Önizleme</div><div className="admin-hero-preview" style={contentDraft.heroImage?{backgroundImage:"linear-gradient(90deg,rgba(36,21,15,.8),rgba(36,21,15,.1)),url("+contentDraft.heroImage+")"}:{}}><span>ANAVELLE · YENİ SEZON</span><h2>{contentDraft.heroTitle||"Ana sayfa başlığı"}</h2><p>{contentDraft.heroSubtitle||"Ana sayfa alt açıklaması"}</p></div><p className="admin-muted">Önizleme bu panelde güncellenir. Canlı ana sayfa henüz bu yerel ayarlarla bağlı değil.</p></div></div>
        </section>}
        {section==="settings"&&<section className="admin-section">
          <div className="admin-page-heading"><div><div className="admin-eyebrow">MAĞAZA YAPILANDIRMASI</div><h1>Mağaza ayarları</h1><p>Temel iletişim ve SEO ayarlarını yönet; yedek al veya dışa aktar.</p></div><button className="admin-btn primary" onClick={()=>saveSettings(settingsDraft)}><Save size={15}/> Ayarları kaydet</button></div>
          <div className="admin-settings-grid"><div className="admin-panel admin-editor-form"><div className="admin-form-section-title">Genel bilgiler</div><label className="admin-field"><span>Mağaza adı</span><input value={settingsDraft.storeName} onChange={e=>setSettingsDraft({...settingsDraft,storeName:e.target.value})}/></label><label className="admin-field"><span>Destek e-postası</span><input type="email" value={settingsDraft.supportEmail} onChange={e=>setSettingsDraft({...settingsDraft,supportEmail:e.target.value})} placeholder="destek@anavelle.com"/></label><label className="admin-field"><span>Telefon</span><input value={settingsDraft.phone} onChange={e=>setSettingsDraft({...settingsDraft,phone:e.target.value})} placeholder="+90 ..."/></label><label className="admin-field"><span>Ücretsiz kargo eşiği (TL)</span><input type="number" min="0" value={settingsDraft.freeShippingThreshold} onChange={e=>setSettingsDraft({...settingsDraft,freeShippingThreshold:e.target.value})} placeholder="Belirtilmedi"/></label><div className="admin-form-section-title">SEO</div><label className="admin-field"><span>Sayfa başlığı</span><input value={settingsDraft.seoTitle} onChange={e=>setSettingsDraft({...settingsDraft,seoTitle:e.target.value})}/></label><label className="admin-field"><span>Meta açıklama</span><textarea rows={3} value={settingsDraft.seoDescription} onChange={e=>setSettingsDraft({...settingsDraft,seoDescription:e.target.value})}/></label></div><div className="admin-settings-side"><div className="admin-panel admin-connection-card"><div className="admin-connection-icon"><Activity/></div><div><strong>Sistem durumu</strong><small>Arayüz çalışıyor · Canlı servisler bağlı değil</small></div><span className="admin-status inactive">Demo</span><ul><li><span>Ürün veritabanı</span><b>Bağlı değil</b></li><li><span>Admin kimlik doğrulama</span><b>Bağlı değil</b></li><li><span>Ödeme sağlayıcısı</span><b>Kapalı</b></li><li><span>Kargo entegrasyonu</span><b>Bağlı değil</b></li><li><span>Medya bulut deposu</span><b>Bağlı değil</b></li></ul><Link href="/api/health" target="_blank">Servis durumunu kontrol et <ArrowUpRight size={14}/></Link></div><div className="admin-panel admin-backup-card"><div className="admin-form-section-title">Yedekleme</div><p>Ürünler, kategoriler, demo siparişler ve ayarlar için JSON yedeği indir. Görsel dosyaları ayrıca dışa aktarılmalıdır.</p><button className="admin-btn secondary full" onClick={exportAll}><Download size={15}/> Mağaza ayarlarını yedekle</button><button className="admin-btn secondary full" onClick={exportCatalog}><FileDown size={15}/> Ürün kataloğunu indir</button><button className="admin-btn secondary full" onClick={()=>importInput.current?.click()}><FileUp size={15}/> Katalog yedeğini yükle</button></div></div></div>
          <div className="admin-info-note"><AlertTriangle size={17}/><span>Güvenlik: Bu yönetim ekranında sunucu taraflı yönetici girişi yoktur. Üretim ortamında güvenli oturum, rol kontrolü, kalıcı veritabanı ve denetim kayıtları kurulmadan hassas müşteri verisi tutulmamalıdır.</span></div>
        </section>}
      </div>
    </main>
    <input ref={fileInput} type="file" accept="image/*" multiple={photoTarget==="library"} hidden onChange={e=>void uploadFiles(e.target.files,photoTarget)}/>
    {editor&&<div className="admin-modal-backdrop" role="presentation" onClick={()=>setEditor(null)}><section className="admin-product-modal" role="dialog" aria-modal="true" aria-label={editingId?"Ürün düzenle":"Yeni ürün"} onClick={e=>e.stopPropagation()}>
      <header className="admin-modal-header"><div><div className="admin-eyebrow">{editingId?"KATALOG KAYDI":"YENİ KAYIT"}</div><h2>{editingId?"Ürünü düzenle":"Yeni ürün ekle"}</h2><p>Ürün bilgilerini ve görselini doldur.</p></div><button onClick={()=>setEditor(null)} aria-label="Pencereyi kapat"><X/></button></header>
      <form onSubmit={saveProduct} className="admin-product-form">
        <div className="admin-form-grid"><label className="admin-field full"><span>Ürün adı *</span><input required value={editor.name} onChange={e=>updateEditor("name",e.target.value)} placeholder="Örn. Anatomic deri sandalet"/></label>
          <label className="admin-field"><span>Ürün kodu *</span><input required value={editor.id} onChange={e=>updateEditor("id",e.target.value)} disabled={!!editingId} placeholder="av-109"/></label>
          <label className="admin-field"><span>Kategori *</span><select value={editor.category} onChange={e=>updateEditor("category",e.target.value)}>{Array.from(new Set([...categories,editor.category])).map(c=><option key={c} value={c}>{c}</option>)}</select></label>
          <label className="admin-field"><span>Satış fiyatı (TL) *</span><input required type="number" min="0" step="0.01" value={editor.price} onChange={e=>updateEditor("price",Number(e.target.value))}/></label>
          <label className="admin-field"><span>Eski fiyat (TL)</span><input type="number" min="0" step="0.01" value={editor.oldPrice??""} onChange={e=>updateEditor("oldPrice",e.target.value===""?undefined:Number(e.target.value))}/></label>
          <label className="admin-field full"><span>Açıklama</span><textarea rows={3} value={editor.description} onChange={e=>updateEditor("description",e.target.value)} placeholder="Ürün açıklaması"/></label>
          <label className="admin-field"><span>Materyal</span><input value={editor.material} onChange={e=>updateEditor("material",e.target.value)} placeholder="Örn. Hakiki deri"/></label>
          <label className="admin-field"><span>Topuk / taban bilgisi</span><input value={editor.heelHeight} onChange={e=>updateEditor("heelHeight",e.target.value)} placeholder="Ürün özelliği"/></label>
          <label className="admin-field full"><span>Renkler (virgülle ayır)</span><input value={editor.colors.join(", ")} onChange={e=>updateEditor("colors",e.target.value.split(",").map(v=>v.trim()).filter(Boolean))} placeholder="Siyah, Taba, Krem"/></label>
          <div className="admin-field full"><span>Bedenler</span><div className="admin-size-pills">{[35,36,37,38,39,40,41,42,43,44,45].map(size=><label key={size} className={editor.sizes.includes(size)?"selected":""}><input type="checkbox" checked={editor.sizes.includes(size)} onChange={e=>updateEditor("sizes",e.target.checked?[...editor.sizes,size].sort():editor.sizes.filter(s=>s!==size))}/>{size}</label>)}</div></div>
          <label className="admin-field full"><span>Özellik etiketleri (virgülle ayır)</span><input value={editor.features.join(", ")} onChange={e=>updateEditor("features",e.target.value.split(",").map(v=>v.trim()).filter(Boolean))} placeholder="Günlük kullanım, Hafif taban"/></label>
          <label className="admin-field full"><span>Fotoğraf URL'si</span><input value={editor.image.startsWith("anavelle-media:")?"":editor.image} onChange={e=>updateEditor("image",e.target.value)} placeholder="https://... veya aşağıdan fotoğraf yükle"/></label>
        </div>
        <div className="admin-upload-drop"><ImagePlus size={23}/><div><strong>Ürün fotoğrafı</strong><small>JPG, PNG, WebP · en fazla 15 MB · tarayıcıda optimize edilir</small></div><button type="button" className="admin-btn secondary" disabled={busy} onClick={()=>{setPhotoTarget("product");fileInput.current?.click();}}><Upload size={14}/>{busy?"Yükleniyor…":"Fotoğraf yükle"}</button></div>
        {editor.image&&<div className="admin-image-current">{editor.image.startsWith("anavelle-media:")?<AdminMediaPreview image={editor.image} alt={editor.name}/>:<img src={editor.image} alt={editor.name}/>}<span>Seçili görsel</span><button type="button" onClick={()=>updateEditor("image","")}><Trash2 size={14}/> Kaldır</button></div>}
        <div className="admin-form-grid admin-form-options"><label className="admin-toggle"><input type="checkbox" checked={editor.inStock} onChange={e=>updateEditor("inStock",e.target.checked)}/><span><strong>Ürün aktif</strong><small>Katalogda görünmesi için aktif olarak işaretle</small></span></label><label className="admin-toggle"><input type="checkbox" checked={editor.freeShipping} onChange={e=>updateEditor("freeShipping",e.target.checked)}/><span><strong>Ücretsiz kargo</strong><small>Ürün kartı için kargo etiketi</small></span></label><label className="admin-field"><span>Ürün etiketi</span><input value={editor.tag||""} onChange={e=>updateEditor("tag",e.target.value||undefined)} placeholder="YENİ, FIRSAT..."/></label></div>
        {error&&<div className="admin-alert error"><AlertTriangle size={16}/><span>{error}</span></div>}
        <footer className="admin-modal-footer"><button type="button" className="admin-btn secondary" onClick={()=>setEditor(null)}>Vazgeç</button><button type="submit" className="admin-btn primary"><Save size={15}/>{editingId?"Ürünü kaydet":"Ürünü oluştur"}</button></footer>
        <p className="admin-modal-disclaimer">Bu kayıt yalnızca bu tarayıcıda saklanır. Canlı mağaza kataloğunu güncellemez.</p>
      </form>
    </section></div>}
  </div>;
}

type AdminAuthStatus = { databaseConfigured:boolean; mediaConfigured:boolean };
function AdminAccessScreen({ready,configured,onAuthenticated}:{ready:boolean;configured:boolean;onAuthenticated:(status:AdminAuthStatus)=>void}) {
  const [password,setPassword]=useState("");
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();setBusy(true);setMessage("");
    try {
      const response=await fetch("/api/admin/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||"Giriş yapılamadı.");
      const session=await fetch("/api/admin/auth/session",{cache:"no-store"}).then(r=>r.json());
      onAuthenticated({databaseConfigured:Boolean(session.databaseConfigured),mediaConfigured:Boolean(session.mediaConfigured)});
    } catch(e) {setMessage(e instanceof Error?e.message:"Giriş sırasında hata oluştu.");}
    finally {setBusy(false);}
  }
  return <div className="admin-access-page"><div className="admin-access-card">
    <div className="admin-access-brand"><span>A</span><div><strong>ANAVELLE</strong><small>GÜVENLİ YÖNETİM ALANI</small></div></div>
    {!ready?<div className="admin-access-loading"><span className="admin-loading-spinner"/> Yönetim oturumu kontrol ediliyor…</div>:!configured?<><div className="admin-access-icon"><LockKeyhole size={22}/></div><div className="admin-eyebrow">İLK KURULUM GEREKLİ</div><h1>Yönetim girişini etkinleştir.</h1><p>Admin sayfası güvenlik için kilitli. Giriş yapabilmek için Netlify site ayarlarında aşağıdaki sunucu ortam değişkenlerini tanımla ve yeni dağıtımı başlat.</p><div className="admin-env-list"><code>ANAVELLE_ADMIN_PASSWORD</code><code>ANAVELLE_SESSION_SECRET</code></div><p className="admin-access-small">İsteğe bağlı kalıcı katalog ve fotoğraf depolaması için <code>SUPABASE_URL</code> ve <code>SUPABASE_SERVICE_ROLE_KEY</code> de gerekir. Gizli anahtarları asla NEXT_PUBLIC_ ile başlatma.</p><a className="admin-btn primary admin-access-link" href="https://app.netlify.com/" target="_blank" rel="noreferrer">Netlify ayarlarını aç <ExternalLink size={15}/></a><Link className="admin-access-back" href="/">Mağazaya dön</Link></>:<><div className="admin-access-icon"><LockKeyhole size={22}/></div><div className="admin-eyebrow">YÖNETİCİ GİRİŞİ</div><h1>Tekrar hoş geldin.</h1><p>Devam etmek için sunucu tarafında tanımlı yönetici şifreni gir.</p><form onSubmit={submit}><label className="admin-access-field"><span>Yönetici şifresi</span><div><input autoFocus required type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" placeholder="Şifren"/><button type="button" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword?"Şifreyi gizle":"Şifreyi göster"}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>{message&&<p className="admin-access-error" role="alert">{message}</p>}<button className="admin-btn primary admin-access-link" disabled={busy}>{busy?"Kontrol ediliyor…":"Güvenli giriş yap"} <ChevronRight size={15}/></button></form><Link className="admin-access-back" href="/">Mağazaya dön</Link></>}
    <div className="admin-access-foot"><ShieldIcon/><span>Şifre tarayıcı koduna yazılmaz. Oturum, HTTP-only ve imzalı sunucu çereziyle korunur.</span></div>
  </div></div>;
}

function MiniStat({icon:Icon,label,value}:{icon:typeof Package;label:string;value:string}) { return <div className="admin-mini-stat"><span><Icon size={17}/></span><div><small>{label}</small><strong>{value}</strong></div></div>; }

function Overview({catalog,mediaCount,orders,onNavigate,onNew,onExport}:{catalog:Product[];mediaCount:number;orders:DemoOrder[];onNavigate:(section:Section)=>void;onNew:()=>void;onExport:()=>void}) {
  const active=catalog.filter(p=>p.inStock).length;
  return <section className="admin-section">
    <div className="admin-page-heading"><div><div className="admin-eyebrow">MAĞAZA ÖZETİ</div><h1>Günaydın, Anavelle.</h1><p>Mağazanı buradan yönet. Değişiklikler şu an demo modunda bu tarayıcıya kaydediliyor.</p></div><div className="admin-heading-actions"><button className="admin-btn secondary" onClick={onExport}><Download size={15}/> Yedek al</button><button className="admin-btn primary" onClick={onNew}><Plus size={16}/> Ürün ekle</button></div></div>
    <div className="admin-overview-alert"><span><AlertTriangle size={19}/></span><div><strong>Yönetim paneli henüz canlı sisteme bağlı değil</strong><p>Ürün, görsel ve ayarlar bu tarayıcıda saklanır. Site ziyaretçileriyle veya başka cihazlarla senkronize olmaz. Canlı kontrol için veritabanı, güvenli admin girişi ve medya deposu gerekiyor.</p></div></div>
    <div className="admin-overview-stats"><div className="admin-overview-stat"><span className="stat-icon"><Package/></span><div><small>Katalog ürünleri</small><strong>{catalog.length}</strong><small className="stat-foot">{active} aktif ürün</small></div><button onClick={()=>onNavigate("products")}><ArrowUpRight size={17}/></button></div><div className="admin-overview-stat"><span className="stat-icon"><Images/></span><div><small>Medya dosyaları</small><strong>{mediaCount}</strong><small className="stat-foot">Yüklenen fotoğraflar</small></div><button onClick={()=>onNavigate("media")}><ArrowUpRight size={17}/></button></div><div className="admin-overview-stat"><span className="stat-icon"><ShoppingCart/></span><div><small>Demo siparişler</small><strong>{orders.length}</strong><small className="stat-foot">Gerçek sipariş yok</small></div><button onClick={()=>onNavigate("orders")}><ArrowUpRight size={17}/></button></div><div className="admin-overview-stat"><span className="stat-icon"><Tags/></span><div><small>Kategoriler</small><strong>{new Set(catalog.map(p=>p.category)).size}</strong><small className="stat-foot">Katalog sınıfları</small></div><button onClick={()=>onNavigate("categories")}><ArrowUpRight size={17}/></button></div></div>
    <div className="admin-overview-columns"><div className="admin-panel admin-overview-products"><div className="admin-panel-heading"><div><h2>Son düzenlenen katalog</h2><p>Ürünlerini hızlıca kontrol et.</p></div><button onClick={()=>onNavigate("products")}>Tüm ürünler <ChevronRight size={14}/></button></div><div className="admin-recent-list">{catalog.slice(0,6).map(p=><div className="admin-recent-product" key={p.id}><AdminProductImage image={p.image} alt={p.name}/><div><strong>{p.name}</strong><small>{p.id} · {p.category}</small></div><b>{money(p.price)}</b><button onClick={()=>onNavigate("products")} title="Ürün listesine git"><Pencil size={14}/></button></div>)}</div></div><div className="admin-panel admin-quick-actions"><div className="admin-panel-heading"><div><h2>Hızlı işlemler</h2><p>Sık kullanılan yönetim araçları.</p></div></div><button onClick={onNew}><span><Plus size={17}/></span><div><strong>Yeni ürün oluştur</strong><small>Ürün, beden, renk ve fotoğraf ekle</small></div><ChevronRight size={16}/></button><button onClick={()=>onNavigate("media")}><span><ImagePlus size={17}/></span><div><strong>Fotoğraf kütüphanesi</strong><small>Görsel yükle ve ürünle eşleştir</small></div><ChevronRight size={16}/></button><button onClick={()=>onNavigate("content")}><span><Store size={17}/></span><div><strong>Ana sayfa içerikleri</strong><small>Başlık ve vitrin alanlarını düzenle</small></div><ChevronRight size={16}/></button><button onClick={()=>onNavigate("settings")}><span><Settings size={17}/></span><div><strong>Mağaza ayarları</strong><small>İletişim, SEO ve yedekleme</small></div><ChevronRight size={16}/></button></div></div>
    <div className="admin-bottom-note"><ShieldIcon/><span><strong>Güvenlik kontrolü</strong> — Üretim öncesi yönetici kimlik doğrulaması, rol kontrolü, kalıcı veritabanı, görsel depolama ve denetim kayıtları zorunludur.</span></div>
  </section>;
}
function ShieldIcon(){return <span className="admin-shield-icon"><Activity size={18}/></span>}

function AdminProductImage({image,alt}:{image:string;alt:string}) {
  const [src,setSrc]=useState("");
  useEffect(()=>{let active=true;let objectUrl="";void resolveProductImage(image).then(value=>{if(!active)return;if(value){objectUrl=value;setSrc(value);}else if(!image.startsWith("anavelle-media:"))setSrc(image);});return()=>{active=false;if(objectUrl)URL.revokeObjectURL(objectUrl);};},[image]);
  return src?<img className="admin-thumb" src={src} alt={alt}/>:<span className="admin-thumb placeholder"><Images size={18}/></span>;
}
function AdminMediaPreview({image,alt}:{image:string;alt:string}) { return <AdminProductImage image={image} alt={alt}/>; }

async function optimizeImage(file:File):Promise<Blob|null> {
  if(typeof createImageBitmap==="undefined")return null;
  const bitmap=await createImageBitmap(file);
  const scale=Math.min(1,1400/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement("canvas");canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
  const ctx=canvas.getContext("2d");if(!ctx){bitmap.close();return null;}
  ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
  return new Promise(resolve=>canvas.toBlob(blob=>resolve(blob), "image/webp", .82));
}
function formatBytes(bytes:number){if(bytes<1024)return bytes+" B";if(bytes<1024*1024)return (bytes/1024).toFixed(0)+" KB";return (bytes/1024/1024).toFixed(1)+" MB";}
