import { readlyApiAxiosInstance } from "@/api/readly-api";
import {
  BookCategoryDto,
  BookCreatedRankDto,
  BookListRequest,
  BookListResponse,
  BookSummaryItemDto,
  BookSummaryLikeCountResponse,
  BookSummaryListRequest,
  BookSummaryListResponse,
  CreateBookSummaryRequest,
  EditBookSummaryRequest,
  RecentBookDto,
  SearchBookRequest,
  SearchBookResponse,
  SearchBookSummaryListRequest,
} from "@/model/book/book.dto";
import type { SearchBookItem } from "@/model/book/book.dto";
import { recordBookKey } from "@/lib/records";

export const searchBookList = async (
  params: SearchBookRequest,
  signal?: AbortSignal,
) => {
  const { data } = await readlyApiAxiosInstance().post<SearchBookResponse>(
    "/book/search",
    params,
    { signal },
  );
  return data;
};

export const getRecentBookList = async (signal?: AbortSignal) => {
  const { data } = await readlyApiAxiosInstance().get<RecentBookDto[]>(
    "/book/recent",
    { signal },
  );
  return data;
};

export const getBookList = async (
  params: BookListRequest = { page_no: 1, page_size: 20 },
  signal?: AbortSignal,
) => {
  const { data } = await readlyApiAxiosInstance().get<BookListResponse>(
    "/book/list",
    {
      params,
      signal,
    },
  );
  return {
    items: data?.items || [],
    total_count: data?.total_count || 0,
    page_no: data?.page_no || params.page_no || 1,
  };
};

export const getBookCreatedRank = async () => {
  const { data } =
    await readlyApiAxiosInstance().get<BookCreatedRankDto[]>(
      "/book/created-rank",
    );
  return data;
};

export const createBookSummary = async (params: CreateBookSummaryRequest) => {
  await readlyApiAxiosInstance().post("/book/summary/create", params);
};

export const getDetailBookSummary = async (
  id: BookSummaryItemDto["id"],
  signal?: AbortSignal,
) => {
  const { data } = await readlyApiAxiosInstance().get<BookSummaryItemDto>(
    "/book/summary",
    {
      params: {
        id,
      },
      signal,
    },
  );
  return data;
};

export const editBookSummary = async (
  params: EditBookSummaryRequest & { id: BookSummaryItemDto["id"] },
) => {
  await readlyApiAxiosInstance().put("/book/summary/edit", params);
};

export const deleteDetailBookSummary = async (id: BookSummaryItemDto["id"]) => {
  await readlyApiAxiosInstance().delete("/book/summary/delete", {
    params: {
      id,
    },
  });
};

export const getBookSummaryList = async (
  params: BookSummaryListRequest,
  signal?: AbortSignal,
) => {
  const { data } = await readlyApiAxiosInstance().get<
    BookSummaryListResponse | []
  >("/book/summary/list", {
    params,
    signal,
  });
  return Array.isArray(data) ? { total: 0, list: [], nextOffset: null } : data;
};

export const getBookSummaryLikeCount = async (
  id: BookSummaryItemDto["id"],
  signal?: AbortSignal,
) => {
  const { data } =
    await readlyApiAxiosInstance().get<BookSummaryLikeCountResponse>(
      "/book/summary/like-count",
      {
        params: {
          id,
        },
        signal,
      },
    );
  return data;
};

export const addBookSummaryLikeCount = async (
  params: Pick<BookSummaryItemDto, "id">,
) => {
  await readlyApiAxiosInstance().post("/book/summary/click-like", params);
};

export const getBookCategoryList = async (signal?: AbortSignal) => {
  const { data } = await readlyApiAxiosInstance().get<BookCategoryDto[]>(
    "/book/category-list",
    { signal },
  );
  return data;
};

export const getSearchBookSummaryList = async (
  params: SearchBookSummaryListRequest,
  signal?: AbortSignal,
) => {
  const { data } = await readlyApiAxiosInstance().get<
    BookSummaryListResponse | []
  >("/book/summary/search", { params, signal });
  return Array.isArray(data) ? { total: 0, list: [], nextOffset: null } : data;
};

export const getCatalogRecords = async (signal?: AbortSignal) => {
  const records: BookSummaryItemDto[] = [];
  const seen = new Set<number>();
  let offset = 0;
  while (true) {
    const result = await getBookSummaryList(
      { order: "desc", limit: 100, offset },
      signal,
    );
    let added = 0;
    for (const record of result.list) {
      if (seen.has(record.id)) continue;
      seen.add(record.id);
      records.push(record);
      added++;
    }
    if (!added || records.length >= result.total) return records;
    offset += result.list.length;
  }
};

export const getRecordsForBook = async (
  book: SearchBookItem,
  signal?: AbortSignal,
) => {
  const records: BookSummaryItemDto[] = [];
  const seen = new Set<number>();
  const key = recordBookKey(book);
  let offset = 0;
  while (true) {
    const page = await getSearchBookSummaryList(
      { type: "title", keyword: book.title, limit: 100, offset },
      signal,
    );
    let added = 0;
    for (const record of page.list) {
      if (seen.has(record.id)) continue;
      seen.add(record.id);
      added++;
      if (
        recordBookKey({
          isbn: record.isbn,
          title: record.book_title,
          author: record.book_author.replaceAll("^", ", "),
        }) === key
      )
        records.push(record);
    }
    // 검색 API의 total은 카테고리별 집계라 실제 페이지 길이로 종료한다.
    if (page.list.length < 100 || !added) return records;
    offset += page.list.length;
  }
};

export const getUserRecords = async (userId: string, signal?: AbortSignal) => {
  if (!userId) return [];
  const records: BookSummaryItemDto[] = [];
  const seen = new Set<number>();
  let offset = 0;
  // shortcut: 개인별 검색·도서 집계 API가 생기면 사용자 범위 일괄 조회를 대체한다.
  while (true) {
    const page = await getBookSummaryList(
      { user_id: userId, order: "desc", limit: 100, offset },
      signal,
    );
    let added = 0;
    for (const record of page.list) {
      if (seen.has(record.id)) continue;
      seen.add(record.id);
      added++;
      if (record.user_id === userId) records.push(record);
    }
    if (page.list.length < 100 || seen.size >= page.total || !added)
      return records;
    offset += page.list.length;
  }
};
