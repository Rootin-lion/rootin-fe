"use client";

import { useState } from "react";
import type { CategoryType } from "@/types/shared/category";
import BookmarkTitle from "./BookmarkTitle";
import BookmarkItem from "./BookmarkItem";

export default function MyBookmark() {
  const [category, setCategory] = useState<CategoryType | "all">("all");

  const handleCategoryChange = (category: CategoryType | "all") => {
    setCategory(category);
  };

  return (
    <div>
      <BookmarkTitle
        category={category}
        onCategoryChange={handleCategoryChange}
      />
      <div className="mt-9 flex flex-col gap-6">
        <BookmarkItem />
        <BookmarkItem />
        <BookmarkItem />
        <BookmarkItem />
      </div>
    </div>
  );
}
