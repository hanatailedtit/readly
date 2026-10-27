"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useEditUserNicknameMutation,
  useEditUserProfileImageMutation,
} from "@/service/user.service";
import type { UserInfoDto } from "@/model/user.dto";
import { createDefaultProfileImage } from "@/lib/profile";
import { cn } from "@/lib/utils";

export function ProfileEditDialog({ user }: { user: UserInfoDto }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.nickname);
  const [savedName, setSavedName] = useState(user.nickname);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>();
  const [resetImage, setResetImage] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState("");
  const [saveError, setSaveError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const nickname = useEditUserNicknameMutation();
  const image = useEditUserProfileImageMutation();

  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const changeOpen = (next: boolean) => {
    if (saving) return;
    if (next) {
      setName(user.nickname);
      setSavedName(user.nickname);
      setFile(null);
      setResetImage(false);
      setDragging(false);
      setNameError("");
      setImageError("");
      setSaveError("");
    }
    if (!next) setFile(null);
    setOpen(next);
  };

  const selectFile = (next?: File) => {
    if (!next || saving) return;
    if (
      !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
        next.type,
      )
    ) {
      setImageError("JPG, PNG, GIF, WebP 이미지를 선택해 주세요.");
      return;
    }
    if (!next.size || next.size > 5 * 1024 * 1024) {
      setImageError("비어 있지 않은 5MB 이하의 이미지를 선택해 주세요.");
      return;
    }
    setFile(next);
    setResetImage(false);
    setImageError("");
    setSaveError("");
  };

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="order-2 w-full bg-white sm:w-auto lg:order-3 lg:min-w-[168px]"
        >
          <Pencil aria-hidden="true" />
          프로필 수정
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-[480px] gap-0 overflow-y-auto rounded-lg border-0 p-6 shadow-none sm:p-8"
        overlayClassName="bg-black/40"
        closeDisabled={saving}
        onEscapeKeyDown={(e) => {
          if (saving) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (saving) e.preventDefault();
        }}
      >
        <DialogHeader className="space-y-3 pr-6 text-left">
          <DialogTitle className="text-[22px] font-bold leading-snug">
            프로필 수정
          </DialogTitle>
          <DialogDescription>
            사진과 닉네임을 변경할 수 있어요.
          </DialogDescription>
        </DialogHeader>
        <form
          className="mt-8"
          aria-busy={saving}
          onSubmit={async (e) => {
            e.preventDefault();
            if (saving) return;
            const nextName = name.trim();
            if (nextName.length < 2 || nextName.length > 8) {
              setNameError("닉네임은 2–8자로 입력해 주세요.");
              nameInput.current?.focus();
              return;
            }
            setSaving(true);
            setSaveError("");
            let nameSaved = false;
            try {
              if (nextName !== savedName) {
                await nickname.mutateAsync({ nickname: nextName });
                setSavedName(nextName);
                nameSaved = true;
              }
              const upload = resetImage
                ? await createDefaultProfileImage(nextName)
                : file;
              if (upload) {
                const form = new FormData();
                form.append("image", upload);
                await image.mutateAsync(form);
              }
              setOpen(false);
              setFile(null);
              toast.success("프로필을 변경했어요.");
            } catch {
              setSaveError(
                nameSaved
                  ? "닉네임은 변경했지만 사진을 저장하지 못했어요. 다시 저장해 주세요."
                  : "변경사항을 저장하지 못했어요. 다시 시도해 주세요.",
              );
            } finally {
              setSaving(false);
            }
          }}
        >
          <fieldset disabled={saving} className="min-w-0 space-y-8">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                if (!saving) setDragging(true);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node))
                  setDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                selectFile(e.dataTransfer.files[0]);
              }}
              className={cn(
                "rounded-md transition-colors",
                dragging &&
                  "bg-accent outline outline-2 outline-primary outline-offset-4",
              )}
            >
              <Label htmlFor="profile-image" className="font-semibold">
                프로필 사진
              </Label>
              <div className="mt-4 flex items-start gap-5">
                <Avatar className="h-[72px] w-[72px] shrink-0 border bg-white">
                  <AvatarImage
                    src={resetImage ? undefined : preview || user.profile_image}
                    alt="프로필 사진 미리보기"
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback className="bg-white font-display text-[28px] font-bold">
                    {name.trim().slice(0, 1) || user.nickname.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 px-4"
                    onClick={() => input.current?.click()}
                  >
                    <Camera aria-hidden="true" />
                    사진 변경
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="mt-1 flex h-11 justify-start px-0 text-foreground underline underline-offset-4"
                    disabled={resetImage || (!user.profile_image && !file)}
                    onClick={() => {
                      setFile(null);
                      setResetImage(!!user.profile_image);
                      setImageError("");
                      setSaveError("");
                    }}
                  >
                    기본 이미지로 변경
                  </Button>
                </div>
              </div>
              <Input
                ref={input}
                id="profile-image"
                type="file"
                tabIndex={-1}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="sr-only"
                aria-describedby="profile-image-help profile-image-error"
                aria-invalid={!!imageError}
                onChange={(e) => {
                  selectFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              <p
                id="profile-image-help"
                className="mt-3 text-xs text-muted-foreground"
              >
                JPG, PNG, GIF, WebP · 최대 5MB
              </p>
              {file && (
                <p
                  className="mt-2 break-all text-xs text-muted-foreground"
                  role="status"
                >
                  선택한 사진: {file.name}
                </p>
              )}
              {resetImage && (
                <p className="mt-2 text-xs text-muted-foreground" role="status">
                  저장하면 기본 이미지로 변경돼요.
                </p>
              )}
              {imageError && (
                <p
                  id="profile-image-error"
                  className="field-error"
                  role="alert"
                >
                  {imageError}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="profile-name" className="font-semibold">
                닉네임
              </Label>
              <div className="relative mt-3">
                <Input
                  ref={nameInput}
                  id="profile-name"
                  autoComplete="nickname"
                  value={name}
                  maxLength={8}
                  aria-invalid={!!nameError}
                  aria-describedby="profile-name-help profile-name-error"
                  className="h-12 pr-16"
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError("");
                    setSaveError("");
                  }}
                />
                <span
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs tabular-nums text-muted-foreground"
                  aria-hidden="true"
                >
                  {name.length} / 8
                </span>
              </div>
              <p
                id="profile-name-help"
                className="mt-3 text-xs text-muted-foreground"
              >
                2–8자로 입력해 주세요.
              </p>
              {nameError && (
                <p id="profile-name-error" className="field-error" role="alert">
                  {nameError}
                </p>
              )}
            </div>
          </fieldset>
          {saveError && (
            <p className="field-error mt-5" role="alert">
              {saveError}
            </p>
          )}
          <DialogFooter className="mt-8 flex-row gap-4 border-t pt-6 sm:justify-between sm:space-x-0">
            <Button
              type="button"
              variant="outline"
              className="min-w-24"
              disabled={saving}
              onClick={() => changeOpen(false)}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="min-w-0 flex-1 sm:min-w-[152px] sm:flex-none"
              disabled={
                saving || (name.trim() === savedName && !file && !resetImage)
              }
            >
              {saving ? "저장 중…" : "변경사항 저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
