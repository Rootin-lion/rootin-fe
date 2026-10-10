type BarPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function BarPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: BarPaginationProps) {
  if (totalPages <= 0) return null;

  return (
    <nav
      aria-label="페이지 이동"
      className={`flex justify-center gap-2 ${className}`}
    >
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;

        return (
          <button
            key={page}
            type="button"
            aria-label={`${page}페이지`}
            aria-current={page === currentPage ? "page" : undefined}
            className={`h-2 cursor-pointer rounded-lg ${page === currentPage ? "bg-primary w-8" : "w-5 bg-[#D9D9D9]"}`}
            onClick={() => onPageChange(page)}
          />
        );
      })}
    </nav>
  );
}
