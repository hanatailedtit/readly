import UserProfile from '@/components/user/UserProfile/UserProfile';
import { Icon } from '@iconify/react/dist/iconify.js';
import CommonDivider from '@/components/ui/divider/CommonDivider';
import EllipsisText from '@/components/ui/text/EllipsisText/EllipsisText';
import { formatDateToString } from '@/utils/date.utils';
import Link from 'next/link';
import { useMemo } from 'react';
import BookCategoryChip from '../BookCategoryChip/BookCategoryChip';
import BookSummaryContent from '../BookSummaryContent/BookSummaryContent';

export type BookSummaryItemProps = {
  id: number;
  content: string;
  bookTitle: string;
  bookAuthor: string;
  userId: string;
  userImage: string;
  userName: string;
  startPage: number;
  endPage: number;
  createAt: string;
  category?: string;
  categoryId?: number;
  likeCount?: number;
  viewCount?: number;
  commentCount?: number;
};

export default function BookSummaryItem({
  id,
  content,
  bookAuthor,
  bookTitle,
  userId,
  userImage,
  userName,
  startPage,
  endPage,
  createAt,
  category,
  categoryId,
  likeCount,
  viewCount,
  commentCount,
}: BookSummaryItemProps) {
  const createAtFromFormat = useMemo(
    () => formatDateToString(new Date(createAt)),
    [createAt],
  );
  return (
    <Link
      href={`/summary/detail/${id}`}
      className="w-full border border-gray border-solid rounded-[16px] p-[16px] flex flex-col"
    >
      <div className="bg-light-gray p-[8px] rounded-[8px] ">
        <div className="overflow-hidden h-[120px]">
          <BookSummaryContent content={content} />
        </div>
      </div>
      <CommonDivider className="my-[8px]" />
      <div className="flex flex-col justify-between h-full">
        <div>
          <div>
            <EllipsisText text={bookTitle} fontSize={14} />
            <p className="text-md text-dark-gray">{bookAuthor}</p>
          </div>
          {startPage && endPage && (
            <div className="flex flex-row gap-x-[4px] text-sm text-dark-gray">
              <p>{startPage}p</p>
              <p>~</p>
              <p>{endPage}p</p>
            </div>
          )}
          <div className="mt-[4px]">
            {category && categoryId && (
              <BookCategoryChip text={category} value={String(categoryId)} />
            )}
          </div>
        </div>
        <div className="flex flex-col items-start mt-[16px]">
          <UserProfile
            userImage={userImage}
            userName={userName}
            userId={userId}
          />
        </div>
      </div>
      <div className="flex flex-row justify-between gap-x-[8px] mt-[8px]">
        <p className="text-dark-gray text-md">{createAtFromFormat}</p>
        <div className="flex flex-row gap-x-[4px]">
          <div className="flex flex-row gap-x-[4px] items-center">
            <Icon icon="lets-icons:view-alt-fill" />
            <p className="text-md">{viewCount}</p>
          </div>
          <div className="flex flex-row gap-x-[4px] items-center">
            <Icon icon="mdi:heart" height={14} />
            <p className="text-md">{likeCount}</p>
          </div>
          <div className="flex flex-row gap-x-[4px] items-center">
            <Icon icon="basil:comment-solid" height={14} />
            <p className="text-md">{commentCount}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
