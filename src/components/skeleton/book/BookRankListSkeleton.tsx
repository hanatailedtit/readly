import BookRankItemSkeleton from './BookRankItemSkeleton';

export default function BookRankListSkeleton() {
  return (
    <div className="flex flex-col w-full">
      <BookRankItemSkeleton />
      <BookRankItemSkeleton />
      <BookRankItemSkeleton />
    </div>
  );
}
