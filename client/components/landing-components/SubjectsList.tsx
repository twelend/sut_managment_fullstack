"use client";

import { useGetSubjects } from "@/hooks/landing/useGetItems";
import { Skeleton } from "@/components/ui/skeleton";
import { SubjectCard } from "./ListItem";


export function SubjectsList() {
  const { data: subjects, isPending, error } = useGetSubjects();

  return (
    <section id="subjects" className="py-20 px-4 bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-0.5 bg-[#FFC178]" />
          <p className="text-[#FFC178] text-sm uppercase tracking-wider">
            Направления
          </p>
        </div>
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-12">
          Наши курсы и кружки
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
            Не удалось загрузить курсы. Попробуйте позже.
          </p>
        )}

        {!isPending && !error && subjects.length === 0 && (
          <p className="text-neutral-400">Пока нет доступных курсов.</p>
        )}

        {!isPending && !error && subjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
