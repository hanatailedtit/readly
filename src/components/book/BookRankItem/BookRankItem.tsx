import { BookCreatedRankModel } from '@/model/book/book.model';
import Image from 'next/image';
import Link from 'next/link';
import EllipsisText from '@/components/ui/text/EllipsisText/EllipsisText';

export type BookRankItemProps = BookCreatedRankModel;

export default function BookRankItem({
  author,
  count,
  image,
  link,
  title,
}: BookRankItemProps) {
  return (
    <Link
      href={link}
      target="_blank"
      className="flex flex-row items-center gap-x-[8px] w-full"
    >
      <div className="md:hover:bg-light-gray rounded-[8px] p-[16px] flex flex-row items-center gap-x-[16px] w-full transition-colors">
        <Image
          src={image}
          alt="book-image"
          width={100}
          height={145}
          className="book-image"
        />
        <div>
          <EllipsisText text={title} lineClamp={3} />
          <p className="text-md text-dark-gray">{author}</p>
          <p className="text-md font-bold">{count}개 등록</p>
        </div>
      </div>
    </Link>
  );
}
