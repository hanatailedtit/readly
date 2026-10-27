"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
  useAddBookSummaryLikeCountMutation,
  useDeleteDetailBookSummaryMutation,
  useGetBookSummaryLikeCountQuery,
  useGetDetailBookSummaryQuery,
} from "@/service/book.service";
import { useGetUserMyInfoQuery } from "@/service/user.service";
import { useBookRecords } from "@/service/library.service";
import { recordTitle, formatDate, bookFromRecord } from "@/lib/records";
import { ShareMenu } from "@/components/records/share-menu";
import { BookCover } from "@/components/books/book-cover";
import { SafeContent } from "@/components/records/safe-content";
import { Comments } from "@/components/records/comments";
import { DeleteDialog } from "@/components/records/delete-dialog";
import { LoadError } from "@/components/records/record-list";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function RecordDetailPage() {
  const { id } = useParams<{ id: string }>(),
    router = useRouter(),
    query = useGetDetailBookSummaryQuery(Number(id)),
    likes = useGetBookSummaryLikeCountQuery(Number(id)),
    like = useAddBookSummaryLikeCountMutation(),
    remove = useDeleteDetailBookSummaryMutation(),
    { data: user } = useGetUserMyInfoQuery(),
    [confirm, setConfirm] = useState(false);
  const record = query.data;
  const related = useBookRecords(record ? bookFromRecord(record) : undefined);
  if (query.isError) return <LoadError retry={query.refetch} />;
  if (!record)
    return (
      <p className="py-16 text-center text-muted-foreground">
        기록을 불러오고 있어요.
      </p>
    );
  const bookLink = `/books/${encodeURIComponent(record.isbn || record.bookTitle)}`,
    count = related.data?.length;

  return (
    <div className="space-y-8">
      <Link href="/records" className="text-sm text-muted-foreground">
        독서 기록 / {record.bookTitle}
      </Link>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_324px] lg:gap-16">
        <article className="order-2 min-w-0 space-y-6 lg:order-1">
          <p className="text-sm text-muted-foreground">
            {record.category} / 독서 기록
          </p>
          <h1 className="font-display text-[28px] font-bold leading-relaxed sm:text-[34px]">
            {recordTitle(record)}
          </h1>
          <div className="flex items-center gap-3">
            <Link href={`/my-page/${record.userId}`}>
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={record.userImage}
                  alt={record.userName}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback className="text-xs">
                  {record.userName?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <p className="text-sm text-muted-foreground">
              <Link
                href={`/my-page/${record.userId}`}
                className="font-medium text-foreground hover:underline"
              >
                {record.userName}
              </Link>{" "}
              · {formatDate(record.createAt)} · 조회 {record.viewCount || 0}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              aria-pressed={!!likes.data?.is_clicked}
              disabled={like.isPending}
              onClick={async () => {
                if (!user) {
                  router.push(
                    "/login?next=" +
                      encodeURIComponent("/summary/detail/" + id),
                  );
                  return;
                }
                try {
                  await like.mutateAsync({ id: Number(id) });
                } catch {
                  toast.error(
                    "좋아요를 저장하지 못했어요. 다시 시도해 주세요.",
                  );
                }
              }}
            >
              <Heart
                className={
                  likes.data?.is_clicked ? "fill-primary text-primary" : ""
                }
              />
              좋아요 {likes.data?.like_count ?? record.likeCount ?? 0}
            </Button>
            <ShareMenu
              title={recordTitle(record)}
              likeCount={likes.data?.like_count ?? record.likeCount ?? 0}
              viewCount={record.viewCount ?? 0}
              userName={record.userName}
              userImage={record.userImage}
            />
            {record.isMy && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <MoreHorizontal />
                    더보기
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/summary/edit/${id}`}>수정</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setConfirm(true)}
                    className="text-destructive"
                  >
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="border-t pt-6">
            <SafeContent content={record.content} />
          </div>
          <p className="text-sm text-muted-foreground">
            {record.startPage && record.endPage
              ? `기록한 쪽수 ${record.startPage}–${record.endPage}p`
              : "책 전체에 대한 기록"}{" "}
            {record.category && `· #${record.category}`}
          </p>
          <Comments id={Number(id)} />
        </article>
        <aside className="order-1 space-y-4 rounded-sm bg-muted p-4 lg:order-2 lg:p-6">
          <div className="flex gap-4 lg:flex-col lg:items-center">
            <BookCover
              title={record.bookTitle}
              image={record.bookImage}
              className="w-20 lg:w-[180px]"
            />
            <div className="min-w-0 flex-1 space-y-3 lg:w-full">
              <h2 className="text-xl font-bold">{record.bookTitle}</h2>
              <p className="text-sm text-muted-foreground">
                {record.bookAuthor} 지음 · {record.category}
              </p>
              {count !== undefined && (
                <p className="text-sm font-semibold">
                  이 책의 독서 기록 {count}건
                </p>
              )}
            </div>
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link href={bookLink}>도서와 다른 기록 보기</Link>
          </Button>
          <Button asChild className="w-full">
            <Link
              href={`/summary/create?isbn=${encodeURIComponent(record.isbn)}`}
            >
              이 책으로 기록 남기기
            </Link>
          </Button>
        </aside>
      </div>
      <Button asChild variant="outline" className="w-[200px]">
        <Link href="/records">독서 기록 목록으로</Link>
      </Button>
      <DeleteDialog
        open={confirm}
        onOpenChange={setConfirm}
        pending={remove.isPending}
        onDelete={async () => {
          try {
            await remove.mutateAsync(Number(id));
            toast.success("독서 기록을 삭제했어요.");
            router.replace("/records");
          } catch {
            toast.error("기록을 삭제하지 못했어요. 다시 시도해 주세요.");
          }
        }}
      />
    </div>
  );
}
