import { BookSummaryItemDto } from '../book/book.dto';
import { UserInfoDto } from '../user.dto';
import { SummaryCommentModel } from './comment.model';

export type CreateSummaryCommentRequest = {
  comment: string;
  summary_id: BookSummaryItemDto['id'];
  comment_id: number | null;
};

export type SummaryCommentItemDto = {
  id: number;
  comment: string;
  summary_id: BookSummaryItemDto['id'];
  comment_id: number | null;
  user_id: UserInfoDto['id'];
  user_image: UserInfoDto['profile_image'];
  user_name: UserInfoDto['nickname'];
  created_at: string;
  is_my: boolean;
};

export const toSummaryCommentModel = (
  item: SummaryCommentItemDto,
): SummaryCommentModel => {
  return {
    comment: item.comment,
    createdAt: item.created_at,
    id: item.id,
    userImage: item.user_image,
    userName: item.user_name,
    isMy: item.is_my,
    userId: item.user_id,
  };
};

export const toSummaryCommentListModel = (
  list: SummaryCommentItemDto[],
): SummaryCommentModel[] => {
  const commentList = list.filter((item) => !item.comment_id);
  return commentList.map((item) => {
    const id = item.id;
    const currentReply = list.filter((item) => item.comment_id === id);
    return {
      ...toSummaryCommentModel(item),
      reply: currentReply
        ? currentReply.map((item) => toSummaryCommentModel(item))
        : undefined,
    };
  });
};
