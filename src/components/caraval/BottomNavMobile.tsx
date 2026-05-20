"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Theater,
  MoreHorizontal,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { BottomSheetAltro } from "./BottomSheetAltro";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  isAltro?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Spettacoli", icon: Theater, href: "/spettacoli" },
  { label: "Altro", icon: MoreHorizontal, isAltro: true },
  { label: "Contatti", icon: Mail, href: "/contatti" },
];

// Pagine che hanno una loro voce diretta nella bottom nav.
// Tutte le altre (/imaginarium, /formazione, /chi-siamo, /ospita, /calendario)
// vengono mappate sulla voce "Altro".
const DIRECT_PATHS = ["/", "/spettacoli", "/contatti"];

export function BottomNavMobile() {
  const pathname = usePathname();
  const [altroOpen, setAltroOpen] = useState(false);
  // Mount guard: evita flicker durante il preloader Sipario e qualsiasi
  // mismatch SSR/CSR. La nav appare solo dopo che React ha completato
  // l'hydration sul client. Il fade-in CSS (.bottom-nav-mobile) ammorbidisce
  // l'apparizione (Fix_3_Bug_Pre_Golive §1).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isActive = (item: NavItem): boolean => {
    if (item.isAltro) {
      if (!pathname) return false;
      // Attivo quando NON siamo su nessuna pagina con voce diretta
      const isOnDirect = DIRECT_PATHS.some((d) =>
        d === "/" ? pathname === "/" : pathname.startsWith(d)
      );
      return !isOnDirect;
    }
    if (!item.href || !pathname) return false;
    if (item.href === "/") return pathname === "/";
    return pathname.startsWith(item.href);
  };

  return (
    <>
      <nav className="bottom-nav-mobile" aria-label="Navigazione principale mobile">
        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const active = isActive(item);

          if (item.isAltro) {
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setAltroOpen(true)}
                className={`bottom-nav-item ${
                  active ? "bottom-nav-item--active" : ""
                }`}
                aria-label={item.label}
                aria-expanded={altroOpen}
              >
                <Icon className="bottom-nav-icon" aria-hidden />
                <span className="bottom-nav-label">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href!}
              className={`bottom-nav-item ${
                active ? "bottom-nav-item--active" : ""
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="bottom-nav-icon" aria-hidden />
              <span className="bottom-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <BottomSheetAltro open={altroOpen} onClose={() => setAltroOpen(false)} />
    </>
  );
}

export default BottomNavMobile;
