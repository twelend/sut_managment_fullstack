"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Suspense, useState } from "react";
import { lazy } from "react";
import { Badge } from "../ui/badge";

const RequestModal = lazy(() =>
  import("./RequestModal").then((module) => ({ default: module.RequestModal }))
);

interface Subject {
  id: number;
  title: string;
  description: string;
  is_active: boolean;
  enrolled?: number;
  capacity?: number;
}

interface SubjectCardProps {
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div
      className={cn(
        "relative bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col transition-all",
        !subject.is_active && "opacity-50"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={cn(
            "text-xs font-medium px-3 py-1 rounded-full",
            subject.is_active
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          )}
        >
          {subject.is_active ? "Набор открыт" : "Набор закрыт"}
        </span>
        {subject.enrolled !== undefined && subject.capacity !== undefined && (
          <Badge
            variant={
              subject.enrolled >= subject.capacity || !subject.is_active
                ? "destructive"
                : "default"
            }
          >
            {subject.enrolled} / {subject.capacity}
          </Badge>
        )}
      </div>

      <h3 className="text-[#eee] text-xl font-semibold mb-3">
        {subject.title}
      </h3>
      <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-1">
        {subject.description}
      </p>

      <Button
        disabled={!subject.is_active}
        onClick={() => {
          setOpen(true);
          console.log(open);
        }}
        className={cn(
          "w-full bg-orange-500 hover:bg-orange-600 text-[#eee] font-medium z-30 relative",
          !subject.is_active && "cursor-not-allowed"
        )}
      >
        Подать заявку
      </Button>
      <Suspense fallback={null}>
        <RequestModal
          id={subject.id}
          isOpen={open}
          setIsOpen={setOpen}
          title={subject.title}
        />
      </Suspense>
    </div>
  );
}
