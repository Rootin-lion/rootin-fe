type RankingType = "Gold" | "Silver" | "Dong";

const medalMap = {
  Gold: { width: 45, height: 45 },
  Silver: { width: 35, height: 35 },
  Dong: { width: 35, height: 35 },
};

export default function RankingBoxWrapper({
  children,
  className,
  type,
}: {
  children: React.ReactNode;
  className: string;
  type: RankingType;
}) {
  return <div className={className}>{children}</div>;
}
