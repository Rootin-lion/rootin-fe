import QuestionSurface from "./QuestionSurface";
import QuestionStatus from "./QutestionStatus";
import NavImg from "../../../assets/contests/solve/nav_char.png";
import Image from "next/image";

const NavItem = ({ children }: { children: React.ReactNode }) => {
  // 일반 bg-bg-green-50 text-[#1A1A1A]
  // 포커스 bg-[#36723E.01] border border-primary-900
  // 선택 text-white bg-primary-900

  return (
    <div className="bg-bg-green-50 flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded-[3px] text-[12px] font-medium text-[#1A1A1A]">
      {children}
    </div>
  );
};

export default function QuestionNavigator() {
  return (
    <QuestionSurface>
      <h2 className="text-[13px] font-semibold text-black">문제 목록</h2>
      <div className="mt-5 grid grid-cols-5 gap-1">
        <NavItem>1</NavItem>
        <NavItem>2</NavItem>
        <NavItem>3</NavItem>
        <NavItem>4</NavItem>
        <NavItem>5</NavItem>
        <NavItem>6</NavItem>
        <NavItem>7</NavItem>
        <NavItem>8</NavItem>
        <NavItem>9</NavItem>
        <NavItem>10</NavItem>
      </div>
      <QuestionStatus />
      <Image src={NavImg} alt="" width={162} height={159} className="mt-15" />
    </QuestionSurface>
  );
}
