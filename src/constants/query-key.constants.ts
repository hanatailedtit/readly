export const USERS_QUERY_KEY = "users" as const;
export const MY_USERS_QUERY_KEY = "my-users" as const;
export const BOOK_SUMMARY_KEY = " book-summary" as const;
export const BOOK_SUMMARY_LIKE_KEY = "book-summary-like" as const;
export const BOOK_CATEGORY_KEY = "book-category-key" as const;
export const COMMENT_KEY = "comment-key" as const;

export const BOOK_INFO_KEY = "book-info" as const;
export const BOOK_SEARCH_KEY = "book-search" as const;
export const BOOK_LIST_KEY = "book-list" as const;

export const isRecordListQuery = ({ queryKey }: { queryKey: readonly unknown[] }) =>
  queryKey[0] === BOOK_SUMMARY_KEY &&
  ["feed", "monthly", "book-records", "profile"].includes(String(queryKey[1]));

// 권한에 따라 응답이 달라지는 쿼리만 로그인·로그아웃 시 갱신한다.
export const isSessionQuery = ({
  queryKey,
}: {
  queryKey: readonly unknown[];
}) =>
  [
    MY_USERS_QUERY_KEY,
    USERS_QUERY_KEY,
    COMMENT_KEY,
    BOOK_SUMMARY_LIKE_KEY,
  ].some((key) => key === queryKey[0]) ||
  (queryKey[0] === BOOK_SUMMARY_KEY &&
    (typeof queryKey[1] === "number" || queryKey[1] === "recent"));
