import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "bordered" | "flat";
type Padding = "sm" | "md" | "lg";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  padding?: Padding;
  children?: ReactNode;
};

const variants: Record<Variant, string> = {
  default: "bg-nero-soft",
  bordered: "bg-transparent border border-crema-faint",
  flat: "bg-transparent",
};

const paddings: Record<Padding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  variant = "default",
  padding = "md",
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-md transition-all duration-base ease-cinema",
        variants[variant],
        paddings[padding],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
