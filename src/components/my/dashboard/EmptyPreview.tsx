export default function EmptyPreview({ message }: { message: string }) {
  return (
    <p className="text-sub-text py-5 text-center text-xs font-medium">
      {message}
    </p>
  );
}
