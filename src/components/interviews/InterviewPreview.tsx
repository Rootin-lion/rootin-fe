import Image from "next/image";
import OsImg from "../../assets/interviews/os.png";
import NetworkImg from "../../assets/interviews/network.png";
import DbImg from "../../assets/interviews/db.png";
import DataImg from "../../assets/interviews/data.png";
import InfraImg from "../../assets/interviews/infra.png";
import SpringImg from "../../assets/interviews/spring.png";
import { InterviewFieldType } from "@/types/interviews/interview";

const INTERVIEW_LIST = {
  OPERATING_SYSTEM: {
    id: 1,
    title: "운영체제",
    content:
      "프로세스와 스레드의 흐름을 누구보다 꼼꼼하게 살펴보는 운영체제 면접관입니다. 메모리 관리, CPU 스케줄링, 동기화 문제까지 깊이 있게 질문하며 단순 암기가 아닌 ‘왜 그렇게 동작하는지’를 중요하게 생각합니다. 기초 개념부터 시스템 내부 구조까지 차근차근 검증해드립니다.",
    img: OsImg,
    alt: "운영체제",
  },
  NETWORK: {
    id: 2,
    title: "네트워크",
    content:
      "데이터가 오가는 경로와 통신 흐름을 누구보다 꼼꼼하게 살펴보는 네트워크 면접관입니다. \n TCP/IP, HTTP, DNS, 라우팅, 소켓 통신까지 깊이 있게 질문하며 단순 암기가 아닌 ‘왜 그렇게 통신되는지’를 중요하게 생각합니다.\n 기초 개념부터 실제 요청과 응답이 처리되는 과정까지 차근차근 검증해드립니다.",
    img: NetworkImg,
    alt: "네트워크",
  },
  DATABASE: {
    id: 3,
    title: "데이터베이스",
    content:
      "수많은 데이터 속에서 필요한 정보를 정확하게 찾아내는 데이터베이스 면접관입니다. 정규화, 인덱스, 트랜잭션, 락과  같은 핵심 개념을 중심으로 질문하며 단순 SQL 작성보다 데이터 흐름과 설계 이유를 중요하게 평가합니다.  안정성과 성능을 함께 고려하는 사고력을 확인해드립니다.",
    img: DbImg,
    alt: "데이터베이스",
  },
  INFRA_CLOUD: {
    id: 4,
    title: "인프라",
    content:
      "서비스가 안정적으로 운영되는 환경을 누구보다 꼼꼼하게 살펴보는 인프라 면접관입니다.\n Linux, Docker, Kubernetes, AWS, CI/CD, Load Balancer와 같은 핵심 기술을 중심으로 질문하며 단순 명령어 사용보다 서비스 운영과 장애 대응을 고려한 설계 능력을 중요하게 평가합니다.\n 확장성과 안정성을 함께 고려하는 인프라 사고력을 확인해드립니다.",
    img: InfraImg,
    alt: "인프라",
  },
  DATA_STRUCTURE_ALGORITHM: {
    id: 5,
    title: "자료구조/알고리즘",
    content:
      "효율적인 문제 해결 과정을 누구보다 꼼꼼하게 살펴보는 자료구조·알고리즘 면접관입니다.\n 배열, 트리, 그래프, 탐색, 정렬, 시간 복잡도와 같은 핵심 개념을 중심으로 질문하며 단순 정답 도출보다 문제를 분석하고 최적의 해결 방법을 선택하는 과정을 중요하게 평가합니다.\n 논리적인 사고력과 알고리즘 설계 능력을 차근차근 검증해드립니다.",
    img: DataImg,
    alt: "자료구조/알고리즘",
  },
  JAVA_SPRING: {
    id: 6,
    title: "자바/스프링",
    content:
      "견고한 애플리케이션을 설계하고 구현하는 과정을 누구보다 꼼꼼하게 살펴보는 자바·스프링 면접관입니다.\n 객체지향, JVM, Spring Boot, JPA, 트랜잭션과 같은 핵심 개념을 중심으로 질문하며 단순 문법 이해보다 안정적이고 확장 가능한 애플리케이션 설계 능력을 중요하게 평가합니다.\n 실무에서 활용되는 개발 역량과 문제 해결 능력을 차근차근 검증해드립니다.",
    img: SpringImg,
    alt: "자바/스프링",
  },
};

export default function InterviewPreview({
  field = "OPERATING_SYSTEM",
}: {
  field: InterviewFieldType;
}) {
  const data = INTERVIEW_LIST[field as keyof typeof INTERVIEW_LIST];

  return (
    <div className="bg-primary-50 border-bg-green-50 max-h-70 rounded-[14px] border px-6 pt-2">
      <div className="flex flex-row items-center gap-1">
        <Image
          src={data.img}
          alt={data.alt}
          width={80}
          height={77}
          className="w-20"
        />
        <p className="text-title-4 text-black">{data.title}</p>
      </div>
      <p className="mt-1 w-78.5 text-[13px] leading-6 font-medium whitespace-pre-wrap text-[#6C6A6A]">
        {data.content}
      </p>
    </div>
  );
}
