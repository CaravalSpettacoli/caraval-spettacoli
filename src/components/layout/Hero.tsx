import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { splitDisplay } from "@/lib/splitDisplay";

type Height = "sm" | "md" | "lg";
type Align = "left" | "center" | "left-extreme";
type Variant = "default" | "manifesto-spettacolo";

export type HeroProps = {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  cta?: { text: string; href: string };
  height?: Height;
  displayFont?: boolean;
  eyebrow?: ReactNode;
  align?: Align;
  variant?: Variant;
  /** Solo per variant manifesto-spettacolo: contenuto extra (CreditiLocandina, etc.) */
  children?: ReactNode;
  /** Solo per variant manifesto-spettacolo: stamp sovrapposto angolo immagine */
  stamp?: ReactNode;
};

const heights: Record<Height, string> = {
  sm: "min-h-[60vh]",
  md: "min-h-[80vh]",
  lg: "min-h-screen",
};

export function Hero({
  title,
  subtitle,
  backgroundImage,
  cta,
  height = "md",
  displayFont = false,
  eyebrow,
  align = "left",
  variant = "default",
  children,
  stamp,
}: HeroProps) {
  if (variant === "manifesto-spettacolo") {
    return (
      <section
        className="relative w-full overflow-hidden bg-nero-deep min-h-[90vh] flex"
        aria-label={title}
      >
        {/* Foto a destra 60% */}
        <div className="absolute inset-y-0 right-0 w-full md:w-3/5">
          {backgroundImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
              aria-hidden="true"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-nero-soft to-nero-deep" />
          )}
          <div
            className="absolute inset-0 bg-gradient-overlay-nero md:bg-gradient-to-r md:from-nero-deep md:via-transparent md:to-transparent"
            aria-hidden="true"
          />
          {stamp && (
            <div className="absolute top-8 right-8 z-20">{stamp}</div>
          )}
        </div>
        {/* Testo a sinistra 40%, sovrapposto */}
        <Container className="relative z-10 flex items-center py-20 md:py-24">
          <div className="max-w-xl">
            {eyebrow && (
              <div className="mb-4 text-label uppercase-tracked text-rosso-hover">
                {eyebrow}
              </div>
            )}
            <h1 className="font-display text-display-l md:text-display-xl text-balance leading-none">
              {splitDisplay(title)}
            </h1>
            {subtitle && (
              <p className="mt-6 font-sans italic text-body-l text-crema-muted">
                {subtitle}
              </p>
            )}
            {children && <div className="mt-10">{children}</div>}
            {cta && (
              <div className="mt-8">
                <Link
                  href={cta.href}
                  className="inline-flex items-center justify-center h-14 px-7 rounded-md bg-rosso-base text-crema-base font-semibold text-body-l transition-all duration-base ease-cinema hover:bg-rosso-hover hover:shadow-glow-rosso"
                >
                  {cta.text}
                </Link>
              </div>
            )}
          </div>
        </Container>
      </section>
    );
  }

  const isExtreme = align === "left-extreme";
  return (
    <section
      className={cn(
        "relative w-full flex items-end overflow-hidden bg-nero-base",
        heights[height]
      )}
      aria-label={title}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-t from-nero-base via-nero-base/70 to-nero-base/20"
        aria-hidden="true"
      />

      <Container
        className={cn(
          "relative z-10 pb-16 md:pb-24",
          align === "center" && "text-center",
          isExtreme && "!pl-4 md:!pl-6"
        )}
      >
        <div
          className={cn(
            "max-w-3xl",
            align === "center" && "mx-auto",
            isExtreme && "max-w-none"
          )}
        >
          {eyebrow && (
            <div className="mb-4 text-label uppercase-tracked text-rosso-hover">
              {eyebrow}
            </div>
          )}
          <h1
            className={cn(
              "text-balance",
              displayFont
                ? "font-display text-display-l md:text-display-xl"
                : "text-h1 md:text-display-m",
              isExtreme && "tracking-tight"
            )}
          >
            {displayFont ? splitDisplay(title) : title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "mt-6 text-body-l text-crema-muted",
                !isExtreme && "max-w-2xl"
              )}
            >
              {subtitle}
            </p>
          )}
          {cta && (
            <div className="mt-8">
              <Link
                href={cta.href}
                className="inline-flex items-center justify-center h-14 px-7 rounded-md bg-rosso-base text-crema-base font-semibold text-body-l transition-all duration-base ease-cinema hover:bg-rosso-hover hover:shadow-glow-rosso"
              >
                {cta.text}
              </Link>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default Hero;
