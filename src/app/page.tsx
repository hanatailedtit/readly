"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRecordFeed } from "@/service/library.service";
import {
  ListControls,
  RecordGrid,
  LoadError,
  useListState,
  PageNumbers,
} from "@/components/records/record-list";
export default function Home() {
  const list = useListState("grid"),
    query = useRecordFeed({ page: list.page, order: list.order });
  return (
    <div className="space-y-8">
      <section
        id="about"
        className="grid items-center gap-8 rounded-[20px] bg-muted p-6 sm:p-8 lg:grid-cols-[1.25fr_1fr]"
      >
        <div className="space-y-6">
          <p className="text-sm font-semibold text-muted-foreground">
            읽고 남은 마음을 모으는 곳
          </p>
          <h1 className="font-display text-[28px] font-bold leading-[1.5] sm:text-[42px]">
            읽고 난 뒤에도,
            <br />
            이야기는 계속되니까.
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            좋아하는 문장부터 오래 남은 생각까지.
            <br />
            나의 기록이 누군가의 다음 책이 됩니다.
          </p>
          <p className="text-sm text-muted-foreground">
            책을 고르고 · 마음을 남기고 · 서로를 읽어요
          </p>
        </div>
        <Image
          src="/brand/reading-illustration.svg"
          alt="펼친 책에 담긴 독서 기록"
          width={460}
          height={300}
          priority
          className="mx-auto h-auto w-full max-w-[460px]"
        />
      </section>
      <section className="flex flex-col gap-4 rounded-sm border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold sm:text-xl">
            지금 독서 기록을 남겨보세요
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            한 줄의 감상도 좋아요. 오늘 읽은 책에서 시작해보세요.
          </p>
        </div>
        <Button asChild className="sm:min-w-[168px]">
          <Link href="/summary/create">기록 남기기</Link>
        </Button>
      </section>
      <section className="space-y-6">
        <ListControls title="함께 읽는 독서 기록" {...list} />
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
        <Button variant="outline" asChild className="w-full">
          <Link href="/records">독서 기록 전체 보기</Link>
        </Button>
      </section>
    </div>
  );
}
