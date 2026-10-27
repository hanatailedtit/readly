"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useBookCatalog } from "@/service/library.service";
import {
  useGetBookListQuery,
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

const PAGE_SIZE = 20;

export function BookDirectory() {
  const [text, setText] = useState(""),
    [searchKeyword, setSearchKeyword] = useState(""),
    [onlyRecorded, setOnlyRecorded] = useState(false),
    [order, setOrder] = useState("count"),
    [page, setPage] = useState(1);

  const bookListQuery = useGetBookListQuery(
    onlyRecorded
      ? undefined
      : {
          page_no: page,
          page_size: PAGE_SIZE,
          title: searchKeyword || undefined,
        },
    { enabled: !onlyRecorded },
  );

  const catalog = useBookCatalog();
  const recent = useGetRecentBookListQuery();

  const available = useMemo(() => {
    const books = new Map(
      (catalog.data || []).map((book) => [recordBookKey(book), book]),
    );
    for (const book of recent.data || []) {
      const key = recordBookKey(book);
      if (!books.has(key)) books.set(key, { ...book, count: 0, records: [] });
    }
    return books;
  }, [catalog.data, recent.data]);

  const recordedBooks: CatalogBook[] = useMemo(() => {
    const list = [...available.values()].filter((book) => book.count > 0);
    const filtered = searchKeyword
      ? list.filter(
          (b) =>
            b.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            b.author.toLowerCase().includes(searchKeyword.toLowerCase()),
        )
      : list;
    return filtered.sort((a, b) =>
      order === "title"
        ? a.title.localeCompare(b.title, "ko")
        : order === "recent"
          ? (b.records[0]?.createAt || "").localeCompare(
              a.records[0]?.createAt || "",
            )
          : b.count - a.count,
    );
  }, [available, searchKeyword, order]);

  const books: CatalogBook[] = useMemo(() => {
    if (onlyRecorded) {
      return recordedBooks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    }
    const list = (bookListQuery.data?.items || []).map((book) => {
      const existing = available.get(recordBookKey(book));
      return {
        ...book,
        count: existing?.count || 0,
        records: existing?.records || [],
      };
    });
    return list.sort((a, b) =>
      order === "title"
        ? a.title.localeCompare(b.title, "ko")
        : order === "recent"
          ? (b.records[0]?.createAt || "").localeCompare(
              a.records[0]?.createAt || "",
            )
          : b.count - a.count,
    );
  }, [onlyRecorded, recordedBooks, page, bookListQuery.data?.items, available, order]);

  const totalCount = onlyRecorded
    ? recordedBooks.length
    : bookListQuery.data?.total_count || 0;

  const isLoading = onlyRecorded ? catalog.isLoading : bookListQuery.isLoading;
  const isError = onlyRecorded ? catalog.isError : bookListQuery.isError;

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
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearchKeyword(text.trim());
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
        <Button type="submit" disabled={isLoading}>
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
          {totalCount.toLocaleString()}권
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
      {isError ? (
        <LoadError
          retry={() => {
            if (onlyRecorded) catalog.refetch();
            else bookListQuery.refetch();
          }}
        />
      ) : (
        <>
          {!isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {books.map((b) => (
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
          {(!books.length || isLoading) && (
            <div className="bg-muted p-10 text-center text-muted-foreground">
              {isLoading
                ? "도서를 불러오고 있어요."
                : searchKeyword
                  ? "검색 결과가 없어요. 다른 검색어로 찾아보세요."
                  : "아직 도서가 없어요."}
            </div>
          )}
        </>
      )}
      <PageNumbers
        page={page}
        total={totalCount}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </div>
  );
}
