export function MainButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      className="bg-primary-900 w-full cursor-pointer rounded-lg px-7 py-4 text-[20px] font-semibold text-white"
    >
      {text}
    </button>
  );
}
