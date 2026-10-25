import { COMMENT_KEY, BOOK_SUMMARY_KEY } from "@/constants/query-key.constants";
import { BookSummaryItemModel } from "@/model/book/book.model";
import { toSummaryCommentListModel } from "@/model/comment/comment.dto";
import {
  createSummaryComment,
  deleteSummaryComment,
  getSummaryCommentList,
} from "@/repository/comment.repository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateSummaryCommentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSummaryComment,
    onSuccess: async (_, { summary_id }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [COMMENT_KEY, summary_id] }),
        queryClient.invalidateQueries({
          queryKey: [BOOK_SUMMARY_KEY],
          refetchType: "none",
          predicate: (query) =>
            ["feed", "monthly", "book-records"].includes(
              String(query.queryKey[1]),
            ),
        }),
      ]);
    },
  });
};

export const useGetSummaryCommentListQuery = (
  summaryId: BookSummaryItemModel["id"],
) => {
  return useQuery({
    queryKey: [COMMENT_KEY, summaryId],
    enabled: Number.isInteger(summaryId) && summaryId > 0,
    queryFn: async ({ signal }) => {
      const data = await getSummaryCommentList(summaryId, signal);
      return {
        total: data.length,
        list: toSummaryCommentListModel(data),
      };
    },
  });
};

export const useDeleteSummaryCommentMutation = (summaryId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSummaryComment,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [COMMENT_KEY, summaryId] }),
        queryClient.invalidateQueries({
          queryKey: [BOOK_SUMMARY_KEY],
          refetchType: "none",
          predicate: (query) =>
            ["feed", "monthly", "book-records"].includes(
              String(query.queryKey[1]),
            ),
        }),
      ]);
    },
  });
};
