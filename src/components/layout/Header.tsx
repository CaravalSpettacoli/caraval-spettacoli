"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { splitDisplay } from "@/lib/splitDisplay";

const NAV_LINKS = [
  { href: "/spettacoli", label: "Spettacoli" },
  { href: "/imaginarium", label: "Imaginarium" },
  { href: "/formazione", label: "Formazione" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/contatti", label: "Contatti" },
];

/** Pagine con sfondo chiaro (palette inversa). Quando l'header sta sopra
 *  uno sfondo chiaro non scrollato → testo + logo scuri. Su scroll torna
 *  comunque scuro perché il blur backdrop diventa nero semi-trasparente. */
const LIGHT_BG_ROUTES = [/^\/imaginarium($|\/)/];

export function Header() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isLightBg = LIGHT_BG_ROUTES.some((re) => re.test(pathname));
  // Tema scuro (testo chiaro su sfondo scuro): default + scrolled + menu mobile aperto
  const dark = !isLightBg || scrolled || open;

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
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-base ease-cinema",
        scrolled
          ? "bg-nero-base/85 backdrop-blur-md border-b border-crema-faint/40"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 md:h-20 max-w-container-wide items-center justify-between px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity"
          aria-label="Caraval Spettacoli — home"
        >
          <Image
            src={dark ? "/caraval-logo-white.png" : "/caraval-logo-black.png"}
            alt="Caraval Spettacoli"
            width={dark ? 8505 : 8000}
            height={dark ? 3345 : 4500}
            priority
            className="h-9 md:h-12 w-auto"
          />
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
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
