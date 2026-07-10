"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  GraduationCap,
  Users,
  MapPin,
  X,
  type LucideIcon,
} from "lucide-react";

type VoceMenu = {
  label: string;
  icon: LucideIcon;
  href: string;
  descrizione?: string;
};

const VOCI_ALTRO: VoceMenu[] = [
  {
    label: "Imaginarium",
    icon: Sparkles,
    href: "/imaginarium",
    descrizione: "Il festival annuale di Caraval",
  },
  {
    label: "Caraval Academy",
    icon: GraduationCap,
    href: "/caraval-academy",
    descrizione: "Corsi adulti, ragazzi e laboratori scuole",
  },
  {
    label: "Chi siamo",
    icon: Users,
    href: "/chi-siamo",
    descrizione: "La compagnia, dal 2016",
  },
  {
    label: "Ospita Caraval",
    icon: MapPin,
    href: "/ospita",
    descrizione: "Porta uno spettacolo da te",
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function BottomSheetAltro({ open, onClose }: Props) {
  const [dragOffset, setDragOffset] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // ESC chiude
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Drag-to-close (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.touches[0].clientY - touchStart;
    if (diff > 0) setDragOffset(diff);
  };
  const handleTouchEnd = () => {
    if (dragOffset > 100) onClose();
    setDragOffset(0);
    setTouchStart(null);
  };

  return (
    <>
      <div
        className={`bottom-sheet-overlay ${open ? "bottom-sheet-overlay--open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`bottom-sheet ${open ? "bottom-sheet--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Altre pagine"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          // Quando open: applica drag offset. Closed: traslazione gestita dalla classe CSS.
          ...(open && dragOffset > 0
            ? { transform: `translateY(${dragOffset}px)` }
            : {}),
        }}
      >
        <div className="bottom-sheet-handle" aria-hidden="true" />

        <header className="bottom-sheet-header">
          <h2 className="bottom-sheet-titolo font-display">Esplora</h2>
          <button
            type="button"
            onClick={onClose}
            className="bottom-sheet-close"
            aria-label="Chiudi menu"
          >
            <X className="w-6 h-6" aria-hidden />
          </button>
        </header>

        <nav className="bottom-sheet-nav" aria-label="Altre pagine">
          {VOCI_ALTRO.map((voce) => {
            const Icon = voce.icon;
            return (
              <Link
                key={voce.href}
                href={voce.href}
                onClick={onClose}
                className="bottom-sheet-voce"
              >
                <div className="bottom-sheet-voce-icona">
                  <Icon className="w-6 h-6" aria-hidden />
                </div>
                <div className="bottom-sheet-voce-content">
                  <span className="bottom-sheet-voce-label font-display">
                    {voce.label}
                  </span>
                  {voce.descrizione && (
                    <span className="bottom-sheet-voce-descrizione">
                      {voce.descrizione}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default BottomSheetAltro;
