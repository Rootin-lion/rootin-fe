import Image, { StaticImageData } from "next/image";

interface StatState {
  key: string;
  title: string;
  value: number;
  img: StaticImageData;
  unit: string;
}

interface DashboardStatCardProps {
  stat: StatState;
}

export default function DashboardStatCard({ stat }: DashboardStatCardProps) {
  return (
    <div className="dashboard-stat-gradient-border h-24.5 w-50 rounded-xl pt-3 pl-4">
      <p className="text-caption text-disabled-text">{stat.title}</p>
      <div className="mt-3 flex flex-row gap-8">
        <div className="bg-primary-100 flex h-10 w-10 shrink-0 items-center justify-center rounded-[50%]">
          <Image src={stat.img} alt="Count" className="h-6 w-6" />
        </div>
        <p className="text-sub-text text-body-3 flex items-center gap-1">
          <span className="text-title-3 text-[#1A1A1A]">{stat.value}</span>
          {stat.unit}
        </p>
      </div>
    </div>
  );
}
