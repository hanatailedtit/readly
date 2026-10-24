"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGetBookCategoryListQuery } from "@/service/book.service";
import {
  useRecordFeed,
  useRecommendedRecords,
} from "@/service/library.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RecordCard } from "./record-card";
import {
  ListControls,
  RecordGrid,
  LoadError,
  useListState,
  PageNumbers,
} from "./record-list";
export function RecordDirectory() {
  const params = useSearchParams(),
    list = useListState(),
    [category, setCategory] = useState<number | undefined>(
      Number(params.get("category_id")) || undefined,
    ),
    [text, setText] = useState(params.get("keyword") || ""),
    [keyword, setKeyword] = useState(params.get("keyword") || ""),
    [type, setType] = useState(params.get("type") || "title"),
    [recommendation, setRecommendation] = useState(0);
  const query = useRecordFeed({
      page: list.page,
      order: list.order,
      category,
      keyword,
      type,
    }),
    { data: categories } = useGetBookCategoryListQuery(),
    recommended = useRecommendedRecords();
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="page-title">독서 기록</h1>
        <p className="text-muted-foreground">
          다른 독자의 생각에서, 다음에 읽을 책을 발견해보세요.
        </p>
      </div>
      <form
        className="grid gap-4 sm:grid-cols-[208px_1fr_160px] sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          setKeyword(text.trim());
          list.setPage(1);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="search-type">검색 범위</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="search-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">책 제목</SelectItem>
              <SelectItem value="author">작가</SelectItem>
              <SelectItem value="category">카테고리</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="record-search">독서 기록 검색</Label>
          <Input
            id="record-search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="책 제목이나 작가, 카테고리를 검색하세요"
          />
        </div>
        <Button type="submit">검색</Button>
      </form>
      {
        <section className="space-y-4 bg-muted p-4 sm:p-6">
          <h2 className="section-title">이달의 추천 독서 기록</h2>
          <p className="text-sm text-muted-foreground">
            서로 다른 시선으로 읽는 한 권의 책 · {new Date().getMonth() + 1}월의
            기록
          </p>
          {recommended.isError ? (
            <LoadError retry={recommended.refetch} />
          ) : recommended.isLoading ? (
            <p className="py-8 text-center text-muted-foreground">
              추천 기록을 불러오고 있어요.
            </p>
          ) : !recommended.data?.length ? (
            <p className="py-8 text-center text-muted-foreground">
              이달의 첫 독서 기록을 기다리고 있어요.
            </p>
          ) : (
            <>
              <div className="hidden gap-6 md:grid md:grid-cols-3">
                {recommended.data.map((r) => (
                  <RecordCard key={r.id} record={r} recommended />
                ))}
              </div>
              <div className="space-y-4 md:hidden">
                {recommended.data[recommendation % recommended.data.length] && (
                  <RecordCard
                    record={
                      recommended.data[
                        recommendation % recommended.data.length
                      ]!
                    }
                    recommended
                  />
                )}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setRecommendation(
                        (i) =>
                          (i - 1 + recommended.data!.length) %
                          recommended.data!.length,
                      )
                    }
                  >
                    이전
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {(recommendation % recommended.data.length) + 1} /{" "}
                    {recommended.data.length}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setRecommendation(
                        (i) => (i + 1) % recommended.data!.length,
                      )
                    }
                  >
                    다음
                  </Button>
                </div>
              </div>
            </>
          )}
        </section>
      }
      <section className="space-y-6">
        <ListControls
          title={
            keyword
              ? `“${keyword}” 검색 결과 ${query.data?.total || 0}건`
              : `전체 독서 기록 ${query.data?.total || 0}건`
          }
          {...list}
          sorting={!keyword}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={!category ? "default" : "outline"}
            onClick={() => {
              setCategory(undefined);
              setKeyword("");
              setText("");
              list.setPage(1);
            }}
          >
            전체
          </Button>
          {categories?.map((c) => (
            <Button
              key={c.id}
              size="sm"
              variant={category === c.id ? "default" : "outline"}
              onClick={() => {
                setCategory(c.id);
                setKeyword("");
                setText("");
                list.setPage(1);
              }}
            >
              {c.name}
            </Button>
          ))}
        </div>
        {query.isError ? (
          <LoadError retry={query.refetch} />
        ) : (
          <RecordGrid
            records={query.data?.records || []}
            loading={query.isLoading}
            view={list.view}
          />
        )}
        <PageNumbers
          page={list.page}
          total={query.data?.total || 0}
          onChange={list.setPage}
        />
      </section>
    </div>
  );
}
