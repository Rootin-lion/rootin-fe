import ReviewItem from "./ReviewItem";
import ReviewTitle from "./ReviewTitle";

export default function MyReview() {
  return (
    <div>
      <ReviewTitle />
      <div className="mt-9 flex flex-col gap-6">
        <ReviewItem />
        <ReviewItem />
        <ReviewItem />
        <ReviewItem />
      </div>
    </div>
  );
}
