"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/hooks/auth/useLoginMutation";
import Link from "next/link";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TypeLoginSchema } from "./login.schema";
import { Loader2 } from "lucide-react";


const LoginPage = () => {
  const [isSending, setIsSending] = useState<boolean>(false)
  const { login, isLoadingLogin } = useLoginMutation();

  const { register, handleSubmit } = useForm<TypeLoginSchema>();
  const onSubmit: SubmitHandler<TypeLoginSchema> = async (data) => {
    setIsSending(true)
    try {
      await login({ values: data });
    } catch (error) {
      // Ошибка обрабатывается в onError хуке
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="h-screen w-full">
      <div className="w-full h-full flex justify-center items-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Войти в Систему Управления</CardTitle>
            <CardDescription>
              Войдите, чтобы управлять заявками и контентом
            </CardDescription>
            <CardAction>
              <Link href={"/"}>
                <Button variant="link">К сайту</Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  {...register("email", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password", { required: true })}
                />
              </div>
              <div className="pt-2">
                <Button disabled={isLoadingLogin} type="submit">{isSending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} {isSending ? 'Вход' : 'Войти'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
