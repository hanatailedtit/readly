import {
  BOOK_CATEGORY_KEY,
  BOOK_INFO_KEY,
  BOOK_SEARCH_KEY,
  BOOK_RANK_KEY,
  BOOK_SUMMARY_KEY,
  BOOK_SUMMARY_LIKE_KEY,
  BOOK_LIST_KEY,
} from "@/constants/query-key.constants";
import { useGetUserMyInfoQuery } from "./user.service";
import { bookFromRecord } from "@/lib/records";
import {
  BookListRequest,
  BookSummaryItemDto,
  BookSummaryListRequest,
  SearchBookRequest,
  SearchBookResponse,
  SearchBookSummaryListRequest,
  toBookCreatedRankModel,
  toBookListItemModel,
  toBookSummaryItemModel,
  toDetailBookSummaryModel,
  toRecentBookItemModel,
  toSearchBookItemModel,
} from "@/model/book/book.dto";
import {
  addBookSummaryLikeCount,
  createBookSummary,
  deleteDetailBookSummary,
  editBookSummary,
  getBookCreatedRank,
  getBookList,
  getBookSummaryLikeCount,
  getDetailBookSummary,
  getRecentBookList,
  getSearchBookSummaryList,
  searchBookList,
} from "@/repository/book.repository";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getBookCategoryList,
  getBookSummaryList,
} from "./../repository/book.repository";

export const useSearchBookMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<SearchBookResponse, Error, SearchBookRequest>({
    mutationFn: (params) => {
      const request = {
        ...params,
        query: params.query.trim(),
        display: params.display || "10",
        start: params.start || "1",
        sort: params.sort || "sim",
      };
      return queryClient.fetchQuery({
        queryKey: [BOOK_SEARCH_KEY, request],
        staleTime: 5 * 60_000,
        queryFn: async ({ signal }) =>
          toSearchBookItemModel(await searchBookList(request, signal)),
      });
    },
    onSuccess: (result) => {
      for (const book of result.items)
        queryClient.setQueryData([BOOK_INFO_KEY, book.isbn], book);
    },
  });
};

export const useGetRecentBookListQuery = () => {
  const { data: user } = useGetUserMyInfoQuery();
  return useQuery({
    queryKey: [BOOK_SUMMARY_KEY, "recent", user?.id],
    enabled: !!user,
    queryFn: async ({ signal }) => {
      const data = await getRecentBookList(signal);
      return data.map((item) => toRecentBookItemModel(item));
    },
    staleTime: 60_000,
  });
};

export const useGetBookListQuery = (
  params?: BookListRequest,
  options?: { enabled?: boolean },
) => {
  const queryClient = useQueryClient();
  const pageNo = params?.page_no ?? 1;
  const pageSize = params?.page_size ?? 20;
  const title = params?.title ?? "";
  const author = params?.author ?? "";

  return useQuery({
    queryKey: [BOOK_LIST_KEY, pageNo, pageSize, title, author],
    enabled: options?.enabled ?? true,
    queryFn: async ({ signal }) => {
      const data = await getBookList(
        {
          page_no: pageNo,
          page_size: pageSize,
          title: title || undefined,
          author: author || undefined,
        },
        signal,
      );
      const items = data.items.map(toBookListItemModel);
      for (const book of items) {
        if (book.isbn) {
          queryClient.setQueryData([BOOK_INFO_KEY, book.isbn], book);
        }
      }
      return {
        ...data,
        items,
      };
    },
    staleTime: 60_000,
  });
};

export const useGetBookCreatedRankQuery = () => {
  return useQuery({
    queryKey: [BOOK_RANK_KEY],
    queryFn: async () => {
      const data = await getBookCreatedRank();
      return data.map((item, index) => toBookCreatedRankModel(item, index));
    },
    staleTime: 60_000,
  });
};

export const useCreateBookSummaryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBookSummary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOK_SUMMARY_KEY] });
    },
  });
};

export const useGetDetailBookSummaryQuery = (id: BookSummaryItemDto["id"]) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [BOOK_SUMMARY_KEY, id],
    enabled: Number.isInteger(id) && id > 0,
    refetchOnWindowFocus: false,
    queryFn: async ({ signal }) => {
      const data = await getDetailBookSummary(id, signal);
      const record = toDetailBookSummaryModel(data);
      queryClient.setQueryData(
        [BOOK_INFO_KEY, record.isbn || record.bookTitle],
        bookFromRecord(record),
      );
      return record;
    },
    staleTime: 60_000,
  });
};

export const useEditBookSummaryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editBookSummary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOK_SUMMARY_KEY] });
    },
  });
};

export const useDeleteDetailBookSummaryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDetailBookSummary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOK_SUMMARY_KEY] });
    },
  });
};

export const useGetBookSummaryListQuery = (params: BookSummaryListRequest) => {
  return useInfiniteQuery({
    queryKey: [
      BOOK_SUMMARY_KEY,
      params.user_id,
      params.category_id,
      params.order,
      params.limit,
    ],
    queryFn: async ({ pageParam = 0, signal }) => {
      const { total, list, nextOffset } = await getBookSummaryList(
        {
          ...params,
          offset: pageParam * Number(params.limit || 16),
        },
        signal,
      );

      return {
        total,
        data: list.map((item) => toBookSummaryItemModel(item)),
        nextOffset,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    staleTime: 60_000,
  });
};

export const useGetBookSummaryLikeCountQuery = (
  id: BookSummaryItemDto["id"],
) => {
  return useQuery({
    queryKey: [BOOK_SUMMARY_LIKE_KEY, id],
    enabled: Number.isInteger(id) && id > 0,
    queryFn: ({ signal }) => getBookSummaryLikeCount(id, signal),
  });
};

export const useAddBookSummaryLikeCountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBookSummaryLikeCount,
    onSuccess: async (_, { id }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [BOOK_SUMMARY_LIKE_KEY, id],
        }),
        queryClient.invalidateQueries({
          queryKey: [BOOK_SUMMARY_KEY],
          refetchType: "none",
          predicate: (query) =>
            ["feed", "monthly", "book-records", "profile"].includes(
              String(query.queryKey[1]),
            ),
        }),
      ]);
    },
  });
};

export const useGetBookCategoryListQuery = () => {
  return useQuery({
    queryKey: [BOOK_CATEGORY_KEY],
    staleTime: 10 * 60_000,
    queryFn: ({ signal }) => getBookCategoryList(signal),
  });
};

export const useGetSearchBookSummaryListQuery = (
  params: SearchBookSummaryListRequest,
) => {
  return useInfiniteQuery({
    queryKey: [
      BOOK_SUMMARY_KEY,
      "search-infinite",
      params.type,
      params.keyword,
      params.limit,
    ],
    queryFn: async ({ pageParam = 0, signal }) => {
      const { total, list, nextOffset } = await getSearchBookSummaryList(
        {
          ...params,
          offset: pageParam * Number(params.limit || 16),
        },
        signal,
      );

      return {
        total,
        data: list.map((item) => toBookSummaryItemModel(item)),
        nextOffset,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    staleTime: 60_000,
  });
};
