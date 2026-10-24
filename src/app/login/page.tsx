"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useLoginByDefaultMutation,
  useLoginByGoogleMutation,
} from "@/service/auth.service";
import { safeReturnPath } from "@/lib/records";
type Values = { id: string; password: string };
export default function LoginPage() {
  const router = useRouter(),
    params = useSearchParams(),
    login = useLoginByDefaultMutation(),
    google = useLoginByGoogleMutation(),
    [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>();
  const destination = safeReturnPath(params.get("next"));
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (response) => {
      try {
        await google.mutateAsync(response.code);
        router.replace(destination);
      } catch {
        setMessage("Google 로그인에 실패했어요. 다시 시도해 주세요.");
      }
    },
    onError: () =>
      setMessage("Google 로그인에 실패했어요. 다시 시도해 주세요."),
  });
  return (
    <AuthLayout>
      <form
        className="space-y-6"
        onSubmit={handleSubmit(async (values) => {
          setMessage("");
          try {
            const result = await login.mutateAsync({
              user_id: values.id,
              password: values.password,
            });
            if (result.isSuccess) router.replace(destination);
            else
              setMessage(
                result.message || "아이디와 비밀번호를 확인해 주세요.",
              );
          } catch {
            setMessage("로그인하지 못했어요. 잠시 후 다시 시도해 주세요.");
          }
        })}
      >
        <div className="space-y-4 pb-2">
          <h1 className="page-title">다시 만나 반가워요</h1>
          <p className="text-muted-foreground">
            독서 기록을 이어가려면 로그인해 주세요.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-id">아이디</Label>
          <Input
            id="login-id"
            autoComplete="username"
            placeholder="아이디를 입력하세요."
            aria-invalid={!!errors.id}
            aria-describedby={errors.id ? "login-id-error" : undefined}
            {...register("id", { required: "아이디를 입력해 주세요." })}
          />
          {errors.id && (
            <p id="login-id-error" className="field-error" role="alert">
              {errors.id.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password">비밀번호</Label>
          <Input
            id="login-password"
            autoComplete="current-password"
            type="password"
            placeholder="비밀번호를 입력하세요."
            aria-invalid={!!errors.password}
            {...register("password", { required: "비밀번호를 입력해 주세요." })}
          />
          {errors.password && (
            <p className="field-error" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>
        {message && (
          <p className="field-error" role="alert">
            {message}
          </p>
        )}
        <Button className="w-full" type="submit" disabled={login.isPending}>
          {login.isPending ? "로그인 중…" : "로그인"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">또는</p>
        <Button
          className="w-full"
          type="button"
          variant="outline"
          disabled={google.isPending}
          onClick={() => {
            if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
              toast.error(
                "Google 로그인을 현재 사용할 수 없어요. 아이디로 로그인해 주세요.",
              );
              return;
            }
            googleLogin();
          }}
        >
          Google로 계속하기
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          아직 계정이 없으신가요?
        </p>
        <Button className="w-full" asChild variant="ghost">
          <Link href="/sign-up">회원가입</Link>
        </Button>
      </form>
    </AuthLayout>
  );
}
