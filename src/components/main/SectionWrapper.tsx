type VariantColor = "primary" | "white" | "ivory";

interface SectionWrapperProps {
  children: React.ReactNode;
  variant: VariantColor;
  className?: string;
}

const BgColorMap: Record<VariantColor, string> = {
  primary: "bg-primary-50",
  white: "bg-white",
  ivory: "bg-bg-ivory",
};

export default function SectionWrapper({
  children,
  variant,
  className = "",
}: SectionWrapperProps) {
  return (
    <section
      className={`${BgColorMap[variant]} flex flex-col items-center justify-center px-5 py-12 md:px-8 md:py-16 lg:min-h-dvh lg:flex-row lg:px-6 lg:py-20 ${className}`}
    >
      {children}
    </section>
  );
}
