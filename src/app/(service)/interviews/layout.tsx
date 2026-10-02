import { InterviewMediaProvider } from "@/components/interviews/InterviewMediaProvider";

export default function InterviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InterviewMediaProvider>{children}</InterviewMediaProvider>;
}
