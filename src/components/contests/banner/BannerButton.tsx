import React from "react";

interface BannerButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function BannerButton({ children, onClick }: BannerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="banner-gradient-border text-primary-800 min-w-30 rounded-xl border border-transparent px-5 py-2 text-[14px] font-semibold"
    >
      {children}
    </button>
  );
}
