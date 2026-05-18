"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";

type ProductImageProps = {
  src?: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

export function ProductImage({ src, alt, priority, className, sizes }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={cn("flex h-full w-full items-center justify-center bg-stone-100 text-stone-400", className)}>
        <ImageOff className="size-8" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      draggable={false}
      priority={priority}
      sizes={sizes}
      className={cn("select-none object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}
