import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Width = "narrow" | "default" | "wide";

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  width?: Width;
  children?: ReactNode;
};

const widths: Record<Width, string> = {
  narrow: "max-w-container-narrow",
  default: "max-w-container",
  wide: "max-w-container-wide",
};

export function Container({
  width = "default",
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 md:px-6 lg:px-8",
        widths[width],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Container;
