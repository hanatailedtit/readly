"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { RecordCard } from "./record-card";
import type { BookSummaryItemModel } from "@/model/book/book.model";
import { cn } from "@/lib/utils";
export function LoadError({ retry }: { retry: () => unknown }) {
  return (
    <div role="alert" className="rounded-sm border p-8 text-center">
      <p className="font-semibold">기록을 불러오지 못했어요.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        잠시 후 다시 시도해 주세요.
      </p>
      <Button variant="outline" className="mt-5" onClick={() => retry()}>
        다시 시도
      </Button>
    </div>
  );
}
export function RecordGrid({
  records,
  view = "grid",
  loading = false,
  profile = false,
}: {
  records: BookSummaryItemModel[];
  view?: "grid" | "list";
  loading?: boolean;
  profile?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-6",
        view === "grid" &&
          (profile ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"),
      )}
    >
      {loading
        ? Array.from({ length: 6 }, (_, i) => (
            <Skeleton
              key={i}
              className={
                view === "grid" ? "h-72 rounded-sm" : "h-44 rounded-sm"
              }
            />
          ))
        : records.map((r) => (
            <RecordCard key={r.id} record={r} view={view} profile={profile} />
          ))}
      {!loading && !records.length && (
        <div className="col-span-full rounded-sm bg-muted p-10 text-center">
          <p className="text-lg font-semibold">
            아직 남겨진 독서 기록이 없어요.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            다른 검색어로 찾아보거나 첫 기록을 남겨보세요.
          </p>
        </div>
      )}
    </div>
  );
}
export function ListControls({
  title,
  view,
  setView,
  order,
  setOrder,
  sorting = true,
}: {
  title: string;
  view: "grid" | "list";
  setView: (v: "grid" | "list") => void;
  order?: string;
  setOrder?: (v: string) => void;
  sorting?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="section-title">{title}</h2>
      <div className="flex gap-2">
        {sorting && (
          <Select value={order} onValueChange={setOrder}>
            <SelectTrigger
              aria-label="독서 기록 정렬"
              className="min-w-0 flex-1 sm:w-44"
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
        )}
        <Button
          variant={view === "list" ? "default" : "outline"}
          className="flex-1 sm:flex-none"
          aria-pressed={view === "list"}
          onClick={() => setView("list")}
        >
          리스트
        </Button>
        <Button
          variant={view === "grid" ? "default" : "outline"}
          className="flex-1 sm:flex-none"
          aria-pressed={view === "grid"}
          onClick={() => setView("grid")}
        >
          그리드
        </Button>
      </div>
    </div>
  );
}
export function PageNumbers({
  page,
  total,
  onChange,
  pageSize = 12,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
  pageSize?: number;
}) {
  const count = Math.ceil(total / pageSize);
  if (count < 2) return null;
  const start = Math.max(1, Math.min(page - 1, count - 2));
  return (
    <Pagination className="py-3">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            disabled={page === 1}
            onClick={() => onChange(page - 1)}
          >
            이전
          </Button>
        </PaginationItem>
        {Array.from({ length: Math.min(3, count) }, (_, i) => start + i).map(
          (p) => (
            <PaginationItem key={p}>
              <Button
                variant={p === page ? "default" : "outline"}
                size="icon"
                aria-label={`${p}페이지`}
                aria-current={p === page ? "page" : undefined}
                onClick={() => onChange(p)}
              >
                {p}
              </Button>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <Button
            variant="ghost"
            disabled={page === count}
            onClick={() => onChange(page + 1)}
          >
            다음
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
export function useListState(initial: "grid" | "list" = "list") {
  const [view, setView] = useState(initial),
    [order, setOrder] = useState("desc"),
    [page, setPage] = useState(1);
  return {
    view,
    setView,
    order,
    setOrder: (v: string) => {
      setOrder(v);
      setPage(1);
    },
    page,
    setPage,
  };
}
