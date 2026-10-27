require("./helpers/typescript.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { toSearchBookItemModel } = require("../src/model/book/book.dto.ts");

const book = {
  title: "검색한 책",
  author: "저자A^저자B",
  image: "",
  isbn: "",
  link: "https://example.com/book",
  publisher: "출판사",
  pubdate: "20241024",
};

test("book search preserves every result when publication dates are missing or invalid", () => {
  const dates = ["20241024", "", "unknown", "20240230"];
  const response = {
    total: dates.length,
    start: 1,
    display: 8,
    meta: { pageable_count: dates.length, is_end: true },
    items: dates.map((pubdate, index) => ({ ...book, title: `도서 ${index}`, pubdate })),
  };
  const result = toSearchBookItemModel(response);
  assert.equal(result.items.length, dates.length);
  assert.ok(Number.isFinite(Date.parse(result.items[0].pubdate)));
  assert.deepEqual(result.items.slice(1).map(item => item.pubdate), ["", "", ""]);
  assert.equal(result.items[0].author, "저자A, 저자B");
  assert.deepEqual(result.meta, response.meta);
  assert.equal(response.items[0].author, "저자A^저자B");
});
