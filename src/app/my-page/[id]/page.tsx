"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { BookOpen, LayoutGrid, List, Search } from "lucide-react";
import {
  useGetUserInfoQuery,
  useGetUserMyInfoQuery,
} from "@/service/user.service";
import { useProfileRecords } from "@/service/library.service";
import {
  RecordGrid,
  LoadError,
  PageNumbers,
  useListState,
} from "@/components/records/record-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileEditDialog } from "@/components/profile/profile-edit-dialog";
import { BookCover } from "@/components/books/book-cover";
import { groupBooks, recordBookKey } from "@/lib/records";
import { filterProfileRecords } from "@/lib/profile";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 4;

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  return <ProfileContent key={id} id={id} />;
}

function ProfileContent({ id }: { id: string }) {
  const info = useGetUserInfoQuery(id);
  const { data: me } = useGetUserMyInfoQuery();
  const query = useProfileRecords(id);
  const list = useListState();
  const [keyword, setKeyword] = useState("");
  const [book, setBook] = useState("");
  const books = useMemo(() => groupBooks(query.data || []), [query.data]);
  const selectedBook = books.some((item) => recordBookKey(item) === book)
    ? book
    : "";
  const records = useMemo(
    () =>
      filterProfileRecords(query.data || [], {
        book: selectedBook,
        keyword,
        order: list.order,
      }),
    [query.data, selectedBook, keyword, list.order],
  );
  const page = Math.min(
    list.page,
    Math.max(1, Math.ceil(records.length / PAGE_SIZE)),
  );
  const isMyProfile = !!(info.data?.is_my && me?.id === info.data.id);
  const chooseBook = (value: string) => {
    setBook(value);
    list.setPage(1);
  };

  if (info.isError) return <LoadError retry={info.refetch} />;
  if (!info.isLoading && !info.data)
    return (
      <p className="py-16 text-center text-muted-foreground">
        독자 정보를 찾을 수 없어요.
      </p>
    );

  return (
    <div className="space-y-10 sm:space-y-12">
      <div className="space-y-3">
        <h1 className="page-title">
          {isMyProfile ? "마이페이지" : "독서 프로필"}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {isMyProfile
            ? "내가 남긴 기록을 한곳에서 만나보세요."
            : "독자가 남긴 기록을 한곳에서 만나보세요."}
        </p>
      </div>

      <section
        aria-label="독자 프로필"
        className="flex flex-wrap items-center gap-6 rounded-lg bg-muted p-6 sm:p-8 lg:min-h-44 lg:gap-8"
      >
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6">
          <Avatar className="h-16 w-16 shrink-0 border bg-white lg:h-20 lg:w-20">
            <AvatarImage
              src={info.data?.profile_image}
              alt={`${info.data?.nickname || "독자"}의 프로필 사진`}
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="bg-white font-display text-[28px] font-bold">
              {info.data?.nickname?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-2">
            {info.isLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <h2 className="break-all text-2xl font-bold sm:text-[28px]">
                {info.data?.nickname}
              </h2>
            )}
            <p className="font-display text-sm font-bold text-muted-foreground sm:text-lg lg:text-[22px]">
              책을 읽고 남긴 마음들
            </p>
          </div>
        </div>
        {isMyProfile && info.data && <ProfileEditDialog user={info.data} />}
        <dl className="order-3 grid w-full grid-cols-2 divide-x border-t pt-6 lg:order-2 lg:w-60 lg:shrink-0 lg:border-0 lg:pt-0">
          {[
            ["작성한 기록", query.data?.length],
            ["기록한 책", books.length],
          ].map(([label, count]) => (
            <div
              key={label}
              className="flex flex-col-reverse items-center gap-2 px-3"
            >
              <dt className="text-xs text-muted-foreground sm:text-sm">
                {label}
              </dt>
              <dd className="text-[28px] font-bold leading-tight tabular-nums sm:text-[32px]">
                {query.isLoading ? (
                  <Skeleton className="h-9 w-8" />
                ) : query.isError ? (
                  "—"
                ) : (
                  count || 0
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid items-start gap-12 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside
          aria-label="기록한 책 필터"
          className="hidden space-y-6 lg:block"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">기록한 책</h2>
            <span className="text-sm text-muted-foreground">
              {query.isError ? "—" : `${books.length}권`}
            </span>
          </div>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start px-4",
              !selectedBook && "bg-muted text-primary",
            )}
            aria-pressed={!selectedBook}
            onClick={() => chooseBook("")}
          >
            <BookOpen aria-hidden="true" />
            모든 책
            <span className="ml-auto tabular-nums">
              {query.data?.length || 0}
            </span>
          </Button>
          {query.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="space-y-4">
              {books.map((item) => {
                const key = recordBookKey(item);
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={selectedBook === key}
                    onClick={() => chooseBook(key)}
                    className={cn(
                      "flex w-full items-start gap-4 rounded-md p-2 text-left transition-colors hover:bg-muted",
                      selectedBook === key && "bg-muted ring-1 ring-primary",
                    )}
                  >
                    <BookCover
                      title={item.title}
                      image={item.image}
                    className="w-12 [&_span]:hidden [&_svg]:mx-auto [&>div]:justify-center"
                    />
                    <span className="min-w-0 space-y-3 py-1">
                      <span className="line-clamp-2 text-sm font-semibold leading-6">
                        {item.title}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        기록 {item.count}건
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          <p className="border-t pt-5 text-xs leading-6 text-muted-foreground">
            책을 선택하면 그 책에 남긴 기록만 모아볼 수 있어요.
          </p>
        </aside>

        <section
          aria-labelledby="profile-records-title"
          className="min-w-0 space-y-5 sm:space-y-6"
        >
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-5 lg:gap-x-4">
            <h2
              id="profile-records-title"
              className="section-title col-start-1 row-start-1 min-w-0"
            >
              {isMyProfile ? "내 독서 기록" : "독서 기록"}
              <span className="ml-3 text-xl text-primary">
                {query.isLoading || query.isError ? "" : records.length}
              </span>
            </h2>
            <p className="col-span-2 col-start-1 row-start-1 hidden justify-self-end text-sm text-muted-foreground lg:block">
              {isMyProfile
                ? "내가 남긴 생각을 다시 꺼내보세요."
                : "책을 읽고 남긴 생각을 만나보세요."}
            </p>
            <div className="relative col-span-2 row-start-2">
              <Label htmlFor="profile-record-search" className="sr-only">
                책 제목이나 기록 내용으로 검색
              </Label>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="profile-record-search"
                type="search"
                value={keyword}
                placeholder="책 제목이나 기록 내용으로 검색"
                className="h-12 pl-12"
                onChange={(e) => {
                  setKeyword(e.target.value);
                  list.setPage(1);
                }}
              />
            </div>
            <div className="col-span-2 row-start-3 flex min-w-0 items-center gap-2 lg:col-span-1 lg:gap-4">
              <div className="min-w-0 flex-1 lg:hidden">
                <Select
                  value={selectedBook || "all"}
                  onValueChange={(value) =>
                    chooseBook(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger aria-label="기록한 책 선택" className="h-12">
                    <SelectValue placeholder="모든 책" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      모든 책 · {books.length}권
                    </SelectItem>
                    {books.map((item) => (
                      <SelectItem
                        key={recordBookKey(item)}
                        value={recordBookKey(item)}
                      >
                        {item.title} · {item.count}건
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p
                role="status"
                className="mr-auto hidden text-sm text-muted-foreground lg:block"
              >
                전체 {records.length}건
              </p>
              <Select value={list.order} onValueChange={list.setOrder}>
                <SelectTrigger
                  aria-label="독서 기록 정렬"
                  className="h-12 w-[120px] shrink-0 sm:w-40 lg:h-11"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">최신순</SelectItem>
                  <SelectItem value="like">인기순</SelectItem>
                  <SelectItem value="view">조회순</SelectItem>
                  <SelectItem value="asc">등록순</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div
              role="group"
              aria-label="기록 보기 방식"
              className="col-start-2 row-start-1 flex gap-1 justify-self-end rounded-md border p-0.5 lg:row-start-3"
            >
              {(["list", "grid"] as const).map((view) => {
                const Icon = view === "list" ? List : LayoutGrid;
                return (
                  <Button
                    key={view}
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "h-11 w-11",
                      list.view === view && "bg-muted text-primary",
                    )}
                    aria-label={view === "list" ? "리스트 보기" : "그리드 보기"}
                    aria-pressed={list.view === view}
                    onClick={() => list.setView(view)}
                  >
                    <Icon aria-hidden="true" />
                  </Button>
                );
              })}
            </div>
          </div>

          {query.isError ? (
            <LoadError retry={query.refetch} />
          ) : !query.isLoading && !records.length ? (
            <div className="rounded-sm border bg-muted/50 px-5 py-12 text-center">
              <BookOpen
                aria-hidden="true"
                className="mx-auto mb-4 h-8 w-8 text-muted-foreground"
              />
              <p className="font-semibold">
                {keyword || selectedBook
                  ? "조건에 맞는 기록이 없어요."
                  : "아직 남긴 독서 기록이 없어요."}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {keyword || selectedBook
                  ? "다른 검색어를 입력하거나 책 선택을 변경해 보세요."
                  : isMyProfile
                    ? "책을 읽으며 떠오른 생각을 첫 기록으로 남겨보세요."
                    : "새로운 독서 기록을 기다리고 있어요."}
              </p>
              {keyword || selectedBook ? (
                <Button
                  variant="outline"
                  className="mt-5 bg-white"
                  onClick={() => {
                    setKeyword("");
                    chooseBook("");
                  }}
                >
                  검색 조건 초기화
                </Button>
              ) : (
                isMyProfile && (
                  <Button asChild className="mt-5">
                    <Link href="/summary/create">첫 기록 남기기</Link>
                  </Button>
                )
              )}
            </div>
          ) : (
            <RecordGrid
              profile
              records={records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
              loading={query.isLoading}
              view={list.view}
            />
          )}
          {!query.isError && !query.isLoading && records.length > 0 && (
            <div className="space-y-2 pt-2">
              <PageNumbers
                page={page}
                total={records.length}
                pageSize={PAGE_SIZE}
                onChange={list.setPage}
              />
              <p
                className="text-center text-xs tabular-nums text-muted-foreground"
                aria-live="polite"
              >
                {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, records.length)} / {records.length}
                건
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
