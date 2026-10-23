import { useAuth } from '@/hooks/useAuth';
import { SummaryCommentModel } from '@/model/comment/comment.model';
import {
  useCreateSummaryCommentMutation,
  useDeleteSummaryCommentMutation,
  useGetSummaryCommentListQuery,
} from '@/service/comment.service';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import SummaryCommentInput from '../SummaryCommentInput/SummaryCommentInput';
import SummaryCommentItem from '../SummaryCommentItem/SummaryCommentItem';

export default function SummaryComment() {
  const [comment, setComment] = useState('');
  const [replyComment, setReplyComment] = useState('');
  const { mutateAsync: createMutate, isPending } =
    useCreateSummaryCommentMutation();
  const { mutate: deleteMutate, isPending: isDeletePending } =
    useDeleteSummaryCommentMutation();
  const { id } = useParams();
  const { data } = useGetSummaryCommentListQuery(Number(id));

  const { isLoggedIn } = useAuth();

  const clickCommentInputButton = async (commentId?: number) => {
    await createMutate({
      comment,
      comment_id: commentId || null,
      summary_id: Number(id),
    });
  };

  const clickReplyCommentInputButton = async (commentId?: number) => {
    await createMutate({
      comment: replyComment,
      comment_id: commentId || null,
      summary_id: Number(id),
    });
  };

  const clickDeleteCommentButton = (commentId: SummaryCommentModel['id']) => {
    deleteMutate(commentId);
  };

  return (
    <div className="flex flex-col gap-y-[32px] w-full">
      {data && (
        <div>
          <p className="text-lg font-bold">댓글 {data?.total} 개</p>
          {data.list.map((item, index) => (
            <div key={`${JSON.stringify(item)}-${index}`}>
              <SummaryCommentItem
                value={replyComment}
                comment={item.comment}
                createdAt={item.createdAt}
                isMy={item.isMy}
                userImage={item.userImage}
                userName={item.userName}
                id={item.id}
                userId={item.userId}
                clickInputButton={clickReplyCommentInputButton}
                setCommentValue={setReplyComment}
                isPending={isPending}
                clickDeleteButton={clickDeleteCommentButton}
                isDeletePending={isDeletePending}
              />
              <div className="ml-[16px] bg-light-blue rounded-[16px]">
                {item.reply &&
                  item.reply.map((item) => (
                    <SummaryCommentItem
                      comment={item.comment}
                      createdAt={item.createdAt}
                      isMy={item.isMy}
                      userImage={item.userImage}
                      userName={item.userName}
                      id={item.id}
                      userId={item.userId}
                      key={`${JSON.stringify(item)}-${index}`}
                      isReply
                      clickDeleteButton={clickDeleteCommentButton}
                      isDeletePending={isDeletePending}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <SummaryCommentInput
        value={comment}
        setCommentValue={setComment}
        clickInputButton={clickCommentInputButton}
        disabled={!isLoggedIn || isPending}
        isPending={isPending}
      />
    </div>
  );
}
