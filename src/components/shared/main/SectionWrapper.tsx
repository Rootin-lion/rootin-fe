"use client";

type VariantColor = "primary" | "white" | "ivory";

interface SectionWrapperProps {
  children: React.ReactNode;
  variant: VariantColor;
}

const BgColorMap: Record<VariantColor, string> = {
  primary: "bg-primary-50",
  white: "bg-white",
  ivory: "bg-ivory",
};

export function SectionWrapper({ children, variant }: SectionWrapperProps) {
  return (
    <div
      className={`${BgColorMap[variant]} flex h-dvh items-center justify-center`}
    >
      {children}
    </div>
  );
}
