"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { themeStyles, type SectionTheme } from "@/lib/theme-system";

const NAV_LINKS_BASE = [
  { href: "/spettacoli", label: "Spettacoli" },
  { href: "/imaginarium", label: "Imaginarium" },
  // "Academy" e non "Caraval Academy": con 7 voci la nav desktop è satura e il
  // brand è già nel logo a sinistra. Per esteso in footer, bottom sheet e hero.
  { href: "/caraval-academy", label: "Academy" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/ospita", label: "Ospita" },
  { href: "/contatti", label: "Contatti" },
];

const HEADER_HEIGHT_PX = 80;

export function Header({ mostraCalendario = false }: { mostraCalendario?: boolean }) {
  const NAV_LINKS = mostraCalendario
    ? [
        ...NAV_LINKS_BASE.slice(0, 3),
        { href: "/calendario", label: "Calendario" },
        ...NAV_LINKS_BASE.slice(3),
      ]
    : NAV_LINKS_BASE;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<SectionTheme>("dark");
  const lastThemeRef = useRef<SectionTheme>("dark");

  // Tema dell'header derivato dalla sezione che sta sotto al top dell'header.
  // Su scroll forziamo dark (backdrop blur nero scuro = UX consistente).
  const variant = themeStyles[currentTheme].headerVariant;
  const dark = variant === "dark" || scrolled;

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const recomputeTheme = () => {
      const sections = document.querySelectorAll<HTMLElement>(
        "section[data-theme]"
      );
      let active: SectionTheme = "dark";
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        const r = s.getBoundingClientRect();
        if (r.top <= HEADER_HEIGHT_PX && r.bottom > HEADER_HEIGHT_PX) {
          const t = s.getAttribute("data-theme") as SectionTheme | null;
          if (t === "dark" || t === "light" || t === "accent") {
            active = t;
          }
          break;
        }
      }
      if (active !== lastThemeRef.current) {
        lastThemeRef.current = active;
        setCurrentTheme(active);
      }
    };

    recomputeTheme();

    let observer: IntersectionObserver | null = null;
    const setupTimer = window.setTimeout(() => {
      recomputeTheme();
      observer = new IntersectionObserver(() => recomputeTheme(), {
        rootMargin: `-${HEADER_HEIGHT_PX}px 0px -90% 0px`,
        threshold: [0, 0.01, 0.99, 1],
      });
      const sections = document.querySelectorAll<HTMLElement>(
        "section[data-theme]"
      );
      sections.forEach((s) => observer!.observe(s));
    }, 50);

    const onScroll = () => recomputeTheme();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(setupTimer);
      if (observer) observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  // Scrim adattivo per leggibilità del logo su sezioni di colore variabile
  const scrimStyle: React.CSSProperties = scrolled
    ? {}
    : {
        background:
          currentTheme === "light"
            ? "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)"
            : "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)",
      };

  const backdropClass = scrolled
    ? "bg-nero-base/85 backdrop-blur-md border-b border-crema-faint/40"
    : "";

  return (
    <header
      data-current-theme={currentTheme}
      data-scrolled={scrolled ? "true" : "false"}
      style={scrimStyle}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-base ease-cinema",
        backdropClass
      )}
    >
      {/* <1024px: logo centrato (no nav, no hamburger — la navigazione è gestita
          da BottomNavMobile fissa in basso).
          ≥1024px: layout classico logo + nav voci. */}
      <div className="mx-auto flex h-14 md:h-16 lg:h-20 max-w-container-wide items-center justify-center lg:justify-between px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity"
          aria-label="Caraval Spettacoli — home"
        >
          <span
            className="relative inline-block h-9 md:h-10 lg:h-12"
            style={{ width: "180px" }}
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/caraval-logo-white.png"
              alt=""
              width={180}
              height={48}
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                opacity: dark ? 1 : 0,
                transition: "opacity 220ms ease-out",
                filter: scrolled
                  ? "none"
                  : "drop-shadow(0 1px 2px rgba(0,0,0,0.25))",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/caraval-logo-black.png"
              alt=""
              width={180}
              height={48}
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                opacity: dark ? 0 : 1,
                transition: "opacity 220ms ease-out",
                filter: scrolled
                  ? "none"
                  : "drop-shadow(0 1px 2px rgba(255,255,255,0.3))",
              }}
            />
          </span>
        </Link>

        <nav
          className="hidden lg:flex items-center gap-8"
          aria-label="Navigazione principale"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "header-link text-body-s uppercase-tracked transition-colors",
                dark ? "text-crema-base" : "text-nero-base"
              )}
              style={
                {
                  ["--header-hover" as string]: scrolled
                    ? "#c01d56"
                    : themeStyles[currentTheme].headerHoverColor,
                } as React.CSSProperties
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
