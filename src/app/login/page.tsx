import LeftSection from "@/components/login/LeftSection";
import RightSection from "@/components/login/RightSection";

export default function LoginPage() {
  return (
    <div className="flex flex-row min-h-dvh bg-[#F8FAF5]">
      <LeftSection />
      <RightSection />
    </div>
  );
}
