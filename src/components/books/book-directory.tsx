"use client";
import Link from "next/link";
import { useState } from "react";
import { useBookCatalog } from "@/service/library.service";
import {
  useSearchBookMutation,
  useGetRecentBookListQuery,
} from "@/service/book.service";
import { BookCover } from "./book-cover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadError, PageNumbers } from "@/components/records/record-list";
import { recordBookKey, type CatalogBook } from "@/lib/records";
export function BookDirectory() {
  const catalog = useBookCatalog(),
    recent = useGetRecentBookListQuery(),
    search = useSearchBookMutation(),
    [text, setText] = useState(""),
    [searched, setSearched] = useState(false),
    [onlyRecorded, setOnlyRecorded] = useState(false),
    [order, setOrder] = useState("count"),
    [page, setPage] = useState(1);
  const available = new Map(
    (catalog.data || []).map((book) => [recordBookKey(book), book]),
  );
  for (const book of recent.data || []) {
    const key = recordBookKey(book);
    if (!available.has(key))
      available.set(key, { ...book, count: 0, records: [] });
  }
  const books: CatalogBook[] = searched
    ? (search.data?.items || []).map((b) => {
        const existing = catalog.data?.find((c) => c.isbn === b.isbn);
        return {
          ...b,
          count: existing?.count || 0,
          records: existing?.records || [],
        };
      })
    : [...available.values()];
  const filtered = books
    .filter((b) => !onlyRecorded || b.count > 0)
    .sort((a, b) =>
      order === "title"
        ? a.title.localeCompare(b.title, "ko")
        : order === "recent"
          ? (b.records[0]?.createAt || "").localeCompare(
              a.records[0]?.createAt || "",
            )
          : b.count - a.count,
    );
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="page-title">도서</h1>
        <p className="text-muted-foreground">
          한 권의 책에 쌓인 다양한 독서 기록을 만나보세요.
        </p>
      </div>
      <form
        className="grid gap-4 sm:grid-cols-[1fr_160px] sm:items-end"
        onSubmit={async (e) => {
          e.preventDefault();
          setPage(1);
          if (!text.trim()) {
            setSearched(false);
            return;
          }
          setSearched(true);
          try {
            await search.mutateAsync({ query: text.trim(), display: "100" });
          } catch {}
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="book-search">도서 검색</Label>
          <Input
            id="book-search"
            placeholder="책 제목이나 저자를 입력하세요."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={search.isPending}>
          검색
        </Button>
      </form>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-h-11 items-center gap-4">
          <Label htmlFor="recorded-filter" className="font-semibold">
            기록이 달린 도서만 보기
          </Label>
          <Switch
            id="recorded-filter"
            checked={onlyRecorded}
            onCheckedChange={(v) => {
              setOnlyRecorded(v);
              setPage(1);
            }}
          />
        </div>
        <span className="font-semibold sm:mr-auto sm:pl-8">
          {filtered.length}권
        </span>
        <Select
          value={order}
          onValueChange={(v) => {
            setOrder(v);
            setPage(1);
          }}
        >
          <SelectTrigger aria-label="도서 정렬" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="count">기록 많은순</SelectItem>
            <SelectItem value="recent">최근 기록순</SelectItem>
            <SelectItem value="title">제목순</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {catalog.isError || search.isError ? (
        <LoadError
          retry={() =>
            searched ? search.mutate({ query: text }) : catalog.refetch()
          }
        />
      ) : (
        <>
          {!(catalog.isLoading || search.isPending) && (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {filtered.slice((page - 1) * 12, page * 12).map((b) => (
                <Link
                  key={b.isbn || b.title}
                  href={`/books/${encodeURIComponent(b.isbn || b.title)}`}
                  className="flex gap-4 rounded-sm border p-4 transition-colors hover:border-primary sm:flex-col sm:p-5"
                >
                  <BookCover
                    title={b.title}
                    image={b.image}
                    className="w-[88px] sm:mx-auto sm:w-[140px]"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
                    <h2 className="line-clamp-2 text-lg font-bold sm:text-xl">
                      {b.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">{b.author}</p>
                    <p className="text-sm font-semibold">
                      독서 기록 {b.count}건
                    </p>
                    {b.count === 0 && (
                      <p className="text-xs text-muted-foreground">
                        첫 기록을 기다리고 있어요
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
          {(!filtered.length || catalog.isLoading || search.isPending) && (
            <div className="bg-muted p-10 text-center text-muted-foreground">
              {catalog.isLoading || search.isPending
                ? "도서를 불러오고 있어요."
                : "아직 도서가 없어요. 책 제목으로 검색해보세요."}
            </div>
          )}
        </>
      )}
      <PageNumbers page={page} total={filtered.length} onChange={setPage} />
    </div>
  );
}
