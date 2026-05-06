import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";

type Height = "sm" | "md" | "lg";

export type HeroProps = {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  cta?: { text: string; href: string };
  height?: Height;
  displayFont?: boolean;
  eyebrow?: ReactNode;
  align?: "left" | "center";
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
}: HeroProps) {
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
          align === "center" && "text-center"
        )}
      >
        <div
          className={cn(
            "max-w-3xl",
            align === "center" && "mx-auto"
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
                : "text-h1 md:text-display-m"
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-body-l text-crema-muted max-w-2xl">
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
