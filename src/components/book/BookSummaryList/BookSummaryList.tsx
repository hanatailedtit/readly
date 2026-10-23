import { useObserverTarget } from '@/hooks/useObserverTarget';
import BookSummaryItem from '../BookSummaryItem/BookSummaryItem';
import { BookSummaryItemModel } from '@/model/book/book.model';
import BookSummaryListSkeleton from '@/components/skeleton/book/BookSummaryListSkeleton';

type BookSummaryListProps = {
  data: BookSummaryItemModel[] | null;
  isFetching: boolean;
  fetchNextPage: () => void;
};

export default function BookSummaryList({
  data,
  isFetching,
  fetchNextPage,
}: BookSummaryListProps) {
  const { observerTarget } = useObserverTarget({ callback: fetchNextPage });

  return (
    <div>
      {isFetching ? (
        <BookSummaryListSkeleton />
      ) : (
        <div>
          {data && data.length > 0 ? (
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 gap-x-[16px] gap-y-[16px] w-full">
              {data.map((item, index) => (
                <BookSummaryItem
                  {...item}
                  key={`${JSON.stringify(item)}-${index}`}
                />
              ))}
            </div>
          ) : (
            <div className="w-full">
              <p className="text-dark-gray text-center">
                데이터가가 존재하지 않습니다.
              </p>
            </div>
          )}
        </div>
      )}
      {observerTarget()}
    </div>
  );
}
