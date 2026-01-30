import { ArrowBigDown } from "lucide-react";

export function Header() {
  return (
    <main
      className="min-h-screen grid grid-rows-[6fr_1fr] p-4 bg-no-repeat bg-center bg-cover relative"
      style={{ backgroundImage: "url(./team.jpg)" }}
    >
      <div className="absolute inset-0 bg-[rgb(0,0,0,0.7)]" />
      <div className="relative mt-38 px-20">
        <div className="space-y-6 flex flex-col items-center">
          <div className="flex items-center gap-8 text-[#FFC178]">
            <div className="h-1 w-10 bg-[#FFC178]" />
            <h2 className="text-2xl">Станция Юных Техников</h2>
          </div>
          <h1 className="text-6xl text-[#eee]">
            <strong>Раскрой</strong> <br />
            свой талант
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-3 items-center text-[#eee] relative">
        <h2>Узнать больше</h2>
        <ArrowBigDown className="animate-bounce" color="#FFC178" />
      </div>

      <div className="h-14 w-full absolute bottom-0 left-0 bg-linear-to-b from-transparent to-black" />
    </main>
  );
}
