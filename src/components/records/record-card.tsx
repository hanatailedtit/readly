import { memo } from "react";
import Link from "next/link";
import { Heart, MessageSquare } from "lucide-react";
import type { BookSummaryItemModel } from "@/model/book/book.model";
import { plainText, recordTitle, formatDate } from "@/lib/records";
import { cn } from "@/lib/utils";
import { BookCover } from "@/components/books/book-cover";
export const RecordCard = memo(function RecordCard({
  record,
  view = "grid",
  recommended = false,
  profile = false,
}: {
  record: BookSummaryItemModel;
  view?: "grid" | "list";
  recommended?: boolean;
  profile?: boolean;
}) {
  return (
    <Link
      href={`/summary/detail/${record.id}`}
      className={cn(
        "group relative flex min-w-0 flex-col gap-4 rounded-sm border bg-white p-6 transition-colors hover:border-primary",
        view === "grid"
          ? "min-h-[296px]"
          : "p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6",
        profile && "p-5 sm:p-6",
        profile && view === "list" && "sm:flex-col sm:items-stretch sm:gap-4",
      )}
    >
      {view === "grid" ? (
        <svg
          className="absolute right-6 top-0 h-6 w-3 text-border"
          viewBox="0 0 12 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M0 0h12v24l-6-4-6 4Z" />
        </svg>
      ) : !profile ? (
        <div className="hidden sm:block">
          <BookCover title={record.bookTitle} image={record.bookImage} />
        </div>
      ) : null}
      <div
        className={cn(
          "min-w-0 flex-1",
          view === "list" && "flex flex-col gap-3",
        )}
      >
        {recommended && (
          <p className="mb-4 text-xs font-medium text-muted-foreground">
            이달의 추천
          </p>
        )}
        <div
          className={cn(
            view === "list" && "flex gap-3 sm:block",
            profile && view === "list" && "gap-4 sm:flex sm:gap-6",
          )}
        >
          {view === "list" && (
            <div className={cn(!profile && "sm:hidden")}>
              <BookCover
                title={record.bookTitle}
                image={record.bookImage}
                className={profile ? "w-16" : "w-[72px]"}
              />
            </div>
          )}
          <div className="min-w-0">
            <h3
              className={cn(
                "line-clamp-2 text-lg font-bold leading-relaxed tracking-tight group-hover:text-primary",
                view === "grid"
                  ? "mb-5 min-h-[60px] pr-2 sm:text-xl"
                  : "sm:text-[22px]",
                profile && "text-[17px] sm:text-lg",
              )}
            >
              {recordTitle(record)}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {record.bookTitle} · {record.bookAuthor}
            </p>
          </div>
        </div>
        <p
          className={cn(
            "line-clamp-2 text-sm leading-6 text-muted-foreground",
            view === "grid" && "mt-4",
          )}
        >
          {plainText(record.content)}
        </p>
      </div>
      <div
        className={cn(
          "flex gap-3 text-xs text-muted-foreground",
          view === "grid"
            ? "mt-auto items-center justify-between border-t pt-4"
            : "items-center justify-between sm:w-44 sm:flex-col sm:items-start",
          profile &&
            "mt-auto items-center justify-between sm:w-auto sm:flex-row sm:items-center",
        )}
      >
        <span>
          {!profile && `${record.userName} · `}
          {formatDate(record.createAt)}
        </span>
        <div className="flex shrink-0 gap-5">
          <span className="flex items-center gap-1.5">
            <Heart className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">좋아요 </span>
            {record.likeCount || 0}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">댓글 </span>
            {record.commentCount || 0}
          </span>
        </div>
      </div>
    </Link>
  );
});
