interface PrimaryDarkButtonProps {
  children: React.ReactNode;
  className: string;
  onClick?: () => void;
}

export default function PrimaryDarkButton({
  children,
  className,
  onClick,
}: PrimaryDarkButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} bg-primary-900 w-full cursor-pointer rounded-lg font-semibold text-white`}
    >
      {children}
    </button>
  );
}
