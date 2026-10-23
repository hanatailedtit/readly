import { useGetBookCreatedRankQuery } from '@/service/book.service';
import BookRankItem from '../BookRankItem/BookRankItem';
import BookRankListSkeleton from '@/components/skeleton/book/BookRankListSkeleton';

export default function BookRankList() {
  const { data, isLoading } = useGetBookCreatedRankQuery();
  return (
    <div className="flex flex-col">
      <p className="text-lg font-bold mb-[16px]">등록한 책 랭킹</p>
      {data && !isLoading ? (
        data?.map((item) => <BookRankItem {...item} key={item.title} />)
      ) : (
        <BookRankListSkeleton />
      )}
    </div>
  );
}
