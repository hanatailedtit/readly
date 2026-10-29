"use client";

import { Loader2, UserRound } from "lucide-react";
import Link from "next/link";
import type { UserInfoDto } from "@/model/user.dto";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CommentComposerProps = {
  id: string;
  user?: UserInfoDto | null;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  pending: boolean;
  loginHref: string;
  replyTo?: string;
  onCancel?: () => void;
};

export function CommentComposer({
  id,
  user,
  value,
  onChange,
  onSubmit,
  pending,
  loginHref,
  replyTo,
  onCancel,
}: CommentComposerProps) {
  const action = replyTo === undefined ? "댓글 남기기" : "답글 남기기";

  return (
    <form
      className="overflow-hidden rounded-lg border bg-background transition-colors focus-within:border-primary"
      aria-busy={pending}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex items-center gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
        <Avatar className="h-9 w-9 border">
          <AvatarImage
            src={user?.profile_image}
            alt=""
            referrerPolicy="no-referrer"
          />
          <AvatarFallback className="text-xs text-muted-foreground">
            {user ? (
              user.nickname.slice(0, 1)
            ) : (
              <UserRound className="h-4 w-4" aria-hidden="true" />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="break-words text-sm font-semibold">
            {user?.nickname || "함께 이야기해요"}
          </p>
          {replyTo !== undefined && (
            <p className="mt-0.5 break-words text-xs text-muted-foreground">
              {replyTo} 님에게 답글
            </p>
          )}
        </div>
      </div>
      <Label htmlFor={id} className="sr-only">
        {replyTo === undefined ? action : `${replyTo} 님에게 답글`}
      </Label>
      <Textarea
        id={id}
        value={value}
        disabled={!user || pending}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={`${id}-hint`}
        rows={3}
        className="min-h-[112px] resize-none rounded-none border-0 px-4 pb-5 pt-3 text-base leading-relaxed shadow-none placeholder:text-muted-foreground/80 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-100 sm:px-5 md:text-base"
        placeholder={
          !user
            ? "로그인하고 이 기록에 대한 생각을 나눠보세요."
            : replyTo === undefined
              ? "이 기록을 읽고 어떤 생각이 드셨나요?"
              : "함께 나누고 싶은 생각을 남겨주세요."
        }
      />
      <div className="flex flex-col gap-3 border-t bg-muted/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p
          id={`${id}-hint`}
          className="text-xs leading-5 text-muted-foreground"
        >
          {user
            ? "서로의 생각을 존중하며 이야기해 주세요."
            : "댓글과 답글은 로그인 후 남길 수 있어요."}
        </p>
        <div className="flex shrink-0 items-center justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={pending}
            >
              취소
            </Button>
          )}
          {user ? (
            <Button
              type="submit"
              size="sm"
              className="min-w-[96px]"
              disabled={!value.trim() || pending}
            >
              {pending && (
                <Loader2 className="animate-spin" aria-hidden="true" />
              )}
              {pending ? "등록 중…" : action}
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link href={loginHref}>로그인 후 {action}</Link>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
