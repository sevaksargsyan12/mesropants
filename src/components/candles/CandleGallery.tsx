"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryImage = { url: string; altText: string };

type CandleGalleryProps = {
  images: GalleryImage[];
  // Used as the alt text fallback whenever a given image's own altText is
  // empty -- typically the candle's name.
  fallbackAlt: string;
};

export default function CandleGallery({ images, fallbackAlt }: CandleGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open = lightboxIndex !== null;
  const count = images.length;

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        setLightboxIndex((i) => (i === null ? null : (i + 1) % count));
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((i) => (i === null ? null : (i - 1 + count) % count));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, count]);

  if (count === 0) {
    return (
      <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-t-[6rem] rounded-b-2xl border border-gold/30">
        <div className="h-full w-full bg-cream-dark dark:bg-dark-bg-soft" />
      </div>
    );
  }

  const active = lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightboxIndex(0)}
        className="relative mx-auto block aspect-[3/4] w-full max-w-md cursor-zoom-in overflow-hidden rounded-t-[6rem] rounded-b-2xl border border-gold/30 motion-safe:animate-shadow-orbit"
      >
        <Image
          src={images[0].url}
          alt={images[0].altText || fallbackAlt}
          fill
          sizes="(min-width: 1024px) 448px, 90vw"
          className="object-cover"
          priority
        />
      </button>

      {count > 1 && (
        <div className="mx-auto mt-4 flex max-w-md justify-center gap-3">
          {images.slice(1).map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setLightboxIndex(i + 1)}
              aria-label={`View photo ${i + 2}`}
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gold/30 transition-opacity hover:opacity-80"
            >
              <Image
                src={image.url}
                alt={image.altText || fallbackAlt}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {open && active && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 p-4 dark:bg-black/95"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
          >
            <X className="h-6 w-6" />
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i === null ? null : (i - 1 + count) % count));
                }}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream sm:left-4"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i === null ? null : (i + 1) % count));
                }}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream sm:right-4"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}

          <Image
            src={active.url}
            alt={active.altText || fallbackAlt}
            width={1600}
            height={1600}
            className="h-auto max-h-[85vh] w-auto max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
