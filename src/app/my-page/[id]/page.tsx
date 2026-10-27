"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetUserInfoQuery,
  useGetUserMyInfoQuery,
  useEditUserNicknameMutation,
  useEditUserProfileImageMutation,
} from "@/service/user.service";
import { useRecordFeed } from "@/service/library.service";
import {
  RecordGrid,
  ListControls,
  LoadError,
  PageNumbers,
  useListState,
} from "@/components/records/record-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function ProfilePage() {
  const { id } = useParams<{ id: string }>(),
    info = useGetUserInfoQuery(id),
    { data: me } = useGetUserMyInfoQuery(),
    list = useListState(),
    feed = useRecordFeed({ page: list.page, order: list.order, userId: id }),
    nickname = useEditUserNicknameMutation(),
    image = useEditUserProfileImageMutation(),
    [editing, setEditing] = useState(false),
    [name, setName] = useState("");
  if (info.isError) return <LoadError retry={info.refetch} />;
  return (
    <div className="space-y-10">
      <section className="space-y-5 rounded-sm bg-muted p-6">
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={info.data?.profile_image}
              alt="프로필"
              referrerPolicy="no-referrer"
            />
            <AvatarFallback>{info.data?.nickname.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="page-title">
              {info.data?.nickname || "독자 프로필"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              책을 읽고 남긴 마음들
            </p>
          </div>
        </div>
        {info.data?.is_my && me?.id === info.data.id && (
          <>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(!editing);
                  setName(info.data.nickname);
                }}
              >
                닉네임 수정
              </Button>
              <div>
                <Label
                  htmlFor="profile-image"
                  className="flex h-[46px] cursor-pointer items-center rounded-md border bg-white px-4"
                >
                  {image.isPending ? "업로드 중…" : "프로필 사진 변경"}
                </Label>
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={image.isPending}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (
                      !file.type.startsWith("image/") ||
                      file.size > 5 * 1024 * 1024
                    ) {
                      toast.error("5MB 이하의 이미지를 선택해 주세요.");
                      return;
                    }
                    const form = new FormData();
                    form.append("image", file);
                    try {
                      await image.mutateAsync(form);
                      toast.success("프로필 사진을 변경했어요.");
                    } catch {
                      toast.error("사진을 변경하지 못했어요.");
                    }
                  }}
                />
              </div>
            </div>
            {editing && (
              <form
                className="flex max-w-md gap-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (name.trim().length < 2 || name.trim().length > 8) {
                    toast.error("닉네임은 2–8자로 입력해 주세요.");
                    return;
                  }
                  try {
                    await nickname.mutateAsync({ nickname: name.trim() });
                    setEditing(false);
                  } catch {
                    toast.error("닉네임을 변경하지 못했어요.");
                  }
                }}
              >
                <Label className="sr-only" htmlFor="profile-name">
                  닉네임
                </Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Button type="submit" disabled={nickname.isPending}>
                  저장
                </Button>
              </form>
            )}
          </>
        )}
      </section>
      <section className="space-y-6">
        <ListControls
          title={`작성한 독서 기록 ${feed.data?.total || 0}건`}
          {...list}
        />
        {feed.isError ? (
          <LoadError retry={feed.refetch} />
        ) : (
          <RecordGrid
            records={feed.data?.records || []}
            loading={feed.isLoading}
            view={list.view}
          />
        )}
        <PageNumbers
          page={list.page}
          total={feed.data?.total || 0}
          onChange={list.setPage}
        />
      </section>
    </div>
  );
}
