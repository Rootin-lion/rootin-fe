import type { CategoryType } from "@/types/shared/category";
import { CATEGORY_LABEL } from "@/constants/shared/category";

export const BOOKMARK_CATEGORY_OPTIONS = [
  { id: 1, value: "all", label: "전체" },
  { id: 2, value: "OPERATING_SYSTEM", label: CATEGORY_LABEL.OPERATING_SYSTEM },
  { id: 3, value: "DATABASE", label: CATEGORY_LABEL.DATABASE },
  { id: 4, value: "NETWORK", label: CATEGORY_LABEL.NETWORK },
  {
    id: 5,
    value: "DATA_STRUCTURE_ALGORITHM",
    label: CATEGORY_LABEL.DATA_STRUCTURE_ALGORITHM,
  },
  { id: 6, value: "INFRA_CLOUD", label: CATEGORY_LABEL.INFRA_CLOUD },
  { id: 7, value: "JAVA_SPRING", label: CATEGORY_LABEL.JAVA_SPRING },
] as const satisfies ReadonlyArray<{
  id: number;
  value: CategoryType | "all";
  label: string;
}>;
