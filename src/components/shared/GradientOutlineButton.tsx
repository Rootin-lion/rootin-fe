import Link from "next/link";

type GradientOutlineButtonType = "gradient" | "outline";

interface GradientOutlineButtonProps {
  children: React.ReactNode;
  variant: GradientOutlineButtonType;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const VARIANT_STYLES = {
  gradient: {
    base: "min-w-30 rounded-xl px-5 py-2 text-[14px]",
    abled:
      "text-primary-900 hover:shadow-[0_8px_20px_rgba(54,114,62,0.18)] border-transparent banner-gradient-border",
    enabled: "border-disabled-text text-disabled-text",
  },
  outline: {
    base: "rounded-2xl px-4 py-1 text-[12px]",
    abled: "text-primary-900",
    enabled: "border-disabled-text text-disabled-text",
  },
};

export default function GradientOutlineButton({
  children,
  variant = "gradient",
  disabled = false,
  onClick,
  className = "",
}: GradientOutlineButtonProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <Link
      href="#"
      onClick={onClick}
      className={`${styles.base} ${disabled ? styles.enabled : styles.abled} focus-visible:ring-primary-900 border text-center font-semibold transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none enabled:cursor-pointer enabled:active:scale-95 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </Link>
  );
}
