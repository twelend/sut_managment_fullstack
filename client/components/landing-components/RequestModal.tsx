"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useCreateRequest } from "@/hooks/landing/useGetItems";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Props {
  id: number;
  title: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export interface IForm {
  child_name: string;
  parent_name: string;
  email: string;
  phone: string;
  age: number | null;
  message: string;
}

export function RequestModal({ id, title, isOpen, setIsOpen }: Props) {
  const { register, handleSubmit, formState, reset } = useForm<IForm>({
    mode: "onChange",
    defaultValues: {
      phone: "89",
      child_name: "",
      parent_name: "",
      email: "",
      age: null,
      message: "",
    },
  });

  const { mutateAsync, isPending } = useCreateRequest();

  const pathname = usePathname();
  const type = pathname.split("/").pop();

  const onSubmit: SubmitHandler<IForm> = async (data) => {
    const body =
      type == "subjects" ? { subject: id, ...data } : { contest: id, ...data };
    await mutateAsync({
      body,
      type: type == "subjects" ? "lesson" : "contest",
    });
    setIsOpen(false);
    reset();
  };

  const childNameError = formState.errors.child_name?.message?.toString();
  const parentNameError = formState.errors.parent_name?.message?.toString();
  const emailError = formState.errors.email?.message?.toString();
  const phoneError = formState.errors.phone?.message?.toString();
  const ageError = formState.errors.age?.message?.toString();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Отправить заявку на "{title}" </DialogTitle>
          <DialogDescription>Введите данные о вас и ребенке</DialogDescription>
        </DialogHeader>
        <div className="">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="">
              <Input
                type="text"
                placeholder="ФИО ребенка..."
                {...register("child_name", {
                  required: "Обязательное поле!",
                })}
              />
              {childNameError && (
                <p className="text-red-500">{childNameError}</p>
              )}
            </div>
            <div className="">
              <Input
                type="text"
                placeholder="ФИО роителя..."
                {...register("parent_name", {
                  required: "Обязательное поле!",
                })}
              />
              {parentNameError && (
                <p className="text-red-500">{parentNameError}</p>
              )}
            </div>
            <div className="">
              <Input
                type="email"
                placeholder="Email..."
                {...register("email", {
                  required: "Обязательное поле!",
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: "Email не прошел валидацию...",
                  },
                })}
              />
              {emailError && <p className="text-red-500">{emailError}</p>}
            </div>
            <div className="">
              <Input
                type="phone"
                {...register("phone", {
                  required: "Обязательное поле!",
                })}
                placeholder="Телефон..."
              />
              {emailError && <p className="text-red-500">{phoneError}</p>}
            </div>
            <div className="">
              <Input
                type="number"
                {...register("age", {
                  required: {
                    value: true,
                    message: "Обязательное поле!",
                  },
                  valueAsNumber: true,
                })}
                placeholder="Возраст ребенка..."
              />
              {ageError && <p className="text-red-500">{ageError}</p>}
            </div>
            <div className="">
              <Textarea
                {...register("message")}
                placeholder="Ваше сообщение..."
              />
            </div>
            <div className="flex gap-4 justify-end mt-6">
              <Button
                type="reset"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Отмена
              </Button>
              <Button
                disabled={isPending}
                className="flex gap-1 items-center"
                type="submit"
              >
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Создать
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
