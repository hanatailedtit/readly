import UserProfile from '@/components/user/UserProfile/UserProfile';
import { COLORS } from '@/constants/color.constants';
import { useAuth } from '@/hooks/useAuth';
import { SummaryCommentItemModel } from '@/model/comment/comment.model';
import CommonButton from '@/components/ui/button/CommonButton/CommonButton';
import { formatDateToString } from '@/utils/date.utils';
import { useMemo, useState } from 'react';
import SummaryCommentInput from '../SummaryCommentInput/SummaryCommentInput';

export type SummaryCommentItemProps = SummaryCommentItemModel & {
  isReply?: boolean;
  isPending?: boolean;
  isDeletePending?: boolean;
  value?: string;
  setCommentValue?: (comment: string) => void;
  clickInputButton?: (commentId?: number) => Promise<void>;
  clickDeleteButton?: (commentId: number) => void;
};

export default function SummaryCommentItem({
  comment,
  createdAt,
  userImage,
  userName,
  id,
  isMy,
  isReply,
  isPending,
  isDeletePending,
  userId,
  value,
  setCommentValue,
  clickInputButton,
  clickDeleteButton,
}: SummaryCommentItemProps) {
  const [isOpenInput, setIsOpenInput] = useState(false);
  const replyButtonText = useMemo(
    () => (isOpenInput ? '닫기' : '답글 달기'),
    [isOpenInput],
  );
  const { isLoggedIn } = useAuth();

  const clickReplyButton = () => {
    setIsOpenInput(!isOpenInput);
  };

  const clickCommentDeleteButton = () => {
    if (!clickDeleteButton) return;
    clickDeleteButton(id);
  };
  return (
    <div className="flex flex-col gap-y-[16px] p-[16px]">
      <p className="text-md text-dark-gray">
        {formatDateToString(new Date(createdAt), 'yyyy.MM.dd HH:mm')}
      </p>
      <div className="whitespace-break-spaces	break-all">{comment}</div>
      <div className="flex flex-row gap-x-[16px]">
        <UserProfile
          userId={userId}
          userImage={userImage}
          userName={userName}
        />
        {isLoggedIn && !isReply && (
          <CommonButton className="text-[12px]" onClick={clickReplyButton}>
            {replyButtonText}
          </CommonButton>
        )}
        {isMy && (
          <div className="flex flex-row gap-x-[8px]">
            {/* <CommonButton text="수정" fontSize={12} padding="2px 8px" /> */}
            <CommonButton
              className="text-[12px] px-[8px] py-[2px]"
              onClick={clickCommentDeleteButton}
              isLoading={isDeletePending}
              disabled={isDeletePending}
              loadingColor={COLORS.white}
              loadingWidth={20}
              variant="red"
            >
              삭제
            </CommonButton>
          </div>
        )}
      </div>
      {isOpenInput &&
        setCommentValue &&
        typeof value === 'string' &&
        clickInputButton && (
          <SummaryCommentInput
            isPending={isPending}
            value={value}
            setCommentValue={setCommentValue}
            clickInputButton={() => clickInputButton(id)}
          />
        )}
    </div>
  );
}
