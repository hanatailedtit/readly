require("./helpers/typescript.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const queryHook = require("./helpers/query-hook.cjs");
const { createQueryClient } = require("../src/lib/react-query.ts");
const { groupBooks } = require("../src/lib/records.ts");
const { useBookRecords } = require("../src/service/library.service.ts");
const { BOOK_SUMMARY_KEY } = require("../src/constants/query-key.constants.ts");

test("cached records keep same-title books by different authors separate when ISBN is missing", () => {
  const client = createQueryClient();
  const book = { isbn: "", title: "같은 제목", author: "두 번째 작가" };
  const records = ["첫 번째 작가", book.author].map((bookAuthor, i) => ({
    id: i + 1, isbn: "", bookTitle: book.title, bookAuthor,
  }));
  client.setQueryData([BOOK_SUMMARY_KEY, "catalog"], groupBooks(records));
  try {
    const result = queryHook(() => useBookRecords(book), client);
    assert.deepEqual(result.data.map(record => record.id), [2]);
    assert.equal(result.isFetching, false);
  } finally {
    client.clear();
  }
});
