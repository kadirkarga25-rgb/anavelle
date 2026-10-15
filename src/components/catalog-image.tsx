"use client";

import { useEffect, useState } from "react";
import { resolveProductImage } from "@/lib/admin-catalog";

export function CatalogImage({ image, alt, className, loading }: { image: string; alt: string; className?: string; loading?: "eager" | "lazy" }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    let active = true;
    let objectUrl = "";
    void resolveProductImage(image).then(value => {
      if (!active) { if (value.startsWith("blob:")) URL.revokeObjectURL(value); return; }
      if (value.startsWith("blob:")) objectUrl = value;
      setSrc(value || "");
    });
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [image]);
  if (!src) return <span className={className ? className + " catalog-image-placeholder" : "catalog-image-placeholder"} aria-label={alt} />;
  return <img src={src} alt={alt} className={className} loading={loading} />;
}
