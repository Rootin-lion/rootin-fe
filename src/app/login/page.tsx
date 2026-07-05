import LeftSection from "@/components/login/LeftSection";
import RightSection from "@/components/login/RightSection";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-row">
      <LeftSection />
      <RightSection />
    </div>
  );
}
