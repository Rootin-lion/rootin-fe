const Circle = () => {
  return <div className="h-2 w-2 rounded-[50%] bg-[#D9D9D9]"></div>;
};

export default function RankingConnector() {
  return (
    <div className="hidden gap-3 lg:flex">
      <Circle />
      <Circle />
      <Circle />
      <Circle />
      <Circle />
      <Circle />
    </div>
  );
}
