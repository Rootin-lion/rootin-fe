import React from "react";

export default function RankingBox({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col text-center">{children}</div>;
}
