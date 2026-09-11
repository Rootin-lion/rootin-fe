import React from "react";

export default function RankingBox({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col text-center duration-300 ease-in-out hover:scale-110">
      {children}
    </div>
  );
}
