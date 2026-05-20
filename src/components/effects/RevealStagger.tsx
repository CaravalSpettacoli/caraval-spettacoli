"use client";

import { Children, isValidElement, type ReactNode } from "react";
import { Reveal, type RevealDirection } from "@/components/effects/Reveal";

/** Wrapper stagger: wrappa ogni child in un <Reveal> con delay incrementale.
 *
 *  Hotfix 4: usato per card lists (Premi, ProgrammaImaginarium, Spettacoli,
 *  Contatti, ecc). Pattern visivo "entrata in cascata" coerente sul sito.
 *
 *  - step: ms di delay tra un child e il successivo (default 100ms)
 *  - baseDelay: delay iniziale del primo child (default 0ms)
 *  - direction: direzione slide-in. Se "alternate", alterna left/right per dispari/pari.
 */
export function RevealStagger({
  children,
  step = 100,
  baseDelay = 0,
  direction = "up",
}: {
  children: ReactNode;
  step?: number;
  baseDelay?: number;
  direction?: RevealDirection | "alternate";
}) {
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <>
      {items.map((child, i) => {
        const d =
          direction === "alternate"
            ? i % 2 === 0
              ? "left"
              : "right"
            : direction;
        return (
          <Reveal key={i} delay={baseDelay + i * step} direction={d}>
            {child}
          </Reveal>
        );
      })}
    </>
  );
}

export default RevealStagger;
