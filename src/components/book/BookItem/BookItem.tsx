import { formatDateToString } from '@/utils/date.utils';
import { parseDomSizeValue } from '@/utils/string.utils';
import { cva } from 'class-variance-authority';
import Image from 'next/image';
import { useMemo } from 'react';

type BookItemProps = {
  title: string;
  author: string;
  publisher: string;
  pubdate: string;
  image?: string;
  link?: string;
  isbn?: string;
  isSelected?: boolean;
  imageWidth?: string | number;
  cursor?: 'default' | 'pointer';
  isWide?: boolean;
  clickItem?: (isbn: string) => void;
};

const bookItemVariants = cva(
  [
    'p-[8px]',
    'rounded-[8px]',
    'w-full',
    'h-full',
    'flex',
    'gap-x-[16px]',
    'md:hover:bg-light-gray',
    'transition-all',
  ],
  {
    variants: {
      selected: {
        true: 'bg-highlight',
        false: 'bg-white',
      },
      wide: {
        true: 'flex-row',
        false: 'flex-col',
      },
    },
    defaultVariants: {
      selected: false,
      wide: false,
    },
  },
);

export default function BookItem({
  title,
  author,
  publisher,
  pubdate,
  image,
  link,
  isbn,
  isSelected,
  imageWidth = '100%',
  cursor = 'pointer',
  isWide,
  clickItem,
}: BookItemProps) {
  const handleClickItem = () => {
    if (clickItem && isbn) {
      clickItem(isbn);
      return;
    }
    if (link) window.open(link, '_blank');
  };

  const pubdateFromFormat = useMemo(() => {
    return formatDateToString(new Date(pubdate));
  }, [pubdate]);

  return (
    <div
      className={bookItemVariants({ selected: isSelected, wide: isWide })}
      style={{
        cursor,
      }}
      onClick={handleClickItem}
    >
      <Image
        src={image || ''}
        alt="book-image"
        width={100}
        height={132}
        className="h-auto"
        style={{ width: parseDomSizeValue(imageWidth) }}
      />
      <div className="py-[8px] flex flex-col gap-y-[8px]">
        <p className="text-md font-bold leading-5">{title}</p>
        <p className="text-sm">{author}</p>
        <p className="text-sm text-dark-gray">{publisher}</p>
        <p className="text-sm text-dark-gray">{pubdateFromFormat}</p>
      </div>
    </div>
  );
}
