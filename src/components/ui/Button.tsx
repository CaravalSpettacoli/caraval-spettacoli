import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  /** Aggiunge animazione pulse rossa pulsante. Solo per variant="primary". */
  pulse?: boolean;
  children?: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    as?: "button";
    href?: never;
  };

type ButtonAsLink = CommonProps & {
  as: "a" | "link";
  href: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent) => void;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-base ease-cinema select-none whitespace-nowrap focus-visible:outline-2 focus-visible:outline-rosso-hover focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-rosso-base text-crema-base hover:bg-rosso-hover hover:shadow-[0_8px_24px_rgba(168,23,74,0.35)] hover:-translate-y-0.5 hover:scale-[1.02] active:bg-rosso-deep active:translate-y-0 active:scale-100",
  secondary:
    "bg-transparent text-crema-base border border-crema-base hover:bg-crema-base hover:text-nero-base hover:-translate-y-0.5",
  ghost:
    "bg-transparent text-crema-base hover:text-crema-bright hover:underline underline-offset-4",
  danger:
    "bg-rosso-deep text-crema-base hover:bg-rosso-base hover:-translate-y-0.5 active:bg-rosso-deep",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-body-s min-w-[44px]",
  md: "h-11 px-5 text-body min-w-[44px]",
  lg: "h-14 px-7 text-body-l min-w-[44px]",
};

function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin",
        className
      )}
    />
  );
}

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  props,
  ref
) {
  const {
    variant = "primary",
    size = "md",
    iconLeft,
    iconRight,
    loading = false,
    pulse = false,
    className,
    children,
    ...rest
  } = props as CommonProps & Record<string, unknown>;

  const cls = cn(
    base,
    variants[variant],
    sizes[size],
    pulse && variant === "primary" && "animate-pulse-rosso",
    className,
  );
  const content = (
    <>
      {loading ? <Spinner /> : iconLeft}
      {children}
      {!loading && iconRight}
    </>
  );

  if ((props as ButtonAsLink).as === "link") {
    const { href, target, rel, onClick } = props as ButtonAsLink;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={cls}
        aria-busy={loading || undefined}
      >
        {content}
      </Link>
    );
  }

  if ((props as ButtonAsLink).as === "a") {
    const { href, target, rel, onClick } = props as ButtonAsLink;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={cls}
        aria-busy={loading || undefined}
      >
        {content}
      </a>
    );
  }

  const { type = "button", disabled, ...buttonRest } =
    rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cls}
      {...buttonRest}
    >
      {content}
    </button>
  );
});

export default Button;
