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
    <div className="dashboard-stat-gradient-border min-h-19 min-w-0 rounded-lg p-2.5 lg:min-h-24.5 lg:w-50 lg:rounded-xl lg:p-3 lg:pl-4">
      <p className="text-disabled-text lg:text-caption text-[10px]">
        {stat.title}
      </p>
      <div className="mt-2 flex min-w-0 flex-wrap items-center gap-1.5 lg:mt-3 lg:gap-2 lg:gap-x-8">
        <div className="bg-primary-100 flex h-6 w-6 shrink-0 items-center justify-center rounded-full lg:h-10 lg:w-10">
          <Image src={stat.img} alt="" className="h-4 w-4 lg:h-6 lg:w-6" />
        </div>
        <p className="text-sub-text lg:text-body-3 flex min-w-0 flex-wrap items-baseline gap-1 text-[10px]">
          <span className="lg:text-title-3 min-w-0 text-[20px] [overflow-wrap:anywhere] text-[#1A1A1A]">
            {stat.value}
          </span>
          <span>{stat.unit}</span>
        </p>
      </div>
    </div>
  );
}
