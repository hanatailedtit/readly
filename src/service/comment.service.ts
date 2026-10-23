import { COMMENT_KEY } from '@/constants/query-key.constants';
import { queryClient } from '@/lib/react-query';
import { BookSummaryItemModel } from '@/model/book/book.model';
import { toSummaryCommentListModel } from '@/model/comment/comment.dto';
import {
  createSummaryComment,
  deleteSummaryComment,
  getSummaryCommentList,
} from '@/repository/comment.repository';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useCreateSummaryCommentMutation = () => {
  return useMutation({
    mutationFn: createSummaryComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMMENT_KEY] });
    },
  });
};

export const useGetSummaryCommentListQuery = (
  summaryId: BookSummaryItemModel['id'],
) => {
  return useQuery({
    queryKey: [COMMENT_KEY, summaryId],
    queryFn: async () => {
      const data = await getSummaryCommentList(summaryId);
      return {
        total: data.length,
        list: toSummaryCommentListModel(data),
      };
    },
  });
};

export const useDeleteSummaryCommentMutation = () => {
  return useMutation({
    mutationFn: deleteSummaryComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMMENT_KEY] });
    },
  });
};
