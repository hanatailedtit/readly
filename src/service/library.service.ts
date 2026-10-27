"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BOOK_SUMMARY_KEY,
  BOOK_INFO_KEY,
} from "@/constants/query-key.constants";
import {
  getBookSummaryList,
  getSearchBookSummaryList,
  getRecordsForBook,
  searchBookList,
  getUserRecords,
} from "@/repository/book.repository";
import {
  toBookSummaryItemModel,
  toSearchBookItemModel,
} from "@/model/book/book.dto";
import type { SearchBookItem, BookSummaryItemDto } from "@/model/book/book.dto";
import {
  groupBooks,
  categoryKeyword,
  bookFromRecord,
  type CatalogBook,
} from "@/lib/records";

export function useProfileRecords(userId: string) {
  return useQuery({
    queryKey: [BOOK_SUMMARY_KEY, "profile", userId],
    enabled: !!userId,
    staleTime: 60_000,
    queryFn: async ({ signal }) =>
      (await getUserRecords(userId, signal)).map(toBookSummaryItemModel),
  });
}

export function useRecordFeed({
  page = 1,
  order = "desc",
  category,
  keyword = "",
  type = "title",
  userId,
}: {
  page?: number;
  order?: string;
  category?: number;
  keyword?: string;
  type?: string;
  userId?: string;
} = {}) {
  return useQuery({
    queryKey: [
      BOOK_SUMMARY_KEY,
      "feed",
      page,
      order,
      category,
      keyword,
      type,
      userId,
    ],
    queryFn: async ({ signal }) => {
      const params = { limit: 12, offset: (page - 1) * 12 };
      const result = keyword
        ? await getSearchBookSummaryList(
            {
              ...params,
              keyword: type === "category" ? categoryKeyword(keyword) : keyword,
              type,
            },
            signal,
          )
        : await getBookSummaryList(
            {
              ...params,
              order,
              category_id: category,
              user_id: userId,
            },
            signal,
          );
      return {
        total: result.total,
        records: result.list.map(toBookSummaryItemModel),
      };
    },
  });
}
export function useRecommendedRecords() {
  return useQuery({
    queryKey: [
      BOOK_SUMMARY_KEY,
      "monthly",
      new Date().getFullYear(),
      new Date().getMonth(),
    ],
    queryFn: async ({ signal }) => {
      const result = await getBookSummaryList(
        {
          order: "desc",
          limit: 100,
          offset: 0,
        },
        signal,
      );
      const now = new Date();
      return result.list
        .filter((item) => {
          const d = new Date(item.created_at);
          return (
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth()
          );
        })
        .sort((a, b) => b.like_count - a.like_count)
        .slice(0, 3)
        .map(toBookSummaryItemModel);
    },
  });
}
export function useBookCatalog() {
  return useQuery({
    queryKey: [BOOK_SUMMARY_KEY, "catalog"],
    staleTime: 60_000,
    queryFn: async ({ signal }) => {
      // shortcut: 도서별 집계 API가 생기면 전체 기록 조회를 서버 집계로 교체한다.
      const records: BookSummaryItemDto[] = [];
      let offset = 0;
      while (true) {
        const result = await getBookSummaryList(
          {
            order: "desc",
            limit: 100,
            offset,
          },
          signal,
        );
        records.push(...result.list);
        if (!result.list.length || records.length >= result.total) break;
        offset += result.list.length;
      }
      return groupBooks(records.map(toBookSummaryItemModel));
    },
  });
}

export function useBookInfo(isbn: string | null) {
  const client = useQueryClient();
  const catalogState = client.getQueryState<CatalogBook[]>([
    BOOK_SUMMARY_KEY,
    "catalog",
  ]);
  const known = catalogState?.data?.find(
    (book) => book.isbn === isbn || book.title === isbn,
  );
  return useQuery({
    queryKey: [BOOK_INFO_KEY, isbn],
    enabled: !!isbn,
    staleTime: 30 * 60_000,
    initialData: known?.records[0]
      ? bookFromRecord(known.records[0])
      : undefined,
    initialDataUpdatedAt: catalogState?.dataUpdatedAt,
    queryFn: async ({ signal }) => {
      const result = toSearchBookItemModel(
        await searchBookList({ query: isbn! }, signal),
      );
      return (
        result.items.find(
          (book) =>
            book.isbn === isbn ||
            book.isbn.split(" ").includes(isbn!) ||
            book.title === isbn,
        ) ?? null
      );
    },
  });
}
export function useBookRecords(book?: SearchBookItem) {
  const client = useQueryClient();
  const catalogState = client.getQueryState<CatalogBook[]>([
    BOOK_SUMMARY_KEY,
    "catalog",
  ]);
  const known = catalogState?.data?.find(
    (item) => item.isbn === book?.isbn && item.title === book?.title,
  );
  return useQuery({
    queryKey: [
      BOOK_SUMMARY_KEY,
      "book-records",
      book?.isbn,
      book?.title,
      book?.author,
    ],
    enabled: !!book,
    staleTime: 60_000,
    initialData: known?.records,
    initialDataUpdatedAt: catalogState?.dataUpdatedAt,
    queryFn: async ({ signal }) =>
      (await getRecordsForBook(book!, signal)).map(toBookSummaryItemModel),
  });
}
