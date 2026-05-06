"use client";

import Link from "next/link";
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

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
          ? "bg-nero-base/80 backdrop-blur-md border-b border-crema-faint"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 md:h-20 max-w-container-wide items-center justify-between px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-h3 md:text-h2 leading-none tracking-tight text-crema-base hover:text-crema-bright transition-colors"
          aria-label="Caraval Spettacoli — home"
        >
          CARAVAL
        </Link>

        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Navigazione principale"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-body-s uppercase-tracked text-crema-base hover:text-rosso-hover transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden inline-flex h-11 w-11 items-center justify-center text-crema-base"
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
