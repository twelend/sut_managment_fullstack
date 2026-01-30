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
import { ChevronRight, Plus, Trash2, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ApplicationsView from "./ApplicarionsView";
import { useSubjectQuery } from "@/hooks/subject/useSubjectQuery";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { SubjectApiResponse } from "@/types";
import {
  useSubjectMutation,
  useSubjectUpdate,
} from "@/hooks/subject/useSubjectMutation";
import { Spinner } from "../ui/spinner";
import { useSubjectDelete } from "@/hooks/subject/useSubjectDelete";
import { TypeSubjectSchema } from "@/features/Dashboard/Subject/subject.schema";

export default function SubjectSection() {
  const [courses, setCourses] = useState<SubjectApiResponse[]>([]);
  const [selectedCourse, setSelectedCourse] =
    useState<SubjectApiResponse | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [toggleStatus, setToggleStatus] = useState<"open" | "closed">("open");
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [capacity, setCapacity] = useState<number>(30);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<SubjectApiResponse | null>(
    null
  );

  const { data, isPending, error } = useSubjectQuery();
  const { createSubject, isCreatingSubject } = useSubjectMutation();
  const { deleteSubject, isDeletingSubject } = useSubjectDelete();
  const { updateSubject, isUpdatingSubject } = useSubjectUpdate();

  const handleToggleStatus = (courseId: number) => {
    const subjects = data?.data;
    if (!Array.isArray(subjects)) return;

    const course = subjects.find((c) => c.id === courseId);
    if (!course) return;

    setToggleStatus(course.status);
    setStatusDialogOpen(true);
    setSelectedCourse(course);
  };

  const confirmToggleStatus = async () => {
    if (selectedCourse) {
      const newStatus = selectedCourse.status === "open" ? "closed" : "open";

      await updateSubject({
        id: selectedCourse.id,
        values: { status: newStatus },
      });

      setCourses(
        (Array.isArray(data?.data)
          ? (data?.data as SubjectApiResponse[])
          : courses
        ).map((c) =>
          c.id === selectedCourse.id ? { ...c, status: newStatus } : c
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

  const handleCreateSubject = async () => {
    if (newName.trim()) {
      await createSubject({
        values: {
          title: newName.trim(),
          description: newDescription.trim() || "",
          capacity: capacity,
          enrolled: 0,
          status: "open",
        },
      });
      setNewName("");
      setNewDescription("");
      setCreateDialogOpen(false);
    }
  };

  const handleDeleteSubject = async (id: number) => {
    if (deleteTarget) {
      await deleteSubject(id);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  if (selectedCourse && !statusDialogOpen) {
    return (
      <ApplicationsView
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

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
          Создать занятие
        </Button>
      </div>

      <div className="grid gap-4">
        {isPending ? (
          <div className="h-[500px] flex justify-center items-center">
            <Spinner style={{ width: "80px", height: "80px" }} />
          </div>
        ) : Array.isArray(data?.data) ? (
          data?.data.map((course) => {
            const capacityPercentage =
              (course.enrolled !== 0 && course.capacity !== 0
                ? course.enrolled / course.capacity
                : 0) * 100;
            const isFull =
              course.enrolled !== 0 && course.capacity !== 0
                ? course.enrolled >= course.capacity
                : false;

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

                      <Button
                        disabled={isDeletingSubject}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setDeleteTarget(course);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">{data?.data.detail}</p>
            </CardContent>
          </Card>
        )}
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
            <DialogTitle>Создать новое занятие</DialogTitle>
            <DialogDescription>
              Добавьте информацию о новом занятии
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название занятия</Label>
              <Input
                id="title"
                placeholder="Например: Сайтостроение, Математика, Английский язык..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Макс. число учеников</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="10"
                value={capacity ? capacity : 30}
                onChange={(e) => setCapacity(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание (опционально)</Label>
              <Textarea
                id="description"
                placeholder="Описание занятия..."
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
            <Button onClick={handleCreateSubject} disabled={!newName.trim()}>
              Создать
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модалка удаления конкурса */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить конкурс</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить конкурс "{deleteTarget?.title}"?
              Это действие не может быть отменено.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              disabled={isCreatingSubject}
              variant="destructive"
              onClick={() =>
                handleDeleteSubject(deleteTarget ? deleteTarget.id : 0)
              }
            >
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
