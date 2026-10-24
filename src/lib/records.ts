import type { SearchBookItem, BookSummaryItemDto } from "@/model/book/book.dto";
import type { BookSummaryItemModel } from "@/model/book/book.model";
export function plainText(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}
export function recordTitle(
  record: Pick<BookSummaryItemModel, "content" | "bookTitle">,
) {
  const first = record.content.match(
    /<(?:h[1-6]|p)[^>]*>([\s\S]*?)<\/(?:h[1-6]|p)>/i,
  )?.[1];
  const title = plainText(first || record.content);
  return title ? title.slice(0, 80) : `${record.bookTitle} · 독서 기록`;
}
export function formatDate(value: string) {
  const normalized = /^\d{8}$/.test(value)
    ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
    : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
}
export function safeExternalUrl(value: string) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
export function bookFromRecord(record: BookSummaryItemModel): SearchBookItem {
  return {
    title: record.bookTitle,
    author: record.bookAuthor,
    image: record.bookImage,
    publisher: record.bookPublisher,
    pubdate: record.bookPubdate,
    link: record.bookLink,
    isbn: record.isbn,
  };
}
export type CatalogBook = SearchBookItem & {
  count: number;
  records: BookSummaryItemModel[];
};
export function recordBookKey(
  book: Pick<SearchBookItem, "isbn" | "title" | "author">,
) {
  return book.isbn?.trim() || `${book.title}::${book.author}`;
}
export function groupBooks(records: BookSummaryItemModel[]): CatalogBook[] {
  const groups = new Map<string, CatalogBook>();
  for (const record of records) {
    const book = bookFromRecord(record),
      key = recordBookKey(book);
    const current = groups.get(key);
    if (current) {
      current.records.push(record);
      current.count++;
    } else groups.set(key, { ...book, count: 1, records: [record] });
  }
  return [...groups.values()];
}
export function pageRangeError(start: string, end: string, wholeBook: boolean) {
  if (wholeBook || (!start && !end)) return "";
  const a = Number(start),
    b = Number(end);
  return !start ||
    !end ||
    !Number.isInteger(a) ||
    !Number.isInteger(b) ||
    a < 1 ||
    b < a
    ? "시작·마지막 쪽수를 양의 정수로 입력하고 순서를 확인해 주세요."
    : "";
}
export type { BookSummaryItemDto };

export function safeReturnPath(value: string | null) {
  if (
    !value?.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\x00-\x1f]/.test(value)
  )
    return "/";
  return value;
}
export function categoryKeyword(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    if (
      Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "string")
    )
      return JSON.stringify(parsed);
  } catch {}
  return JSON.stringify([value]);
}
