"use client";

import { useGetContests } from "@/hooks/landing/useGetItems";
import { Skeleton } from "@/components/ui/skeleton";
import { SubjectCard } from "./ListItem";

export function ContestsList() {
  const { data: contests, isPending, error } = useGetContests();

  return (
    <section id="contests" className="py-20 px-4 bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-0.5 bg-[#FFC178]" />
          <p className="text-[#FFC178] text-sm uppercase tracking-wider">
            Направления
          </p>
        </div>
        <h2 className="text-[#eee] text-3xl md:text-4xl font-bold mb-12">
          Наши конкурсы
        </h2>

        {isPending && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-red-400">
            Не удалось загрузить конкурсы. Попробуйте позже.
          </p>
        )}

        {!isPending && !error && contests.length === 0 && (
          <p className="text-neutral-400">Пока нет доступных конкурсов.</p>
        )}

        {!isPending && !error && contests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => (
              <SubjectCard key={contest.id} subject={contest} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
