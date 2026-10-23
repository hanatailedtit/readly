import { readlyApiAxiosInstance } from '@/api/readly-api';
import { BookSummaryItemModel } from '@/model/book/book.model';
import {
  CreateSummaryCommentRequest,
  SummaryCommentItemDto,
} from '@/model/comment/comment.dto';

export const createSummaryComment = async (
  params: CreateSummaryCommentRequest,
) => {
  await readlyApiAxiosInstance().post('/comment/create', params);
};

export const getSummaryCommentList = async (id: BookSummaryItemModel['id']) => {
  const { data } = await readlyApiAxiosInstance().get<SummaryCommentItemDto[]>(
    '/comment/list',
    {
      params: {
        summary_id: id,
      },
    },
  );

  return data;
};

export const deleteSummaryComment = async (id: SummaryCommentItemDto['id']) => {
  await readlyApiAxiosInstance().delete('/comment/delete', { params: { id } });
};
