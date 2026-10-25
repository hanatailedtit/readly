"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useBookInfo, useBookRecords } from "@/service/library.service";
import { useMemo } from "react";
import { BookCover } from "@/components/books/book-cover";
import { Button } from "@/components/ui/button";
import {
  LoadError,
  ListControls,
  RecordGrid,
  PageNumbers,
  useListState,
} from "@/components/records/record-list";
import { safeExternalUrl, formatDate } from "@/lib/records";
export default function BookDetailPage() {
  const { isbn } = useParams<{ isbn: string }>();
  const lookup = useBookInfo(isbn);
  const book = lookup.data;
  const query = useBookRecords(book ?? undefined);
  const list = useListState();
  const records = useMemo(
    () =>
      [...(query.data || [])].sort((a, b) =>
        list.order === "like"
          ? (b.likeCount || 0) - (a.likeCount || 0)
          : list.order === "view"
            ? (b.viewCount || 0) - (a.viewCount || 0)
            : list.order === "asc"
              ? a.createAt.localeCompare(b.createAt)
              : b.createAt.localeCompare(a.createAt),
      ),
    [query.data, list.order],
  );
  if (lookup.isError) return <LoadError retry={lookup.refetch} />;
  if (!book)
    return (
      <p className="py-16 text-center text-muted-foreground">
        {lookup.isLoading || lookup.isFetching
          ? "도서 정보를 불러오고 있어요."
          : "도서를 찾을 수 없어요."}
      </p>
    );
  return (
    <div className="space-y-8">
      <Link href="/books" className="text-sm text-muted-foreground">
        도서 / {book.title}
      </Link>
      <section className="grid gap-6 rounded-sm bg-muted p-5 sm:p-8 md:grid-cols-[180px_1fr] md:gap-12">
        <BookCover
          title={book.title}
          image={book.image}
          className="w-[120px] md:w-[180px]"
        />
        <div className="space-y-4">
          <h1 className="page-title">{book.title}</h1>
          <p className="text-lg">{book.author} 지음</p>
          <p className="text-sm text-muted-foreground">
            {book.publisher} {book.pubdate && `· ${formatDate(book.pubdate)}`} ·
            ISBN {book.isbn}
          </p>
          <p className="leading-relaxed text-muted-foreground">
            한 권의 책을 읽고 남긴 서로 다른 생각들. 같은 장면을 읽은 독자들의
            마음을 만나보세요.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link
                href={`/summary/create?isbn=${encodeURIComponent(book.isbn)}`}
              >
                이 책으로 기록 남기기
              </Link>
            </Button>
            {safeExternalUrl(book.link) && (
              <Button asChild variant="outline">
                <a
                  href={safeExternalUrl(book.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  도서 원문 정보
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>
      <section className="space-y-6 border-t pt-8">
        <ListControls
          title={`이 책의 독서 기록 ${records.length}건`}
          {...list}
        />
        <p className="text-sm text-muted-foreground">
          같은 책에서 발견한, 서로 다른 이야기
        </p>
        {query.isError ? (
          <LoadError retry={query.refetch} />
        ) : (
          <RecordGrid
            loading={query.isLoading}
            records={records.slice((list.page - 1) * 12, list.page * 12)}
            view={list.view}
          />
        )}
        <PageNumbers
          page={list.page}
          total={records.length}
          onChange={list.setPage}
        />
      </section>
      <Button asChild variant="outline">
        <Link href="/books">도서 목록으로</Link>
      </Button>
    </div>
  );
}
