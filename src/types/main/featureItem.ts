import type { ImageProps } from "next/image";

export interface FeatureData {
  id: number;
  title: string;
  image: ImageProps["src"];
  textColor: string;
  bg: string;
}
