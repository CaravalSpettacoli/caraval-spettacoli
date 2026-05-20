"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SkipLink } from "./SkipLink";
import { BottomNavMobile } from "@/components/caraval/BottomNavMobile";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { IubendaScripts } from "@/components/seo/IubendaScripts";

/**
 * Isola Sanity Studio dal "chrome" del sito pubblico (header, footer, bottom
 * nav, custom cursor, banner cookie). Su `/studio` mostra solo i children;
 * altrove avvolge i children con il chrome completo.
 *
 * Header e Footer sono passati come render props perche Footer e async server
 * component (fetch Sanity): la composizione tramite slot permette di mantenere
 * il rendering server-side dei chrome elements senza propagare async ai layer
 * client.
 */
export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio") ?? false;

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <>
      <SkipLink />
      <CustomCursor />
      <IubendaScripts />
      {header}
      <main id="contenuto" className="flex-1">
        {children}
      </main>
      {footer}
      <BottomNavMobile />
    </>
  );
}

export default SiteChrome;
