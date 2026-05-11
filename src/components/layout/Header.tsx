"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { splitDisplay } from "@/lib/splitDisplay";
import { themeStyles, type SectionTheme } from "@/lib/theme-system";

const NAV_LINKS = [
  { href: "/spettacoli", label: "Spettacoli" },
  { href: "/imaginarium", label: "Imaginarium" },
  { href: "/formazione", label: "Formazione" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/contatti", label: "Contatti" },
];

// Voce B2B "Ospita" presente solo nel menu mobile (decisione: NON in header desktop).
const MOBILE_EXTRA_LINKS = [{ href: "/ospita", label: "Ospita Caraval" }];

const HEADER_HEIGHT_PX = 80;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<SectionTheme>("dark");

  // Tema dell'header derivato dalla sezione che sta sotto al top dell'header.
  // Su scroll/menu mobile aperto forziamo dark (backdrop blur nero scuro = UX
  // consistente, e il drawer mobile è sempre nero pieno).
  const variant = themeStyles[currentTheme].headerVariant;
  const dark = variant === "dark" || scrolled || open;

  // Scroll handler (backdrop blur)
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

  // IntersectionObserver: rileva quale sezione sta sotto al top dell'header.
  // Re-init ad ogni cambio pathname (App Router client-side nav non rimonta layout).
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Quando una section ha rect.top <= HEADER_HEIGHT && rect.bottom > HEADER_HEIGHT
    // significa che l'header sta passando sopra quella sezione.
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
      setCurrentTheme(active);
    };

    // Delay di 50ms: al cambio pathname il DOM della nuova pagina può non
    // essere ancora montato quando il useEffect ri-gira.
    let observer: IntersectionObserver | null = null;
    const setupTimer = window.setTimeout(() => {
      observer = new IntersectionObserver(() => recomputeTheme(), {
        rootMargin: `-${HEADER_HEIGHT_PX}px 0px -90% 0px`,
        threshold: [0, 0.01, 0.99, 1],
      });
      const sections = document.querySelectorAll<HTMLElement>(
        "section[data-theme]"
      );
      sections.forEach((s) => observer!.observe(s));
      recomputeTheme();
    }, 50);

    // Recompute on scroll come fallback (in caso una sezione non triggeri l'observer).
    const onScroll = () => recomputeTheme();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(setupTimer);
      if (observer) observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  // Body lock quando menu mobile aperto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Scrim sottile in cima quando non scrollato — garantisce leggibilità
  // anche su foto sfondo o gradient inattesi.
  const scrimClass = scrolled
    ? ""
    : variant === "light"
      ? "bg-gradient-to-b from-crema-base/70 to-transparent"
      : "bg-gradient-to-b from-black/55 to-transparent";

  // Backdrop blur con bg coerente al tema corrente (su scroll mostra dark
  // perché `dark` include `scrolled`).
  const backdropClass = scrolled
    ? "bg-nero-base/85 backdrop-blur-md border-b border-crema-faint/40"
    : scrimClass;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-base ease-cinema",
        backdropClass
      )}
    >
      <div className="mx-auto flex h-16 md:h-20 max-w-container-wide items-center justify-between px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity"
          aria-label="Caraval Spettacoli — home"
        >
          {/* Logo cross-fade: 2 <img> sovrapposti, opacity controllata da variant.
              Wrapper a dimensione fissa per evitare layout shift tra aspect ratios
              diversi del logo white (≈2.54) e black (≈1.78). */}
          <span
            className="relative inline-block h-9 md:h-12"
            style={{ width: "180px" }}
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/caraval-logo-white.png"
              alt=""
              className="absolute inset-0 w-full h-full object-contain object-left"
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
              className="absolute inset-0 w-full h-full object-contain object-left"
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
          className="hidden md:flex items-center gap-8"
          aria-label="Navigazione principale"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-body-s uppercase-tracked transition-colors",
                dark
                  ? "text-crema-base hover:text-rosso-hover"
                  : "text-nero-base hover:text-rosso-deep"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className={cn(
            "md:hidden inline-flex h-11 w-11 items-center justify-center transition-colors",
            dark ? "text-crema-base" : "text-nero-base"
          )}
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="md:hidden fixed inset-0 top-16 z-40 bg-nero-base animate-fade-in"
        >
          <nav
            className="flex flex-col gap-2 px-4 pt-8 pb-12"
            aria-label="Navigazione mobile"
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-4 font-display text-h3 text-crema-base hover:text-rosso-hover transition-colors border-b border-crema-faint"
              >
                {splitDisplay(l.label)}
              </Link>
            ))}
            {MOBILE_EXTRA_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-4 font-display text-h3 text-crema-base hover:text-rosso-hover transition-colors border-b border-crema-faint"
              >
                {splitDisplay(l.label)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
