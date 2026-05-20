"use client";

/** Template di route App Router: ri-renderizzato ad ogni navigation.
 *  Applica la classe `page-transition` per fade-in 300ms tra le pagine.
 *  Niente framer-motion: pura CSS animation (definita in globals.css). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
