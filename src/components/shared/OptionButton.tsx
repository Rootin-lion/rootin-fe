type OptionButtonType = "outline" | "filled";

const VARIANT_STYLES = {
  outline: {
    base: "rounded-md  bg-white px-3 py-1.5 text-[14px] font-medium text-black transition-colors",
    selected: "border-primary border-2",
    unselected: "border-[#D5D9DD]",
  },
  filled: {
    base: "text-body-3 rounded-lg border-[#DDE8D0] py-3 text-[#6C6A6A]",
    selected: "bg-bg-green-200",
    unselected: "bg-white",
  },
};

export default function OptionButton({
  children,
  variant,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  variant: OptionButtonType;
  selected: boolean;
  onClick?: () => void;
}) {
  const styles = VARIANT_STYLES[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer border ${styles.base} ${
        selected ? styles.selected : styles.unselected
      }`}
    >
      {children}
    </button>
  );
}
