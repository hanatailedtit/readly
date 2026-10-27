import { transferStringToDate } from "@/utils/date.utils";
import { UserInfoDto } from "../user.dto";
import {
  BookCreatedRankModel,
  BookDetailSummaryModel,
  BookSummaryItemModel,
} from "./book.model";
export type SearchBookRequest = {
  query: string;
  display?: string;
  start?: string;
  sort?: "sim" | "date";
};

export type SearchBookResponse = {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: SearchBookItem[];
  meta?: {
    pageable_count: number;
    is_end: boolean;
  };
};

export type BookItemDto = Pick<
  BookSummaryItemDto,
  | "book_author"
  | "book_image"
  | "book_link"
  | "book_pubdate"
  | "book_publisher"
  | "book_title"
  | "isbn"
>;

export type SearchBookItem = {
  title: string;
  link: string;
  image: string;
  author: string;
  publisher: string;
  pubdate: string;
  isbn: string;
};

export type BookListRequest = {
  page_no?: number;
  page_size?: number;
  title?: string;
  author?: string;
};

export type BookListItemDto = {
  title: string;
  author: string;
  publisher: string;
  pubdate: string;
  image: string;
  isbn: string;
  link?: string;
};

export type BookListResponse = {
  items: BookListItemDto[];
  total_count: number;
  page_no: number;
};

export const toBookListItemModel = (item: BookListItemDto): SearchBookItem => {
  return {
    title: item.title,
    author: item.author ? item.author.replaceAll("^", ", ") : "",
    publisher: item.publisher || "",
    pubdate: item.pubdate || "",
    image: item.image || "",
    isbn: item.isbn || "",
    link: item.link || "",
  };
};

export const toSearchBookItemModel = (item: SearchBookResponse) => {
  const bookItem: SearchBookItem[] = item.items.map((item) => {
    return {
      author: item.author.replaceAll("^", ", "),
      image: item.image,
      isbn: item.isbn,
      link: item.link,
      pubdate: transferStringToDate(item.pubdate, "yyyyMMdd").toISOString(),
      publisher: item.publisher,
      title: item.title,
    };
  });
  return {
    ...item,
    items: bookItem,
  };
};

export type RecentBookDto = BookItemDto;

export const toRecentBookItemModel = (item: RecentBookDto): SearchBookItem => {
  return {
    author: item.book_author.replaceAll("^", ", "),
    image: item.book_image,
    isbn: item.isbn,
    link: item.book_link,
    pubdate: item.book_pubdate,
    publisher: item.book_publisher,
    title: item.book_title,
  };
};

export type BookCreatedRankDto = BookItemDto & { created_count: number };

export const toBookCreatedRankModel = (
  item: BookCreatedRankDto,
  index: number,
): BookCreatedRankModel => {
  return {
    author: item.book_author.replaceAll("^", ", "),
    image: item.book_image,
    link: item.book_link,
    title: item.book_title,
    count: item.created_count,
    rank: index + 1,
  };
};

export type CreateBookSummaryRequest = {
  content: string;
  bookInfo: SearchBookItem;
  startPage?: number;
  endPage?: number;
  category_id: number;
};

export type EditBookSummaryRequest = CreateBookSummaryRequest;

export type BookSummaryListRequest = {
  category_id?: BookCategoryDto["id"] | null;
  user_id?: UserInfoDto["id"] | null;
  order?: string;
  limit?: number;
  offset?: number;
  nextOffset?: number;
};

export type BookSummaryListResponse = {
  total: number;
  list: BookSummaryItemDto[];
  nextOffset: number | null;
};

export type BookSummaryItemDto = {
  id: number;
  contents: string;
  book_title: string;
  book_author: string;
  book_publisher: string;
  book_pubdate: string;
  view_count: number;
  like_count: number;
  user_id: string;
  created_at: string;
  book_image: string;
  book_link: string;
  start_page: number;
  end_page: number;
  user_name: string;
  user_image: string;
  is_my: boolean;
  category_id: number;
  category_name: string;
  comment_count: number;
  isbn: string;
};

export const toBookSummaryItemModel = (
  item: BookSummaryItemDto,
): BookSummaryItemModel => {
  return {
    bookImage: item.book_image,
    bookLink: item.book_link,
    bookPublisher: item.book_publisher,
    bookPubdate: item.book_pubdate,
    isbn: item.isbn,
    id: item.id,
    bookAuthor: item.book_author.replaceAll("^", ", "),
    bookTitle: item.book_title,
    content: item.contents,
    endPage: item.end_page,
    startPage: item.start_page,
    userId: item.user_id,
    userImage: item.user_image,
    userName: item.user_name,
    createAt: item.created_at,
    category: item.category_name,
    categoryId: item.category_id,
    likeCount: item.like_count,
    viewCount: item.view_count,
    commentCount: item.comment_count,
  };
};

export const toDetailBookSummaryModel = (
  item: BookSummaryItemDto,
): BookDetailSummaryModel => {
  return {
    ...toBookSummaryItemModel(item),
    bookImage: item.book_image,
    bookPubdate: item.book_pubdate,
    bookPublisher: item.book_publisher,
    bookLink: item.book_link,
    isMy: item.is_my,
    isbn: item.isbn,
  };
};
export type BookSummaryLikeCountResponse = {
  like_count: number;
  is_clicked: boolean;
};

export type BookCategoryDto = {
  created_at: string;
  id: number;
  name: string;
  summary_count: number;
};

export type SearchBookSummaryListRequest = {
  keyword: string;
  type: string;
  limit?: number;
  offset?: number;
};
