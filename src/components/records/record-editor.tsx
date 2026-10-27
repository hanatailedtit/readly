"use client";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { BookCover } from "@/components/books/book-cover";
import { RichEditor } from "./rich-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  useCreateBookSummaryMutation,
  useEditBookSummaryMutation,
  useGetBookCategoryListQuery,
  useSearchBookQuery,
  useGetRecentBookListQuery,
} from "@/service/book.service";
import type { SearchBookItem } from "@/model/book/book.dto";
import type { BookDetailSummaryModel } from "@/model/book/book.model";
import { bookFromRecord, plainText, pageRangeError } from "@/lib/records";
export function RecordEditor({
  record,
  defaultBook,
}: {
  record?: BookDetailSummaryModel;
  defaultBook?: SearchBookItem;
}) {
  const router = useRouter(),
    [ready, setReady] = useState(false),
    [book, setBook] = useState<SearchBookItem | null>(
      record ? bookFromRecord(record) : defaultBook || null,
    ),
    [query, setQuery] = useState(""),
    [searchQuery, setSearchQuery] = useState(""),
    [searchPage, setSearchPage] = useState(1),
    [searchPageSize, setSearchPageSize] = useState(8),
    [category, setCategory] = useState(
      record?.categoryId ? String(record.categoryId) : "",
    ),
    content = useRef(record?.content || ""),
    [wholeBook, setWholeBook] = useState(
      record ? !record.startPage && !record.endPage : false,
    ),
    [start, setStart] = useState(
      record?.startPage ? String(record.startPage) : "",
    ),
    [end, setEnd] = useState(record?.endPage ? String(record.endPage) : ""),
    [errors, setErrors] = useState<Record<string, string>>({});
  const setContent = useCallback((value: string) => {
    content.current = value;
  }, []);
  const search = useSearchBookQuery({
      query: searchQuery,
      display: String(searchPageSize),
      start: String((searchPage - 1) * searchPageSize + 1),
    }),
    categories = useGetBookCategoryListQuery(),
    recent = useGetRecentBookListQuery(),
    create = useCreateBookSummaryMutation(),
    edit = useEditBookSummaryMutation(),
    pending = create.isPending || edit.isPending;
  const searchTotal = Math.min(
    search.data?.meta?.pageable_count ?? search.data?.total ?? 0,
    searchPageSize * 50,
  );
  const searchPageCount = Math.max(1, Math.ceil(searchTotal / searchPageSize));
  const canSearchNext =
    searchPage < searchPageCount &&
    search.data?.meta?.is_end !== true &&
    search.data?.items.length === searchPageSize;
  const submitBookSearch = () => {
    const term = query.trim();
    if (!term || search.isFetching) return;
    if (term === searchQuery && searchPage === 1) void search.refetch();
    else {
      setSearchPage(1);
      setSearchQuery(term);
    }
  };
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 640px)");
    const updatePageSize = () => {
      setSearchPageSize(desktop.matches ? 8 : 4);
      setSearchPage(1);
    };
    updatePageSize();
    desktop.addEventListener("change", updatePageSize);
    return () => desktop.removeEventListener("change", updatePageSize);
  }, []);
  useEffect(() => {
    if (!Cookies.get("access_token"))
      router.replace(
        "/login?next=" +
          encodeURIComponent(window.location.pathname + window.location.search),
      );
    else setReady(true);
  }, [router]);
  if (!ready)
    return (
      <p className="py-16 text-center text-muted-foreground">
        로그인 상태를 확인하고 있어요.
      </p>
    );
  if (record && !record.isMy)
    return <p role="alert">내가 작성한 기록만 수정할 수 있어요.</p>;
  return (
    <div className="space-y-8">
      <Link href="/records" className="text-sm text-muted-foreground">
        독서 기록 / {record ? "기록 수정" : "기록 남기기"}
      </Link>
      <div className="space-y-4">
        <h1 className="page-title">
          {record ? "독서 기록을 수정해보세요" : "책을 읽은 마음을 남겨보세요"}
        </h1>
        <p className="text-muted-foreground">
          좋아하는 문장부터 오늘의 생각까지, 나만의 독서 기록을 작성해 보세요.
        </p>
      </div>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_324px] lg:gap-16">
        <form
          className="min-w-0 space-y-8"
          onSubmit={async (e) => {
            e.preventDefault();
            const issues: Record<string, string> = {};
            if (!book) issues.book = "기록할 책을 선택해 주세요.";
            if (!category) issues.category = "카테고리를 선택해 주세요.";
            if (!plainText(content.current))
              issues.content = "독서 기록 내용을 입력해 주세요.";
            const range = pageRangeError(start, end, wholeBook);
            if (range) issues.range = range;
            setErrors(issues);
            if (Object.keys(issues).length || !book) return;
            const payload = {
              bookInfo: book,
              content: content.current,
              category_id: Number(category),
              startPage: wholeBook || !start ? undefined : Number(start),
              endPage: wholeBook || !end ? undefined : Number(end),
            };
            try {
              if (record) {
                await edit.mutateAsync({ ...payload, id: record.id });
                router.push(`/summary/detail/${record.id}`);
              } else {
                await create.mutateAsync(payload);
                router.push("/records");
              }
              toast.success(
                record ? "독서 기록을 수정했어요." : "독서 기록을 등록했어요.",
              );
            } catch {
              toast.error(
                "기록을 저장하지 못했어요. 입력 내용은 유지되니 다시 시도해 주세요.",
              );
            }
          }}
        >
          <section className="space-y-4">
            <h2 className="section-title">읽은 책 *</h2>
            <p className="text-sm text-muted-foreground">
              책을 먼저 선택하면 해당 도서의 기록 목록에도 함께 표시됩니다.
            </p>
            {book ? (
              <div className="flex flex-wrap items-center gap-4 rounded-sm border p-5">
                <BookCover title={book.title} image={book.image} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold">{book.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {book.author}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    이 책에 독서 기록을 연결합니다.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setBook(null)}
                >
                  책 변경
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="write-book-search">책 제목 또는 저자</Label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      id="write-book-search"
                      placeholder="기록할 책을 검색하세요."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                          e.preventDefault();
                          submitBookSearch();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!query.trim() || search.isFetching}
                      onClick={submitBookSearch}
                    >
                      {search.isFetching ? "검색 중…" : "도서 검색"}
                    </Button>
                  </div>
                </div>
                {!searchQuery && !!recent.data?.length && (
                  <div className="space-y-3 rounded-sm bg-muted p-4">
                    <p className="text-sm font-semibold">최근 찾아본 도서</p>
                    <div className="flex flex-wrap gap-2">
                      {recent.data.slice(0, 5).map((item, index) => (
                        <Button
                          key={`${item.isbn || item.link || item.title}:${index}`}
                          type="button"
                          variant="outline"
                          className="h-auto min-h-11 max-w-full whitespace-normal py-2 text-left"
                          onClick={() => setBook(item)}
                        >
                          {item.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                {search.isError && (
                  <p role="alert" className="field-error">
                    책을 검색하지 못했어요. 다시 시도해 주세요.
                  </p>
                )}
                {searchQuery && search.isPending && (
                  <p role="status" className="text-sm text-muted-foreground">
                    책을 검색하고 있어요.
                  </p>
                )}
                {search.data && (
                  <div
                    aria-busy={search.isFetching}
                    className="space-y-4 rounded-sm border p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold">
                        기록할 책을 선택하세요.
                      </p>
                      <p role="status" className="text-xs text-muted-foreground">
                        {search.isFetching
                          ? "검색 중…"
                          : `검색 결과 ${search.data.total.toLocaleString()}권`}
                      </p>
                    </div>
                    {search.data.items.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        검색 결과가 없어요.
                      </p>
                    )}
                    {search.data.items.map((b, index) => (
                      <div
                        key={`${b.isbn || b.link || b.title}:${index}`}
                        className="flex flex-wrap items-center gap-4"
                      >
                        <BookCover
                          title={b.title}
                          image={b.image}
                          className="w-[60px]"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold">{b.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {b.author}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={search.isFetching}
                          onClick={() => {
                            setBook(b);
                            setErrors((e) => ({ ...e, book: "" }));
                          }}
                        >
                          선택
                        </Button>
                      </div>
                    ))}
                    {searchTotal > searchPageSize && (
                      <nav
                        aria-label="도서 검색 결과 페이지"
                        className="flex items-center justify-center gap-4 border-t pt-4"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label="이전 도서 검색 결과"
                          disabled={searchPage === 1 || search.isFetching}
                          onClick={() => setSearchPage((page) => page - 1)}
                        >
                          <ChevronLeft aria-hidden="true" />
                        </Button>
                        <span className="min-w-16 text-center text-sm tabular-nums">
                          {searchPage} / {searchPageCount}
                          <span className="sr-only"> 페이지</span>
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label="다음 도서 검색 결과"
                          disabled={!canSearchNext || search.isFetching}
                          onClick={() => setSearchPage((page) => page + 1)}
                        >
                          <ChevronRight aria-hidden="true" />
                        </Button>
                      </nav>
                    )}
                  </div>
                )}
              </div>
            )}
            {errors.book && (
              <p role="alert" className="field-error">
                {errors.book}
              </p>
            )}
          </section>
          <div className="space-y-2">
            <Label htmlFor="write-category">카테고리 *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                id="write-category"
                aria-invalid={!!errors.category}
              >
                <SelectValue placeholder="카테고리를 선택하세요." />
              </SelectTrigger>
              <SelectContent>
                {categories.data?.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categories.isError && (
              <p className="field-error">
                분류를 불러오지 못했어요.{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => categories.refetch()}
                >
                  다시 시도
                </button>
              </p>
            )}
            {errors.category && (
              <p role="alert" className="field-error">
                {errors.category}
              </p>
            )}
          </div>
          <section className="space-y-4">
            <h2 className="section-title">독서 기록 *</h2>
            <RichEditor
              value={record?.content || ""}
              onChange={setContent}
              invalid={!!errors.content}
            />
            {errors.content && (
              <p role="alert" className="field-error">
                {errors.content}
              </p>
            )}
          </section>
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="section-title">쪽수 기록</h2>
              <div className="flex min-h-11 items-center gap-4">
                <Label htmlFor="whole-book" className="font-semibold">
                  책 전체
                </Label>
                <Switch
                  id="whole-book"
                  checked={wholeBook}
                  onCheckedChange={setWholeBook}
                />
              </div>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 sm:max-w-[544px]">
              <div className="space-y-2">
                <Label htmlFor="start-page">시작 쪽수</Label>
                <Input
                  id="start-page"
                  type="number"
                  min={1}
                  step={1}
                  placeholder="예: 32"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  disabled={wholeBook}
                  className="disabled:bg-muted"
                />
              </div>
              <span className="pb-3 text-muted-foreground">—</span>
              <div className="space-y-2">
                <Label htmlFor="end-page">마지막 쪽수</Label>
                <Input
                  id="end-page"
                  type="number"
                  min={1}
                  step={1}
                  placeholder="예: 68"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  disabled={wholeBook}
                  className="disabled:bg-muted"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {wholeBook
                ? "책 전체 기록으로 쪽수 입력이 비활성화됩니다."
                : "책 전체에 대한 기록이라면 ‘책 전체’를 켜주세요."}
            </p>
            {errors.range && (
              <p role="alert" className="field-error">
                {errors.range}
              </p>
            )}
          </section>
          <div className="flex flex-wrap items-center justify-end gap-4 border-t pt-8">
            <p className="mr-auto text-sm text-muted-foreground">
              등록한 기록은 다른 독자와 함께 읽을 수 있어요.
            </p>
            <Button asChild variant="outline">
              <Link href={record ? `/summary/detail/${record.id}` : "/records"}>
                취소
              </Link>
            </Button>
            <Button type="submit" disabled={pending}>
              {pending
                ? "저장 중…"
                : record
                  ? "수정 저장하기"
                  : "기록 등록하기"}
            </Button>
          </div>
        </form>
        <aside className="h-fit space-y-6 rounded-lg bg-muted p-6">
          <h2 className="section-title">
            한 줄부터
            <br />
            시작해도 좋아요
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            완벽한 서평을 쓰지 않아도 괜찮아요.
            <br />
            읽으며 떠오른 생각을
            <br />내 말로 남겨보세요.
          </p>
          <div className="space-y-5 border-y py-6">
            <h3 className="text-lg font-bold">이렇게 적어보세요</h3>
            {[
              "오래 기억하고 싶은 장면",
              "내 일상과 연결된 생각",
              "함께 나누고 싶은 질문",
            ].map((t) => (
              <p key={t} className="text-sm text-muted-foreground">
                {t}
              </p>
            ))}
          </div>
          <h3 className="text-lg font-bold">등록하기 전에</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            읽은 책과 카테고리를 확인해 주세요.
            <br />
            본문은 꼭 입력해 주세요.
            <br />
            쪽수는 선택사항입니다.
          </p>
        </aside>
      </div>
    </div>
  );
}
