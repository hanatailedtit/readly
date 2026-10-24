"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useCheckSignUpIdMutation,
  useCheckSignUpNicknameMutation,
  useSignUpByDefaultMutation,
} from "@/service/auth.service";
import { safeExternalUrl } from "@/lib/records";
type Values = {
  id: string;
  password: string;
  verifyPassword: string;
  nickname: string;
  agreed: boolean;
};
export default function SignUpPage() {
  const router = useRouter(),
    signup = useSignUpByDefaultMutation(),
    check = useCheckSignUpIdMutation(),
    nicknameCheck = useCheckSignUpNicknameMutation(),
    [message, setMessage] = useState(""),
    [checked, setChecked] = useState<{ id: string; exists: boolean } | null>(
      null,
    );
  const {
      register,
      handleSubmit,
      control,
      setError,
      getValues,
      watch,
      formState: { errors },
    } = useForm<Values>({ defaultValues: { agreed: false } }),
    id = watch("id");
  return (
    <AuthLayout signup>
      <form
        className="space-y-5"
        onSubmit={handleSubmit(async (values) => {
          setMessage("");
          try {
            const status = await check.mutateAsync({ user_id: values.id });
            if (status.isExist) {
              setError(
                "id",
                { message: "이미 사용 중인 아이디입니다." },
                { shouldFocus: true },
              );
              return;
            }
            const nicknameStatus = await nicknameCheck.mutateAsync({
              nickname: values.nickname,
            });
            if (nicknameStatus.isExist) {
              setError(
                "nickname",
                { message: "이미 사용 중인 닉네임입니다." },
                { shouldFocus: true },
              );
              return;
            }
            await signup.mutateAsync({
              user_id: values.id,
              password: values.password,
              nickname: values.nickname,
            });
            router.replace("/login");
          } catch {
            setMessage(
              "가입하지 못했어요. 입력 내용을 확인하고 다시 시도해 주세요.",
            );
          }
        })}
      >
        <div className="space-y-4 pb-2">
          <h1 className="page-title">나의 독서 기록 시작하기</h1>
          <p className="text-muted-foreground">
            책을 읽은 마음을 오래 간직해 보세요.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-id">아이디</Label>
          <Input
            id="signup-id"
            placeholder="영문·숫자 6자 이상"
            autoComplete="username"
            aria-invalid={!!errors.id}
            {...register("id", {
              required: "아이디를 입력해 주세요.",
              pattern: {
                value: /^[A-Za-z0-9]{6,}$/,
                message: "아이디는 영문과 숫자로 6자 이상 입력해 주세요.",
              },
              onBlur: async () => {
                const value = getValues("id");
                if (!/^[A-Za-z0-9]{6,}$/.test(value)) return;
                try {
                  const result = await check.mutateAsync({ user_id: value });
                  setChecked({ id: value, exists: result.isExist });
                } catch {
                  setChecked(null);
                }
              },
            })}
          />
          {errors.id ? (
            <p className="field-error" role="alert">
              {errors.id.message}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {checked && checked.id === id
                ? checked.exists
                  ? "이미 사용 중인 아이디입니다."
                  : "사용할 수 있는 아이디입니다."
                : "입력 후 아이디 사용 가능 여부를 확인합니다."}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">비밀번호</Label>
          <Input
            id="signup-password"
            placeholder="8자 이상 입력하세요."
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register("password", {
              required: "비밀번호를 입력해 주세요.",
              minLength: {
                value: 8,
                message: "비밀번호는 8자 이상 입력해 주세요.",
              },
            })}
          />
          {errors.password && (
            <p className="field-error" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-confirm">비밀번호 확인</Label>
          <Input
            id="signup-confirm"
            placeholder="비밀번호를 다시 입력하세요."
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.verifyPassword}
            {...register("verifyPassword", {
              required: "비밀번호를 다시 입력해 주세요.",
              validate: (value) =>
                value === getValues("password") ||
                "비밀번호가 일치하지 않습니다.",
            })}
          />
          {errors.verifyPassword && (
            <p className="field-error" role="alert">
              {errors.verifyPassword.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-name">닉네임</Label>
          <Input
            id="signup-name"
            placeholder="2–8자로 입력해 주세요."
            autoComplete="nickname"
            aria-invalid={!!errors.nickname}
            {...register("nickname", {
              required: "닉네임을 입력해 주세요.",
              minLength: {
                value: 2,
                message: "닉네임은 2자 이상 입력해 주세요.",
              },
              maxLength: {
                value: 8,
                message: "닉네임은 8자 이하로 입력해 주세요.",
              },
            })}
          />
          {errors.nickname && (
            <p className="field-error" role="alert">
              {errors.nickname.message}
            </p>
          )}
        </div>
        <Controller
          control={control}
          name="agreed"
          rules={{
            validate: (value) => value || "서비스 이용에 동의해 주세요.",
          }}
          render={({ field }) => (
            <div className="flex min-h-11 items-center gap-3">
              <Checkbox
                id="signup-agreed"
                checked={field.value}
                onCheckedChange={(value) => field.onChange(value === true)}
              />
              <Label
                htmlFor="signup-agreed"
                className="text-xs leading-relaxed text-muted-foreground"
              >
                {safeExternalUrl(process.env.NEXT_PUBLIC_TERMS_URL || "") &&
                safeExternalUrl(process.env.NEXT_PUBLIC_PRIVACY_URL || "") ? (
                  <>
                    <a
                      href={process.env.NEXT_PUBLIC_TERMS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      이용약관
                    </a>{" "}
                    및{" "}
                    <a
                      href={process.env.NEXT_PUBLIC_PRIVACY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      개인정보 수집·이용
                    </a>
                    에 동의합니다.
                  </>
                ) : (
                  "Readly의 공개 독서 기록 서비스 이용에 동의합니다."
                )}{" "}
                (필수)
              </Label>
            </div>
          )}
        />
        {errors.agreed && (
          <p className="field-error" role="alert">
            {errors.agreed.message}
          </p>
        )}
        {message && (
          <p role="alert" className="field-error">
            {message}
          </p>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={
            signup.isPending || check.isPending || nicknameCheck.isPending
          }
        >
          {signup.isPending ? "가입 중…" : "회원가입"}
        </Button>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            이미 계정이 있으신가요?
          </span>
          <Button asChild variant="ghost">
            <Link href="/login">로그인</Link>
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
