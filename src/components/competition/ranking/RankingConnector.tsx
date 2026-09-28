const Circle = () => {
  return <div className="h-2 w-2 rounded-[50%] bg-[#D9D9D9]"></div>;
};

export default function RankingConnector() {
  return (
    <div className="flex gap-3">
      <Circle />
      <Circle />
      <Circle />
      <Circle />
      <Circle />
      <Circle />
    </div>
  );
}
