"use client";

import { useEffect, useRef, useState } from "react";

type RevealTextProps = {
  text: string;
  as?: "h1" | "h2";
  className?: string;
};

export default function RevealText({
  text,
  as: Tag = "h2",
  className = "",
}: RevealTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");
  let charIndex = 0;

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {[...word].map((char, ci) => {
            const delay = charIndex * 30;
            charIndex += 1;
            return (
              <span
                key={ci}
                className={`inline-block ${
                  inView
                    ? "motion-safe:animate-reveal-char"
                    : "motion-safe:opacity-0"
                }`}
                style={inView ? { animationDelay: `${delay}ms` } : undefined}
              >
                {char}
              </span>
            );
          })}
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
