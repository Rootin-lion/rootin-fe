export function MainButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      className="bg-primary-900 w-full cursor-pointer rounded-lg px-7 py-4 text-[20px] font-semibold text-white duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(31,41,55,0.12)]"
    >
      {text}
    </button>
  );
}
