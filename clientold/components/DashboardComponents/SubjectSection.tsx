"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ChevronRight, Plus, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ApplicationsView from "./ApplicarionsView";
import { useSubjectQuery } from "@/hooks/subject/useSubjectQuery";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ContestApiResponse } from "@/types";

interface Course {
  id: number;
  title: string;
  newApplications: number;
  totalApplications: number;
  enrolled: number;
  capacity: number;
  status: "open" | "closed";
}

const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: "Математика",
    newApplications: 5,
    totalApplications: 24,
    enrolled: 18,
    capacity: 25,
    status: "open",
  },
  {
    id: 2,
    title: "Английский язык",
    newApplications: 3,
    totalApplications: 18,
    enrolled: 14,
    capacity: 20,
    status: "open",
  },
  {
    id: 3,
    title: "Рисование",
    newApplications: 11,
    totalApplications: 42,
    enrolled: 22,
    capacity: 30,
    status: "closed",
  },
  {
    id: 4,
    title: "Программирование",
    newApplications: 7,
    totalApplications: 31,
    enrolled: 25,
    capacity: 25,
    status: "open",
  },
];

export default function SubjectSection() {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [toggleStatus, setToggleStatus] = useState<"open" | "closed">("open");
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContestApiResponse | null>(
    null
  );

  const { data, isPending, error } = useSubjectQuery();

  const handleToggleStatus = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setToggleStatus(course.status);
      setStatusDialogOpen(true);
      setSelectedCourse(course);
    }
  };

  const confirmToggleStatus = () => {
    if (selectedCourse) {
      setCourses(
        courses.map((c) =>
          c.id === selectedCourse.id
            ? { ...c, status: toggleStatus === "open" ? "closed" : "open" }
            : c
        )
      );
      setStatusDialogOpen(false);
      setSelectedCourse(null);
    }
  };

  const getCapacityColor = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 100) return "text-destructive";
    if (percentage >= 80) return "text-yellow-600";
    return "text-green-600";
  };

  const handleCreateCompetition = async () => {
    if (newName.trim()) {
      // await createContest({
      //   values: {
      //     title: newName.trim(),
      //     description: newDescription.trim() || "",
      //   },
      // });
      setNewName("");
      setNewDescription("");
      setCreateDialogOpen(false);
    }
  };

  const handleDeleteCompetition = async (id: number) => {
    if (deleteTarget) {
      // await deleteContest(id);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  // if (selectedCourse && !statusDialogOpen) {
  //   return (
  //     <ApplicationsView
  //       course={selectedCourse}
  //       onBack={() => setSelectedCourse(null)}
  //     />
  //   );
  // }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Занятия</h2>
          <p className="text-muted-foreground">
            Управление заявками на занятия по предметам
          </p>
        </div>
        <Button
          className="gap-2 w-[200px]"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Создать курс
        </Button>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => {
          const capacityPercentage = (course.enrolled / course.capacity) * 100;
          const isFull = course.enrolled >= course.capacity;

          return (
            <Card
              key={course.id}
              className="hover:border-primary/50 transition-colors cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        {course.title}
                      </h3>
                      <Badge
                        variant={
                          course.newApplications > 0
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        +{course.newApplications}
                      </Badge>
                      {isFull && (
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200"
                        >
                          Полная
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>
                            Запись: {course.enrolled}/{course.capacity}
                          </span>
                        </div>
                        <span
                          className={`font-medium ${getCapacityColor(
                            course.enrolled,
                            course.capacity
                          )}`}
                        >
                          {capacityPercentage.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={capacityPercentage} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        Всего заявок: {course.totalApplications}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {course.status === "open"
                          ? "Набор открыт"
                          : "Набор закрыт"}
                      </span>
                      <Switch
                        checked={course.status === "open"}
                        onCheckedChange={() => handleToggleStatus(course.id)}
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCourse(course)}
                      className="gap-2"
                    >
                      Просмотр заявок
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Диалог подтверждения изменения статуса */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменение статуса набора</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите{" "}
              {toggleStatus === "open" ? "закрыть" : "открыть"} набор для "
              {selectedCourse?.title}
              "?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button onClick={confirmToggleStatus}>Подтвердить</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модалка создания курса */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать новый курс</DialogTitle>
            <DialogDescription>
              Добавьте информацию о новом конкурсе
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название конкурса</Label>
              <Input
                id="title"
                placeholder="Например: Лего. Эстафета..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание (опционально)</Label>
              <Textarea
                id="description"
                placeholder="Описание конкурса..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-4 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              onClick={handleCreateCompetition}
              disabled={!newName.trim()}
            >
              Создать
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
