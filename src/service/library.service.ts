"use client";
import { useQuery } from "@tanstack/react-query";
import { BOOK_SUMMARY_KEY } from "@/constants/query-key.constants";
import {
  getBookSummaryList,
  getSearchBookSummaryList,
} from "@/repository/book.repository";
import { toBookSummaryItemModel } from "@/model/book/book.dto";
import type { BookSummaryItemDto } from "@/model/book/book.dto";
import { groupBooks, categoryKeyword } from "@/lib/records";

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
    queryFn: async () => {
      const params = { limit: 12, offset: (page - 1) * 12 };
      const result = keyword
        ? await getSearchBookSummaryList({
            ...params,
            keyword: type === "category" ? categoryKeyword(keyword) : keyword,
            type,
          })
        : await getBookSummaryList({
            ...params,
            order,
            category_id: category,
            user_id: userId,
          });
      return {
        total: result.total,
        records: result.list.map(toBookSummaryItemModel),
      };
    },
  });
}
export function useRecommendedRecords() {
  return useQuery({
    queryKey: [BOOK_SUMMARY_KEY, "monthly"],
    queryFn: async () => {
      const result = await getBookSummaryList({
        order: "desc",
        limit: 100,
        offset: 0,
      });
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
    queryFn: async () => {
      // shortcut: 도서별 집계 API가 생기면 전체 기록 조회를 서버 집계로 교체한다.
      const records: BookSummaryItemDto[] = [];
      let offset = 0;
      while (true) {
        const result = await getBookSummaryList({
          order: "desc",
          limit: 100,
          offset,
        });
        records.push(...result.list);
        if (!result.list.length || records.length >= result.total) break;
        offset += result.list.length;
      }
      return groupBooks(records.map(toBookSummaryItemModel));
    },
  });
}
