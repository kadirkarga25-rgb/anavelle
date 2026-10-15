import { Product, products } from "@/data/products";

const CATALOG_KEY = "anavelle-admin-products-v1";
const MEDIA_KEY = "anavelle-admin-media-v1";
const DB_NAME = "anavelle-admin-assets";
const STORE_NAME = "images";

export type AdminMedia = { id: string; name: string; type: string; size: number; createdAt: string; productId?: string; url?: string; storageId?: string };

export function hasAdminCatalogOverride(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CATALOG_KEY) !== null;
}

export function getAdminCatalog(): Product[] {
  if (typeof window === "undefined") return products;
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    if (!raw) return products;
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) ? parsed : products;
  } catch { return products; }
}

export function saveAdminCatalog(items: Product[]) {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("anavelle-admin-catalog-updated"));
}

export function getAdminMedia(): AdminMedia[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(MEDIA_KEY) || "[]") as AdminMedia[]; } catch { return []; }
}

export function saveAdminMedia(items: AdminMedia[]) {
  localStorage.setItem(MEDIA_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("anavelle-admin-media-updated"));
}

function openMediaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") { reject(new Error("Tarayıcı dosya depolaması desteklenmiyor.")); return; }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Medya deposu açılamadı."));
  });
}

export async function saveMediaBlob(id: string, blob: Blob): Promise<void> {
  const db = await openMediaDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(blob, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error("Görsel kaydedilemedi."));
    tx.onabort = () => reject(tx.error || new Error("Görsel kaydı iptal edildi."));
  });
  db.close();
}

export async function getMediaBlob(id: string): Promise<Blob | undefined> {
  const db = await openMediaDb();
  const blob = await new Promise<Blob | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result as Blob | undefined);
    request.onerror = () => reject(request.error || new Error("Görsel okunamadı."));
  });
  db.close();
  return blob;
}

export async function deleteMediaBlob(id: string): Promise<void> {
  const db = await openMediaDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error("Görsel silinemedi."));
  });
  db.close();
}

export async function resolveProductImage(image: string): Promise<string> {
  if (!image.startsWith("anavelle-media:")) return image;
  try {
    const blob = await getMediaBlob(image.slice("anavelle-media:".length));
    return blob ? URL.createObjectURL(blob) : "";
  } catch { return ""; }
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
