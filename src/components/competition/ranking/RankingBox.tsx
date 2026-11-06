import React from "react";

export default function RankingBox({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center text-center duration-300 ease-in-out md:hover:scale-110">
      {children}
    </div>
  );
}
