"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

type Slide = { src: string; alt: string };

type HeroSliderProps = {
  slides: Slide[];
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
};

export default function HeroSlider({
  slides,
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
}: HeroSliderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative w-full aspect-[4/5] overflow-hidden bg-burgundy-dark sm:aspect-[16/9] lg:aspect-[1916/821]">
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          sizes="100vw"
          priority={i === 0}
          className={`object-cover object-center transition-opacity duration-1000 sm:object-left ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div
        aria-hidden
        className="absolute inset-0 w-full bg-gradient-to-r from-burgundy-dark/50 to-transparent sm:w-[60%]"
      />

      <div className="absolute inset-0 mx-auto flex w-full max-w-6xl items-center px-6 sm:px-8 lg:px-10">
        <div className="max-w-md text-cream">
          {eyebrow && (
            <p className="font-display text-sm uppercase tracking-[0.3em] text-gold">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-wide sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-lg text-cream/80">{subtitle}</p>
          <div className="mt-8">
            <Button href={ctaHref} variant="secondary">
              {ctaLabel}
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 hidden justify-center gap-2 sm:flex sm:justify-start sm:pl-6 lg:pl-10">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-gold" : "w-2 bg-cream/50 hover:bg-cream/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
