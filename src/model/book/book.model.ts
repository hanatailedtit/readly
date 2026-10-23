import { BookSummaryItemProps } from '@/components/book/BookSummaryItem/BookSummaryItem';

export type BookSummaryItemModel = BookSummaryItemProps;

export type BookDetailSummaryModel = BookSummaryItemProps & {
  bookImage: string;
  bookPubdate: string;
  bookPublisher: string;
  bookLink: string;
  isMy: boolean;
  isbn: string;
};

export type SearchBookItemModel = {
  title: string;
  author: string;
  publisher: string;
  pubdate: string;
  image: string;
  isbn?: string;
};

export type BookCreatedRankModel = {
  image: string;
  title: string;
  author: string;
  count: number;
  rank: number;
  link: string;
};
