import {
  BOOK_CATEGORY_KEY,
  BOOK_INFO_KEY,
  BOOK_SEARCH_KEY,
  BOOK_SUMMARY_KEY,
  BOOK_SUMMARY_LIKE_KEY,
  BOOK_LIST_KEY,
  isRecordListQuery,
} from "@/constants/query-key.constants";
import { useGetUserMyInfoQuery } from "./user.service";
import { bookFromRecord } from "@/lib/records";
import {
  BookListRequest,
  BookSummaryItemDto,
  SearchBookRequest,
  SearchBookItem,
  toBookListItemModel,
  toDetailBookSummaryModel,
  toRecentBookItemModel,
  toSearchBookItemModel,
} from "@/model/book/book.dto";
import {
  addBookSummaryLikeCount,
  createBookSummary,
  deleteDetailBookSummary,
  editBookSummary,
  getBookList,
  getBookCategoryList,
  getBookSummaryLikeCount,
  getDetailBookSummary,
  getRecentBookList,
  searchBookList,
} from "@/repository/book.repository";
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const bookSearchOptions = (params: SearchBookRequest) => {
  const request = {
    ...params,
    query: params.query.trim(),
    display: params.display || "10",
    start: params.start || "1",
    sort: params.sort || "sim",
  };
  return queryOptions({
    queryKey: [BOOK_SEARCH_KEY, request],
    staleTime: 5 * 60_000,
    queryFn: async ({ signal }) =>
      toSearchBookItemModel(await searchBookList(request, signal)),
  });
};

export const useSearchBookQuery = (params: SearchBookRequest) => {
  return useQuery({
    ...bookSearchOptions(params),
    enabled: !!params.query.trim(),
    placeholderData: keepPreviousData,
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
          queryClient.setQueryData<SearchBookItem>(
            [BOOK_INFO_KEY, book.isbn],
            (cached) => cached ?? book,
          );
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
    enabled: Number.isSafeInteger(id) && id > 0,
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

export const useGetBookSummaryLikeCountQuery = (
  id: BookSummaryItemDto["id"],
) => {
  return useQuery({
    queryKey: [BOOK_SUMMARY_LIKE_KEY, id],
    enabled: Number.isSafeInteger(id) && id > 0,
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
          predicate: isRecordListQuery,
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
