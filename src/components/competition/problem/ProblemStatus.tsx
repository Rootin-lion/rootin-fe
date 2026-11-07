export default function ProblemStatus() {
  return (
    <div className="mt-2 flex flex-row items-center justify-end gap-3 px-1 md:mt-3 md:justify-between md:gap-0">
      <div className="flex flex-row items-center gap-1">
        <div className="border-primary-900 h-2.5 w-2.5 rounded-[50%] border bg-[#EBF1EC]" />
        <p className="text-[10px] font-normal text-black">현재</p>
      </div>
      <div className="flex flex-row items-center gap-1">
        <div className="bg-primary-900 h-2.5 w-2.5 rounded-[50%]" />
        <p className="text-[10px] font-normal text-black">풀이 완료</p>
      </div>
      <div className="flex flex-row items-center gap-1">
        <div className="bg-bg-green-50 h-2.5 w-2.5 rounded-[50%]" />
        <p className="text-[10px] font-normal text-black">미풀이</p>
      </div>
    </div>
  );
}
