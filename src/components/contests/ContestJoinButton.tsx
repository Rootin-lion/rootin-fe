export default function ContestJoinButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="banner-gradient-border text-primary-900 focus-visible:ring-primary-900 min-w-30 cursor-pointer rounded-xl border border-transparent px-5 py-2 text-[14px] font-semibold transition-all hover:shadow-[0_8px_20px_rgba(54,114,62,0.18)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0 active:scale-95"
    >
      {children}
    </button>
  );
}
